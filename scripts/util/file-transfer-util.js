class FileTransferUtil {
  constructor() {
    let platform = navigator.platform.toLowerCase();
    console.log('TODO: Check Android platform');
    this.isMobile = platform.indexOf('iphone') >= 0 ? true : false;
    if(this.isMobile) {
      document.addEventListener('deviceready', this.storageInitialize.bind(this));
    }
  }

  storageInitialize() {
    const basePath = cordova.file.documentsDirectory;
    let filePath = this.getFilePath();
    this.getDirEntry(basePath)
        .then(dirEntry => {
          filePath = filePath.startsWith('/') ? filePath.substr(1) : filePath;
          filePath = filePath.endsWith('/') ? filePath.slice(0, -1) : filePath;
          const dirs = filePath.split('/');
          this.createDir(dirEntry, dirs, 0);
        })
        .catch(error => console.error(error));
  }

  createDir(dirEntry, dirs, index) {
    dirEntry.getDirectory(dirs[index], { create: true }, dirEntry => {
      if(dirs[++index]) {
        this.createDir(dirEntry, dirs, index);
      }
    });
  }

  /**
   * @description 파일 읽기
   */
  readFile(fileName, callback) {
    if(this.isMobile) {
      this.mobileReadFile(fileName, callback);
    } else {
      this.webReadFile(fileName, callback);
    }
  }

  /**
   * @description 모바일 환경의 파일 읽기
   */
  mobileReadFile(fileName, callback) {
    const basePath = cordova.file.documentsDirectory.endsWith('/') ? cordova.file.documentsDirectory : cordova.file.documentsDirectory + '/';
    const filePath = this.getFilePath();
    const fullPath = `${basePath}${filePath}`;

    this.getDirEntry(fullPath)
        .then(dirEntry => this.getFileEntry(dirEntry, fileName))
        .then(fileEntry => this.readFileAsText(fileEntry))
        .then(result => callback(result))
        .catch(error => console.error(error));
  }

  /**
   * @description 웹 환경의 파일 읽기
   */
  webReadFile(fileName, callback) {  
    this.request(this.getReqUrl('read_file'), 'POST', {
      fileName: fileName,
      filePath: this.getFilePath()
    }, event => {
      callback(event.currentTarget.responseText);
    });
  }

  /**
   * @description 파일 쓰기
   */
  writeFile(fileName, content) {
    if(this.isMobile) {
      this.mobileWriteFile(fileName, content);
    } else {
      this.webWriteFile(fileName, content);
    }
  }

  /**
   * @description 모바일 환경의 파일 쓰기
   */
  mobileWriteFile(fileName, content) {
    const basePath = cordova.file.documentsDirectory.endsWith('/') ? cordova.file.documentsDirectory : cordova.file.documentsDirectory + '/';
    const filePath = this.getFilePath();
    const fullPath = `${basePath}${filePath}`;

    this.getDirEntry(fullPath)
        .then(dirEntry => this.getFileEntry(dirEntry, fileName))
        .then(fileEntry => this.createWriter(fileEntry))
        .then(fileWriter => this.writeContent(fileWriter, fileName, filePath, content))
        .catch(error => console.error(error));
  }

  /**
   * @description 웹 환경의 파일 쓰기
   */
  webWriteFile(fileName, content) {
    this.request(this.getReqUrl('write_file'), 'POST', {
      fileName: fileName,
      content: content,
      filePath: this.getFilePath()
    }, event => {
      const response = JSON.parse(event.currentTarget.response);
      document.dispatchEvent(new CustomEvent('write-file-success', {
        detail: {
          fileName: response.fileName,
          filePath: response.filePath,
          preview: content.split('\n')[0]
        }
      }));
    });
  }

  /**
   * @description 파일 삭제
   */
  deleteFile(fileName) {
    if(this.isMobile) {
      this.mobileDeleteFile(fileName);
    } else {
      this.webDeleteFile(fileName);
    }
  }

  /**
   * @description 모바일 환경의 파일 삭제
   */
  mobileDeleteFile(fileName) {
    const basePath = cordova.file.documentsDirectory.endsWith('/') ? cordova.file.documentsDirectory : cordova.file.documentsDirectory + '/';
    const filePath = this.getFilePath();
    const fullPath = `${basePath}${filePath}`;

    this.getDirEntry(fullPath)
        .then(dirEntry => this.getFileEntry(dirEntry, fileName))
        .then(fileEntry => this.removeFile(fileEntry, fileName))
        .catch(error => console.error(error));
  }

  /**
   * @description 웹 환경의 파일 삭제
   */
  webDeleteFile(fileName) {
    this.request(this.getReqUrl('delete_file'), 'POST', {
      fileName: fileName,
      filePath: this.getFilePath()
    }, () => {
      const response = JSON.parse(event.currentTarget.response);
      document.dispatchEvent(new CustomEvent('delete-file-success', {
        detail: {
          fileName: response.fileName
        }
      }));
    });
  }  

  /**
   * @description 파일 패스를 전달 받아 native directory entry를 리턴함
   * 
   * @param {String} path 파일 패스
   * @returns {Object} dirEntry native directory entry
   */
  getDirEntry(path) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(path, dirEntry => resolve(dirEntry), error => reject(error));
    });
  }

  /**
   * @description directory entry와 fileName을 통해 native file entry를 리턴함
   * 
   * @param {Object} dirEntry directory entry
   * @param {String} fileName file name
   * @returns {Object} fileEntry native file entry
   */
  getFileEntry(dirEntry, fileName) {
    return new Promise((resolve, reject) => {
      dirEntry.getFile(fileName, { create: true, exclusive: false}, fileEntry => resolve(fileEntry), error => reject(error));
    });
  }

  /**
   * @description file entry를 전달 받아 fileWriter를 생성하고 리턴함
   * 
   * @param {Object} fileEntry native fileEntry
   * @returns {Object} fileWriter native fileWriter
   */
  createWriter(fileEntry) {
    return new Promise((resolve, reject) => {
      fileEntry.createWriter(fileWriter => resolve(fileWriter), error => reject(error));
    });
  }

  /**
   * @description fileWrite를 통해 해당 파일에 content를 쓰고 성공시 write-file-success 이벤트를 발생
   * 
   * @param {Object} fileWriter native file writer object
   * @param {String} fileName file name
   * @param {String} filePath file path
   * @param {String} content content
   */
  writeContent(fileWriter, fileName, filePath, content) {
    return new Promise((resolve, reject) => {
      fileWriter.onwriteend = () => {
        document.dispatchEvent(new CustomEvent('write-file-success', {
          detail: {
            fileName: fileName,
            filePath: filePath,
            preview: content.split('\n')[0]
          }          
        }));
        resolve();
      };

      fileWriter.onerror = error => {
        reject(error);
      };

      fileWriter.write(new Blob([content]), { type: 'text/plain' });
    });
  }

  /**
   * @description file entry의 파일을 text로 읽어 return
   * @param {Object} fileEntry native file entry
   */
  readFileAsText(fileEntry) {
    return new Promise((resolve, reject) => {
      fileEntry.file(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };

        reader.onerror = error => {
          reject(error);
        };

        reader.readAsText(file);
      });
    });
  }  

  /**
   * @description fileEntry에서 fileName을 통해 file을 삭제
   * 
   * @param {Object} fileEntry native file entry
   * @param {String} fileName remove target file name
   */
  removeFile(fileEntry, fileName) {
    return new Promise((resolve, reject) => {
      fileEntry.remove(() => {
        document.dispatchEvent(new CustomEvent('delete-file-success', {
          detail: {
            fileName: fileName
          }
        }));

        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  getFilePath() {
    let filePath = window.CONST.FILE.PATH;
    if(!filePath.endsWith('/')) {
      filePath += '/';
    }

    return filePath;
  }

  getReqUrl(api) {
    let baseUrl = window.CONST.SERVER.BASE_URL;
    if(baseUrl.endsWith('/')) {
      baseUrl = baseUrl.substr(0, test.length - 1);
    }
    if(api.startsWith('/')) {
      api = api.substr(1);
    }
    return `${baseUrl}/${api}`;
  }

  request(url, method, body, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if(method.toLowerCase() === 'post' || 'put') {
      xhr.setRequestHeader('content-type', 'application/json');
    }
    
    xhr.onreadystatechange = event => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        callback(event);
      }
    };

    if(body) {
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send();
    }
  }
}