import * as React from 'react';
import { useAdBlockDetection } from '../hook';

type StorageType = 'cookies' | 'local' | 'session';

type WrapperProps = {
  storageType?: StorageType;
};

const AdBlockWrapper: React.FC<WrapperProps> = ({ children }) => {
  const { showComponent } = useAdBlockDetection();

  return <>{showComponent && children}</>;
};

export { AdBlockWrapper };
