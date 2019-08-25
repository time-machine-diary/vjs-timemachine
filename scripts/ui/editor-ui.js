class EditorUI {
  constructor() {
    this.writeEditor = document.getElementById('editor');
    document.addEventListener('page-changed-to-write', this.viewInitialSetup.bind(this));
  }

  viewInitialSetup() {
    if(this._focusFlag) {
      setTimeout(() => {
        this.writeEditor.focus();
      }, 500);
    }
  }

  showEmptyEditor(diaryInfo) {
    this.fileName = diaryInfo.fileName;
    location.hash = 'write';
    this.previousContent = null;
    this.cleareEditor();
    this._focusFlag = true;
  }

  showContentEditor(diaryInfo) {
    location.hash = 'write';
    this.fileName = diaryInfo.fileName;
    this.previousContent = diaryInfo.diary.content;
    this.writeEditor.value = this.previousContent;
    this._focusFlag = false;
  }

  cleareEditor() {
    this.writeEditor.value = '';
  }

  saveDiary() {
    if(this.isContentChanged()) {
      window.ha.openConfirm({
        title: '일기 저장',
        type: CONST.NATIVE_STYLE.ALERT.ACTION,
        message: '일기를 저장 하시겠습니까?',
        options: [{
          name: '저장',
          type: CONST.NATIVE_STYLE.BTN.DEFAULT,
          callback: () => {
            document.dispatchEvent(new CustomEvent('save-diary', {
              detail: {
                fileName: this.fileName,
                content: this.writeEditor.value
              }
            }));
          }
        }, {
          name: '나가기',
          type: CONST.NATIVE_STYLE.BTN.DESTRUCTIVE,
          callback: () => {
            history.back();
          }
        }, {
          name: '취소',
          type: CONST.NATIVE_STYLE.BTN.CANCEL
        }]
      });
    } else {
      history.back();
    }
  }

  isContentChanged() {
    return this.writeEditor.value && this.writeEditor.value !== this.previousContent;
  }
}