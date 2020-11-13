import * as React from 'react';
import { useIsAdBlocker } from '../hook';

type StorageType = 'cookies' | 'local' | 'session';

type WrapperProps = {
  storageType?: StorageType;
};

const AdBlockWrapper: React.FC<WrapperProps> = ({
  children,
}) => {
  const {showComponent}= useIsAdBlocker();

  return <>{showComponent && children}</>;
};

export { AdBlockWrapper };
