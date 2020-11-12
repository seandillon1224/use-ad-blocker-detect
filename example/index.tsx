import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Modal from './modal';
import {AdBlockWrapper} from "../.";

const App = () => {
  return (
    <div>
      <Modal />
      <AdBlockWrapper>
        <div>Yeah you blocked</div>
      </AdBlockWrapper>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
