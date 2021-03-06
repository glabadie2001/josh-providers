const { isArray, isObject } = require("lodash");

const getDelimitedPath = (base, key, valueIsArray) => valueIsArray 
  ? base ? `${base}[${key}]` : key
  : base ? `${base}.${key}` : key;

const getPaths = (data, acc = {}, basePath = null) => {
  if(data === '::NULL::') return {};
  if(!isObject(data)) {
    acc[basePath || '::NULL::'] = JSON.stringify(data);
    return acc;
  }
  const source = isArray(data) ? data.map((d, i) => [i, d]) : Object.entries(data);
  const returnPaths = source.reduce((paths, [key, value]) => {
    const path = getDelimitedPath(basePath, key, !isArray(value));
    if(isObject(value)) getPaths(value, paths, path);
    paths[path.toString()] = JSON.stringify(value);
    return paths;
  }, acc || {});
  return basePath ? returnPaths : ({...returnPaths, '::NULL::': JSON.stringify(data)});
}

const sanitize = str => str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
  switch (char) {
    case "\0":
      return "\\0";
    case "\x08":
      return "\\b";
    case "\x09":
      return "\\t";
    case "\x1a":
      return "\\z";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\"":
    case "'":
    case "\\":
    case "%":
      return "\\"+char;
    default:
      return char;
  }
});

module.exports = {
    getPaths,
    sanitize,
};
