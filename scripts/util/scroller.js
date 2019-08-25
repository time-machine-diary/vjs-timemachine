const scroller = {
  scrollAnimate: function(targetElement, option) {
    'use strict';
    this.targetElement = targetElement;
    this.axis = option.axis.toLowerCase() === 'y' ? 'y' : 'x';
    this.to = option.to;
    this.duration = option.duration;
    this.callback = option.callback;

    if(this.axis === 'x') {
      this.unitValue = Math.ceil(Math.abs(this.targetElement.scrollLeft - this.to) / this.duration);
      this.animateScrollX();
    } else {
      this.unitValue = Math.ceil(Math.abs(this.targetElement.scrollTop - this.to) / this.duration);
      this.animateScrollY();
    }
  },

  animateScrollX: function() {
    'use strict';
    if(this.targetElement.scrollLeft > this.to) {
      this.direction = 'left';
    } else if (this.targetElement.scrollLeft < this.to) {
      this.direction = 'right';
    }
    
    if(this.direction === 'left') {
      this.animateScrollLeft();
    } else {
      this.animateScrollRight();
    }
  },

  animateScrollLeft: function() {
    'use strict';
    if(this.targetElement.scrollLeft <= this.to) {
      this.targetElement.scrollLeft = this.to;
      if(this.callback && typeof this.callback === 'function') {
        this.callback();
      }
    } else {
      this.targetElement.scrollLeft = this.targetElement.scrollLeft - this.unitValue;
      requestAnimationFrame(this.animateScrollLeft.bind(this));
    }
  },

  animateScrollRight: function() {
    'use strict';
    if(this.targetElement.scrollLeft >= this.to) {
      this.targetElement.scrollLeft = this.to;
      if(this.callback && typeof this.callback === 'function') {
        this.callback();
      }
    } else {
      this.targetElement.scrollLeft = this.targetElement.scrollLeft + this.unitValue;
      requestAnimationFrame(this.animateScrollRight.bind(this));
    }
  },

  animateScrollY: function() {
    'use strict';
    if(this.targetElement.scrollTop > this.to) {
      this.direction = 'up';
    } else if (this.targetElement.scrollTop < this.to) {
      this.direction = 'down';
    }

    if(this.direction === 'up') {
      this.animateScrollUp();
    } else {
      this.animateScrollDown();
    }
  },

  animateScrollUp: function() {
    'use strict';
    if(this.targetElement.scrollTop <= this.to) {
      this.targetElement.scrollTop = this.to;
      if(this.callback && typeof this.callback === 'function') {
        this.callback();
      }
    } else {
      this.targetElement.scrollTop = this.targetElement.scrollTop - this.unitValue;
      requestAnimationFrame(this.animateScrollUp.bind(this));
    }
  },

  animateScrollDown: function() {
    'use strict';
    if(this.targetElement.scrollTop >= this.to) {
      this.targetElement.scrollTop = this.to;
      if(this.callback && typeof this.callback === 'function') {
        this.callback();
      }
    } else {
      this.targetElement.scrollTop = this.targetElement.scrollTop + this.unitValue;
      requestAnimationFrame(this.animateScrollDown.bind(this));
    }
  }
};

window.scroller = scroller;