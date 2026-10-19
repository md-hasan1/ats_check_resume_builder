import Swal, { SweetAlertOptions, SweetAlertResult, SweetAlertIcon } from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Check if dark mode is active on html / document element
const isDarkMode = (): boolean => {
  if (typeof document === "undefined") return true;
  return (
    document.documentElement.classList.contains("dark") ||
    document.body.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

// Base theme options for ATS platform matching glassmorphism and theme
const getBaseSwalOptions = (): Record<string, unknown> => {
  const dark = isDarkMode();
  return {
    background: dark ? "#110e1b" : "#ffffff",
    color: dark ? "#f8fafc" : "#0f172a",
    buttonsStyling: true,
    customClass: {
      popup: "ats-swal-popup",
      title: "ats-swal-title",
      htmlContainer: "ats-swal-html",
      confirmButton: "ats-swal-confirm-btn",
      cancelButton: "ats-swal-cancel-btn",
      denyButton: "ats-swal-deny-btn",
      timerProgressBar: "ats-swal-progress",
    },
  };
};

/**
 * SweetAlert Toast instance for non-blocking notifications
 */
export const toastMixin = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toastEl) => {
    toastEl.addEventListener("mouseenter", Swal.stopTimer);
    toastEl.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export type CustomAlertOptions = Record<string, unknown>;

const fireToast = (options: Record<string, unknown>): Promise<SweetAlertResult> => {
  return (toastMixin.fire as (opts: unknown) => Promise<SweetAlertResult>)({
    ...getBaseSwalOptions(),
    ...options,
  });
};

const fireModal = (options: Record<string, unknown>): Promise<SweetAlertResult> => {
  return (Swal.fire as (opts: unknown) => Promise<SweetAlertResult>)({
    ...getBaseSwalOptions(),
    ...options,
  });
};

/**
 * Drop-in replacement for toast notifications, powered by SweetAlert2
 */
export const toast = {
  success: (message: string, options?: CustomAlertOptions) => {
    return fireToast({
      icon: "success",
      title: message,
      ...options,
    });
  },
  error: (message: string, options?: CustomAlertOptions) => {
    return fireToast({
      icon: "error",
      title: message,
      ...options,
    });
  },
  warning: (message: string, options?: CustomAlertOptions) => {
    return fireToast({
      icon: "warning",
      title: message,
      ...options,
    });
  },
  info: (message: string, options?: CustomAlertOptions) => {
    return fireToast({
      icon: "info",
      title: message,
      ...options,
    });
  },
  loading: (message: string, options?: CustomAlertOptions) => {
    return fireToast({
      title: message,
      didOpen: () => {
        Swal.showLoading();
      },
      ...options,
    });
  },
  dismiss: () => {
    Swal.close();
  },
  promise: async <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ): Promise<T> => {
    toast.loading(msgs.loading);
    try {
      const result = await promise;
      const successMsg =
        typeof msgs.success === "function" ? msgs.success(result) : msgs.success;
      toast.success(successMsg);
      return result;
    } catch (err) {
      const errorMsg =
        typeof msgs.error === "function" ? msgs.error(err) : msgs.error;
      toast.error(errorMsg);
      throw err;
    }
  },
};

/**
 * SweetAlert Modal helper functions for dialogs, confirms, and modal alerts
 */
export const showAlert = {
  /**
   * Generic SweetAlert fire
   */
  fire: (options: CustomAlertOptions | SweetAlertOptions): Promise<SweetAlertResult> => {
    return fireModal(options as Record<string, unknown>);
  },

  /**
   * Success modal alert
   */
  success: (title: string, text?: string, options?: CustomAlertOptions): Promise<SweetAlertResult> => {
    return fireModal({
      icon: "success" as SweetAlertIcon,
      title,
      text,
      confirmButtonText: "OK",
      confirmButtonColor: "#8b5cf6",
      ...options,
    });
  },

  /**
   * Error modal alert
   */
  error: (title: string, text?: string, options?: CustomAlertOptions): Promise<SweetAlertResult> => {
    return fireModal({
      icon: "error" as SweetAlertIcon,
      title,
      text,
      confirmButtonText: "OK",
      confirmButtonColor: "#ef4444",
      ...options,
    });
  },

  /**
   * Warning modal alert
   */
  warning: (title: string, text?: string, options?: CustomAlertOptions): Promise<SweetAlertResult> => {
    return fireModal({
      icon: "warning" as SweetAlertIcon,
      title,
      text,
      confirmButtonText: "OK",
      confirmButtonColor: "#f59e0b",
      ...options,
    });
  },

  /**
   * Info modal alert
   */
  info: (title: string, text?: string, options?: CustomAlertOptions): Promise<SweetAlertResult> => {
    return fireModal({
      icon: "info" as SweetAlertIcon,
      title,
      text,
      confirmButtonText: "OK",
      confirmButtonColor: "#3b82f6",
      ...options,
    });
  },

  /**
   * Confirmation dialog with Yes / Cancel buttons (replaces native confirm())
   */
  confirm: async ({
    title = "Are you sure?",
    text,
    confirmButtonText = "Yes, proceed",
    cancelButtonText = "Cancel",
    isDestructive = false,
  }: {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDestructive?: boolean;
  }): Promise<boolean> => {
    const result = await fireModal({
      icon: (isDestructive ? "warning" : "question") as SweetAlertIcon,
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      confirmButtonColor: isDestructive ? "#ef4444" : "#8b5cf6",
      cancelButtonColor: "#64748b",
      focusCancel: isDestructive,
    });
    return result.isConfirmed;
  },

  /**
   * Loading indicator modal
   */
  loading: (title: string = "Processing...", text?: string) => {
    fireModal({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  /**
   * Close any open alert
   */
  close: () => {
    Swal.close();
  },

  /**
   * Quick access to toast notifications
   */
  toast,
};

export default Swal;
