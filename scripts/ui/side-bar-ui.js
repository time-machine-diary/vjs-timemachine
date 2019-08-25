/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  index.html의 header ui를 핸들링하기 위한 class
 */
class SideBarUI {
  constructor() {
    this.sideBar = document.getElementById('side-bar');
    this.sideBarModal = document.getElementById('side-bar-modal');
    this.sideBarContentContainer = document.getElementById('side-bar-content-container');

    this.sideBarModal.addEventListener('click', () => {
      this.closeSideBar();
    });

    this.renderMenus();
  }

  renderMenus() {
    this.clearMenus();
    window.CONST.MENUS.forEach(menu => {
      const menuItem = this.getMenuItem(menu);
      if(menuItem) {
        this.sideBarContentContainer.appendChild(menuItem);
      }
    });

    this.sideBarContentContainer.appendChild(this.getContactInfo());
  }

  clearMenus() {
    while(this.sideBarContentContainer.children.length) {
      this.sideBarContentContainer.removeChild(this.sideBarContentContainer.firstChild);
    }
  }

  getMenuItem(menu) {
    if(menu.showCallback && typeof menu.showCallback === 'function') {
      if(menu.showCallback()) {
        return this.renderMenuItem(menu);
      }
    } else {
      return this.renderMenuItem(menu);
    }
  }

  renderMenuItem(menu) {
    const menuItem = document.createElement('div');
    menuItem.innerText = menu.name;
    menuItem.setAttribute('class', 'menu-item');
    menuItem.setAttribute('route', menu.route);
    menuItem.addEventListener('click', () => {
      location.hash = menu.route;
      this.closeSideBar();
    });
    return menuItem;
  }

  getContactInfo() {
    if(!this.contactInfoContainer) {
      this.contactInfoContainer = document.createElement('div');
      this.contactInfoContainer.setAttribute('id', 'contact-info-container');
      const emailCard =  document.createElement('a');
      emailCard.setAttribute('href', 'mailto:' + window.CONST.APP.DEVELOPER.CONTACT);
      emailCard.classList.add('email-card');
      emailCard.innerHTML = window.CONST.APP.DEVELOPER.CONTACT;

      this.contactInfoContainer.appendChild(emailCard);
    }

    return this.contactInfoContainer;
  }

  toggleSideBar(open) {
    if(open) {
      this.openSideBar();
    } else if (open === false) {
      this.closeSideBar();
    } else {
      if(this.sideBar.hasAttribute('toggle')) {
        this.closeSideBar();
      } else {
        this.openSideBar();
      }
    }
    
  }

  openSideBar() {
    this.sideBar.setAttribute('toggle', '');
    this.sideBar.style.display = 'block';
    this.sideBarContentContainer.style.animationName = 'side-bar-open';
  }

  closeSideBar() {
    this.sideBarContentContainer.style.animationName = 'side-bar-close';
    setTimeout(() => {
      this.sideBar.removeAttribute('toggle');
      this.sideBar.style.display = 'none';
      this.renderMenus();
    }, 250);
  }
}