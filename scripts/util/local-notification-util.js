class LocalNotificationUtil {
  addNotification(title, subtitle, message, hour, minute, successCallback, errorCallback) {
    if('LocalNotification' in window) {
      window.LocalNotification.addNotification(title, subtitle, message, hour, minute, successCallback, errorCallback);
    } else {
      throw new Error('LocalNotificaion is not exists.');
    }
  }

  clearNotification(successCallback, errorCallback) {
    if('LocalNotification' in window) {
      window.LocalNotification.clearNotification(successCallback, errorCallback);
    } else {
      throw new Error('LocalNotificaion is not exists.');
    }
  }
}