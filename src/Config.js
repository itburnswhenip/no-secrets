const fs = require('fs');
const Ajv = require('ajv');

function readJsonFile(fs, path) {
  let data = fs.readFileSync(path);
  return JSON.parse(data);
}

class Config {
  constructor(file, schema) {
    this._settings = readJsonFile(fs, file);
    this.validate(schema);
  }

  get settings() {
    return this._settings;
  }

  validate(schema) {
    let ajv = new Ajv({allErrors: true, schemas: [schema], useDefaults:true});
    let valid = ajv.validate(schema, this.settings);
    if (!valid)
      throw 'Error(s) occured reading the configuration file:\n' + ajv.errors.map(e => e.message).join('\n');
  }
}

module.exports = Config;