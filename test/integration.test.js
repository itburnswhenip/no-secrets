const exec = require('child_process').exec;
const hasha = require('hasha');

test('integration test', done => {
  const cmd = 'node src/index.js no-secrets.example.json clean < test/inputexample.txt > test/output.txt';
  let result = exec(cmd, (error, stdout, stderr) => {
    let inputHash = hasha.fromFileSync('test/outputexample.txt');
    let outputHash = hasha.fromFileSync('test/output.txt');
    expect(inputHash).toBe(outputHash);
    done();
  });
});