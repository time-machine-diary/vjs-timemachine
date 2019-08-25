/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  index.html의 header ui를 핸들링하기 위한 class
 */
class HeaderUI {
  constructor() {
    this.header = document.getElementById('header');
    this.headerLeft = document.getElementById('header-left');
    this.headerCenter = document.getElementById('header-center');
    this.headerRight = document.getElementById('header-right');
    this.hiddenDatepicker = document.getElementById('hidden-datepicker');

    this.hiddenDatepicker.addEventListener('change', event => {
      let currentValue = event.currentTarget.value;
      if(!currentValue) {
        const date = new Date();
        currentValue = `${date.getFullYear()}-${date.getMonth() + 1}`;
        setTimeout(() => {
          this.hiddenDatepicker.value = currentValue;
          this.hiddenDatepicker.blur();
        }, 100);
      }

      const yearMonth = currentValue.split('-');
      const year = parseInt(yearMonth[0]);
      const month = parseInt(yearMonth[1]);

      if(year !== parseInt(window.stdDateUtil.getYearStr()) || month !== parseInt(window.stdDateUtil.getMonthStr())) {
        window.stdDateUtil.setYearMonth(year, month);
        document.dispatchEvent(new CustomEvent('date-picked'));        
      }
    });
  }

  /**
   * @description 헤더의 엘리먼트를 Object 형태로 전달 받아 append
   * @param {Object} elements 
   */
  appendContent(elements) {
    const leftElement = elements.left;
    const centerElement = elements.center;
    const rightElement = elements.right;

    if(leftElement) {
      this.appendLeftElement(leftElement);
    } else {
      this.clearLeftElement();
    }

    if(centerElement) {
      this.appendCenterElement(centerElement);
    } else {
      this.clearCenterElement();
    }

    if(rightElement) {
      this.appendRightElement(rightElement);
    } else {
      this.clearRightElement();
    }
  }

  /**
   * @description 헤더 왼쪽 섹션의 엘리먼트를 제거
   */
  clearLeftElement() {
    while(this.headerLeft.children.length) {
      this.headerLeft.removeChild(this.headerLeft.firstChild);
    }
  }

  /**
   * @description 헤더 중앙 섹션의 엘리먼트를 제거
   */
  clearCenterElement() {
    while(this.headerCenter.children.length) {
      this.headerCenter.removeChild(this.headerCenter.firstChild);
    }
  }

  /**
   * @description 헤더 오른쪽 섹션의 엘리먼트를 제거
   */
  clearRightElement() {
    while(this.headerRight.children.length) {
      this.headerRight.removeChild(this.headerRight.firstChild);
    }
  }

  /**
   * @description 헤더 왼쪽의 엘리먼트를 제거 후 append
   * @param {Object} element append할 Element
   */
  appendLeftElement(element) {
    this.clearLeftElement();
    this.headerLeft.appendChild(element);
  }

  /**
   * @description 헤더 중앙의 엘리먼트를 제거 후 append
   * @param {Object} element append할 Element
   */
  appendCenterElement(element) {
    this.clearCenterElement();
    this.headerCenter.appendChild(element);
  }

  /**
   * @description 헤더 오른쪽의 엘리먼트를 제거 후 append
   * @param {Object} element append할 Element
   */  
  appendRightElement(element) {
    this.clearRightElement();
    this.headerRight.appendChild(element);
  }

  /**
   * @description DateUtil 객체를 전달 받아 캘린더 화면의 기본 구성을 헤더에 표현함
   */
  showCommonHeader() {
    this.showSearchBtn();
    this.showMonthDisplay();
    this.showMenuBtn();
  }

  showEditorHeader() {
    this.showRouteBackBtn();
    this.showCenterFullDate();
    // this.showWeatherIcon();
    this.clearRightElement();
  }

  showSearchHeader() {
    this.showSearchBtn();
    this.showSearchCloseBtn();
    this.showSearchInput();
  }

