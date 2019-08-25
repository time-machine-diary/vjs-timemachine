/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  index.html의 setting ui를 핸들링하기 위한 class
 */

class SettingUI {
  constructor() {
    this.settingView = document.getElementById('setting');
    this.settingViews = document.getElementById('setting-views');
    this.settingVersion = document.getElementById('setting-version');
    this.appVersion = document.getElementById('app-version');

    this.passwordActive = document.getElementById('pwd-active');
    this.passwordActiveText = document.getElementById('pwd-active-text');
    this.initialViewSetting = document.getElementById('initial-view-setting');
    this.currentThemeText = document.getElementById('current-theme-text');
    this.themeSetting = document.getElementById('theme-setting');
    this.alarmActive = document.getElementById('alarm-active');
    this.alarmTime = document.getElementById('alarm-time');
    this.resetBtn = document.getElementById('reset');

    this.setInitValues();
    this.registerEventListeners();

    this.moduleName = 'Setting UI';
  }

  setInitValues() {
    this.initPasswordActive();
    this.initCurrentTheme();
    this.initInitialView();
    this.initAlaramActive();
    this.initAlaramTime();
  }

  initPasswordActive() {
    const passwordActive = this.getLS(window.CONST.LS_KEYS.PWD_ACTIVE);
    if(typeof passwordActive === 'boolean') {
      this.passwordActiveText.innerText = passwordActive ? '켜짐' : '꺼짐';
    } else {
      this.setLS(window.CONST.LS_KEYS.PWD_ACTIVE, false);
      this.passwordActiveText.innerText = '꺼짐';
    }
  }

  initCurrentTheme() {
    const currentThemeKey = this.getLS(window.CONST.LS_KEYS.THEME) ? this.getLS(window.CONST.LS_KEYS.THEME) : this.setLS(window.CONST.LS_KEYS.THEME, window.CONST.THEMES[0].name);
    const currentTheme = window.CONST.THEMES.filter(theme => {
      return theme.name === currentThemeKey;
    })[0];
    this.currentThemeText.innerText = currentTheme ? currentTheme.description : '기본';
  }

  initInitialView() {
    const initialView = this.initialViewSetting.querySelector('span#initial-view');
    let initialViewObj = this.getLS(window.CONST.LS_KEYS.INITIAL_VIEW) ? this.getLS(window.CONST.LS_KEYS.INITIAL_VIEW) : this.setLS(window.CONST.LS_KEYS.INITIAL_VIEW, {
      name: '캘린더',
      route: 'calendar'
    });
    initialView.innerText = initialViewObj.name;
  }

  initAlaramActive() {
    this.alarmActive.checked = this.getLS(window.CONST.LS_KEYS.ALARM_ACTIVE) ? this.getLS(window.CONST.LS_KEYS.ALARM_ACTIVE) : this.setLS(window.CONST.LS_KEYS.ALARM_ACTIVE, false);
    if(this.alarmActive.checked) {
      this.alarmTime.removeAttribute('disabled');
    }
  }

  initAlaramTime() {
    this.alarmTime.value = this.getLS(window.CONST.LS_KEYS.ALARM_TIME) ? this.getLS(window.CONST.LS_KEYS.ALARM_TIME) : this.setLS(window.CONST.LS_KEYS.ALARM_TIME, '00:00');
  }  

  registerEventListeners() {
    this.passwordActive.onclick = this.checkAuthBeforeSetting.bind(this);
    this.initialViewSetting.onclick = this.showInitialViewSetting.bind(this);
    this.themeSetting.onclick = this.showThemeSetting.bind(this);
    this.alarmActive.onchange = this.alarmActiveChanged.bind(this);
    this.alarmTime.onchange = this.alarmTimeInputHandler.bind(this);
    this.resetBtn.onclick = this.resetDiary.bind(this);
  }

  initAppVersion(appVersion) {
    this.settingVersion.innerText = appVersion;
    this.appVersion.innerText = appVersion;
  }

  checkAuthBeforeSetting() {
    if(this.getLS(window.CONST.LS_KEYS.PWD_ACTIVE)) {
      document.dispatchEvent(new CustomEvent('show-pwd-check', {
        detail: {
          successCallback: this.showPasswordSetting.bind(this)
        }
      }));      
    } else {
      this.showPasswordSetting();
    }

  }

  showPasswordSetting() {
    location.hash = 'setting';

    setTimeout(() => {
      this.settingViews.insertBefore(this.getPwdSettingViewList(), this.settingViews.firstElementChild.nextElementSibling);
      this.settingViews.style.overflowX = 'auto';
      window.scroller.scrollAnimate(this.settingViews, {
        axis: 'x',
        to: this.settingViews.clientWidth,
        duration: 15
      });
  
      setTimeout(() => {
        this.settingViews.style.overflowX = 'hidden';
      });
    }, 200);
  }

