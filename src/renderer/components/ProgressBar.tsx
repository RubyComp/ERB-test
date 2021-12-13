import { useState } from 'react';
import { ipcRenderer } from 'electron';
import Spiner from './Spiner';
// import { log } from 'util';

function ProgressBar() {
  const [value, setValue] = useState(1);

  function switcher() {
    console.log('switcher');
    ipcRenderer.send('loaderValueReq', 'ping');
    ipcRenderer.on('loaderValueReply', (event, result) => {
      console.log('event: ', event);
      console.log('result: ', result);
      setValue(result);
      // resolve(result);
    });
  }

  return (
    <div>
      <Spiner />
      <h1>{value}</h1>
      <p>lines</p>
      <button type="button" onClick={switcher}>
        Start Test
      </button>
    </div>
  );
}

export default ProgressBar;
