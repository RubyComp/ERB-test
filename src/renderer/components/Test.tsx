import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

function Test() {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    ipcRenderer.on('asynchronous-message', () => {
      console.log(counter);
      setCounter(counter + 1);
    });
    return () => {
      ipcRenderer.removeAllListeners('asynchronous-message');
    };
  }, [counter]);

  return (
    <div>
      <h1>Counter: {counter}</h1>
    </div>
  );
}

export default Test;
