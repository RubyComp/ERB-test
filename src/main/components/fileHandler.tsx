import console from 'console';
import { ipcMain } from 'electron';
// import sqlite3 from 'sqlite3';
import xmlParser from './xmlParser';
// import TagsNames from '../tagsList';

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const es = require('event-stream');

console.log('fileHandler');

// const testFile = 'rufallout_pages_full.xml';
const testFile = 'ruhalflife_pages_full.xml';
// const testFile = 'rufallouttest_pages_full.xml';

// const testFile = 'rumlp_pages_full.xml';

// const testFile = 'test.txt';
// const startRow = 0;
const maxRows = 0;

const tableName = 'edits';
const tableNamePrefix = 'HL';
const tableNameFull = tableName + tableNamePrefix;

let isBusy = false;

interface Revision {
  revId: number | -1;
  pageId: number | -1;
  row: number | -1;
  time: string | '';
  user: number | 1;
  cashedTitle: string | '';
  cashedUser: string | '';
}

export default function fileHandler() {
  const db = new sqlite3.Database('test.sqlite3');

  try {
    db.run(`DROP TABLE IF EXISTS ${tableNameFull}`);
    // db.run(
    //   `CREATE TABLE IF NOT EXISTS ${tableNameFull} (key INTEGER PRIMARY KEY, row TEXT NOT NULL, revId TEXT NOT NULL, pageId TEXT NOT NULL, time TEXT NOT NULL, user TEXT NOT NULL, cashedTitle TEXT NOT NULL, cashedUser TEXT NOT NULL)`,

    // );

    db.run(
      `CREATE TABLE IF NOT EXISTS ${tableNameFull} (key INTEGER PRIMARY KEY, row TEXT NOT NULL, revId TEXT NOT NULL, pageId TEXT NOT NULL, time TEXT NOT NULL, user TEXT NOT NULL, cashedTitle TEXT NOT NULL, cashedUser TEXT NOT NULL)`,
      () => {
        console.log('Test1');
      }
    );
  } catch (error) {
    console.log('initTable error');
  }

  function addValue(val: Revision) {
    // const stmt = db.prepare(`INSERT INTO edits (time) VALUES ('${val}')`);
    // const stmt = db.prepare(`INSERT INTO edits (time) VALUES (888)`);
    // console.log(val);
    try {
      // db.run(
      //   `INSERT INTO ${tableNameFull} (revId, pageId, row, time, user, cashedTitle, cashedUser) VALUES (${val.revId}, ${val.pageId}, ${val.row}, '${val.time}', '${val.user}', '${val.cashedTitle}', '${val.cashedUser}')`
      // );

      db.run(
        `INSERT INTO ${tableNameFull} (revId, pageId, row, time, user, cashedTitle, cashedUser) VALUES (${val.revId}, ${val.pageId}, ${val.row}, '${val.time}', '${val.user}', '${val.cashedTitle}', '${val.cashedUser}')`,
        () => {
          console.log('Test');
        }
      );
    } catch (error) {
      console.log('initTable error');
    }
    // stmt.finalize();
  }

  function finish() {
    db.close();
    isBusy = false;
    console.log('Finish.');
  }

  function sendToGUI(event: any, value: any) {
    const text = value.toLocaleString();
    // console.log('Send: ', value);
    event.sender.send('loaderReply', text);
  }

  function fileReader(ev: Electron.IpcMainEvent) {
    let lineNr = 0;
    let pageTitle = 'TEST Title not init';
    // let parentTagId = -1;
    let revData: Revision;

    const s = fs
      .createReadStream(testFile, { encoding: null })
      .pipe(es.split())
      .pipe(
        es
          .mapSync(function numeric(line: string) {
            if (maxRows > 0 && lineNr >= maxRows) {
              console.log(`Max rows limit (${maxRows}) reached.`);
              s.destroy();
            } else {
              lineNr += 1;
              // parentTagId =

              s.pause();

              if ((!(lineNr % 10000) && lineNr < 10000) || !(lineNr % 1000)) {
                sendToGUI(ev, lineNr);
              }

              // const tagInfo = String(xmlParser(line));
              const tagInfo = xmlParser(line, lineNr);
              // console.log(tagInfo);

              if (tagInfo.length) {
                const firstTagId = tagInfo[0].nameId;

                /*
                 * Entrance to <page>
                 */
                if (firstTagId === 10) {
                  pageTitle = 'TEST Title cleared';
                  // pageId = -1;
                }

                /*
                 * Entrance to <revision>
                 */
                if (firstTagId === 14 && tagInfo[0].type === 0) {
                  revData = {
                    revId: -1,
                    pageId: -1,
                    row: -1,
                    time: '',
                    user: -1,
                    cashedTitle: pageTitle,
                    cashedUser: '',
                  };
                }

                /*
                 * Exit from <revision> and send rev
                 */
                if (firstTagId === 14 && tagInfo[0].type === 1) {
                  revData.row = lineNr;
                  addValue(revData);
                }

                /*
                 * Simple case with only single tag
                 */
                if (
                  tagInfo &&
                  tagInfo.length === 2 &&
                  firstTagId === tagInfo[1].nameId
                ) {
                  const tagContent = {
                    pos: {
                      start: tagInfo[0].pos.start + tagInfo[0].pos.tagLength,
                      end: tagInfo[1].pos.start,
                    },
                    text: '',
                  };
                  tagContent.text = line.substring(
                    tagContent.pos.start,
                    tagContent.pos.end
                  );

                  switch (firstTagId) {
                    case 11:
                      /*
                       * <title>
                       */
                      pageTitle = tagContent.text;
                      break;

                    case 15:
                      /*
                       * <timestamp>
                       */
                      revData.time = tagContent.text;
                      break;

                    case 17:
                    case 18:
                      /*
                       * <username>
                       * or
                       * <ip>
                       */
                      revData.cashedUser = tagContent.text;
                      break;

                    default:
                      break;
                  }
                }
              }
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
            sendToGUI(ev, lineNr);
            finish();
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
