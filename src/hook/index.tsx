import * as React from 'react';
import Cookies from 'js-cookie';

const AD_BLOCKER_COOKIE = 'AD_BLOCKER_COOKIE';

const AD_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

type ReturnMeta = {
    isAdBlocker: boolean | undefined;
    checking: boolean;
    storageStatus: boolean; 
}

type StorageType = "cookies" | "local" | "session";

type ReturnArr = [boolean | undefined, () => void, ReturnMeta]

type Config = {
  storageType: StorageType;
  adUrl?: string;
  callback?: (args: string) => void;
}

const getStorageFunctions = (type: StorageType) => {
  let storageStatus;
  let storageSetter;
  
  switch (type) {
    case 'cookies': {
      storageStatus = Cookies.getJSON(AD_BLOCKER_COOKIE);
      storageSetter = () => Cookies.set(AD_BLOCKER_COOKIE, "true");
      return [storageStatus, storageSetter]
    }
    case 'local': {
      storageStatus = window.localStorage.getItem(AD_BLOCKER_COOKIE);
      storageSetter = () => window.localStorage.setItem(AD_BLOCKER_COOKIE, "true");
      return [storageStatus, storageSetter]
    }
    case 'session': {
      storageStatus = window.sessionStorage.getItem(AD_BLOCKER_COOKIE);
      storageSetter = () => window.sessionStorage.setItem(AD_BLOCKER_COOKIE, "true");
      return [storageStatus, storageSetter]
    }
    default: {
      throw new Error("Not a valid storage type. Must be one of ['cookies', 'session', 'local'].")
    }
  }
}

const useIsAdBlocker = ({storageType = 'cookies', adUrl = AD_URL}: Config): ReturnArr => {
  // boolean based flag signifying whether ad blocker is detected
  const [isAdBlocker, setIsAdBlocker] = React.useState<boolean | undefined>(undefined);
  const windowIsUndefined = typeof window === 'undefined';
  const [storageStatus, storageSetter] = windowIsUndefined ? [true, false] : getStorageFunctions(storageType);

  // Determines if the user is likely using an ad block extension
  React.useEffect(() => {
    async function checkAdBlocker() {
      try {
        return fetch(
          new Request(adUrl, {
            method: 'HEAD',
            mode: 'no-cors',
          }),
        )
          .then(() => {
            // Google Ads request succeeded, so likely no ad blocker
            setIsAdBlocker(false);
          }).catch(() => {
            // Request failed, likely due to ad blocker
            setIsAdBlocker(true);
          });
      } catch (error) {
        // fetch API error; possible fetch not supported (old browser)
        // Marking as a blocker since there was an error and so
        // we can prevent continued requests when this function is run
        setIsAdBlocker(true);
        return isAdBlocker;
      }
    }

    if (isAdBlocker === undefined) checkAdBlocker();
  }, [isAdBlocker, storageType]);

  // de facto loading state - if undefined, we haven't checked if there's ad blocker
  const checking = isAdBlocker === undefined;

  // boolean value as to whether or not 
  const showComponent = isAdBlocker && !checking && !storageStatus;
  return [showComponent, storageSetter, { isAdBlocker, checking, storageStatus }];
};

export {useIsAdBlocker};
