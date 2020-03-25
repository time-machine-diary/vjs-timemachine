(() => {
  "use strict";
  window.CONST = window.CONST
    ? window.CONST
    : {
        DB: {
          DB_NAME: "tm_db",
          DB_VERSION: "1.0.0",
          DB_DESC: "tm_db",
          DB_SIZE: 1024 * 1024,
          TABLES: {
            tm_auth: {
              encrypted_pwd: {
                type: "text",
                notNull: true
              }
            },
            tm_diaries: {
              id: {
                type: "integer",
                idField: true
              },
              fileName: {
                type: "text",
                notNull: true
              },
              year: {
                type: "text",
                notNull: true
              },
              month: {
                type: "text",
                notNull: true
              },
              date: {
                type: "text",
                notNull: true
              },
              preview: {
                type: "text",
                notNull: true
              },
              content: {
                type: "text",
                notNull: true
              }
            }
          }
        },
        FILE: {
          PATH: "diaries"
        },
        SERVER: {
          BASE_URL: "http://localhost:9100"
        },
        MENUS: [
          {
            name: "설정",
            route: "setting"
          }
        ],
        APP: {
          VERSION: "v1.0.0",
          DEVELOPER: {
            NAME: "Jay Lee",
            CONTACT: "support@TMDiary.com"
          }
        },
        INITIAL_VIEWS: [
          {
            name: "캘린더 보기",
            route: "calendar"
          },
          {
            name: "목록 보기",
            route: "list"
          }
        ],
        THEMES: [
          {
            name: "basic",
            description: "기본",
            colors: {
              "--main-theme-color": "#BF004D",
              "--main-theme-light": "#DE463C",
              "--main-theme-dark": "#990440",
              "--main-theme-deep-dark": "#560022"
            }
          },
          {
            name: "dark",
            description: "어두운",
            colors: {
              "--main-theme-color": "#242524",
              "--main-theme-light": "#4C4E4E",
              "--main-theme-dark": "#1D1E1E",
              "--main-theme-deep-dark": "#000000"
            }
          },
          {
            name: "line",
            description: "LINE",
            colors: {
              "--main-theme-color": "#00B900",
              "--main-theme-light": "#00F900",
              "--main-theme-dark": "#009900",
              "--main-theme-deep-dark": "#006900"
            }
          }
        ],
        LS_KEYS: {
          ALARM_ACTIVE: "tm.setting.alarm.active",
          ALARM_TIME: "tm.setting.alarm.time",
          INITIAL_VIEW: "tm.setting.initial.view",
          PWD_ACTIVE: "tm.setting.password.active",
          TOUCH_ID_ACTIVE: "tm.setting.touch.id.active",
          THEME: "tm.setting.theme"
        },
        DEPLOY: {
          DEV_MODE: false,
          // SRC_URL: 'http://192.168.0.103:7777'
          // SRC_URL: 'http://192.168.123.153:7777'
          SRC_URL: "http://192.168.0.5:7777"
        },
        BLOCKER: {
          BLOCKER_MESSAGE: "TIME MACHINE DIARY"
        },
        NOTIFICATION: {
          TITLE: {
            REMIND_TITLE: "일기 작성 알림"
          },
          SUBTITLE: {
            REMIND_SUBTITLE: ""
          },
          MESSAGE: {
            REMIND_MESSAGE: "오늘 하루를 타임머신에 기록하세요."
          }
        },
        NATIVE_STYLE: {
          BTN: {
            DEFAULT: "DEFAULT",
            CANCEL: "CANCEL",
            DESTRUCTIVE: "DESTRUCTIVE"
          },
          ALERT: {
            DEFAULT: "DEFAULT",
            ACTION: "ACTION"
          }
        },
        WEATHER: {
          API_KEY: "2b72ced6ffe45e621bfa8b15b56e7082",
          API: "https://api.openweathermap.org/data/2.5/weather",
          TYPES: ["SUNNY", "CLOUDY", "RAINY", "SNOWY"],
          CODES: {
            THUNDERSTORM: {
              MIN: 200,
              MAX: 299
            },
            DRIZZLE: {
              MIN: 300,
              MAX: 399
            },
            RAIN: {
              MIN: 500,
              MAX: 599
            },
            SNOW: {
              MIN: 600,
              MAX: 699
            },
            ATMOSPHERE: {
              MIN: 700,
              MAX: 799
            },
            CLEAR: {
              MIN: 800,
              MAX: 800
            },
            CLOUDS: {
              MIN: 801,
              MAX: 804
            }
          }
        }
      };
})();
