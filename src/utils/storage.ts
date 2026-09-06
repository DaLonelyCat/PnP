/**
 * Storage and cookie management utilities
 */

export function clearAllCookies() {
  try {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = (eqPos > -1 ? cookie.slice(0, eqPos) : cookie).trim();
      if (name) {
        // Clear for root path, empty path, and domain
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
        // Handle common subdomains if any
        if (window.location.hostname.includes('.')) {
          const parts = window.location.hostname.split('.');
          if (parts.length > 2) {
            const domain = '.' + parts.slice(-2).join('.');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain};`;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not clear cookies:', err);
  }
}

export function clearOrderSession() {
  clearAllCookies();
  try {
    localStorage.removeItem('restoku_order');
    localStorage.removeItem('restoku_cart');
    sessionStorage.clear();
  } catch (err) {
    console.warn('Could not clear local storage:', err);
  }
}
