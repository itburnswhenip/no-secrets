const FilterMode = require('./FilterMode');
const fs = require('fs');

class Args {
  constructor(process) {
    this._argv = process.argv;
  }

  getFilterMode() {
    debugger;
    switch (this._argv[3]) {
      case 'smudge':
        return FilterMode.SMUDGE;
      case 'clean':
        return FilterMode.CLEAN;
      default: 
        throw 'Please specify the filter mode (smudge|clean). For example: node no-secrets.js ./no-secrets.json clean';
    }
  }
  
  getConfigFile() {
    let arg = this._argv[2];
  
    if (arg == null)
      throw 'Please specify the configuration relative or absolute path. For example: node no-secrets.js ./no-secrets.json clean';
    else if (!fs.existsSync(arg))
      throw 'Configuration file not found.';
    else
      return arg;
  }

  getFilePath() {
    return this._argv[4];
  }
}

module.exports = Args;