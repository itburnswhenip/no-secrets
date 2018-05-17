#!/usr/bin/env node
"use strict";
const fs = require('fs');
const Ajv = require('ajv');
const minimatch = require('minimatch');

/**
 * Filter mode options.
 */
const FilterMode = {
  SMUDGE: 'smudge',
  CLEAN: 'clean'
};

/**
 * Escapes a single '$' as double '$$' in an input string for regex replacement.
 * @param {string} input Input string.
 */
function escapeFilter(input) {
  input =  input.replace('$', '$$$$');
  return input;
}

/**
 * Returns the filter mode in a given configuration.
 * @param {*} config no-secrets configuration object.
 * @param {*} filter 
 */
function getFilterValue(config, filter) {
  if (config.filterMode == FilterMode.SMUDGE)
    return escapeFilter(filter.smudge);
  else
    return escapeFilter(filter.clean);
}

/**
 * Matches a file path string against a glob pattern mask.
 * @param {string} path File path to match.
 * @param {string} mask Glob pattern mask.
 */
function fileMatch(path, mask, pathNoCase) {
  if (path){
    //let absoluteMask = process.cwd() + '/' + mask;
    let options = {nocase: pathNoCase, matchBase:false, dot:true};
    let result = minimatch(path, mask, options );
    return result;
  }
  else
    return true;
}

/**
 * Filters a data string.
 * @param {*} config no-secrets configuration object.
 * @param {string} data Data string to filter.
 */
function filter(config, data) {
  let line = data.toString();
  
  for (var filter of config.filters) {
    if (fileMatch(config.filePath, filter.path, config.pathNoCase)) {
      const regexp = new RegExp(filter.regex);
      const filterValue = '$1' + getFilterValue(config, filter) + '$3';
      line = line.replace(regexp, filterValue);
    }
  }

  process.stdout.write(line);
}

/**
 * Returns the chosen filter mode command line argument.
 * @throws Will throw if argument is missing or invalid.
 */
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

/**
 * Returns the chosen configuration file command line argument.
 * @throws Will throw if configuration file argument is missing or file does not exist.
 */
function getArgvConfigFile() {
  let arg = process.argv[2];

  if (arg == null)
    throw 'Please specify the configuration relative or absolute path. For example: node no-secrets.js ./no-secrets.json clean';
  else if (!fs.existsSync(arg))
    throw 'Configuration file not found.';
  else
    return arg;
}

/**
 * Validates a no-secrets configuration object using JSON schema.
 * @param {*} configSchema no-secretes configuration schema object.
 * @param {*} config no-secrets configuration object.
 * @throws Will throw if configuration is invalid
 */
function validateConfig(configSchema, config) {
  let ajv = new Ajv({allErrors: true, schemas: [configSchema], useDefaults:true});
  let valid = ajv.validate(configSchema, config);
  if (!valid)
    throw 'Error(s) occured reading the configuration file:\n' + ajv.errors.map(e => e.message).join('\n');
  else
    return config;
}

/**
 * Read a JSON file using 'fs'.
 * @param {fs} fs File system module.
 * @param {string} path File path.
 */
function readJsonFile(fs, path) {
  let data = fs.readFileSync(path);
  return JSON.parse(data);
}

// main()
try {
  const configSchema = require('./configSchema.json');
  let config = readJsonFile(fs, getArgvConfigFile());
  config = validateConfig(configSchema, config);
  config.filterMode = getArgvFilterMode();
  config.filePath = process.argv[4];

  process.stdin.on("data", function(data) { filter(config, data); });
}
catch(err) {
  console.error(err);
  process.exit(1);
}