  /**
   * @description 헤더 왼쪽 섹션에 조회 버튼을 표시함
   */
  showSearchBtn() {
    this.appendLeftElement(this.getSearchBtn());
  }

  /**
   * @description 헤더 중앙 섹션에 날짜를 표시함
   */
  showMonthDisplay() {
    this.appendCenterElement(this.getMonthDisplay());
  }

  /**
   * @description 헤더 오른쪽 섹션에 메뉴 버튼을 표시함
   */
  showMenuBtn() {
    this.appendRightElement(this.getMenuBtn());
  }

  /**
   * @description 헤더 중앙 섹선에 조회 input 필드를 표시하고 포커스를 이동함
   */
  showSearchInput() {
    this.appendCenterElement(this.getSearchInput());
    this.searchInput.focus();
  }

  /**
   * @description 헤더 왼쪽 섹선에 조회 닫기 버튼을 표시함
   */
  showSearchCloseBtn() {
    this.appendRightElement(this.getSearchCloseBtn());
  }

  /**
   * @description 헤더 왼쪽 섹션에 뒤로가기 버튼을 표시함
   */
  showRouteBackBtn() {
    this.appendLeftElement(this.getRouteBackBtn());
  }

  showCenterFullDate() {
    this.appendCenterElement(this.getFullDateDisplay());
  }

  showWeatherIcon() {
    this.appendRightElement(this.getWeatherIcon());
  }

  /**
   * @description 조회 버튼 엘리먼트를 리턴함
   * @returns {Object} 조회 버튼 엘리먼트
   */
  getSearchBtn() {
    if(!this.searchBtn) {
      this.searchBtn = document.createElement('img');
      this.searchBtn.setAttribute('id', 'search-btn');
      this.searchBtn.setAttribute('src', './assets/images/search.svg');
      this.searchBtn.addEventListener('click', () => {
        this.showSearchHeader();
      });
    }

    return this.searchBtn;
  }

  /**
   * @description 날짜 표시 엘리먼트를 리턴함
   * @returns {Object} 날짜 표시 엘리먼트
   */
  getMonthDisplay() {
    if(!this.monthDisplay) {
      this.monthDisplay = document.createElement('span');
      this.monthDisplay.setAttribute('id', 'month-display');
      this.monthDisplay.addEventListener('click', () => {
        this.hiddenDatepicker.focus();
      });
    }
    this.monthDisplay.innerText = window.stdDateUtil.getYearMonthStr();
    return this.monthDisplay;
  }

