window.addEventListener('load', () => {
  'use strict';
  window.spinner = new HybridSpinner();
});

class HybridSpinner {
  show(option) {
    if(option && option.cancelCallback && typeof option.cancelCallback === 'function') {
      this.cancelCallback = option.cancelCallback;
    }
    
    if(this.isNativeAvail()) {
      this.mobileSpinnerShow(option);
    } else {
      this.webSpinnerShow(option);
    }
  }

  hide() {
    if(this.isNativeAvail()) {
      this.mobileSpinnerHide();
    } else {
      this.webSpinnerHide();
    }
  }

  showBySec(option, second, callback) {
    this.show(option);
    setTimeout(() => {
      this.hide();
      if(callback) {
        callback();
      }
    }, second * 1000);
  }

  mobileSpinnerShow(option) {
    window.SpinnerPlugin.activityStart(option ? option.message : null, {dimBackground: false});
  }

  mobileSpinnerHide() {
    window.SpinnerPlugin.activityStop();
  }

  webSpinnerShow(option) {
    this.webSpinner = this.getWebSpinner(option);
    document.body.appendChild(this.webSpinner);
  }

  webSpinnerHide() {
    this.webSpinner.remove();
  }  

  getWebSpinner(option) {
    if(!option) {
      option = {};
    }
    this.modal = this.getModal();
    this.spinnerContainer = this.getSpinnerContainer();
    this.spinner = this.getSpinner();
    this.messageField = this.getMessageField(option.message ? option.message : '');

    this.spinnerContainer.appendChild(this.spinner);
    this.spinnerContainer.appendChild(this.messageField);
    this.modal.appendChild(this.spinnerContainer);
    return this.modal;
  }

  getModal() {
    if(!this.modal) {
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
    }

    return this.modal;
  }

  getSpinnerContainer() {
    if(!this.spinnerContainer) {
      this.spinnerContainer = this.generateElmentWithStyles({
        name: 'div',
        style: {
          margin: 'auto',
          display: 'grid'
        }
      });
    }

    return this.spinnerContainer;
  }
  
  getSpinner() {
    if(!this.spinner) {
      this.spinner = this.generateElmentWithStyles({
        name: 'img',
        style: {
          margin: 'auto'
        }
      });
      this.spinner.setAttribute('src', './assets/images/spinner.gif');
    }
    return this.spinner;
  }

  getMessageField(message) {
    if(!this.messageField) {
      this.messageField = this.generateElmentWithStyles({
        name: 'span',
        style: {
          color: '#fff',
          margin: 'auto'
        }
      });
    }

    this.messageField.innerText = message;
    return this.messageField;
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
    return window.SpinnerPlugin ? true : false;
  }  
}