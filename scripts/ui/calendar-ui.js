/**
 * @author Jay Lee <jaylee.possible@gmail.com>
 * @description  index.html의 calendar ui를 핸들링하기 위한 class
 */
class CalendarUI {
  constructor() {
    this.calendarContainer = document.getElementById("calendar-container");
    this.calendar = document.getElementById("calendar");
    this.prevCalendar = document.getElementById("prev-calendar");
    this.nextCalendar = document.getElementById("next-calendar");

    this.addEventListeners();
  }

  /**
   * @description calendar ui 핸들링을 위한 event listener를 등록
   */
  addEventListeners() {
    this.calendarContainer.addEventListener("scroll", () => {
      clearTimeout(this.calendarContainer.isScrolling);
      this.calendarContainer.isScrolling = setTimeout(() => {
        var interval = setInterval(() => {
          if (this.calendarContainer.isTouchEnd) {
            clearInterval(interval);
            this.adjustAnimation();
          }
        }, 50);
      }, 50);
    });

    this.calendarContainer.addEventListener("touchstart", () => {
      this.calendarContainer.isTouchEnd = false;
    });
    this.calendarContainer.addEventListener("touchend", () => {
      this.calendarContainer.isTouchEnd = true;
    });
  }

  /**
   * @description 지난달, 이번달, 다음달 달력의 내용들을 clear
   */
  clearCalendars() {
    this.clearDateRows(this.prevCalendar);
    this.clearDateRows(this.calendar);
    this.clearDateRows(this.nextCalendar);
  }

  /**
   * @description 지난달, 이번달, 다음달 달력을 렌더링하고
   * 화면의 스크롤을 이번달로 이동함
   */
  renderCalendars() {
    this.clearCalendars();
    this.renderCurrentCalendar();
    this.renderPrevCalendar();
    this.renderNextCalendar();
    this.adjustXScroll();
    // this.markTodayCircle();
  }

  adjustXScroll() {
    this.calendarContainer.scrollLeft = window.screen.availWidth;
  }

  /**
   * @description date를 전달 받아 이번달 캘린더를 구성함
   * @param {Object} DateUtil 객체의 날짜 정보
   */
  renderCurrentCalendar() {
    this.clearDateRows(this.calendar);
    this.renderDateRows(
      window.stdDateUtil.getDateRange(),
      this.calendar,
      window.stdDateUtil.date
    );
    const yearStr = window.stdDateUtil.getYearStr();
    const monthStr = window.stdDateUtil.getMonthStr();
    this.calendar.getYearMonth = function() {
      return `${yearStr}${monthStr}`;
    };
  }

  /**
   * @description date를 전달 받아 지난달 DateUtil 객체를 초기화 하고 지난달 캘린더를 구성함
   * @param {Object} DateUtil 객체의 날짜 정보
   */
  renderPrevCalendar() {
    const prevDateUtil = new DateUtil(window.stdDateUtil.date);
    prevDateUtil.date.setMonth(prevDateUtil.date.getMonth() - 1);
    this.prevDateUtil = prevDateUtil;
    this.clearDateRows(this.prevCalendar);
    this.renderDateRows(this.prevDateUtil.getDateRange(), this.prevCalendar);
    const yearStr = this.prevDateUtil.getYearStr();
    const monthStr = this.prevDateUtil.getMonthStr();
    this.prevCalendar.getYearMonth = function() {
      return `${yearStr}${monthStr}`;
    };
  }
  /**
   * @description date를 전달 받아 다음달 DateUtil 객체를 초기화 하고 다음달 캘린더를 구성함
   * @param {Object} DateUtil 객체의 날짜 정보
   */
  renderNextCalendar() {
    const nextDateUtil = new DateUtil(window.stdDateUtil.date);
    nextDateUtil.date.setMonth(nextDateUtil.date.getMonth() + 1);
    this.nextDateUtil = nextDateUtil;
    this.clearDateRows(this.nextCalendar);
    this.renderDateRows(this.nextDateUtil.getDateRange(), this.nextCalendar);
    const yearStr = this.nextDateUtil.getYearStr();
    const monthStr = this.nextDateUtil.getMonthStr();
    this.nextCalendar.getYearMonth = function() {
      return `${yearStr}${monthStr}`;
    };
  }

