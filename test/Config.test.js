const Config = require('../src/Config');

test('config creation', () => {
  const configSchema = require('../src/configSchema.json');
  let config = new Config('no-secrets.example.json', configSchema);
  expect(config).toBeDefined();
});

test('invalid configuration', () => {
  const configSchema = require('../src/configSchema.json');
  expect(()=>{
    let config = new Config('package.json', configSchema);
  }).toThrow();
});