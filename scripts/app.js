window.stdDateUtil = new DateUtil();
window.currentDateUtil = new DateUtil();
window.ha = new HybridAlert();
window.spinner = new HybridSpinner();
window.execLogger = new ExecLogger();
const viewerUI = new ViewerUI();
const headerUI = new HeaderUI();
const calendarUI = new CalendarUI();
const listUI = new ListUI();
const searchUI = new SearchUI();
const blocker = new BlockerUI();
const editorUI = new EditorUI();
const sideBarUI = new SideBarUI();
const settingUI = new SettingUI();
const webDBUtil = new WebDBUtil();
const pageUtil = new PageUtil();
const fileTransUtil = new FileTransferUtil();
const localNotificationUtil = new LocalNotificationUtil();
new AuthUI();

const app = {
  moduleName: 'App Module',

  actived: true,

  initializeApplication: function() {
    'use strict';
    app.adjustTheme();
    app.adjustFastClick();
    app.registEventListeners();
    webDBUtil.initialize();
    headerUI.showCommonHeader();
    viewerUI.renderViewer();
    calendarUI.renderCalendars();
    listUI.renderLists();
    settingUI.initAppVersion(window.CONST.APP.VERSION);
    pageUtil.initialSetup(app.getEntryPoint(), Array.from(document.querySelectorAll('div[page]')));
    app.changeHiddenPickerValue();
    app.hideSplashScreen();
    fileTransUtil.storageInitialize();
  },

  adjustTheme: function() {
    'use strict';
    let currentTheme = JSON.parse(localStorage.getItem(window.CONST.LS_KEYS.THEME));
    currentTheme = currentTheme ? currentTheme : 'basic';
    
    const themeObj = window.CONST.THEMES.filter(theme => {
      return theme.name === currentTheme;
    })[0];
    
    for(let key in themeObj.colors) {
      if(themeObj.colors[key]) {
        document.body.style.setProperty(key, themeObj.colors[key]);
      }
    }
    document.dispatchEvent(new CustomEvent('theme-adjusted'));
    app.adjustStatusBarColor();
  },

  adjustStatusBarColor: function(color) {
    'use strict';
    if(location.protocol.indexOf('http') < 0) {
      window.StatusBar.overlaysWebView(false);
      if(!color) {
        color = document.body.style.getPropertyValue('--main-theme-color');
      }
      
      window.StatusBar.backgroundColorByHexString(color);
    }
  },

  adjustFastClick: function() {
    'use strict';
    window.FastClick.attach(document.body);
    window.FastClick.attach(document.body);
  },

  registEventListeners: function() {
    'use strict';
    document.addEventListener('app-actived', app.activedHandler);
    document.addEventListener('app-deactived', app.deactivedHandler);
    document.addEventListener('app-enter-background', app.enterBackgroundHandler);
    window.addEventListener('statusTap', app.scrollToTop);
    // 데이터 베이스 초기화 완료 이벤트 핸들러
    document.addEventListener('web-db-initialized', app.getMonthDiaryList);
    // 리스트 보기 버튼 클릭 이벤트 핸들러
    // document.addEventListener('footer-move-to-list', app.showListView);  
    // 캘린더 보기 버튼 클릭 이벤트 핸들러
    // document.addEventListener('footer-move-to-calendar', app.showCalendarView);
    // 뒤로가기 버튼 클릭 이벤트 핸들러
    document.addEventListener('route-back', app.routeBack);
    // 메뉴 토글 버튼 클릭 이벤트 핸들러
    document.addEventListener('menu-btn-click', app.menuBtnClick);
    // calendar view에서 할당되지 않은 날짜 클릭시 이벤트 핸들러
    document.addEventListener('show-empty-viewer', app.showEmptyViewer);
    // calendar view에서 할당되어 있는 날짜 클릭시 이벤트 핸들러
    document.addEventListener('show-content-viewer', app.showContentViewer);
    // viewer에서 할당되지 않은 날짜 클릭시 이벤트 핸들러
    document.addEventListener('show-empty-editor', app.showEmptyEditor);
    // viewer에서 할당되어 있는 날짜 클릭시 이벤트 핸들러
    document.addEventListener('show-content-editor', app.showContentEditor);
    // list에서 할당되어 있는 일기의 미리 보기를 조회하기 위한 이벤트 핸들러
    document.addEventListener('show-list-preview', app.showListPreview);
    // editor에서 일기 저장 버튼 클릭시 이벤트 핸들러
    document.addEventListener('save-diary', app.saveDiary);
    
    document.addEventListener('diary-saved', () => {
      document.dispatchEvent(new CustomEvent('show-content-viewer', {
        detail: {
          fileName: window.currentDateUtil.getDateFileNameFormat() + '.txt'
        }
      }));
    });
    // 화면 공통 일기 삭제 버튼 클릭시 이벤트 핸들러
    document.addEventListener('delete-diary', app.deleteDiary);
    // 캘린더 변경 이벤트 핸들러
    document.addEventListener('date-switched', app.dateSwitched);
    // date picker를 통해 date가 변경 되었을 때 이벤트 핸들러
    document.addEventListener('date-picked', () => {
      app.refreshDiary();
    });
    
    document.addEventListener('pwd-inited', app.savePwd);
    
    document.addEventListener('pwd-deactived', app.deletePwd);
    
    document.addEventListener('check-auth', app.checkAuth);
    
    document.addEventListener('search-keyword-changed', app.searchByKeyword);
    
    document.addEventListener('reset-diary', app.resetDiary);

    document.addEventListener('import-diary', app.importDiary);

    document.addEventListener('export-diary', app.exportDiary);
    
    document.addEventListener('theme-changed', app.adjustTheme);

    document.addEventListener('alarm-enabled', app.addNotification);

    document.addEventListener('alarm-disabled', app.clearNotification);
  },

  getEntryPoint: function() {
    'use strict';
    // 페이지 변경 이벤트 핸들러
    document.addEventListener('page-changed', app.pageChanged);
    
    if(JSON.parse(localStorage.getItem(window.CONST.LS_KEYS.PWD_ACTIVE))) {
      document.dispatchEvent(new CustomEvent('show-pwd-check', {
        detail: {
          successCallback: () => {
            const initialView = JSON.parse(localStorage.getItem(window.CONST.LS_KEYS.INITIAL_VIEW));
            if(initialView && initialView.route) {
              location.hash = initialView.route;
            } else {
              location.hash = 'calendar';
            }
          }
        }
      }));
      
      return 'auth';
    }
    
    const initialView = JSON.parse(localStorage.getItem(window.CONST.LS_KEYS.INITIAL_VIEW));
    if(!initialView) {
      return 'calendar';
    }
    
    return initialView.route;
  },
  
  scrollToTop: function() {
    'use strict';
    if(pageUtil.getCurrentPage() === 'list') {
      listUI.scrollToTop();
    }
  },

  getMonthDiaryList: function() {
    'use strict';
    const tmDiary = new TmDiary();
    tmDiary.year = window.stdDateUtil.getYearStr();
    tmDiary.month = window.stdDateUtil.getMonthStr();
    webDBUtil.selectDiary(tmDiary.getDataObj())
    .then(diaries => {
      app.markDiaryList(diaries);
      app.markingCurrentDate();
    })
    .catch(error => {
      throw error;
    });
  },

  markDiaryList: function(diaries) {
    'use strict';
    const page = pageUtil.getCurrentPage();
    const dates = diaries.map(diary => diary.date);
    switch (page) {
      case 'calendar':
        calendarUI.markAssigneByDates(dates);
        break;
      case 'list':
        listUI.markAssigneByDates(dates);
        break;
    }
  },

  showListView: function() {
    'use strict';
    location.hash = 'list';
  },

  showCalendarView: function() {
    'use strict';
    location.hash = 'calendar';
  },

  routeBack: function() {
    'use strict';
    const currentPage = pageUtil.getCurrentPage();
    if(currentPage === 'write') {
      editorUI.saveDiary();
    } else if(currentPage === 'setting') {
      settingUI.routeBack();
    } else {
      history.back();
    }
  },

  pageChanged: function(event) {
    'use strict';
    const previousPage = event.detail.previousPage;
    const currentPage = event.detail.currentPage;
  
    switch(previousPage) {
      case 'auth':
        headerUI.showHeader();
        app.adjustStatusBarColor();
        // footerUI.showFooter();
        break;
    }  
  
    switch(currentPage) {
      case 'calendar':
        headerUI.showCommonHeader();
        if(previousPage) {
          app.getMonthDiaryList();
        }
        calendarUI.renderCalendars();
        calendarUI.markByDate();
        break;
  
      case 'list':
        headerUI.showCommonHeader();
        // footerUI.showListFooter();
        app.getMonthDiaryList();
        listUI.renderLists();
        // listUI.moveTopByDate();
        break;
  
      case 'write':
        // headerUI.showEditorHeader(viewerUI.getDiaryDate());
        headerUI.showEditorHeader();
        // if(!editorUI.previousContent && this.currentDateUtil.isToday()) {
        //   headerUI.getCurrentWeather();
        // }
        // footerUI.clearFooter();
        break;
  
      case 'setting':
        headerUI.showRouteBackBtn();
        headerUI.clearCenterElement();
        headerUI.clearRightElement();
        // footerUI.clearFooter();
        break;
  
      case 'auth':
        headerUI.hideHeader();
        app.adjustStatusBarColor();
        // footerUI.hideFooter();
        break;
  
      case 'search':
        if(previousPage === 'write') {
          headerUI.showSearchHeader();
          // input event dispatch to re-search diaries after route back to search page
          app.searchByKeyword({
            detail: headerUI.searchInput.value
          });
        }
        break;
  
      default:
        const menuInfo = window.CONST.MENUS.find(menu => {
          return menu.page === currentPage;
        });
        
        if(menuInfo && menuInfo.name) {
          const titleElement = document.createElement('span');
          titleElement.innerText = menuInfo.name ? menuInfo.name : '';
          headerUI.appendCenterElement(titleElement);
          headerUI.showRouteBackBtn();
        }
        break;
    }

    setTimeout(() => {
      sideBarUI.renderMenus();
    }, 250);
  },

  menuBtnClick: function() {
    'use strict';
    sideBarUI.toggleSideBar();
  },

  showEmptyViewer: function() {
    'use strict';
    viewerUI.showEmptyViewer();
  },

  showContentViewer: function(event) {
    'use strict';
    const tmDiary = new TmDiary();
    tmDiary.fileName = event.detail.fileName;
    webDBUtil.selectDiary(tmDiary.getDataObj())
    .then(diaries => {
      if(diaries && diaries.length) {
        viewerUI.showContentViewer(diaries[0].content);
      }
    })
    .catch(error => {
      throw error;
    });
  },

  showEmptyEditor: function(event) {
    'use strict';
    editorUI.showEmptyEditor({
      fileName: event.detail.fileName
    });
  },

  showContentEditor: function(event) {
    'use strict';
    const tmDiary = new TmDiary();
    tmDiary.fileName = event.detail.fileName;
    webDBUtil.selectDiary(tmDiary.getDataObj())
    .then(diaries => {
      editorUI.showContentEditor({
        fileName: event.detail.fileName,
        diary: diaries[0]
      });
    })
    .catch(error => {
      throw error;
    });
  },

  showListPreview: function(event) {
    'use strict';
    const dateBlock = event.detail.dateBlock;
    const tmDiary = new TmDiary();
    tmDiary.fileName = event.detail.fileName;
    webDBUtil.selectDiary(tmDiary.getDataObj())
    .then(diaries => {
      dateBlock.showDiaryPreview(diaries[0]);
    })
    .catch(error => {
      throw error;
    });
  },

  saveDiary: function(event) {
    'use strict';
    const tmDiary = new TmDiary();
    tmDiary.fileName = event.detail.fileName;
    tmDiary.content = event.detail.content;
    webDBUtil.selectDiary({ fileName: tmDiary.fileName })
    .then(diaries => {
      if(diaries.length) {
        tmDiary.id = diaries[0].id;
        webDBUtil.replaceDiary(tmDiary);
      } else {
        webDBUtil.insertDiary(tmDiary);
      }
    })
    .then(() => {
      if(location.hash.indexOf('setting') === -1) {
        history.back();
      }
      document.dispatchEvent(new CustomEvent('diary-saved'));
    })
    .catch(error => {
      throw error;
    });
  },

  deleteDiary: function(event) {
    'use strict';
    webDBUtil.deleteDiary(event.detail.fileName)
    .then(() => {
      app.getMonthDiaryList();
      viewerUI.showEmptyViewer();
      if(event.detail.callback && typeof event.detail.callback === 'function') {
        event.detail.callback();
      }
      document.dispatchEvent(new CustomEvent('diary-deleted'));
    })
    .catch(error => {
      throw error;
    });
  },

  dateSwitched: function() {
    'use strict';
    headerUI.showCommonHeader();
    app.changeHiddenPickerValue();
    app.getMonthDiaryList();
  },

  markingCurrentDate: function() {
    'use strict';
    if(calendarUI.calendar.getYearMonth() === viewerUI.getYearMonth()) {
      const dateCell = calendarUI.getDateCellByDate(window.currentDateUtil.getDate());
      if(!dateCell.hasAttribute('selected')) {
        dateCell.marking();
      }
    }
  },

  changeHiddenPickerValue: function() {
    'use strict';
    const stdDateObj = window.stdDateUtil.getDateObj();
    const yearStr = stdDateObj.year.toString();
    const monthStr = stdDateObj.month.toString().length === 1 ? '0' + stdDateObj.month.toString() : stdDateObj.month.toString();
    document.getElementById('hidden-datepicker').value = `${yearStr}-${monthStr}`;
  },

  hideSplashScreen: function() {
    'use strict';
    if('splashscreen' in navigator) {
      navigator.splashscreen.hide();
    }
  },

  refreshDiary: function() {
    'use strict';
    // window.spinner.showBySec({
    //   message: `${window.stdDateUtil.getYearMonthStr()}...`
    // }, 1);

    window.spinner.showBySec(null, 1);
  
    calendarUI.renderCalendars();
    listUI.renderList();
    headerUI.showCommonHeader();  
    app.getMonthDiaryList();
  },

  savePwd: function(event) {
    'use strict';
    webDBUtil.deletePwd()
    .then(() => {
      return webDBUtil.insertPwd(event.detail);
    })
    .then(() => {
      window.ha.openConfirm({
        title: '암호 설정',
        type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
        message: '암호 설정이 완료 되었습니다.',
        options: [{
          name: '확인',
          type: CONST.NATIVE_STYLE.BTN.DEFAULT
        }]
      });
    })
    .catch(() => {
      window.ha.openConfirm({
        title: '암호 설정 실패',
        type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
        message: '암호 설정에 실패 했습니다.',
        options: [{
          name: '확인',
          type: CONST.NATIVE_STYLE.BTN.DEFAULT
        }]
      });
    });
  },

  deletePwd: function() {
    'use strict';
    webDBUtil.deletePwd();
  },

  checkAuth: function(event) {
    'use strict';
    webDBUtil.checkAuth(event.detail)
    .then(() => {
      document.dispatchEvent(new CustomEvent('auth-checked', {
        detail: true
      }));
    })
    .catch(() => {
      document.dispatchEvent(new CustomEvent('auth-checked', {
        detail: false
      }));
    });
  },

  activedHandler: function() {
    'use strict';
    blocker.hide();
    if(app.showPwdPage) {
      app.showPwdPage = false;
      document.dispatchEvent(new CustomEvent('show-pwd-check', {
        detail: {
          successCallback: () => {
            if(!pageUtil.getCurrentPage()) {
              location.hash = JSON.parse(localStorage.getItem(window.CONST.LS_KEYS.INITIAL_VIEW)).route;
            } else {
              history.back();
            }
          }
        }
      })); 
    }
  },

  deactivedHandler: function() {
    'use strict';
    if(pageUtil.getCurrentPage() !== 'auth') {
      blocker.show();
    }
  },

  enterBackgroundHandler: function() {
    'use strict';
    if(pageUtil.getCurrentPage() !== 'auth') {
      app.showPwdPage = JSON.parse(localStorage.getItem(window.CONST.LS_KEYS.PWD_ACTIVE));
    }
  },

  searchByKeyword: function() {
    'use strict';
    let keywords = headerUI.searchInput.value;
    if(!keywords) {
      return;
    }
    keywords = keywords.replace(/\s+/g, '||');
    keywords = keywords.split('||');
    keywords = keywords.filter(keyword => {
      return keyword.length > 0;
    });
  
  
    let sql = `
      SELECT
        id,
        fileName,
        preview,
        content,
        CAST(year AS INT) as year,
        CAST(month AS INT) as month,
        CAST(date AS INT) as date  
      FROM 
        tm_diaries
      WHERE
    `;
  
    keywords.forEach(keyword => {
      if(keyword) {
        sql += `
          content like '%${keyword}%' OR
        `;
      }
    });
  
    sql = sql.substr(0, sql.lastIndexOf(' OR'));
  
    sql += `
      ORDER BY year asc, month asc, date asc
    `;
  
    webDBUtil.doTrx(sql, [])
    .then(result => {
      if(result && result.length >= 0) {
        location.hash = 'search';
        searchUI.renderSearchList(result, keywords);
      }
    })
    .catch(error => {
      throw error;
    });
  },

  resetDiary: function() {
    'use strict';
    const sql = `
      DELETE FROM tm_diaries
    `;
    window.spinner.show({
      message: '초기화 진행중...'
    });
  
    webDBUtil.doTrx(sql, [])
    .then(() => {
      window.spinner.hide();
      document.dispatchEvent(new CustomEvent('diary-reseted'));
      window.ha.openConfirm({
        title: '완료',
        type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
        message: 'Time Machine을 다시 실행 합니다.',
        options: [{
          name: '확인',
          type: CONST.NATIVE_STYLE.BTN.DEFAULT,
          callback: () => {
            location.hash = JSON.parse(localStorage.getItem(window.CONST.LS_KEYS.INITIAL_VIEW)).route;
          }
        }]
      });
    });
  },

  importDiary: function() {
    'use strict';
    fileTransUtil.readFiles(window.CONST.FILE.PATH, fileEntries => {
      const total = fileEntries.length;

      if(total === 0) {
        window.ha.openConfirm({
          title: '불러오기',
          type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
          message: '기기에 저장된 일기가 없습니다.',
          options: [{
            name: '확인',
            type: CONST.NATIVE_STYLE.BTN.DEFAULT
          }]
        });
        return;
      }

      window.ha.openConfirm({
        title: '불러오기',
        type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
        message: `${total}개의 일기를 불러 오시겠습니까? 현재 작성된 일기를 덮어 쓸 수 있으니 주의하세요.`,
        options: [{
          name: '불러오기',
          type: CONST.NATIVE_STYLE.BTN.DESTRUCTIVE,
          callback: () => {
            let idx = 0;

            const importNextDiary = function() {
              idx++;
              window.spinner.show({ message: `${idx}/${total} 불러오기 진행중...` });
              if(fileEntries[idx]) {
                const fileName = fileEntries[idx].name;
                fileTransUtil.readFile(fileName, content => {
                  document.dispatchEvent(new CustomEvent('save-diary', {
                    detail: {
                      fileName: fileName,
                      content: content
                    }
                  }));
                });
              } else {
                document.removeEventListener('diary-saved', importNextDiary);
                window.spinner.hide();
                window.ha.openConfirm({
                  title: '불러오기 완료',
                  type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
                  message: `${total}개의 일기를 불러오는데 성공 했습니다.`,
                  options: [{
                    name: '확인',
                    type: CONST.NATIVE_STYLE.BTN.DEFAULT
                  }]
                });
              }
            };
            
            document.addEventListener('diary-saved', importNextDiary);
            const fileName = fileEntries[idx].name;
            fileTransUtil.readFile(fileName, content => {
              document.dispatchEvent(new CustomEvent('save-diary', {
                detail: {
                  fileName: fileName,
                  content: content
                }
              }));
            });
            window.spinner.show({ message: `${idx}/${total} 불러오기 진행중...` });
          }
        }, {
          name: '취소',
          type: CONST.NATIVE_STYLE.BTN.CANCEL
        }]
      });
    });
  },

  exportDiary: function() {
    'use strict';
    const sql = `
      SELECT fileName, content FROM tm_diaries
    `;

    webDBUtil.doTrx(sql, [])
    .then(diaries => {
      const total = diaries.length;

      if(total === 0) {
        window.ha.openConfirm({
          title: '내보내기',
          type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
          message: '아직 작성하신 일기가 없습니다.',
          options: [{
            name: '확인',
            type: CONST.NATIVE_STYLE.BTN.DEFAULT
          }]
        });

        return;
      }

      let idx = 0;
      const writeNextDiary = function() {
        idx++;
        window.spinner.show({ message: `${idx}/${total} 내보내기 진행중...` });
        if(diaries[idx]) {
          fileTransUtil.writeFile(diaries[idx].fileName, diaries[idx].content);    
        } else {
          document.removeEventListener('write-file-success', writeNextDiary);
          document.removeEventListener('write-file-error', failWriteDiary);
          window.spinner.hide();
          window.ha.openConfirm({
            title: '내보내기 완료',
            type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
            message: `${diaries.length}개의 일기를 내보내는데 성공 했습니다.`,
            options: [{
              name: '확인',
              type: CONST.NATIVE_STYLE.BTN.DEFAULT
            }]
          });
        }
      };
      const failWriteDiary = function() {
        window.ha.openConfirm({
          title: '내보내기 실패',
          type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
          message: `'${event.detail.fileName}' 일기 내보내기에 실패 했습니다.`,
          options: [{
            name: '확인',
            type: CONST.NATIVE_STYLE.BTN.DESTRUCTIVE
          }]
        });
      };
      document.addEventListener('write-file-success', writeNextDiary);
      document.addEventListener('write-file-error', failWriteDiary);

      fileTransUtil.writeFile(diaries[idx].fileName, diaries[idx].content);
      window.spinner.show({ message: `${idx}/${total} 내보내기 진행중...` });
    });
  },

  addNotification: function(event) {
    'use strict';
    const hour = event.detail.hour;
    const minute = event.detail.minute;
    const title = CONST.NOTIFICATION.TITLE.REMIND_TITLE;
    const subtitle = CONST.NOTIFICATION.SUBTITLE.REMIND_SUBTITLE;
    const message = CONST.NOTIFICATION.MESSAGE.REMIND_MESSAGE;

    localNotificationUtil.addNotification(title, subtitle, message, hour, minute);
  },

  clearNotification: function() {
    'use strict';
    localNotificationUtil.clearNotification();
  }
};

document.addEventListener('src-imported', app.initializeApplication);