import React from 'react';
import { Toaster, toast as hotToast, DefaultToastOptions } from 'react-hot-toast';

type Appearance = 'success' | 'error' | 'warning' | 'info';

interface AddToastOptions {
  appearance?: Appearance;
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  onDismiss?: () => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  placement?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  [key: string]: any;
}

export function ToastProvider({
  children,
  autoDismiss,
  autoDismissTimeout = 4000,
  placement = 'top-center',
}: ToastProviderProps) {
  const options: DefaultToastOptions = {};

  if (autoDismiss !== false) {
    options.duration = autoDismissTimeout;
  } else {
    options.duration = Infinity;
  }

  return (
    <>
      <Toaster position={placement} toastOptions={options} />
      {children}
    </>
  );
}

export function useToasts() {
  const addToast = (content: React.ReactNode, options?: AddToastOptions) => {
    const duration =
      options?.autoDismiss === false
        ? Infinity
        : options?.autoDismissTimeout || 4000;

    const message = content as React.ReactElement | string | null;

    switch (options?.appearance) {
      case 'success':
        return hotToast.success(message, { duration });
      case 'error':
        return hotToast.error(message, { duration });
      case 'warning':
        return hotToast(message, { icon: '⚠️', duration });
      default:
        return hotToast(message, { duration });
    }
  };

  const removeToast = (id: string) => {
    hotToast.dismiss(id);
  };

  return { addToast, removeToast };
}
