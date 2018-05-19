const Args = require('../src/Args');
const fs = require('fs');
const constants = require('./constants');
const FilterMode = require('../src/FilterMode');

const myprocess = {
  argv: [
    "C:\\Program Files\\nodejs\\node.exe",
    "C:\\Users\\jgalentine\\Documents\\GitHub\\no-secrets\\src\\index.js",
    constants.NO_SECRETS_EXAMPLE,
    FilterMode.CLEAN,
    constants.INPUT_EXAMPLE
  ]
};

test('get args file path', ()=>{
  const args = new Args(myprocess);
  expect(args.getFilePath()).toBe(constants.INPUT_EXAMPLE);
});

test('get args config file', () => {
  const args = new Args(myprocess);
  expect(args.getConfigFile()).toBe(constants.NO_SECRETS_EXAMPLE);
});

test('get args config file not provided', () => {
  let myprocesscopy = JSON.parse(JSON.stringify(myprocess));
  myprocesscopy.argv[2] = null;
  const args = new Args(myprocesscopy);
  expect(()=>{
    args.getConfigFile();
  }).toThrow();
});

test('get args config file not found', () => {
  let myprocesscopy = JSON.parse(JSON.stringify(myprocess));
  myprocesscopy.argv[2] = 'invalid';
  const args = new Args(myprocesscopy);
  expect(()=>{
    args.getConfigFile();
  }).toThrow();
});

test('get args filter mode clean', () => {
  const args = new Args(myprocess);
  expect(args.getFilterMode()).toEqual(FilterMode.CLEAN);
});

test('get args filter mode smudge', () => {
  let myprocessSmudge = JSON.parse(JSON.stringify(myprocess));
  myprocessSmudge.argv[3] = FilterMode.SMUDGE;
  const args = new Args(myprocessSmudge);
  expect(args.getFilterMode()).toEqual(FilterMode.SMUDGE);
});

test('get args missing filter mode', () => {
  let myprocessSmudge = JSON.parse(JSON.stringify(myprocess));
  myprocessSmudge.argv[3] = null;
  const args = new Args(myprocessSmudge);
  expect(()=>{
    args.getFilterMode();
  }).toThrow();
});