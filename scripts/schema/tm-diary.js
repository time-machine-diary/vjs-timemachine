/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  TmDiary schema
 */
class TmDiary {

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get fileName() {
    return this._fileName;
  }

  set fileName(fileName) {
    this.computeDateFields(fileName);
    this._fileName = fileName;
  }

  get year() {
    return this._year;
  }

  set year(year) {
    this._year = year;
  }

  get month() {
    return this._month;
  }

  set month(month) {
    this._month = month;
  }

  get date() {
    return this._date;
  }

  set date(date) {
    this._date = date;
  }

  get preview() {
    return this._preview;
  }

  set preview(preview) {
    this._preview = preview;
  }

  get content() {
    return this._content;
  }

  set content(content) {
    this.computePreviewField(content);
    this._content = content;
  }

  /**
   * @description fileName이 set 되었을 때
   * 현재 객체의 year, month, date를 자동 계산하여 초기화
   * @param {String} 일기파일 명칭
   */
  computeDateFields(fileName) {
    const splitedName = fileName.replace('.txt', '').split('-');
    this._year = splitedName[0];
    this._month = splitedName[1];
    this._date = splitedName[2];
  }

  /**
   * @description content가 set 되었을 때
   * 현재 객체의 preview를 계산하여 초기화
   * @param {String} 일기 내용
   */
  computePreviewField(content) {
    const contentArray = content.split('\n');
    if(contentArray.length >= 2) {
      this._preview = content.split('\n')[0] + '\n' + content.split('\n')[1];
    } else {
      this._preview = content.split('\n')[0];
    }
  }

  /**
   * @description 현재 객체의 properties를 리턴
   * @returns {Object} 현재 객체의 properties
   */
  getDataObj() {
    return {
      id: this._id,
      fileName: this._fileName,
      year: this._year,
      month: this._month,
      date: this._date,
      preview: this._preview,
      content: this._content
    };
  }
}