  /**
   * @description touchend event handler
   * touchend 이벤트가 발생하면 현재 스크롤의 위치를 바탕으로
   * 현재 달력 혹은 지난/다음달 달력으로 스크롤을 이동함
   */
  adjustAnimation() {
    if (
      this.calendarContainer.scrollLeft === window.screen.availWidth ||
      this.calendarContainer.scrollLeft === this.calendarContainer.clientWidth
    ) {
      return;
    }

    const availWidth = window.screen.availWidth;
    const stdWidth = availWidth / 3;

    if (availWidth - stdWidth >= this.calendarContainer.scrollLeft) {
      this.adjustPrevCalendarAnimation();
    } else if (availWidth + stdWidth <= this.calendarContainer.scrollLeft) {
      this.adjustNextCalendarAnimation();
    } else {
      this.adjustSnapBackCalendarAnimation();
    }
  }

  adjustPrevCalendarAnimation() {
    window.scroller.scrollAnimate(this.calendarContainer, {
      axis: "x",
      to: 0,
      duration: 15,
      callback: () => {
        this.switchPrevCurrent();
      }
    });
  }

  adjustNextCalendarAnimation() {
    window.scroller.scrollAnimate(this.calendarContainer, {
      axis: "x",
      to: this.calendarContainer.offsetWidth * 2,
      duration: 15,
      callback: () => {
        this.switchNextCurrent();
      }
    });
  }

  adjustSnapBackCalendarAnimation() {
    window.scroller.scrollAnimate(this.calendarContainer, {
      axis: "x",
      to: this.calendarContainer.offsetWidth,
      duration: 15
    });
  }

  switchPrevCurrent() {
    this.nextCalendar.remove();
    this.calendar.setAttribute("id", "next-calendar");
    this.nextCalendar = this.calendar;
    this.prevCalendar.setAttribute("id", "calendar");
    this.calendar = this.prevCalendar;
    this.nextDateUtil = window.stdDateUtil;
    window.stdDateUtil = this.prevDateUtil;
    this.prevCalendar = document.createElement("div");
    this.prevCalendar.setAttribute("id", "prev-calendar");
    this.calendarContainer.insertBefore(
      this.prevCalendar,
      this.calendarContainer.firstElementChild
    );
    this.calendarContainer.scrollLeft = window.screen.availWidth;
    this.renderPrevCalendar();
    this.fireCalendarChangeEvent();
  }

  switchNextCurrent() {
    this.prevCalendar.remove();
    this.calendar.setAttribute("id", "prev-calendar");
    this.prevCalendar = this.calendar;
    this.nextCalendar.setAttribute("id", "calendar");
    this.calendar = this.nextCalendar;
    this.prevDateUtil = window.stdDateUtil;
    window.stdDateUtil = this.nextDateUtil;
    this.nextCalendar = document.createElement("div");
    this.nextCalendar.setAttribute("id", "next-calendar");
    this.calendarContainer.appendChild(this.nextCalendar);
    this.calendarContainer.scrollLeft = window.screen.availWidth;
    this.renderNextCalendar(window.stdDateUtil);
    this.fireCalendarChangeEvent();
  }

  fireCalendarChangeEvent() {
    document.dispatchEvent(new CustomEvent("date-switched"));
  }

  // markToday() {
  //   const date = window.dateUtil.getDateObj().date;
  //   const todayDateCell = this.getDateCellByDate(date);
  //   todayDateCell.select();
  // }

  /**
   * @description 현재 달력의 연도/월이 currentDateUtil의 연도/월과 같을 경우 전달 받은 날짜를 찾아 마킹
   * @param {Object} date DateUtil 객체
   */
  markByDate() {
    if (this.isSameYearMonth(this.calendar.getYearMonth())) {
      this.getDateCellByDate(window.currentDateUtil.getDate()).select();
    }
  }

