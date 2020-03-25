/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  index.html의 setting ui를 핸들링하기 위한 class
 */

class AuthUI {
  constructor() {
    this.pwdDisplayText = document.getElementById("auth-display-text");
    this.lockerSvgObject = document.getElementById("auth-locker-img");
    this.pwdUnits = Array.from(document.querySelectorAll("div.auth-unit"));
    this.changableButton = document.querySelector("button#changable-btn");
    this.numPadButtons = Array.from(
      document.querySelectorAll("button.auth-num-pad")
    );
    this.loadLockerSvg();

    this.registerEventListeners();
  }

  registerEventListeners() {
    this.numPadButtons.forEach(numPadButton => {
      numPadButton.onclick = this.numPadClicked.bind(this);
    });

    document.addEventListener("show-pwd-change", event => {
      this.readySetupNewPwd();
      this.successCallback = event.detail.successCallback;
      this.cancelCallback = event.detail.cancelCallback;
    });

    document.addEventListener("show-pwd-check", event => {
      this.readyCheckAuth();
      this.successCallback = event.detail.successCallback;
    });

    document.addEventListener("auth-checked", event => {
      const result = event.detail;
      if (result) {
        this.successCallback();
      } else {
        navigator.vibrate(500);
        this.showMissMatchText();
        this.clearFilledUnit();
        this.pwd = "";
      }
    });
  }

  loadLockerSvg() {
    this.lockerSvgObject.setAttribute("data", "./assets/images/locker.svg");
    this.lockerSvgObject.addEventListener("load", function() {
      const themeName = JSON.parse(localStorage.getItem(CONST.LS_KEYS.THEME));
      const currentTheme = window.CONST.THEMES.filter(theme => {
        return theme.name === themeName;
      })[0];
      const paths = this.contentDocument.querySelectorAll(".locker-svg");
      paths.forEach(path => {
        path.style.fill = currentTheme.colors["--main-theme-color"];
      });
    });
  }

  readySetupNewPwd() {
    this.clearFilledUnit();
    this.showSetupText();
    this.showCancelBtn();
    this.isSetupNewPwd = true;
    this.isCheckAuth = false;
    this.isConfirmPwd = false;
    this.pwd = "";
    location.hash = "auth";
  }

  readySetupConfirmPwd() {
    this.clearFilledUnit();
    this.showConfirmText();
    this.isConfirmPwd = true;
    this.confirmPwd = "";
  }

  readyCheckAuth() {
    this.clearFilledUnit();
    this.showCheckAuthText();
    if (this.checkTouchIdUsable()) {
      this.showTouchIdBtn();
    } else {
      this.hideCancelBtn();
    }
    this.isSetupNewPwd = false;
    this.isCheckAuth = true;
    this.pwd = "";
    location.hash = "auth";
    if (this.checkTouchIdUsable()) {
      this.showTouchIdAuth();
    } else {
      this.hideTouchIdAuth();
    }
  }

  checkTouchIdUsable() {
    return JSON.parse(
      localStorage.getItem(window.CONST.LS_KEYS.TOUCH_ID_ACTIVE)
    );
  }

  showCancelBtn() {
    this.changableButton.classList.remove("touch-id");
    this.changableButton.classList.remove("disabled");
    this.changableButton.innerText = "취소";
    this.changableButton.setAttribute("value", "cancel");
  }

  hideCancelBtn() {
    this.changableButton.classList.remove("touch-id");
    this.changableButton.classList.add("disabled");
    this.changableButton.innerText = "";
  }

  showTouchIdBtn() {
    this.changableButton.innerText = "";
    this.changableButton.classList.remove("disabled");
    if (!this.changableButton.classList.contains("touch-id")) {
      this.changableButton.classList.add("touch-id");
    }
    const object = document.createElement("object");
    object.setAttribute("type", "image/svg+xml");
    object.setAttribute("data", "./assets/images/finger-print.svg");
    object.addEventListener("load", function() {
      const themeName = JSON.parse(localStorage.getItem("tm.setting.theme"));
      const currentTheme = window.CONST.THEMES.filter(theme => {
        return theme.name === themeName;
      })[0];
      const paths = this.contentDocument.querySelectorAll(".finger-print-svg");
      paths.forEach(path => {
        path.style.fill = currentTheme.colors["--main-theme-color"];
      });
    });
    this.changableButton.appendChild(object);
    this.changableButton.fingerPrintIcon = object;
    this.changableButton.setAttribute("value", "touch-id");
  }

  hideTouchIdAuth() {
    this.changableButton.classList.add("disabled");
  }

