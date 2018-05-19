const FilterMode = require('./FilterMode');
const minimatch = require('minimatch');

function fileMatch(path, mask, pathNoCase) {
  if (path){
    let options = {nocase: pathNoCase, matchBase:false, dot:true};
    let result = minimatch(path, mask, options );
    return result;
  }
  else
    return true;
}

function escapeFilter(input) {
  input =  input.replace('$', '$$$$');
  return input;
}

function getFilterValue(settings, filter) {
  if (settings.filterMode == FilterMode.SMUDGE)
    return escapeFilter(filter.smudge);
  else
    return escapeFilter(filter.clean);
}

class Filter {
  constructor(settings) {
    this._settings = settings;
  }

  run(data) {
    let line = data.toString();
  
    for (var filter of this._settings.filters) {
      if (fileMatch(this._settings.filePath, filter.path, this._settings.pathNoCase)) {
        const regexp = new RegExp(filter.regex);
        const filterValue = '$1' + getFilterValue(this._settings, filter) + '$3';
        line = line.replace(regexp, filterValue);
      }
    }

    return line;
  }
}

module.exports = Filter;