  /**
   * @description 데이트 리스트를 전달 받아 작성되어 있는 일기를 표시함
   * @param {Array} dates 작성된 일기가 있는 날짜 배열
   */
  markAssigneByDates(dates) {
    this.disassignCell();
    if (dates && dates.length) {
      dates.forEach(date => {
        const dateCell = this.getDateCellByDate(date);
        dateCell.setAttribute("assigned", "");
        if (dateCell.hasAttribute("selected")) {
          this.fireReadDiaryEvent();
        }
      });
    }
  }

  /**
   * @description render가 완료된 캘린더들중 오늘 날짜가 포함된 캘린더를 찾아
   * 오늘 날짜의 dateCell에 today class를 추가함
   */
  markTodayCircle() {
    // 오늘 날짜가 현재 달력에 포함되는지 확인
    const currentDate = new DateUtil();
    const currentYearMonth = `${currentDate.getYearStr()}${currentDate.getMonthStr()}`;
    const prevCalendarYearMonth = this.prevCalendar.getYearMonth();
    const currentCalendarYearMonth = this.calendar.getYearMonth();
    const nextCalendarYearMonth = this.nextCalendar.getYearMonth();
    let dateCell;

    if (currentYearMonth === prevCalendarYearMonth) {
      dateCell = this.getDateCellByDateFromCalendar(
        currentDate.getDate(),
        this.prevCalendar
      );
    } else if (currentYearMonth === currentCalendarYearMonth) {
      dateCell = this.getDateCellByDateFromCalendar(
        currentDate.getDate(),
        this.calendar
      );
    } else if (currentYearMonth === nextCalendarYearMonth) {
      dateCell = this.getDateCellByDateFromCalendar(
        currentDate.getDate(),
        this.nextCalendar
      );
    }

    if (dateCell) {
      if (this.todayCell) {
        this.todayCell.classList.remove("today");
      }
      this.todayCell = dateCell;
      this.todayCell.classList.add("today");
    }
  }

  /**
   * @description 캘린더의 날짜가 선택되면 custom event를 발생시킴
   */
  fireReadDiaryEvent() {
    const fileName = window.currentDateUtil.getDateFileNameFormat() + ".txt";
    // const viewerFileName = viewerUI.getFileName();
    // if(fileName !== viewerFileName) {
    document.dispatchEvent(
      new CustomEvent("show-content-viewer", {
        detail: {
          fileName: fileName
        }
      })
    );
    // }
  }

  /**
   * @description 화면에 표시된 모든 date-cell 중 마킹된 셀을 찾아 마킹을 취소함
   */
  disselectCells() {
    const dateCells = Array.from(
      this.calendarContainer.querySelectorAll("div.date-cell[selected]")
    );
    dateCells.forEach(dateCell => {
      dateCell.disselect();
    });
  }

  /**
   * @description 화면에 표시된 모든 date-cell 중 assigned 셀을 찾아 assigned를 해제함
   */
  disassignCell() {
    const dateCells = Array.from(
      this.calendar.querySelectorAll("div.date-cell[assigned]")
    );
    dateCells.forEach(dateCell => {
      dateCell.removeAttribute("assigned");
    });
  }

  /**
   * @description 전달 받은 date를 통해 해당 날짜의 date-cell을 찾고 리턴함
   * @param {Object} date DateUtil 객체
   * @returns {Object} date-cell 엘리먼트
   */
  getDateCellByDate(date) {
    return this.getDateCellByDateFromCalendar(date, this.calendar);
  }

  getDateCellByDateFromCalendar(date, calendarEl) {
    const dateCell = calendarEl.querySelector(`span[date="${date}"]`);
    let parentEl = dateCell.parentElement;
    while (!parentEl.classList.contains("date-cell")) {
      parentEl = parentEl.parentElement;
    }
    return parentEl;
  }

  /**
   * @description 캘린더 구성에 앞서 모든 date-row를 제거함
   */
  clearDateRows(container) {
    let dateRows = Array.from(container.querySelectorAll("div.dates-row"));
    dateRows.forEach(dateRow => {
      dateRow.remove();
    });
  }

