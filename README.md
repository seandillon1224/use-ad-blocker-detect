# React Hook/Component - use-ad-block-detection

## Motivation

In many cases, there is a use case that calls for finding out whether a user has an Ad Blocker turned on.  A common example is that many times the functionality of video players is degraded or altogether rendered unusable when an Ad Blocker is present.

The useAdBlockDetection package is used to determine whether or not a user is using an Ad Blocker, and add some utilities surrounding this.
## Install
To install via NPM.
```bash
npm install use-ad-block-detection
```
## Usage
### Wrapper Component
For simple usage, i.e. you just want to show some JSX based on there being an Ad Blocker detected, you can (and probably should) just use the Component import, `AdBlockWrapper`.

Example Usage:

```javascript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AdBlockWrapper} from "use-ad-block-detection";

const App = () => {
  return (
    <div>
      <AdBlockWrapper>
        <div>If you are seeing me, there is an Ad Blocker.</div>
      </AdBlockWrapper>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```
## Hook

If you need more control and want to hook into some helpful utils, then the hook-based implementation may be a better bet.

This hook, ```useAdBlockDetection```, accepts a completely optional config and returns some helpful properties in array format.
### Options Config

Option | Type | Default | Description
------------ | ------------- | ------------- | -------------
```storageType``` | string (one of ["cookies", "local", "session"]) | 'cookies' | In many cases you may want to know if a user has already been presented some sort of alert/modal/toast regarding their Ad Blocker.  By keeping track of this 'already seen' boolean, we can limit the user's exposure to any sort of alert.  By default we store this boolean value as a cookie, but this can be overridden to use localStorage or sessionStorage.  **NOTE**: This will not be stored automatically, more on that in the hooks's return values below.
```adUrl``` | string | Generic Ad Script | Currently, we send a dummy request out to a known generic ad script (Google) to capture the rejection.  As ad blockers get smarter, and scripts change, there is a chance this may either be deprecated or somehow be 'caught' by the ad blockers.  This allows for an override by sending in your own outside ad script to send a request to and attempt to trigger, and capture the ad blocker's existence.  
```hasBlockerCb``` | function | null | Callback function that will be called when an ad blocker is detected.  **NOTE**: This will fire every time an Ad Blocker is detected on page load, with no regard for the ```storageStatus``` boolean.  In the event that, for example, you are attempting to capture analytics as to how many times *new* users have Ad Blocker's enabled this can be used in tandem with ```storageStatus```.

### Result

After being called, the ```useAdBlockDetection``` hook will return an object with the following properties.

Property | Type | Description
------------ | ------------- | ------------- 
```showComponent``` | boolean OR undefined | Boolean value that will only hold a truthy value when: ```isAdBlocker``` is true  and we have no ```storageType``` value. i.e. The user has an Ad Blocker and we have not called ```storageSetter```.
```storageSetter``` | function | Function that when called, will set  ```new Date().getTime() ``` value to the selected ```storageType```.  The date string is both truthy so that showComponent will turn false when this is called, and allows for more advanced checks if you want to show something based on how long ago a user had this value stored.
```isAdBlocker``` | boolean OR undefined | A boolean that indicates whether there is an Ad Blocker detected.  Initially undefined until finished checking for Ad Blocker.
```storageStatus``` | string OR null |  If ```storageSetter``` has been called, this will be a stringified ```new Date().getTime() ```, otherwise null.

Example Usage:

```javascript
import * as React from 'react';
import {useAdBlockDetection} from 'use-ad-block-detection';
import useOutsideClick from 'useOutsideClick'; /* mock outside click hook */
import css from './style.css';

// by passing this function into our config object as hasBlockerCb, we call this each time that the useAdBlockDetection hook sees an Ad Blocker and fire off our analytics capturing in the process
const analyticsTrack = () => {
    // do some analytics things in here
}

const Modal = () => {
  const modalRef = React.useRef(null);
  // by passing session as storageType, we're theoretically choosing to show this modal every time the user closes this browser tab and re-opens the url in that browser - using 'local' or the default 'cookies' would have a longer term effect on when to show.
  const { showComponent, storageSetter } = useAdBlockDetection({storageType: 'session', hasBlockerCb: analyticsTrack});
  const [isOpen, setIsOpen] = React.useState(true);
  
  // if we close the modal either by the button or via clicking outside, track that we have shown our user that the site may not run as smoothly with an Ad Blocker so we do not show them it again.
  const handleClose = () => {
    storageSetter();
    setIsOpen(false);
  };
  // handle clicks outside of the modal the same way we handle the Close Modal button
  useOutsideClick(modalRef, () => {
    handleClose();
  });

  return showComponent && isOpen && (
    <div className="modal">
      <div ref={modalRef} className="modalMain">
        <h1>Ad Blocker detected, our videos may not work as smoothly with this enabled.</h1>
        <button type="button" onClick={handleClose}>
          CLOSE MODAL
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<Modal />, document.getElementById('root'));

```