  /**
   * @description 메뉴 버튼 엘리먼트를 리턴함
   * @returns {Object} 메뉴 버튼 엘리먼트
   */
  getMenuBtn() {
    if(!this.menuBtn) {
      this.menuBtn = document.createElement('img');
      this.menuBtn.setAttribute('id', 'menu-btn');
      this.menuBtn.setAttribute('src', './assets/images/menu.svg');
      this.menuBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('menu-btn-click'));
      });

    }

    return this.menuBtn;
  }

  /**
   * @description 조회 input 엘리먼트를 리턴함
   * @returns {Object} 메뉴 버튼 엘리먼트
   */  
  getSearchInput() {
    if(!this.searchInput) {
      this.searchInput = document.createElement('input');
      this.searchInput.setAttribute('id', 'search-input');
      this.searchInput.setAttribute('type', 'search');
      this.searchInput.addEventListener('input', event => {
        let searchKeywords = event.currentTarget.value;
        document.dispatchEvent(new CustomEvent('search-keyword-changed', {
          detail: searchKeywords
        }));
      });
    }

    return this.searchInput;
  }

  /**
   * @description 조회 닫기 버튼 엘리먼트를 리턴함
   * @returns {Object} 조회 닫기 버튼 엘리먼트
   */
  getSearchCloseBtn() {
    if(!this.searchCloseBtn) {
      this.searchCloseBtn = document.createElement('img');
      this.searchCloseBtn.setAttribute('id', 'search-close-btn');
      this.searchCloseBtn.setAttribute('src', './assets/images/white-x.svg');
      this.searchCloseBtn.addEventListener('click', () => {
      this.showCommonHeader();
        this.searchInput.value = '';
        if(location.hash.indexOf('search') >= 0) {
          history.back();
        }
      });
    }

    return this.searchCloseBtn;
  }

  /**
   * @description 뒤로가기 버튼 엘리먼트를 리턴함
   * @returns {Object} 뒤로가기 버튼 엘리먼트
   */
  getRouteBackBtn() {
    if(!this.routeBackBtn) {
      this.routeBackBtn = document.createElement('img');
      this.routeBackBtn.setAttribute('id', 'route-back-btn');
      this.routeBackBtn.setAttribute('src', './assets/images/back-icon.svg');
      this.routeBackBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('route-back'));
      });
    }

    return this.routeBackBtn;
  }

  getFullDateDisplay() {
    if(!this.fullDateDisplay) {
      this.fullDateDisplay = document.createElement('span');
      this.fullDateDisplay.setAttribute('id', 'full-date-display');
    }

    this.fullDateDisplay.innerText = window.currentDateUtil.getFullDateStr();
    return this.fullDateDisplay;
  }

  getWeatherIcon() {
    if(!this.weatherIcon) {
      this.weatherIcon = document.createElement('img');
      this.weatherIcon.setAttribute('id', 'weather-icon');
      this.weatherIcon.setAttribute('type', CONST.WEATHER.TYPES[0]);
      this.weatherIcon.setAttribute('src', './assets/images/w-sunny.svg');
      this.weatherIcon.addEventListener('click', () => {
        if(!this.hiddenWeatherCombo) {
          this.hiddenWeatherCombo = document.querySelector('#hidden-weather-combo');
          this.hiddenWeatherCombo.addEventListener('change', event => {
            this.weatherIcon.setAttribute('type', CONST.WEATHER.TYPES[0]);

            switch(event.currentTarget.value) {
              // 'SUNNY', 'CLOUDY', 'RAINY', 'SNOWY'
              case CONST.WEATHER.TYPES[0]: 
                this.weatherIcon.setAttribute('src', './assets/images/w-sunny.svg');
                break;
              case CONST.WEATHER.TYPES[1]: 
                this.weatherIcon.setAttribute('src', './assets/images/w-cloudy.svg');
                break;
              case CONST.WEATHER.TYPES[2]: 
                this.weatherIcon.setAttribute('src', './assets/images/w-rainy.svg');
                break;
              case CONST.WEATHER.TYPES[3]: 
                this.weatherIcon.setAttribute('src', './assets/images/w-snowy.svg');
                break;
            }
          });
        }

        this.hiddenWeatherCombo.click();
      });
    }

    return this.weatherIcon;
  }

  showHeader() {
    this.header.style.display = 'grid';
  }

  hideHeader() {
    this.header.style.display = 'none';
  }

  // getSelectedWeather() {
  //   return this.weatherIcon.getAttribute('type');
  // }

  // getCurrentWeather() {
  //   navigator.geolocation.getCurrentPosition(this.getWeatherByLocation.bind(this), this.setWeatherIcon);
  // }

  // getWeatherByLocation(location) {
  //   const lat = location.coords.latitude;
  //   const lon = location.coords.longitude;
  //   const me = this;
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('GET', `${window.CONST.WEATHER.API}?lat=${lat}&lon=${lon}&appid=${window.CONST.WEATHER.API_KEY}`, true);
  //   xhr.onreadystatechange = () => {
  //     if(xhr.readyState === xhr.DONE) {
  //       if (xhr.status === 200 || xhr.status === 201) {
  //         const res = JSON.parse(xhr.response);
  //         me.setWeatherIcon(res.weather[0].main);
  //       }
  //     }
  //   };
  //   xhr.send();
  // }
}