class SearchUI {
  constructor() {
    this.searchViewContainer = document.getElementById('search-view-container');
  }

  renderSearchList(result, keywords) {
    this.clearSearchList();
    let items = result;
    items.forEach((item, idx) => {
      if(idx === 0) {
        this.searchViewContainer.appendChild(this.renderDivider(item.year, item.month));
      } else if (items[idx - 1].year !== item.year || items[idx - 1].month !== item.month) {
        this.searchViewContainer.appendChild(this.renderDivider(item.year, item.month));
      }
      this.searchViewContainer.appendChild(this.renderItemBlock(item.fileName, item.date, item.preview, keywords));
    });
  }

  clearSearchList() {
    while(this.searchViewContainer.childElementCount) {
      this.searchViewContainer.removeChild(this.searchViewContainer.firstElementChild);
    }
  }

  renderDivider(year, month) {
    const divContainer = document.createElement('div');
    divContainer.classList.add('divide-container');

    const divLeftLineContainer = document.createElement('div');
    divLeftLineContainer.classList.add('divide-line-container');

    const divRightLineContainer = document.createElement('div');
    divRightLineContainer.classList.add('divide-line-container');

    const divLeftTopLine = document.createElement('div');
    divLeftTopLine.classList.add('divide-line-top');

    const divLeftBottomLine = document.createElement('div');
    divLeftBottomLine.classList.add('divide-line-bottom');

    const divRightTopLine = document.createElement('div');
    divRightTopLine.classList.add('divide-line-top');

    const divRightBottomLine = document.createElement('div');
    divRightBottomLine.classList.add('divide-line-bottom');

    divLeftLineContainer.appendChild(divLeftTopLine);
    divLeftLineContainer.appendChild(divLeftBottomLine);

    divRightLineContainer.appendChild(divRightTopLine);
    divRightLineContainer.appendChild(divRightBottomLine);

    const divDisplay = document.createElement('span');
    divDisplay.classList.add('divide-display');
    divDisplay.innerText = `${year}년 ${month}월`;

    divContainer.appendChild(divLeftLineContainer);
    divContainer.appendChild(divDisplay);
    divContainer.appendChild(divRightLineContainer);

    return divContainer;
  }

  renderItemBlock(fileName, date, preview, keywords) {
    const day = this.getDayByFileName(fileName);
    const dateBlock = this.renderDateBlock(fileName, date);
    const dateSection = this.renderDateSection(date, day);
    const contentSection = this.renderContentSection(preview, keywords);
    dateBlock.appendChild(dateSection);
    dateBlock.appendChild(contentSection);
    dateBlock.addEventListener('touchstart', event => {
      const currentScrollTop = this.searchViewContainer.scrollTop;
      event.currentTarget.timer = setTimeout(() => {
        if(currentScrollTop === this.searchViewContainer.scrollTop) {
          this.showDeleteAlert(fileName, date);
        }
      }, 500);
    });

    dateBlock.addEventListener('touchend', event => {
      if(event.currentTarget.timer) {
        clearTimeout(event.currentTarget.timer);
      }
    });
    return dateBlock;
  }

  showDeleteAlert(fileName, date) {
    navigator.vibrate(100);
    window.ha.openConfirm({
      title: '일기 삭제',
      type: CONST.NATIVE_STYLE.ALERT.ACTION,
      message: '일기를 삭제하시겠습니까?',
      options: [{
        name: '삭제',
        type: CONST.NATIVE_STYLE.BTN.DESTRUCTIVE,
        callback: () => {
          fileName = `${fileName.substr(0, fileName.lastIndexOf('-'))}-${date}`;
          document.dispatchEvent(new CustomEvent('delete-diary', {
            detail: {
              fileName: `${fileName}.txt`,
              callback: () => {
                document.dispatchEvent(new CustomEvent('search-keyword-changed'));
              }
            }
          }));
        }
      }, {
        name: '취소',
        type: CONST.NATIVE_STYLE.BTN.CANCEL
      }]
    });
  }

  renderDateBlock(fileName, date) {
    const dateBlock = document.createElement('div');
    dateBlock.classList.add('list-item');
    dateBlock.setAttribute('date', date);

    dateBlock.addEventListener('click', event => {
      window.stdDateUtil.setDate(date);
      document.dispatchEvent(new CustomEvent('show-content-editor', {
        detail: {
          fileName: fileName,
          diary: event
        }
      }));
    });

    return dateBlock;
  }

  renderDateSection(date, day) {
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
    if(day === '일') {
      dateSection.classList.add('sunday');
    }    

    return dateSection;
  }

  renderContentSection(preview, keywords) {
    const contentSection = document.createElement('div');
    contentSection.classList.add('content-section');
    const content = document.createElement('div');
    content.classList.add('content');
    content.innerHTML = this.getMarkedPreview(preview, keywords);
    contentSection.appendChild(content);

    return contentSection;
  }

  getDayByFileName(fileName) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dateArr = fileName.replace('.txt', '').split('-');
    dateArr.forEach((date, idx) => {
      if(idx > 0 && date.length === 1) {
        dateArr[idx] = '0' + date;
      }
    });
    const date = dateArr.join('-');
    const dateObj = new Date(date);
    return days[dateObj.getDay()];
  }

  getMarkedPreview(preview, keywords) {
    keywords.forEach(keyword => {
      preview = preview.split(keyword).join(`<strong>${keyword}</strong>`);
    });

    return preview;
  }
}