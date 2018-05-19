const constants = require('./constants');
const exec = require('child_process').exec;
const hasha = require('hasha');

test('integration clean test', done => {
  const cmd = `node src/index.js ${constants.NO_SECRETS_EXAMPLE} clean < ${constants.INPUT_EXAMPLE} > ${constants.OUTPUT}`;
  let result = exec(cmd, (error, stdout, stderr) => {
    let inputHash = hasha.fromFileSync(constants.OUTPUT_CLEAN_EXAMPLE);
    let outputHash = hasha.fromFileSync(constants.OUTPUT);
    expect(inputHash).toBe(outputHash);
    done();
  });
});

test('integration smudge test', done => {
  const cmd = `node src/index.js ${constants.NO_SECRETS_EXAMPLE} smudge < ${constants.INPUT_EXAMPLE} > ${constants.OUTPUT}`;
  let result = exec(cmd, (error, stdout, stderr) => {
    let inputHash = hasha.fromFileSync(constants.OUTPUT_SMUDGE_EXAMPLE);
    let outputHash = hasha.fromFileSync(constants.OUTPUT);
    expect(inputHash).toBe(outputHash);
    done();
  });
});