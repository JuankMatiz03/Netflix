/**
 * AlertButtonModel model alert
 */
export interface AlertButtonModel{
  text: string;
  handler?: () => void;
  role: string;
  color?: string;
}

/**
 * AlertModel
 */
export interface AlertModel {
  header: string;
  message?: string;
  primaryButton?: AlertButtonModel;
  secondaryButton?: AlertButtonModel;
}
