import { ipcMain } from 'electron';
import xmlParser from './xmlParser';
import TagsNames from '../tagsList';

const fs = require('fs');
const es = require('event-stream');

console.log('fileHandler');
console.log(TagsNames.timestamp);

// const testFile = 'rufallout_pages_full.xml';
const testFile = 'ruhalflife_pages_full.xml';
// const testFile = 'test.txt';

let isBusy = false;

export default function fileHandler() {
  function sendNumb(event: any, num: any) {
    const value = num.toLocaleString();
    // console.log('Send: ', value);
    event.sender.send('loaderReply', value);
  }

  function fileReader(ev: Electron.IpcMainEvent) {
    isBusy = true;
    let lineNr = 0;

    const s = fs
      .createReadStream(testFile, { encoding: null })
      .pipe(es.split())
      .pipe(
        es
          .mapSync(function numeric(line: string) {
            // if (lineNr >= 200000) return;
            s.pause();
            lineNr += 1;
            // console.log(line);
            // const tagInfo = String(xmlParser(line));

            // if (tagInfo.length > 0) console.log(tagInfo);

            if ((!(lineNr % 10000) && lineNr < 100000) || !(lineNr % 100000))
              sendNumb(ev, lineNr);
            s.resume();
          })
          .on('error', function readingError(err: any) {
            console.error('Error while reading file.', err);
          })
          .on('end', function readingEnd(line: any) {
            console.log('Read entire file.');
            sendNumb(ev, lineNr);
            isBusy = false;
          })
      );
  }

  ipcMain.on('loaderReq', (event, arg) => {
    if (isBusy) return;
    if (arg === 'ping') {
      console.log('----ping:', arg);
      fileReader(event);
    } else {
      console.log('----else:', arg);
      event.sender.send('loaderReply', 'unrecognized arg');
    }
  });
}
