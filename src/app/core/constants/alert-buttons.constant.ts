/**
 * ALERT_BUTTONS for AlertService
 * @param text button text
 * @param role button role default cancel
 * @param color button color default primary
 * @param callback function
 */
export const ALERT_BUTTONS = {
  primaryButton: (
    text: string,
    role: string = 'cancel',
    color: string = 'primary',
    callback?: () => void) => ({
    text: text,
    role: role,
    color: color,
    handler: () => {
      if (callback) {
        callback();
      }
    }
  }),
  secondaryButton: (
    text: string,
    role: string = 'cancel',
    color: string = 'primary',
    callback?: () => void) => ({
    text: text,
    role: role,
    color: color,
    handler: () => {
      if(callback) {
        callback();
      }
    }
  })
};
