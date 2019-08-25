class BlockerUI {
  constructor() {
    document.body.appendChild(this.getBlocker());
    this.isShow = false;
  }

  getBlocker() {
    this.blocker = document.createElement('div');
    this.blocker.setAttribute('id', 'blocker');
    this.blocker.style.position = 'absolute';
    this.blocker.style.top = 0;
    this.blocker.style.bottom = 0;
    this.blocker.style.left = 0;
    this.blocker.style.right = 0;
    this.blocker.style.zIndex = 100;
    this.blocker.style.display = 'none';
    this.blocker.style.flexDirection = 'column';
    this.blocker.appendChild(this.getMessage());
    this.blocker.appendChild(this.getSvgObj());
    return this.blocker;
  }

  getSvgObj() {
    const svgObj = document.createElement('object');
    svgObj.setAttribute('id', 'blocker-icon');
    svgObj.setAttribute('type', 'image/svg+xml');
    svgObj.setAttribute('data', './assets/images/logo-colored.svg');
    svgObj.addEventListener('load', function() {
      const themeName = JSON.parse(localStorage.getItem(CONST.LS_KEYS.THEME));
      const currentTheme = window.CONST.THEMES.filter(theme => {
        return theme.name === themeName;
      })[0];
      const paths = this.contentDocument.querySelectorAll('.logo-colored');
      paths.forEach(path => {
        path.style.fill = currentTheme.colors['--main-theme-color'];
      });
    });
    return svgObj;
  }

  getMessage() {
    const messageSpan = document.createElement('span');
    messageSpan.setAttribute('id', 'blocker-msg');
    messageSpan.innerText = CONST.BLOCKER.BLOCKER_MESSAGE;
    return messageSpan;
  }

  getShowStatus() {
    return this.isShow;
  }

  show() {
    this.blocker.style.display = 'flex';
    this.isShow = true;
  }

  hide() {
    this.blocker.style.display = 'none';
    this.isShow = false;
  }
}