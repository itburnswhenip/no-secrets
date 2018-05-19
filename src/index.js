#!/usr/bin/env node
"use strict";
const Args = require('./Args');
const Config = require('./Config');
const Filter = require('./Filter');
const FilterMode = require('./FilterMode');

try {
  const args = new Args(process);
  const configSchema = require('./configSchema.json');
  let settings = new Config(args.getConfigFile(), configSchema).settings;
  settings.filterMode = args.getFilterMode();
  settings.filePath = args.getFilePath();
  
  process.stdin.on("data", function(data) { 
    let filter = new Filter(settings); 
    process.stdout.write(filter.run(data));
  });
}
catch(err) {
  console.error(err);
  process.exit(1);
}