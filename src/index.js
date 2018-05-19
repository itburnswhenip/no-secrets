#!/usr/bin/env node
"use strict";
const fs = require('fs');
const Config = require('./Config');
const Filter = require('./Filter');
const FilterMode = require('./FilterMode');

function getArgvFilterMode() {
  let arg = process.argv[3];

  switch (arg) {
    case 'smudge':
      return FilterMode.SMUDGE;
    case 'clean':
      return FilterMode.CLEAN;
    default: 
      throw 'Please specify the filter mode (smudge|clean). For example: node no-secrets.js ./no-secrets.json clean';
  }
}

function getArgvConfigFile() {
  let arg = process.argv[2];

  if (arg == null)
    throw 'Please specify the configuration relative or absolute path. For example: node no-secrets.js ./no-secrets.json clean';
  else if (!fs.existsSync(arg))
    throw 'Configuration file not found.';
  else
    return arg;
}

// main()
try {
  const configSchema = require('./configSchema.json');
  let settings = new Config(getArgvConfigFile(), configSchema).settings;
  settings.filterMode = getArgvFilterMode();
  settings.filePath = process.argv[4];
  
  process.stdin.on("data", function(data) { 
    let filter = new Filter(settings); 
    filter.run(data);
  });
}
catch(err) {
  console.error(err);
  process.exit(1);
}