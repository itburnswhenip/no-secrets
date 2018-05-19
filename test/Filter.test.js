const constants = require('./constants');
const Filter = require('../src/Filter');
const Config = require('../src/Config');
const FilterMode = require('../src/FilterMode');
const hasha = require('hasha');
const fs = require('fs');

test('filter clean', () => {
  const configSchema = require('../src/configSchema.json');
  let settings = new Config(constants.NO_SECRETS_EXAMPLE, configSchema).settings;
  settings.filterMode = FilterMode.CLEAN;
  settings.filePath = constants.INPUT_EXAMPLE;
  let filter = new Filter(settings); 
  let data = fs.readFileSync(constants.INPUT_EXAMPLE);
  fs.writeFileSync(constants.OUTPUT, filter.run(data));
  let inputHash = hasha.fromFileSync(constants.OUTPUT_CLEAN_EXAMPLE);
  let outputHash = hasha.fromFileSync(constants.OUTPUT);
  expect(inputHash).toBe(outputHash);
});

test('filter smudge', () => {
  const configSchema = require('../src/configSchema.json');
  let settings = new Config(constants.NO_SECRETS_EXAMPLE, configSchema).settings;
  settings.filterMode = FilterMode.SMUDGE;
  settings.filePath = constants.INPUT_EXAMPLE;
  let filter = new Filter(settings); 
  let data = fs.readFileSync(constants.INPUT_EXAMPLE);
  fs.writeFileSync(constants.OUTPUT, filter.run(data));
  let inputHash = hasha.fromFileSync(constants.OUTPUT_SMUDGE_EXAMPLE);
  let outputHash = hasha.fromFileSync(constants.OUTPUT);
  expect(inputHash).toBe(outputHash);
});

test('filter smudge no file path', () => {
  const configSchema = require('../src/configSchema.json');
  let settings = new Config(constants.NO_SECRETS_EXAMPLE, configSchema).settings;
  settings.filterMode = FilterMode.SMUDGE;
  settings.filePath = "";
  let filter = new Filter(settings); 
  let data = fs.readFileSync(constants.INPUT_EXAMPLE);
  fs.writeFileSync(constants.OUTPUT, filter.run(data));
  let inputHash = hasha.fromFileSync(constants.OUTPUT_SMUDGE_EXAMPLE);
  let outputHash = hasha.fromFileSync(constants.OUTPUT);
  expect(inputHash).toBe(outputHash);
});

test('filter smudge no different file path', () => {
  const configSchema = require('../src/configSchema.json');
  let settings = new Config(constants.NO_SECRETS_EXAMPLE, configSchema).settings;
  settings.filterMode = FilterMode.SMUDGE;
  settings.filePath = constants.INPUT_EXAMPLE;
  settings.filters[0].path = "fakefile.txt";
  let filter = new Filter(settings); 
  let data = fs.readFileSync(constants.INPUT_EXAMPLE);
  fs.writeFileSync(constants.OUTPUT, filter.run(data));
  let inputHash = hasha.fromFileSync(constants.INPUT_EXAMPLE);
  let outputHash = hasha.fromFileSync(constants.OUTPUT);
  expect(inputHash).toBe(outputHash);
});