/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  index.html의 viewer ui를 핸들링하기 위한 클래스
 */
class ViewerUI {
  constructor() {
    this.viewerHeader = document.getElementById('viewer-header');
    this.viewerContent = document.getElementById('viewer-content');
  }

  /**
   * @description date 객체를 전달 받아 viewer ui를 구성함
   */  
  renderViewer() {
    this.showDateField();
    this.showEmptyViewer();
  }

  showDateField(showDeleteBtn) {
    this.clearViewerHeader();
    const dateFieldElement = this.getDateField();
    dateFieldElement.setDateFieldValue(window.currentDateUtil.getFullDateStr());
    this.viewerHeader.appendChild(dateFieldElement);
    if(showDeleteBtn) {
      const deleteBtn = this.getDeleteBtn();
      this.viewerHeader.appendChild(deleteBtn);
    }
  }

  clearViewerHeader() {
    while(this.viewerHeader.children.length) {
      this.viewerHeader.removeChild(this.viewerHeader.firstChild);
    }
  }

  getDateField() {
    if(!this.dateField) {
      this.dateField = document.createElement('span');
      this.dateField.setAttribute('id', 'viewer-date-field');
      this.dateField.setDateFieldValue = function(dateStr) {
        this.innerText = dateStr;
      };
    }

    return this.dateField;
  }

  getDeleteBtn() {
    if(!this.deleteBtn) {
      this.deleteBtn = document.createElement('object');
      this.deleteBtn.setAttribute('id', 'viewer-delete-btn');
      this.deleteBtn.setAttribute('type', 'image/svg+xml');
      this.deleteBtn.setAttribute('data', './assets/images/x-btn.svg');

      this.deleteBtn.addEventListener('load', function() {
        const themeName = JSON.parse(localStorage.getItem('tm.setting.theme'));
        const currentTheme = window.CONST.THEMES.filter(theme => {
          return theme.name === themeName;
        })[0];
        this.contentDocument.getElementById('x-btn').style.fill = currentTheme.colors['--main-theme-color'];
        this.contentDocument.querySelector('svg').addEventListener('touchend', () => {
          window.ha.openConfirm({
            title: '일기 삭제',
            type: CONST.NATIVE_STYLE.ALERT.ACTION,
            message: '일기를 삭제 하시겠습니까?',
            options: [{
              name: '취소',
              type: CONST.NATIVE_STYLE.BTN.CANCEL,
            }, {
              name: '삭제',
              type: CONST.NATIVE_STYLE.BTN.DESTRUCTIVE,
              callback: () => {
                document.dispatchEvent(new CustomEvent('delete-diary', {
                  detail: {
                    fileName: `${window.currentDateUtil.getDateFileNameFormat()}.txt`
                  }
                }));
              }
            }]
          });
        });
      });
    }

    return this.deleteBtn;
  }

  showEmptyViewer() {
    this.clearViewerContent();
    this.showDateField(false);
    this.viewerContent.appendChild(this.getEmptyViewer());
  }

  showContentViewer(content) {
    this.clearViewerContent();
    this.showDateField(true);
    this.viewerContent.appendChild(this.getContentViewer(content));
  }

  clearViewerContent() {
    while(this.viewerContent.children.length) {
      this.viewerContent.removeChild(this.viewerContent.firstChild);
    }
  }

  getEmptyViewer() {
    if(!this.emptyViewer) {
      this.emptyViewer = document.createElement('img');
      this.emptyViewer.setAttribute('id', 'empty-viewer');
      this.emptyViewer.setAttribute('src', './assets/images/gray-plus.svg');
      this.emptyViewer.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('show-empty-editor', {
          detail: {
            fileName: event.currentTarget.getAttribute('file-name')
          }
        }));
      });
    }

    this.currentDiaryDate = window.currentDateUtil.getFullDateStr();
    this.emptyViewer.setAttribute('file-name', `${window.currentDateUtil.getDateFileNameFormat()}.txt`);
    return this.emptyViewer;    
  }

  getContentViewer(content) {
    if(!this.contentViewer) {
      this.contentViewer = document.createElement('div');
      this.contentViewer.setAttribute('id', 'content-viewer');
      this.contentViewer.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('show-content-editor', {
          detail: {
            fileName: event.currentTarget.getAttribute('file-name')
          }
        }));
      });
    }
    
    this.currentDiaryDate = window.currentDateUtil.getFullDateStr();
    this.contentViewer.setAttribute('file-name', `${window.currentDateUtil.getDateFileNameFormat()}.txt`);
    this.contentViewer.innerText = content;
    return this.contentViewer;
  }

  getYearMonth() {
    
    const dateArray = this.currentDiaryDate.split(' ');
    const year = dateArray[0];
    const month = dateArray[1];

    return `${year.substr(0, year.length - 1)}${month.substr(0, month.length - 1)}`;
  }

  getFileName() {
    const dateArray = this.currentDiaryDate.split(' ');
    dateArray.pop();
    const fileName = dateArray.map(date => {
      return date.substr(0, date.length - 1);
    }).join('-') + '.txt';

    return fileName;
  }
}