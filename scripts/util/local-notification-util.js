class LocalNotificationUtil {
  addNotification(title, message, hour, minute, interval) {
    if('localNotification' in window) {
      window.localNotification.addNotificationSchedule(title, message, hour, minute, interval);
    } else {
      throw new Error('LocalNotificaion is not exists.');
    }
  }

  clearNotification() {
    if('localNotification' in window) {
      window.localNotification.clearNotificationSchedule();
    } else {
      throw new Error('LocalNotificaion is not exists.');
    }
  }
}