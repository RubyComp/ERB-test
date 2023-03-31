import console from 'console';
import { ipcMain } from 'electron';
import xmlParser from './xmlParser';
// import sqlite3 from 'sqlite3';
// import TagsNames from '../tagsList';

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const es = require('event-stream');
const readline = require('readline');

// const readline = require('linebyline');

export default function fileHandler() {
  console.log('fileHandler');

  // const testFile = 'rufallout_pages_full.xml';
  // const testFile = 'ruhalflife_pages_full.xml';
  const testFile = 'rufallouttest_pages_full.xml';
  // const testFile = 'rumlp_pages_full.xml';

  // const testFile = 'test.txt';
  // const startRow = 0;
  const maxRows = 10;

  const tableName = 'edits';
  const tableNamePrefix = 'HL';
  const tableNameFull = tableName + tableNamePrefix;

  const db = new sqlite3.Database('test.sqlite3');

  let ipcEvent: Electron.IpcMainEvent;
  let isBusy = false;
  let readInited = false;

  let lineNr = 0;
  let pageTitle = 'TEST Title not init';

  interface Revision {
    revId: number | -1;
    pageId: number | -1;
    row: number | -1;
    time: string | '';
    user: number | 1;
    cashedTitle: string | '';
    cashedUser: string | '';
  }

  // function awaw() {
  //   setTimeout(() => {
  //     console.log('awaw');
  //     return true;
  //   }, 2000);
  // }

  // const promise1 = new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve('foo');
  //   }, 10000);
  // });

  // promise1
  //   .then((value) => {
  //     console.log(value);
  //     return true;
  //   })
  //   .catch(errr);

  async function processLineByLine() {
    // console.log(promise1);

    const fileStream = fs.createReadStream(testFile);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    // eslint-disable-next-line no-restricted-syntax

    console.log('-----------------');
    console.log(`rl: ${rl}`);
    console.log('-----------------');

    // eslint-disable-next-line no-restricted-syntax
    for await (const line of rl) {
      lineNr += 1;
      console.log(`Line from file: ${lineNr}: ${line}`);

      fileStream.pause();
      // await awaw();
      // fileStream.pause();
      // if (lineNr === 10)
      // if (lineNr > 30) fileStream.destroy();
      // setTimeout(() => {
      //   fileStream.pause();
      //   console.log(222);
      // }, 2000);
    }
  }

  processLineByLine();

  function readNext() {
    lineNr += 1;
    console.log(`Next ${lineNr}`);
  }

  function sendToGUI(event: any, value: any) {
    const text = value.toLocaleString();
    // console.log('Send: ', value);
    event.sender.send('loaderReply', text);
  }
  function finish() {
    db.close();
    isBusy = false;
    console.log('Finish.');
  }

  function addValue(val: Revision, callback: any) {
    try {
      db.run(
        `INSERT INTO ${tableNameFull} (revId, pageId, row, time, user, cashedTitle, cashedUser) VALUES (${val.revId}, ${val.pageId}, ${val.row}, '${val.time}', '${val.user}', '${val.cashedTitle}', '${val.cashedUser}')`,
      );
    } catch (error) {
      console.log('initTable error');
    }
    // stmt.finalize();
  }

  function processLine(s: any) {
    if ((!(lineNr % 10000) && lineNr < 10000) || !(lineNr % 1000)) {
      sendToGUI(ipcEvent, lineNr);
    }
    s.pause();
    console.log('processLine');

    // setTimeout(() => {
    //   console.log('Timeout');
    // }, 1000);
  }

  function fileReader() {
    // let parentTagId = -1;
    let revData: Revision;
    console.log('fileReader-1');

    const s = fs
      .createReadStream(testFile, { encoding: null })
      .pipe(es.split())
      .pipe(
        es
          .mapSync((line: any) => {
            s.pause();
            lineNr += 1;

            console.log(lineNr);
            if (maxRows > 0 && lineNr >= maxRows) {
              console.log(`Max rows limit (${maxRows}) reached.`);
              s.destroy();
            } else {
              // // parentTagId =
              // console.log(line);
              s.pause();
              // setTimeout(() => {
              //   console.log('Timeout');
              // }, 2000);
              processLine(s);
              // s.resume();
              // console.log(`Pause`);

              // // const tagInfo = String(xmlParser(line));
              // const tagInfo = xmlParser(line, lineNr);
              // // console.log(tagInfo);

              // if (tagInfo.length) {
              //   const firstTagId = tagInfo[0].nameId;

              //   /*
              //    * Entrance to <page>
              //    */
              //   if (firstTagId === 10) {
              //     pageTitle = 'TEST Title cleared';
              //     // pageId = -1;
              //   }

              //   /*
              //    * Entrance to <revision>
              //    */
              //   if (firstTagId === 14 && tagInfo[0].type === 0) {
              //     revData = {
              //       revId: -1,
              //       pageId: -1,
              //       row: -1,
              //       time: '',
              //       user: -1,
              //       cashedTitle: pageTitle,
              //       cashedUser: '',
              //     };
              //   }

              //   /*
              //    * Exit from <revision> and send rev
              //    */
              //   if (firstTagId === 14 && tagInfo[0].type === 1) {
              //     revData.row = lineNr;
              //     addValue(revData);
              //   }

              //   /*
              //    * Simple case with only single tag
              //    */
              //   if (
              //     tagInfo &&
              //     tagInfo.length === 2 &&
              //     firstTagId === tagInfo[1].nameId
              //   ) {
              //     const tagContent = {
              //       pos: {
              //         start: tagInfo[0].pos.start + tagInfo[0].pos.tagLength,
              //         end: tagInfo[1].pos.start,
              //       },
              //       text: '',
              //     };
              //     tagContent.text = line.substring(
              //       tagContent.pos.start,
              //       tagContent.pos.end
              //     );

              //     switch (firstTagId) {
              //       case 11:
              //         /*
              //          * <title>
              //          */
              //         pageTitle = tagContent.text;
              //         break;

              //       case 15:
              //         /*
              //          * <timestamp>
              //          */
              //         revData.time = tagContent.text;
              //         break;

              //       case 17:
              //       case 18:
              //         /*
              //          * <username>
              //          * or
              //          * <ip>
              //          */
              //         revData.cashedUser = tagContent.text;
              //         break;

              //       default:
              //         break;
              //     }
              //   }
              // }
            }
            //   const tagNameId = tagInfo[0].nameId;

            //   switch (tagNameId) {
            //     case '9': {
            //       console.log('------------------');

            //       tagContent.text = line.substring(
            //         tagContent.pos.start,
            //         tagContent.pos.end
            //       );

            //       // const testText = 'key="110" case="first-letter"';

            //       const regFindAttrs = /(([a-zA-Z]*)="(.*?)")/g;
            //       const attrsData = [
            //         ...tagInfo[0].attrs.matchAll(regFindAttrs),
            //       ];

            //       console.log(tagInfo);
            //       console.log(
            //         `INSERT INTO namespaces (key, name) VALUES (${attrsData[3]}, '${tagContent.text}')`
            //       );
            //       sendToGUI(ev, tagContent.text);

            //       db.serialize(function addNamespace() {
            //         const stmt = db.prepare(
            //           `INSERT INTO namespaces (key, name) VALUES (${attrsData[3]}, '${tagContent.text}')`
            //         );
            //         stmt.run();
            //         stmt.finalize();
            //       });

            //       break;
            //     }
            //     default: {
            //       console.log('default');
            //       break;
            //     }
            //   }
            // }
            // console.log('test');
            // tagInfo.forEach((tag) => {
            //   if (tag.nameId === '9')c {
            //     // addTestValue();
            //     console.log('------------------');
            //     console.log(tag);
            //     console.log(line);
            //   }
            // });
            // }

            s.resume();
          })
          .on('error', function readingError(err: any) {
            console.error('Error while reading file.', err);
          })
          .on('end', function readingEnd(line: any) {
            sendToGUI(ipcEvent, lineNr);
            finish();
          })
      );
  }

  function createTable() {
    db.run(
      `CREATE TABLE IF NOT EXISTS ${tableNameFull} (key INTEGER PRIMARY KEY, row TEXT NOT NULL, revId TEXT NOT NULL, pageId TEXT NOT NULL, time TEXT NOT NULL, user TEXT NOT NULL, cashedTitle TEXT NOT NULL, cashedUser TEXT NOT NULL)`,
      () => {
        console.log('Table was created');
        fileReader();
      }
    );
  }
  function clearTable(next: any) {
    db.run(`DROP TABLE IF EXISTS ${tableNameFull}`, () => {
      console.log('Table was cleared');
      next();
    });
  }

  function initTable() {
    try {
      clearTable(createTable);
    } catch (error) {
      console.log('initTable error');
    }
  }

  function initRead() {
    console.log('initRead');
    if (readInited) {
      console.log('Reader is already started.');
    } else {
      console.log('Reading...');
      readInited = true;
      initTable();
    }
  }

  ipcMain.on('loaderReq', (event, arg) => {
    if (isBusy) return;
    if (arg === 'ping') {
      console.log('----ping:', arg);
      ipcEvent = event;
      initRead();
    } else {
      console.log('----else:', arg);
      event.sender.send('loaderReply', 'unrecognized arg');
    }
  });
}
