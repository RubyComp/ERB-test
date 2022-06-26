// import tagsNames from '../tagsList';
const tagsList = {
  mediawiki: {
    id: 0,
  },
  siteinfo: {
    id: 1,
  },
  sitename: {
    id: 3,
  },
  dbname: {
    id: 4,
  },
  base: {
    id: 5,
  },
  generator: {
    id: 6,
  },
  case: {
    id: 7,
  },
  namespaces: {
    id: 8,
  },
  namespace: {
    id: 9,
  },
  page: {
    id: 10,
  },
  title: {
    id: 11,
  },
  ns: {
    id: 12,
  },
  id: {
    id: 13,
  },
  revision: {
    id: 14,
  },
  timestamp: {
    id: 15,
  },
  contributor: {
    id: 16,
  },
  username: {
    id: 17,
  },
  ip: {
    id: 18,
  },
  model: {
    id: 19,
  },
  minor: {
    id: 20,
  },
  comment: {
    id: 21,
  },
  format: {
    id: 22,
  },
  text: {
    id: 23,
  },
  sha1: {
    id: 24,
  },
  parentid: {
    id: 25,
  },
  redirect: {
    id: 26,
  },
  origin: {
    id: 27,
  },
};

interface XMLTag {
  nameId: number | -1;
  /*
   * Types:
   * — standalone: -1
   * — open: 0
   * — close: 1
   */
  type: number;
  pos: {
    start: number;
    tagLength: number;
  };
  attrs: string;
  cashedName: string;
}
// console.log(tagsNames);

function getTagId(list: object, value: string) {
  return list[value].id;
}

export default function xmlParser(line: string, lineNr: number) {
  /**
   * Take some XML line and return list of tags
   */
  const tagsInfo: XMLTag[] = [];

  if (line.length !== 0) {
    // const checkUnclosedTag = /<.*[^>]\n/g;
    // const unclosedFounded = [...line.matchAll(checkUnclosedTag)];

    // console.log('--------------');
    // console.log(unclosedFounded);

    // if (unclosedFounded.length) {
    //   console.error(`XML parser error at line ${lineNr}`);
    // }

    const regFindAnyTag = /<\s?(\/?)(\w*)(\s(.*=".*")*)?\s?(\/?)\s?>/g;
    const founded = [...line.matchAll(regFindAnyTag)];

    founded.forEach(function parseTag(tag) {
      const tagNameId = getTagId(tagsList, tag[2]);

      let type: number;

      if (tag[1].length > 0) {
        type = 1;
      } else if (tag[5].length > 0) {
        type = -1;
      } else {
        type = 0;
      }

      // type AttrsList = Record<string, string>;

      // let attrs: AttrsList = {};

      const tagInfo: XMLTag = {
        nameId: tagNameId || -1,
        type, // -1: standalone, 0: open, 1: closed
        pos: {
          start: tag.index || -1,
          tagLength: tag[0].length,
        },
        // attrs: tag[4],
        attrs: '',
        cashedName: tag[2],
      };

      // if (tagNameId === '9' && type === 0) {
      //   const regFindAttrs = /(([a-zA-Z]*)="(.*?)")/g;
      //   const tagAttrs: string = tagInfo[0].attrs || '';
      //   const attrsData = [...tagAttrs.matchAll(regFindAttrs)];

      //   attrsData.forEach((attr) => {
      //     attrs.attr[2] = attr[3];
      //   });
      // }

      tagsInfo.push(tagInfo);
    });
  }

  return tagsInfo;
}