  clearFilledUnit() {
    this.pwdUnits.forEach(pwdUnit => {
      pwdUnit.removeAttribute("filled");
    });
  }

  numPadClicked(event) {
    const value = event.currentTarget.value;
    switch (value) {
      case "touch-id":
        this.showTouchIdAuth();
        break;

      case "cancel":
        this.routeBack();
        break;

      case "del":
        this.delClicked();
        break;

      default:
        this.pwdClicked(value);
    }
  }

  showTouchIdAuth() {
    if (window.touchid) {
      window.touchid.checkSupport(() => {
        if (this.checkTouchIdUsable()) {
          window.touchid.authenticate(
            () => {
              document.dispatchEvent(
                new CustomEvent("auth-checked", {
                  detail: true
                })
              );
            },
            null,
            `잠금 해제`
          );
        } else {
          this.notSetTouchId();
        }
      }, this.unavailTouchId);
    } else {
      this.unavailTouchId();
    }
  }

  notSetTouchId() {
    window.ha.openConfirm({
      title: "Touch ID 사용 불가",
      type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
      message: "Touch ID가 설정되어 있지 않습니다.",
      options: [
        {
          name: "확인",
          type: CONST.NATIVE_STYLE.BTN.DEFAULT
        }
      ]
    });
  }

  unavailTouchId() {
    window.ha.openConfirm({
      title: "Touch ID 사용 불가",
      type: CONST.NATIVE_STYLE.ALERT.DEFAULT,
      message: "Touch ID를 사용 할 수 없습니다.",
      options: [
        {
          name: "확인",
          type: CONST.NATIVE_STYLE.BTN.DEFAULT
        }
      ]
    });
  }

  pwdClicked(value) {
    if (event.currentTarget.classList.contains("disabled")) {
      return;
    }
    if (this.isSetupNewPwd) {
      if (!this.isConfirmPwd) {
        this.pwd += value;
        this.pwdUnits[this.pwd.length - 1].setAttribute("filled", "");
        if (this.pwd.length === 4) {
          this.readySetupConfirmPwd();
        }
      } else {
        if (this.confirmPwd.length < 4) {
          this.confirmPwd += value;
          this.pwdUnits[this.confirmPwd.length - 1].setAttribute("filled", "");
          if (this.confirmPwd.length === 4 && this.pwd === this.confirmPwd) {
            document.dispatchEvent(
              new CustomEvent("pwd-inited", {
                detail: this.pwd
              })
            );
            this.successCallback();
          } else if (
            this.confirmPwd.length === 4 &&
            this.pwd !== this.confirmPwd
          ) {
            this.showMissMatchText();
            this.clearFilledUnit();
            this.confirmPwd = "";
            navigator.vibrate(500);
          }
        }
      }
    } else if (this.isCheckAuth) {
      if (this.pwd.length < 4) {
        this.pwd += value;
        this.pwdUnits[this.pwd.length - 1].setAttribute("filled", "");
        if (this.pwd.length === 4) {
          document.dispatchEvent(
            new CustomEvent("check-auth", {
              detail: this.pwd
            })
          );
        }
      }
    }
  }

  delClicked() {
    if (this.isSetupNewPwd) {
      if (!this.isConfirmPwd && this.pwd.length > 0) {
        this.pwd = this.pwd.slice(0, -1);
      } else if (this.isConfirmPwd && this.confirmPwd.length > 0) {
        this.confirmPwd = this.confirmPwd.slice(0, -1);
      } else {
        navigator.vibrate(500);
      }
    } else if (this.isCheckAuth) {
      if (this.pwd.length > 0) {
        this.pwd = this.pwd.slice(0, -1);
      } else {
        navigator.vibrate(500);
      }
    }

    for (let i = 3; i >= 0; i--) {
      if (this.pwdUnits[i].hasAttribute("filled")) {
        this.pwdUnits[i].removeAttribute("filled");
        break;
      } else {
        continue;
      }
    }
  }

  routeBack() {
    history.back();
    setTimeout(() => {
      document.getElementById("pwd-active-checkbox").checked = JSON.parse(
        localStorage.getItem(window.CONST.LS_KEYS.PWD_ACTIVE)
      );
    }, 100);
  }

  showSetupText() {
    this.showDisplayText("새로운 암호를 입력하세요.");
  }

  showConfirmText() {
    this.showDisplayText("새로운 암호를 재입력하세요.");
  }

  showCheckAuthText() {
    this.showDisplayText("암호를 입력하세요.");
  }

  showMissMatchText() {
    this.showDisplayText("올바른 암호를 입력하세요.");
  }

  showDisplayText(text) {
    this.pwdDisplayText.innerText = text;
  }
}
