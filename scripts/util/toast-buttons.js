class ToastButtons {
  constructor(conf) {
    this.renderButtons(conf);
  }

  showButtons() {
    document.body.appendChild(this.modal);
    this.buttonContainer.setAttribute('active', '');
    setTimeout(() => {
      this.modal.setAttribute('active', '');
    }, 150);
  }

  hideButtons() {
    this.modal.removeAttribute('active');
    this.buttonContainer.removeAttribute('active');
    setTimeout(() => {
      document.body.removeChild(this.modal);
    }, 300);
  }

  renderButtons(conf) {
    this.modal = document.createElement('div');
    this.modal.style.position = 'absolute';
    this.modal.style.top = 0;
    this.modal.style.left = 0;
    this.modal.style.right = 0;
    this.modal.style.bottom = 0;
    this.modal.style.zIndex = 10;
    this.modal.setAttribute('id', 'toast-btn-modal');

    this.buttonContainer = document.createElement('div');
    this.buttonContainer.setAttribute('id', 'toast-btn-container');
    this.buttonContainer.style.position = 'absolute';

    const message = document.createElement('div');
    message.setAttribute('id', 'toast-btn-message');
    message.innerText = conf.message;
    
    this.buttonContainer.appendChild(message);

    conf.buttons.forEach(button => {
      const btnEl = document.createElement('div');
      btnEl.classList.add('toast-btn');
      btnEl.innerText = button.name;
      if(button.type) {
        btnEl.setAttribute('type', button.type);
      } else {
        btnEl.setAttribute('type', 'positive');
      }

      btnEl.addEventListener('click', () => {
        if(button.onclick && typeof button.onclick === 'function') {
          button.onclick();
        }
        this.hideButtons();
      });

      this.buttonContainer.appendChild(btnEl);
    });

    this.modal.appendChild(this.buttonContainer);
  }
}