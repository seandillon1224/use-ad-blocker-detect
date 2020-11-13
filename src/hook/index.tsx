import * as React from 'react';
import Cookies from 'js-cookie';

const AD_BLOCKER_COOKIE = 'AD_BLOCKER_COOKIE';

const AD_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

type ReturnArr = {
  showComponent: boolean | undefined;
  storageSetter: () => void;
  isAdBlocker: boolean | undefined;
  storageStatus: string | null;
};

type StorageType = 'cookies' | 'local' | 'session';

type Config = {
  storageType: StorageType;
  adUrl?: string;
  hasBlockerCb?: null | (() => void);
};

const getStorageFunctions = (type: StorageType) => {
  let storageStatus;
  let storageSetter;
  switch (type) {
    case 'cookies': {
      storageStatus = Cookies.getJSON(AD_BLOCKER_COOKIE);
      storageSetter = () =>
        Cookies.set(AD_BLOCKER_COOKIE, new Date().getTime().toString());
      return [storageStatus, storageSetter];
    }
    case 'local': {
      storageStatus = window.localStorage.getItem(AD_BLOCKER_COOKIE);
      storageSetter = () =>
        window.localStorage.setItem(
          AD_BLOCKER_COOKIE,
          new Date().getTime().toString()
        );
      return [storageStatus, storageSetter];
    }
    case 'session': {
      storageStatus = window.sessionStorage.getItem(AD_BLOCKER_COOKIE);
      storageSetter = () =>
        window.sessionStorage.setItem(
          AD_BLOCKER_COOKIE,
          new Date().getTime().toString()
        );
      return [storageStatus, storageSetter];
    }
    default: {
      throw new Error(
        "Not a valid storage type. Must be one of ['cookies', 'session', 'local']."
      );
    }
  }
};

const useAdBlockDetection = (config?: Config): ReturnArr => {
  const { storageType = 'cookies', adUrl = AD_URL, hasBlockerCb = null } =
    config || {};
  const [isAdBlocker, setIsAdBlocker] = React.useState<boolean | undefined>(
    undefined
  );
  // check for window and initialize storageStatus and storageSetter to true and false respectively (SSR catch) until we have it
  const windowIsUndefined = typeof window === 'undefined';
  const [storageStatus, storageSetter] = windowIsUndefined
    ? [true, false]
    : getStorageFunctions(storageType);

  // Determines if the user is likely using an ad block extension
  React.useEffect(() => {
    async function checkAdBlocker() {
      try {
        return fetch(
          new Request(adUrl, {
            method: 'HEAD',
            mode: 'no-cors',
          })
        )
          .then(() => {
            // Google Ads request succeeded, most likely not blocker
            setIsAdBlocker(false);
          })
          .catch(() => {
            if (hasBlockerCb) hasBlockerCb();
            // Request failed, likely due to ad blocker
            setIsAdBlocker(true);
          });
      } catch (error) {
        // fetch itself failed, assume it's not the blocker and flag accordingly
        setIsAdBlocker(false);
        return isAdBlocker;
      }
    }

    if (isAdBlocker === undefined) checkAdBlocker();
  }, [isAdBlocker, storageType]);

  const showComponent = isAdBlocker && !storageStatus;
  return { showComponent, storageSetter, isAdBlocker, storageStatus };
};

export { useAdBlockDetection };