  showInitialViewSetting() {
    this.settingViews.insertBefore(this.getInitialViewList(), this.settingViews.firstElementChild.nextElementSibling);
    this.settingViews.style.overflowX = 'auto';
    window.scroller.scrollAnimate(this.settingViews, {
      axis: 'x',
      to: this.settingViews.clientWidth,
      duration: 15
    });

    setTimeout(() => {
      this.settingViews.style.overflowX = 'hidden';
    }, 300);
  }

  showThemeSetting() {
    this.settingViews.insertBefore(this.getThemeSettingList(), this.settingViews.firstElementChild.nextElementSibling);
    this.settingViews.style.overflowX = 'auto';
    window.scroller.scrollAnimate(this.settingViews, {
      axis: 'x',
      to: this.settingViews.clientWidth,
      duration: 15
    });

    setTimeout(() => {
      this.settingViews.style.overflowX = 'hidden';
    }, 300);
  }

  getPwdSettingViewList() {
    if(!this.pwdSettingViewList) {
      this.pwdSettingViewList = document.createElement('div');
      this.pwdSettingViewList.setAttribute('id', 'pwd-setting-view-list');
      this.pwdSettingViewList.classList.add('setting-view');
      
      this.pwdActiveOption = document.createElement('div');
      this.pwdActiveOption.classList.add('option-item');
      
      this.pwdActiveOptionText = document.createElement('span');
      this.pwdActiveOptionText.classList.add('title');
      this.pwdActiveOptionText.innerText = '암호 잠금';
      
      this.pwdActiveCheck = document.createElement('input');
      this.pwdActiveCheck.setAttribute('type', 'checkbox');
      this.pwdActiveCheck.setAttribute('id', 'pwd-active-checkbox');
      this.pwdActiveCheck.checked = this.getLS(window.CONST.LS_KEYS.PWD_ACTIVE);

      this.pwdActiveOption.appendChild(this.pwdActiveOptionText);
      this.pwdActiveOption.appendChild(this.pwdActiveCheck);

      this.touchIdSupported()
      .then(() => {
        this.fingerPrintOption = document.createElement('div');
        this.fingerPrintOption.classList.add('option-item');
  
        this.fingerPrintText = document.createElement('span');
        this.fingerPrintText.classList.add('title');
        this.fingerPrintText.innerText = 'Touch ID';
  
        this.fingerPrintCheck = document.createElement('input');
        this.fingerPrintCheck.setAttribute('type', 'checkbox');
        this.fingerPrintCheck.checked = this.getLS(window.CONST.LS_KEYS.TOUCH_ID_ACTIVE);
        
        this.fingerPrintOption.appendChild(this.fingerPrintText);
        this.fingerPrintOption.appendChild(this.fingerPrintCheck);
        this.pwdSettingViewList.insertBefore(this.fingerPrintOption, this.pwdSettingViewList.querySelector('div.empty-item'));

        if(!this.pwdActiveCheck.checked) {
          this.fingerPrintCheck.setAttribute('disabled', '');
        }

        this.fingerPrintCheck.onchange = event => {
          let fingerPrintActive = event.currentTarget.checked;
          setTimeout(() => {
            if(fingerPrintActive && window.touchid) {
              this.touchIdSupported()
              .catch(() => {
                window.ha.openConfirm({
                  title: 'Touch ID 등록 실패',
                  type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
                  text: 'Touch ID를 사용 할 수 없습니다.',
                  options: [{
                    name: '확인',
                    type: CONST.NATIVE_STYLE.BTN.DEFAULT
                  }]
                });
              })
              .finally(() => {
                this.setLS(window.CONST.LS_KEYS.TOUCH_ID_ACTIVE, fingerPrintActive);
              });
            } else {
              this.setLS(window.CONST.LS_KEYS.TOUCH_ID_ACTIVE, fingerPrintActive);
            }
          }, 300);
        };
      });

      const emptyItem = document.createElement('div');
      emptyItem.classList.add('empty-item');

      this.pwdResetOption = document.createElement('div');
      this.pwdResetOption.classList.add('option-item', 'activable');
      
      this.pwdResetText = document.createElement('span');
      this.pwdResetText.classList.add('title');
      this.pwdResetText.innerText = '암호 변경';

      this.pwdResetOption.appendChild(this.pwdResetText);

      this.pwdResetOption.onclick = event => {
        if(!event.currentTarget.hasAttribute('disabled')) {
          document.dispatchEvent(new CustomEvent('show-pwd-change', {
            detail: {
              successCallback: () => {
                history.back();
              },              
              cancelCallback: () => {
                history.back();
              }
            }
          }));
        }
      };

      this.pwdSettingViewList.appendChild(this.pwdActiveOption);
      this.pwdSettingViewList.appendChild(emptyItem);
      this.pwdSettingViewList.appendChild(this.pwdResetOption);

      if(!this.pwdActiveCheck.checked) {
        this.pwdResetOption.setAttribute('disabled', '');
      }

      this.pwdActiveCheck.onchange = event => {
        const pwdActive = event.currentTarget.checked;
        if(pwdActive) {
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('show-pwd-change', {
              detail: {
                successCallback: () => {
                  history.back();
                  this.activePwd();
                },
                cancelCallback: () => {
                  this.deactivePwd();
                }
              }
            }));
          }, 500);
        } else {
          this.deactivePwd();
        }
      };
    }

    return this.pwdSettingViewList;
  }

  activePwd() {
    if(this.fingerPrintCheck) {
      this.fingerPrintCheck.removeAttribute('disabled');
    }
    this.pwdResetOption.removeAttribute('disabled');
    this.passwordActiveText.innerText = '켜짐';    
    this.setLS(window.CONST.LS_KEYS.PWD_ACTIVE, true);
  }

  deactivePwd() {
    this.pwdActiveCheck.checked = false;
    if(this.fingerPrintCheck) {
      this.fingerPrintCheck.checked = false;
      this.fingerPrintCheck.setAttribute('disabled', '');
    }
    this.pwdResetOption.setAttribute('disabled', '');
    this.passwordActiveText.innerText = '꺼짐';
    this.setLS(window.CONST.LS_KEYS.PWD_ACTIVE, false);
    this.setLS(window.CONST.LS_KEYS.TOUCH_ID_ACTIVE, false);
    document.dispatchEvent(new CustomEvent('pwd-deactived'));
  }

  cancelPwdInit() {
    history.back();
    setTimeout(() => {
      this.deactivePwd();
    }, 200);
  }

  getInitialViewList() {
    if(!this.initialViewList) {
      this.initialViewList = document.createElement('div');
      this.initialViewList.setAttribute('id', 'initial-view-list');
      this.initialViewList.classList.add('setting-view');
      let currentInitialView = this.getLS(window.CONST.LS_KEYS.INITIAL_VIEW) ? this.getLS(window.CONST.LS_KEYS.INITIAL_VIEW) : { name: '캘린더', route: 'calendar' };     

      window.CONST.INITIAL_VIEWS.forEach(initialView => {
        const viewOptionItem = document.createElement('div');
        viewOptionItem.setAttribute('route', initialView.route);
        viewOptionItem.classList.add('option-item', 'activable', 'option');
        viewOptionItem.select = function() {
          if(this.getAttribute('selected')) {
            return;
          }

          const checkIcon = SettingUI.getCheckIcon();
          this.appendChild(checkIcon);
          this.checkElement = checkIcon;
          this.setAttribute('selected', '');
        };

        viewOptionItem.disselect = function() {
          this.removeChild(this.checkElement);
          this.removeAttribute('selected');
        };
        
        const viewName = document.createElement('span');
        viewName.classList.add('title');
        viewName.innerText = initialView.name;
        
        viewOptionItem.appendChild(viewName);
        viewOptionItem.getInfoObj = () => {
          return {
            name: initialView.name,
            route: initialView.route
          };
        };

        if(currentInitialView.route === initialView.route) {
          viewOptionItem.select();
        }

        viewOptionItem.onclick = event => {
          const selectedView = this.initialViewList.querySelector('div.option[selected]');
          selectedView.disselect();
          event.currentTarget.select();
          this.setLS(window.CONST.LS_KEYS.INITIAL_VIEW, event.currentTarget.getInfoObj());
          this.initInitialView();
        };

        this.initialViewList.appendChild(viewOptionItem);
      });
    }

    return this.initialViewList;
  }

  getThemeSettingList() {
    if(!this.themeList) {
      this.themeList = document.createElement('div');
      this.themeList.setAttribute('id', 'theme-list');
      this.themeList.classList.add('setting-view');
      let currentTheme = this.getLS(window.CONST.LS_KEYS.THEME) ? this.getLS(window.CONST.LS_KEYS.THEME) : { name: 'basic', description: '기본'};

      window.CONST.THEMES.forEach(theme => {
        const themeOptionItem = document.createElement('div');
        themeOptionItem.setAttribute('theme', theme.name);
        themeOptionItem.classList.add('option-item', 'activable', 'option');
        themeOptionItem.select = function() {
          if(this.getAttribute('selected')) {
            return;
          }

          const checkIcon = SettingUI.getCheckIcon();
          this.appendChild(checkIcon);
          this.checkElement = checkIcon;
          this.setAttribute('selected', '');
        };

        themeOptionItem.disselect = function() {
          this.removeChild(this.checkElement);
          this.removeAttribute('selected');
        };

        const themeName = document.createElement('span');
        themeName.classList.add('title');
        themeName.innerText = theme.description;

        themeOptionItem.appendChild(themeName);
        themeOptionItem.getInfoObj = () => {
          return theme;
        };

        if(currentTheme === theme.name) {
          themeOptionItem.select();
        }

        themeOptionItem.onclick = event => {
          const selectedTheme = this.themeList.querySelector('div.option[selected]');
          selectedTheme.disselect();
          event.currentTarget.select();
          this.setLS(window.CONST.LS_KEYS.THEME, event.currentTarget.getInfoObj().name);
          this.initCurrentTheme();

          document.dispatchEvent(new CustomEvent('theme-changed'));
        };

        this.themeList.appendChild(themeOptionItem);
      });
    }

    return this.themeList;
  }

  alarmActiveChanged(event) {
    const alarmActive = event.currentTarget.checked;

    if(alarmActive) {
      this.alarmTime.removeAttribute('disabled');
      this.fireAddAlarmEvent();

    } else {
      this.alarmTime.setAttribute('disabled', '');
      this.fireClearAlarmEvent();
    }

    this.setLS(window.CONST.LS_KEYS.ALARM_ACTIVE, alarmActive);
  }

  alarmTimeInputHandler(event) {
    let alarmTime = event.currentTarget.value;
    if(!alarmTime) {
      alarmTime = '00:00';
      setTimeout(() => {
        this.alarmTime.value = alarmTime;
        this.alarmTime.blur();
      }, 100);
    }

    this.fireAddAlarmEvent();
    
    this.setLS(window.CONST.LS_KEYS.ALARM_TIME, alarmTime);
  }

  fireAddAlarmEvent() {
    const alarmTimeArray = this.alarmTime.value.split(':');
    const hour = parseInt(alarmTimeArray[0]); const minute = parseInt(alarmTimeArray[1]);

    document.dispatchEvent(new CustomEvent('alarm-enabled', {
      detail: {
        hour: hour,
        minute: minute,
        interval: CONST.NOTIFICATION.DEFAULT_INTERVAL
      }
    }));
  }

  fireClearAlarmEvent() {
    document.dispatchEvent(new CustomEvent('alarm-disabled'));
  }

  resetDiary() {
    window.ha.openConfirm({
      title: '초기화',
      message: '작성한 모든 일기가 삭제 됩니다.',
      type: CONST.NATIVE_STYLE.ALERT.ACTION,
      options: [{
        name: '초기화',
        type: CONST.NATIVE_STYLE.BTN.DESTRUCTIVE,
        callback: () => {
          document.dispatchEvent(new CustomEvent('reset-diary'));
        }
      }, {
        name: '취소',
        type: CONST.NATIVE_STYLE.BTN.CANCEL
      }]
    });
  }

  routeBack() {
    // setting 화면의 디테일 화면일 경우 스크롤이 오른쪽으로 이동 했기 때문에
    if(this.settingViews.scrollLeft > 0) {
      window.scroller.scrollAnimate(this.settingViews, {
        axis : 'x',
        to: 0,
        duration: 15
      });
    } else { // setting 화면의 디테일 화면이 아닐 경우 메인 화면으로 이동
      location.hash = JSON.parse(localStorage.getItem(CONST.LS_KEYS.INITIAL_VIEW)).route;
    }
  }

  getLS(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }

  setLS(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  static getCheckIcon() {
    const object = document.createElement('object');
    object.setAttribute('type', 'image/svg+xml');
    object.setAttribute('data', './assets/images/check-icon.svg');
    object.addEventListener('load', function() {
      const themeName = JSON.parse(localStorage.getItem('tm.setting.theme'));
      const currentTheme = window.CONST.THEMES.filter(theme => {
        return theme.name === themeName;
      })[0];
      this.contentDocument.getElementById('check-icon').style.fill = currentTheme.colors['--main-theme-color'];
    });

    return object;
  }

  touchIdSupported() {
    return new Promise((resolve, reject) => {
      if('touchid' in window) {
        window.touchid.checkSupport(() => {
          resolve(true); 
        }, () => {
          reject({
            title: 'Touch ID 사용 불가',
            message: 'Touch ID를 사용 할 수 없습니다.',
            options: [{
              name: '확인'
            }]
          });
        });
      } else {
        reject({
          title: 'Touch ID 사용 불가',
          message: 'Touch ID를 사용 할 수 없습니다.',
          options: [{
            name: '확인'
          }]
        });
      }
    });
  }
}