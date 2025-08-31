let logoutFn: () => void;

export const setLogoutHandler = (fn: () => void) => {
  logoutFn = fn;
};

// used for log out triggering globally
export const triggerLogout = () => {
  if (logoutFn) {
    logoutFn();
  }
};
