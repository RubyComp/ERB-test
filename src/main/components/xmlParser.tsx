import TagsNames from '../tagsList';

console.log('xmlParser');

export default function xmlParser(line: string) {
  // const re = /<\s?(\/?)(\w*)(\s(.*=".*")*)?\s?(\/?)\s?>/g;
  // const found = [...line.matchAll(re)];

  // console.log(TagsNames);
  /*
  function getKeyByValue(object: {
      name: number;
      closed: number;
      pos: number;
    }[], value: string) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  const tagsList: {
    name: number;
    closed: number; // -1: standalone, 0: open, 1: close
    pos: number;
  }[] = [];

  found.forEach(function parseTag(tag) {
    const tagName = getKeyByValue(tagsList, tag[2]) || -1;
    let type = 0;
    // const tagIndex = tag.index;
    const tagIndex: number = tag.index || 0;
    if (tag[1].length > 0) {
      type = 1;
    } else if (tag[5].length > 0) {
      type = -1;
    }
    const tagInfo = {
      name: tagName,
      closed: type, // -1: standalone, 0: open, 1: close
      pos: tagIndex,
    };
    tagsList.push(tagInfo);
    // console.log(tagInfo);
  });
  return tagsList;
  // console.log('line: ', line); */
}

// all tags
// <(/|)\b(|.*?)>

//

// const tagsList = [
//   'base',
//   'case',
//   'comment',
//   'contributor',
//   'dbname',
//   'generator',
//   'ip',
//   'mediawiki',
//   'minor',
//   'namespace',
//   'namespaces',
//   'page',
//   'restrictions',
//   'revision',
//   'siteinfo',
//   'sitename',
//   'text',
//   'timestamp',
//   'title',
//   'username',
// ];

// let example = [
//   {
//     tagname: 'revision',
//     type: '0', // -1: standalone, 0: open, 1: closed
//     pos: {
//       start: 12,
//       end: 16,
//     },
//   },
// ];