  /**
   * @description 선택한 연, 월의 날짜 범위를 통해 캘린더를 구성함
   */
  renderDateRows(dates, container, dateObj) {
    let dateRow = this.getDateRow();
    dates.forEach(dateValue => {
      let dateCell = this.getDateCell();
      let date = this.getDate(dateValue);
      dateCell.appendChild(date);
      dateRow.appendChild(dateCell);

      if (dateObj && dateValue) {
        const currentDate = `${dateObj.getFullYear()}-${dateObj.getMonth() +
          1}-${dateValue}`;
        const todayDate = new Date();
        const isToday =
          currentDate ===
          `${todayDate.getFullYear()}-${todayDate.getMonth() +
            1}-${todayDate.getDate()}`;
        if (isToday) {
          dateCell.classList.add("today");
        }
      }

      if (dateRow.children.length === 7) {
        container.appendChild(dateRow);
        dateRow = this.getDateRow();
      }
    });

    if (dateRow.hasChildNodes()) {
      container.appendChild(dateRow);
    }

    while (container.children.length < 6) {
      container.appendChild(this.getEmptyDatesRow());
    }
  }

  getEmptyDatesRow() {
    const emptyDatesRow = document.createElement("div");
    emptyDatesRow.classList.add("dates-row");
    // emptyDatesRow.classList.add('empty-dates-row');
    return emptyDatesRow;
  }

  /**
   * @description dates-row 엘리먼트를 리턴함
   * @returns {Object} dates-row 엘리먼트
   */
  getDateRow() {
    let dateRow = document.createElement("div");
    dateRow.classList.add("dates-row");
    return dateRow;
  }

  /**
   * @description dates-cell 엘리먼트를 리턴함
   * @returns {Object} dates-cell 엘리먼트
   */
  getDateCell() {
    let dateCell = document.createElement("div");
    dateCell.classList.add("date-cell");
    dateCell.addEventListener("click", () => {
      if (dateCell.innerText && dateCell.innerText.length > 0) {
        dateCell.select();
      }
    });

    dateCell.select = () => {
      this.disselectCells();
      dateCell.marking();
      this.changeDateValue(dateCell.getDate());
      if (dateCell.hasAttribute("assigned")) {
        this.fireReadDiaryEvent();
      } else {
        document.dispatchEvent(new CustomEvent("show-empty-viewer"));
      }
    };

    dateCell.marking = function() {
      const selectedMark = CalendarUI.getSelectedMark();
      dateCell.appendChild(selectedMark);
      dateCell.selectedMark = selectedMark;
      dateCell.setAttribute("selected", "");
    };

    dateCell.disselect = () => {
      dateCell.removeAttribute("selected");
      dateCell.removeChild(dateCell.selectedMark);
    };

    dateCell.getDate = () => {
      return dateCell.querySelector("span[date]").getAttribute("date");
    };

    return dateCell;
  }

  /**
   * @description date 엘리먼트를 리턴함
   * @returns {Object} date 엘리먼트
   */
  getDate(dateValue) {
    let date = document.createElement("span");
    date.innerText = dateValue;
    date.classList.add("date");
    date.setAttribute("date", dateValue);
    return date;
  }

  changeDateValue(date) {
    window.currentDateUtil = window.stdDateUtil;
    window.currentDateUtil.setDate(date);
  }

  /**
   * @description 전달 받은 연월이 현재 연월과 같은지 확인하여 결과를 리턴함
   */
  isSameYearMonth(yearMonth) {
    return (
      yearMonth ===
      `${window.currentDateUtil.getYearStr()}${window.currentDateUtil.getMonthStr()}`
    );
  }

  static getSelectedMark() {
    const object = document.createElement("object");
    object.setAttribute("type", "image/svg+xml");
    object.setAttribute("data", "./assets/images/selected-mark.svg");
    object.addEventListener("load", function() {
      const themeName = JSON.parse(localStorage.getItem("tm.setting.theme"));
      const currentTheme = window.CONST.THEMES.filter(theme => {
        return theme.name === themeName;
      })[0];
      this.contentDocument.getElementById("selected-mark").style.fill =
        currentTheme.colors["--main-theme-color"];
    });

    return object;
  }
}
