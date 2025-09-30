// token.ts
export const getToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    console.log('Getting token:', token ? `${token.substring(0, 20)}...` : 'null');
    return token;
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

export const saveTokens = (idToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    console.log('Saving tokens:', { 
      token: idToken ? `${idToken.substring(0, 20)}...` : 'null',
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null'
    });
    localStorage.setItem("token", idToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    console.log('Clearing tokens');
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
};

// Debug function to check all localStorage
export const debugTokens = () => {
  if (typeof window !== 'undefined') {
    console.log('=== TOKEN DEBUG ===');
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('Token:', localStorage.getItem('token'));
    console.log('RefreshToken:', localStorage.getItem('refreshToken'));
    console.log('==================');
  }
};

// Safe localStorage clearing that preserves auth tokens
export const clearNonAuthStorage = (keysToRemove: string[] = []) => {
  if (typeof window !== 'undefined') {
    const authKeys = ['token', 'refreshToken'];
    
    if (keysToRemove.length > 0) {
      // Remove specific keys only
      keysToRemove.forEach(key => {
        if (!authKeys.includes(key)) {
          localStorage.removeItem(key);
          console.log(`Removed localStorage key: ${key}`);
        } else {
          console.warn(`Skipped removing auth key: ${key}`);
        }
      });
    } else {
      // Remove all keys except auth keys
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!authKeys.includes(key)) {
          localStorage.removeItem(key);
          console.log(`Removed localStorage key: ${key}`);
        }
      });
    }
    console.log('Safe localStorage clear completed. Auth tokens preserved.');
  }
};
