import { AlertButton, AlertOptions } from "react-native";

type AlertHandler = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: AlertOptions,
) => void;

interface QueuedAlert {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  options?: AlertOptions;
}

let alertHandler: AlertHandler | null = null;
const queuedAlerts: QueuedAlert[] = [];

export const registerAlertHandler = (handler: AlertHandler | null) => {
  alertHandler = handler;

  if (!alertHandler || queuedAlerts.length === 0) {
    return;
  }

  const pending = [...queuedAlerts];
  queuedAlerts.length = 0;

  pending.forEach((queued) => {
    alertHandler?.(queued.title, queued.message, queued.buttons, queued.options);
  });
};

export const appAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: AlertOptions,
) => {
  if (alertHandler) {
    alertHandler(title, message, buttons, options);
    return;
  }

  queuedAlerts.push({ title, message, buttons, options });
};
