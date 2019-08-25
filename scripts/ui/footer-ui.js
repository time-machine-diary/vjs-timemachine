/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  index.html의 footer ui를 핸들링하기 위한 class
 */
class FooterUI {
  constructor() {
    this.footer = document.getElementById('footer');
  }

  /**
   * @description 캘린더 화면의 footer를 구성함
   */
  showCalendarFooter() {
    this.clearFooter();
    this.showRefreshBtn();
    this.showListViewBtn();
  }

  /**
   * @description 리스트 화면의 footer를 구성함
   */
  showListFooter() {
    this.clearFooter();
    this.showRefreshBtn();
    this.showCalendarViewBtn();
  }

  /**
   * @description footer의 children을 모두 제거
   */
  clearFooter() {
    while(this.footer.children.length) {
      this.footer.removeChild(this.footer.firstChild);
    }
  }

  /**
   * @description 리스터 보기 버튼을 표시함
   */
  showListViewBtn() {
    this.footer.appendChild(this.getListViewBtn());
  }

  /**
   * @description 캘린더 보기 버튼을 표시함
   */
  showCalendarViewBtn() {
    this.footer.appendChild(this.getCalendarViewBtn());
  }

  /**
   * @description 새로고침/오늘날짜 보기 버튼을 표시함
   */
  showRefreshBtn() {
    this.footer.appendChild(this.getRefreshBtn());
  }

  /**
   * @description 리스트 보기 버튼을 리턴
   * @returns {Object} 리스트 보기 버튼 엘리먼트
   */
  getListViewBtn() {
    if(!this.listViewBtn) {
      this.listViewBtn = document.createElement('img');
      this.listViewBtn.setAttribute('id', 'list-view-btn');
      this.listViewBtn.setAttribute('src', './assets/images/list-view.svg');
      this.listViewBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('footer-move-to-list'));
      });
    }

    return this.listViewBtn;
  }

  /**
   * @description 캘린더 보기 버튼을 리턴
   * @returns {Object} 캘린더 보기 버튼 엘리먼트
   */
  getCalendarViewBtn() {
    if(!this.calendarViewBtn) {
      this.calendarViewBtn = document.createElement('img');
      this.calendarViewBtn.setAttribute('id', 'calendar-view-btn');
      this.calendarViewBtn.setAttribute('src', './assets/images/calendar-view.svg');
      this.calendarViewBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('footer-move-to-calendar'));
      });
    }

    return this.calendarViewBtn;
  }

  /**
   * @description 새로고침/오늘날짜 보기 버튼을 리턴
   * @returns {Object} 새로고침/오늘날짜 보기 버튼 엘리먼트
   */  
  getRefreshBtn() {
    if(!this.refreshBtn) {
      this.refreshBtn = document.createElement('img');
      this.refreshBtn.setAttribute('id', 'refresh-btn');
      this.refreshBtn.setAttribute('src', './assets/images/refresh.svg');
      this.refreshBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('refresh-diary'));
      });
    }

    return this.refreshBtn;
  }

  showFooter() {
    this.footer.style.display = 'flex';
  }

  hideFooter() {
    this.footer.style.display = 'none';
  }
}