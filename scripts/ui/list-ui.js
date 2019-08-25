class ListUI {
  constructor() {
    this.listViewContainer = document.getElementById('list-view-container');
    this.list = document.getElementById('list');
    this.addEventListeners();
    this.moduleName = 'List UI';
    this.prevPullPoint = document.getElementById('prev-pull-point');
    this.nextPullPoint = document.getElementById('next-pull-point');
  }

  addEventListeners() {
    this.listViewContainer.addEventListener('touchend', () => {
      const targetPullPoint = this.prevPullPointActived ? this.prevPullPoint : this.nextPullPointActived ? this.nextPullPoint : null;
      if(!targetPullPoint) {
        return;
      }

      const pullPointBody = targetPullPoint.querySelector('.pull-point-body');
      pullPointBody.style.height = '0px';
      Array.from(targetPullPoint.children).forEach(element => {
        if(!element.classList.contains('transparents-bg')) {
          element.classList.add('transparents-bg');
        }
      });
      this.prevPullPointActived = false;
      this.nextPullPointActived = false;
      this.adjustAnimation();
    });
    this.listViewContainer.addEventListener('scroll', event => {
      const container = event.currentTarget;
      if(container.scrollTop < - 40) {
        this.prevPullPointActived = true;
        Array.from(this.prevPullPoint.children).forEach(element => {
          if(element.classList.contains('transparents-bg')) {
            element.classList.remove('transparents-bg');
          }
        });

        const pullPointBody = this.prevPullPoint.querySelector('.pull-point-body');
        pullPointBody.style.height = -(container.scrollTop + 40) + 'px';

      } else if (container.scrollHeight + 40 < container.scrollTop + container.clientHeight) {
        this.nextPullPointActived = true;
        Array.from(this.nextPullPoint.children).forEach(element => {
          if(element.classList.contains('transparents-bg')) {
            element.classList.remove('transparents-bg');
          }
        });

        const pullPointBody = this.nextPullPoint.querySelector('.pull-point-body');
        pullPointBody.style.height = (container.scrollTop + container.clientHeight - 40) - container.scrollHeight + 'px';
      }
    });
  }

  clearList(container) {
    const list = Array.from(container.querySelectorAll('div.list-item'));
    list.forEach(item => {
      item.remove();
    });
  }

  renderList() {
    this.clearList(this.list);
    this.renderDateBlocks(window.stdDateUtil.getLastDate(), window.stdDateUtil.getFirstDay(), this.list);
  }

  renderDateBlocks(lastDate, firstDayIndex, target) {
    for(let date = 1; date <= lastDate; date++) {
      const dateBlock = this.renderDateBlock(date);
      const dateSection = this.renderDateSection(date, firstDayIndex);
      const contentSection = this.renderContentSection(date);
      dateBlock.appendChild(dateSection);
      dateBlock.appendChild(contentSection);
      target.appendChild(dateBlock);
    }

  }

  renderDateBlock(date) {
    const dateBlock = document.createElement('div');
    dateBlock.classList.add('list-item');
    dateBlock.setAttribute('date', date);

    dateBlock.selectDiary = () => {
      const date = dateBlock.getAttribute('date');
      const dateObj = window.stdDateUtil.getDateObj();
      const fileName = `${dateObj.year}-${dateObj.month}-${date}.txt`;
      document.dispatchEvent(new CustomEvent('show-list-preview', {
        detail: {
          fileName: fileName,
          dateBlock: dateBlock
        }
      }));
    };

    dateBlock.moveToTop = () => {
      console.log('move to top 적용 여부 결정');
      // this.listViewContainer.scrollTop = dateBlock.offsetTop - dateBlock.clientHeight;
    };

    dateBlock.addEventListener('click', event => {
      window.currentDateUtil = window.stdDateUtil;
      window.currentDateUtil.setDate(event.currentTarget.getAttribute('date'));
      const fileName = `${window.currentDateUtil.getDateFileNameFormat()}.txt`;
      if(dateBlock.hasAttribute('assigned')) {
        document.dispatchEvent(new CustomEvent('show-content-editor', {
          detail: {
            fileName: fileName,
            diary: event
          }
        }));
      } else {
        document.dispatchEvent(new CustomEvent('show-empty-editor', {
          detail: {
            fileName: fileName
          }
        }));
      }
    });

    dateBlock.addEventListener('touchstart', event => {
      const currentScrollTop = this.listViewContainer.scrollTop;
      event.currentTarget.timer = setTimeout(() => {
        if(currentScrollTop === this.listViewContainer.scrollTop && dateBlock.hasAttribute('assigned')) {
          // this.showToastBtns(dateBlock.getAttribute('date'));
          this.showDeleteAlert(dateBlock.getAttribute('date'));
        }
      }, 500);
    });

    dateBlock.addEventListener('touchend', event => {
      if(event.currentTarget.timer) {
        clearTimeout(event.currentTarget.timer);
      }
    });

    dateBlock.showDiaryPreview = diary => {
      const contentField = dateBlock.querySelector('.content-field');
      contentField.innerText = diary.preview;
    };

    return dateBlock;
  }

  showDeleteAlert(date) {
    navigator.vibrate(100);
    window.ha.openConfirm({
      title: '일기 삭제',
      type: CONST.NATIVE_STYLE.ALERT.ACTION,
      message: '일기를 삭제하시겠습니까?',
      options: [{
        name: '삭제',
        type: CONST.NATIVE_STYLE.BTN.DESTRUCTIVE,
        callback: () => {
          let fileName = window.stdDateUtil.getDateFileNameFormat();
          fileName = `${fileName.substr(0, fileName.lastIndexOf('-'))}-${date}`;
          document.dispatchEvent(new CustomEvent('delete-diary', {
            detail: {
              fileName: `${fileName}.txt`
            }
          }));
        }
      }, {
        name: '취소',
        type: CONST.NATIVE_STYLE.BTN.CANCEL
      }]
    });

  }

  adjustAnimation() {
    let unitHeight = (document.querySelector('.list-item').clientHeight) * 2;
    if(this.listViewContainer.scrollTop < -unitHeight ) {
      // this.showSpinner(`${window.stdDateUtil.getPrevYearMonthStr()}...`);
      this.showSpinner();
      window.stdDateUtil.date.setMonth(window.stdDateUtil.date.getMonth() - 1);
      setTimeout(() => {
        this.renderList();
        this.hideSpinner();
        this.fireCalendarChangeEvent();
      }, 500);

    } else if (this.listViewContainer.scrollTop + this.listViewContainer.clientHeight > this.listViewContainer.scrollHeight + unitHeight) {
      // this.showSpinner(`${window.stdDateUtil.getNextYearMonthStr()}...`);
      this.showSpinner();
      window.stdDateUtil.date.setMonth(window.stdDateUtil.date.getMonth() + 1);
      setTimeout(() => {
        this.renderList();
        this.hideSpinner();
        this.fireCalendarChangeEvent();
      }, 500);
    }

  }

  showSpinner(message) {
    window.spinner.show({
      message: message
    });
  }

  hideSpinner() {
    window.spinner.hide();
  }

  fireCalendarChangeEvent() {
    document.dispatchEvent(new CustomEvent('date-switched'));
  }  

  renderDateSection(date, firstDayIndex) {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayIdx = (firstDayIndex + date - 1) % 7;
    const day = days[dayIdx];

    const dateSection = document.createElement('div');
    dateSection.classList.add('date-section');
    const dateSpan = document.createElement('span');
    dateSpan.classList.add('date');
    dateSpan.innerText = date;
    const daySpan = document.createElement('span');
    daySpan.innerText = day;
    daySpan.classList.add('day');

    dateSection.appendChild(dateSpan);
    dateSection.appendChild(daySpan);
    if(dayIdx === 0) {
      dateSection.classList.add('sunday');
    }    

    return dateSection;
  }
  
  renderContentSection(date) {
    const contentSection = document.createElement('div');
    contentSection.classList.add('content-section');
    const content = document.createElement('div');
    content.classList.add('content');
    content.setAttribute('date', date);
    content.appendChild(this.getContentField(date));
    content.appendChild(this.getAddBtn(date));
    contentSection.appendChild(content);

    return contentSection;
  }

  deleteDiary() {
    window.ha.openConfirm({
      title: '일기 삭제',
      type: CONST.NATIVE_STYLE.ALERT.ACTION,
      message: '일기를 삭제 하시겠습니까?',
      options: [{
        name: '취소',
        type: CONST.NATIVE_STYLE.BTN.CANCEL
      }, {
        name: '확인',
        type: CONST.NATIVE_STYLE.BTN.DEFAULT,
        callback: () => {
          document.dispatchEvent(new CustomEvent('delete-diary', {
            detail: {
              fileName: `${window.stdDateUtil.getDateFileNameFormat()}.txt`
            }
          }));
        }
      }]
    });
  }

  getContentField(date) {
    const contentField = document.createElement('div');
    contentField.setAttribute('date', date);
    contentField.classList.add('content-field');

    return contentField;
  }

  getAddBtn(date) {
    const addBtn = document.createElement('img');
    addBtn.setAttribute('date', date);
    addBtn.setAttribute('src', './assets/images/gray-plus.svg');
    addBtn.classList.add('add-btn');

    return addBtn;
  }

  /**
   * @description 일기가 할당 되어 있는 날짜 리스트를 전달 받아 화면에 표시함
   * @param {Array} dates 일기가 할당 되어 있는 날짜 리스트
   */
  markAssigneByDates(dates) {
    this.clearAssignedDates();
    if(dates && dates.length) {
      dates.forEach(date => {
        const list = this.getListByDate(date);
        list.setAttribute('assigned', '');
        list.selectDiary();
      });
    }
  }

  clearAssignedDates() {
    const assignedItems = Array.from(this.listViewContainer.querySelectorAll(`div.list-item[assigned]`));
    assignedItems.forEach(assignedItem => {
      assignedItem.removeAttribute('assigned');
    });
  }

  /**
   * @description 전달 받은 날짜를 통해 해당 날짜의 리스트 엘리먼트를 리턴
   * @param {String} date 날짜 문자열
   * @returns {Object} 전달 받은 날짜의 리스트 엘리먼트
   */
  getListByDate(date) {
    return this.list.querySelector(`div.list-item[date='${date}']`);
  }

  scrollToTop() {
    window.scroller.scrollAnimate(this.listViewContainer, {
      axis: 'y',
      to: 0,
      duration: 15
    });
  }

  moveTopByDate() {
    this.getListByDate(window.currentDateUtil.getDate()).moveToTop();
  }
}