class LocalNotificationUtil {
  addNotification(title, message, hour, minute, interval) {
    if('LocalNotification' in window) {
      window.LocalNotification.addNotification(title, message, hour, minute, interval);
    } else {
      throw new Error('LocalNotificaion is not exists.');
    }
  }

  clearNotification() {
    if('LocalNotification' in window) {
      window.LocalNotification.clearNotification();
    } else {
      throw new Error('LocalNotificaion is not exists.');
    }
  }
}