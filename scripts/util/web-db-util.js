/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  Mobile, PC 환경의 File System 관리를 위한 Util
 */
class WebDBUtil {
  /**
   * @description WebSQL initialize 데이터베이스 및 테이블 생성을 수행
   */
  initialize() {
    this.createDatabase();
    this.createTables();
  }

  /**
   * @description window 객체의 CONST 정보를 바탕으로 데이터베이스를 initialize
   */
  createDatabase() {
    this.dbConf = this.dbConf ? this.dbConf : window.CONST.DB;
    this.webSQL = window.openDatabase(this.dbConf.DB_NAME, this.dbConf.DB_VERSION, this.dbConf.DB_DESC, this.dbConf.DB_SIZE);
  }

  /**
   * @description window 객체의 CONST 정보를 바탕으로 데이터베이스의 테이블들을 initialize
   */
  createTables() {
    this.dbConf = this.dbConf ? this.dbConf : window.CONST.DB;
    const tables = this.dbConf.TABLES;

    for(let tableName in tables) {
      if(tables[tableName]) {
        let table = tables[tableName];
        let createTableSql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
        
        for(let columnName in table) {
          if(table[columnName]) {
            let column = table[columnName];
            createTableSql += `${columnName} `;
            createTableSql += `${column.type} `;
            createTableSql += column.notNull ? 'NOT NULL' : '';
            createTableSql += column.idField ? 'PRIMARY KEY ASC' : '';
            createTableSql += ",";
          }
        }

        createTableSql = createTableSql.slice(0, -1);
        createTableSql += ")";
        
        this.doTrx(createTableSql, [])
        .then(() => {
          this.createTablesSuccessCallback();
        })
        .catch(error => {
          throw error;
        });
      }
    }
  }

  /**
   * @description 테이블 생성 success callback
   */
  createTablesSuccessCallback() {
    document.dispatchEvent(new CustomEvent('web-db-initialized'));
  }

  selectDiary(data) {
    let sql = `SELECT * FROM tm_diaries WHERE 1=1`;

    if(data) {
      for(const key in data) {
        if(data[key]) {
          sql += ` AND ${key} = '${data[key]}'`;
        }
      }
    }

    return this.doTrx(sql, []);
  }

  replaceDiary(diary) {
    const sql = `REPLACE INTO tm_diaries
                  (id, fileName, year, month, date, preview, content)
                VALUES
                  (?, ?, ?, ?, ?, ?, ?)`;
    const args = [diary.id, diary.fileName, diary.year, diary.month, diary.date, diary.preview, diary.content];
    return this.doTrx(sql, args);
  }

  insertDiary(diary) {
    const sql = `INSERT INTO tm_diaries
                  (fileName, year, month, date, preview, content)
                VALUES
                  (?, ?, ?, ?, ?, ?)`;
    const args = [diary.fileName, diary.year, diary.month, diary.date, diary.preview, diary.content];
    return this.doTrx(sql, args);
  }

  deleteDiary(fileName) {
    const sql = 'DELETE FROM tm_diaries WHERE fileName = ?';
    const args = [fileName];
    return this.doTrx(sql, args);
  }

  insertPwd(pwd) {
    const sql = `INSERT INTO tm_auth
                  (encrypted_pwd)
                VALUES 
                  (?)`;
    const args = [pwd];
    return this.doTrx(sql, args);
  }

  deletePwd() {
    const sql = `DELETE FROM tm_auth`;
    return this.doTrx(sql, []);
  }

  checkAuth(pwd) {
    const sql = `SELECT encrypted_pwd FROM tm_auth LIMIT 1`;
    return new Promise((resolve, reject) => {
      this.doTrx(sql, [])
          .then(result => {
            if(pwd === result[0].encrypted_pwd) {
              resolve();
            } else {
              reject();
            }
          });
    });
  }

  doTrx(sql, args) {
    return new Promise(resolve => {
      if(this.webSQL && this.webSQL.transaction) {
        this.webSQL.transaction(trx => {
          trx.executeSql(sql, args, (trx, result) => {
            resolve(this.getResultFromRows(result.rows));
          }, (trx, error) => {
            throw new Error(error.message);
          });
        });
      }
    });
  }

  getResultFromRows(rows) {
    const resultList = [];
    for(let i = 0; i < rows.length; i++) {
      resultList.push(rows.item(i));
    }
    return resultList;
  }
}