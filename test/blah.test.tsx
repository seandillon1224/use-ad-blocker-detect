import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useIsAdBlocker, AdBlockWrapper } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AdBlockWrapper />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
