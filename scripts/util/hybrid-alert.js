class HybridAlert {
  openConfirm(config) {
    if(this.isNativeAvail()) {
      this.mobileConfirm(config);
    } else {
      this.webConfirm(config);
    }
  }

  mobileConfirm(config) {
    NativeAlert.alert(config.type, config.title, config.message, config.options, event => {
      config.options.forEach(option => {
        if(option.name === event && option.callback && typeof option.callback === 'function') {
          option.callback();
        }
      });
    }, error => {
      throw new Error(error);
    });
  }

  webConfirm(config) {
    if(this.webAlert) {
      this.webAlert.remove();
    }
    this.webAlert = this.getWebAlert(config);
    document.body.appendChild(this.webAlert);
  }

  getWebAlert(config) {
    this.modal = this.getModal();
    this.alertBox = this.getAlertBox();
    this.titleField = this.getTitleField(config.title);
    this.messageField = this.getMessageField(config.message);
    this.buttonContainer = this.getButtonContainer();
    const buttonElements = this.getButtons(config.options);

    this.modal.appendChild(this.alertBox);
    this.alertBox.appendChild(this.titleField);
    this.alertBox.appendChild(this.messageField);
    this.alertBox.appendChild(this.buttonContainer);
    buttonElements.forEach(button => {
      this.buttonContainer.appendChild(button);
    });

    return this.modal;
  }

  getModal() {
    this.modal = this.generateElmentWithStyles({
      name: 'div',
      style: {
        position: 'absolute',
        display: 'grid',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, .5)'
      }
    });

    return this.modal;
  }

  getAlertBox() {
    this.alertBox = this.generateElmentWithStyles({
      name: 'div',
      style: {
        margin: 'auto',
        backgroundColor: '#fff',
        padding: '2vh 5vw',
        borderRadius: 'var(--default-border-radius)'
      }
    });

    return this.alertBox;
  }

  getTitleField(title) {
    this.titleField = this.generateElmentWithStyles({
      name: 'p',
      style: {
        fontSize: '2.5vh',
        color: '#000'
      }
    });

    this.titleField.innerText = title;
    return this.titleField;
  }

  getMessageField(message) {
    this.messageField = this.generateElmentWithStyles({
      name: 'span',
      style: {
        marginLeft: '2vh',
        color: '#000'
      }
    });
    this.messageField.innerText = message;
    return this.messageField;
  }

  getButtonContainer() {
    this.buttonContainer = this.generateElmentWithStyles({
      name: 'div',
      style: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridGap: '2vw',
        marginTop: '3vh',
        justifyContent: 'end'
      }
    });
    return this.buttonContainer;
  }

  getButtons(options) {
    const buttonElements = [];
    options.forEach(option => {
      const button = this.generateElmentWithStyles({
        name: 'button',
        style: {
          padding: '1vh 1vw',
          color: '#fff',
          fontSize: '2vh',
          backgroundColor: 'var(--theme-gray)',
          borderRadius: 'var(--default-border-radius)'
        }
      });
      button.innerText = option.name;
      button.onclick = () => {
        this.webAlert.remove();
        if(option.callback && typeof option.callback === 'function') {
          option.callback();
        }
      };

      buttonElements.push(button);
    });

    return buttonElements;
  }

  generateElmentWithStyles(option) {
    const element = document.createElement(option.name);
    for(let key in option.style) {
      if(option.style[key]) {
        element.style[key] = option.style[key];
      }
    }

    return element;
  }

  isNativeAvail() {
    return 'NativeAlert' in window;
  }
}