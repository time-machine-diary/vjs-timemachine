class ModalUtil {
  constructor() {
    this.initModal();
  }

  initModal() {
    this.modal = document.createElement("div");
    this.modal.style.display = "none";
    this.modal.style.position = "absolute";
    this.modal.style.zIndex = 99;
    this.modal.style.left = 0;
    this.modal.style.top = 0;
    this.modal.style.right = 0;
    this.modal.style.bottom = 0;
    this.modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    this.modal.classList.add("modal");
    this.modal.setAttribute("active", false);

    this.contentContainer = document.createElement("div");
    this.contentContainer.style.margin = "auto";
    this.contentContainer.style.display = "flex";
    this.contentContainer.style.flexDirection = "column";
    this.modal.appendChild(this.contentContainer);
    document.body.appendChild(this.modal);
  }

  show(thumbnail, label) {
    if (Boolean(this.modal.getAttribute("active"))) {
      this.hide();
    }

    if (thumbnail) {
      this.setThumbnail(thumbnail);
    }

    if (label) {
      this.setLabel(label);
    }
    this.modal.style.display = "flex";
    this.modal.setAttribute("active", true);
  }

  hide() {
    this.modal.style.display = "none";
    while (this.contentContainer.childElementCount) {
      this.contentContainer.removeChild(this.contentContainer.firstChild);
    }
    this.modal.setAttribute("active", false);
  }

  setThumbnail(thumbnail) {
    if (typeof thumbnail === "string") {
      const src = thumbnail;
      thumbnail = new Image(100, 100);
      thumbnail.src = src;
    }

    thumbnail.classList.add("modal-thumbnail");
    this.contentContainer.appendChild(thumbnail);
  }

  setLabel(label) {
    if (typeof label === "string") {
      const labelText = label;
      label = document.createElement("span");
      label.innerHTML = labelText;
      label.classList.add("modal-label");
      label.style.color = "white";
      label.style.margin = "auto";
      label.style.paddingTop = "1vh";
    }

    label.classList.add("modal-label");
    this.contentContainer.appendChild(label);
  }
}
