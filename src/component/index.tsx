import * as React from 'react';
import { useIsAdBlocker } from '../hook';

type StorageType = 'cookies' | 'local' | 'session';

type WrapperProps = {
  storageType?: StorageType;
};

const AdBlockWrapper: React.FC<WrapperProps> = ({
  children,
  storageType = 'cookies',
}) => {
  const [showComponent] = useIsAdBlocker({ storageType });

  return <>{showComponent && children}</>;
};

export { AdBlockWrapper };
