(function() {
  'use strict';
  
  const scriptList = [
    'schema/tm-diary.js',
    'util/exec-logger.js',
    'util/date-util.js',
    'util/web-db-util.js',
    'util/file-transfer-util.js',
    'util/page-util.js',
    'util/hybrid-alert.js',
    'util/hybrid-spinner.js',
    'util/toast-buttons.js',
    'util/local-notification-util.js',
    'ui/header-ui.js',
    'ui/side-bar-ui.js',
    'ui/calendar-ui.js',
    'ui/viewer-ui.js',
    'ui/editor-ui.js',
    'ui/list-ui.js',
    'ui/setting-ui.js',
    'ui/auth-ui.js',
    'ui/search-ui.js',
    'ui/blocker-ui.js',
    'ext-libs/fastclick.js',
    'util/scroller.js',
    'app.js'
  ];

  const styleSheetList = [
    'main-style.css',
    'auth-style.css',
    'calendar-style.css',
    'editor-style.css',
    'list-style.css',
    'setting-style.css',
    'viewer-style.css',
    'search-style.css'
  ];

  const _getScriptTag = function() {
    return document.createElement('script');
  };

  const _getLinkTag = function() {
    const linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');
    return linkTag;
  };

  const importScripts = function() {
    let prefix = CONST.DEPLOY.DEV_MODE ? CONST.DEPLOY.SRC_URL : '.';

    styleSheetList.forEach(styleSheet => {
      const linkTag = _getLinkTag();
      linkTag.setAttribute('href', `${prefix}/css/${styleSheet}`);
      document.head.appendChild(linkTag);
    });

    let scriptIdx = 0;
    const _loadScript = function() {
      const scriptTag = _getScriptTag();
      const script = scriptList[scriptIdx];
      scriptIdx++;
      scriptTag.setAttribute('src', `${prefix}/scripts/${script}`);
      if(script === 'app.js') {
        scriptTag.onload = () => {
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('src-imported'));
          }, 1000);
        };
      } else if (script !== 'app.js' && scriptList[scriptIdx]) {
        scriptTag.onload = _loadScript;
      }

      document.body.appendChild(scriptTag);
    };

    _loadScript(scriptList[scriptIdx]);

    // scriptList.forEach(script => {
    //   const scriptTag = _getScriptTag();
    //   scriptTag.setAttribute('src', `${prefix}/scripts/${script}`);
    //   if(script === 'app.js') {
    //     scriptTag.addEventListener('load', () => {
    //       setTimeout(() => {
    //         document.dispatchEvent(new CustomEvent('src-imported'));
    //       }, 1000);
    //     });
    //   }

    //   document.body.appendChild(scriptTag);
    // });
  };

  // if(location.protocol.indexOf('http') >= 0) {
  //   window.addEventListener('load', importScripts);
  // } else {
  //   document.addEventListener('deviceready', importScripts);
  // }
  importScripts();
})();