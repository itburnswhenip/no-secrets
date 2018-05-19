[![Build Status](https://travis-ci.org/jgalentine007/no-secrets.svg?branch=master)](https://travis-ci.org/jgalentine007/no-secrets) [![Coverage Status](https://coveralls.io/repos/github/jgalentine007/no-secrets/badge.svg?branch=master)](https://coveralls.io/github/jgalentine007/no-secrets?branch=master)

# no-secrets #

Smudge and clean filter script for keeping secrets out of your Git repositories and build systems. You can use this if you are unable to use an environment variable approach (or don't want to) or do not want the complexity of a key management system.

## Install ##

**no-secrets** should be installed globally and will create a command called `no-secrets`

`npm install no-secrets -g`

**no-secrets** can easily be added to a Git repository by running the following commands:

From a windows command prompt or powershell:
`no-secrets-install-windows`

From a bash shell:
`no-secrets-install`

**Windows installations require that Git Bash be installed when installing Git (it is by default.)**

You will be prompted for:
* Name the filter being created (it should not contain spaces.) for example `myfilter`
* The file mask that will be added to the `.gitattributes` file.

The installation script will:
* Add the clean smudge filter to your local git configuration file `.git/config`
* Add the filter file mask to `.gitattributes` (if it does not exist it will be created.) 
* Create a filter configuration file template called `myfilter.template.json`
* Add `myfilter.json` to `.gitignore` (if it does not exist it will be created.)
* Instruct you to copy the filter configuration template `myfilter.template.json` to `myfilter.json`

The filter configuration file template should be filled out with the regular expressions that you wish to filter on and added to the repository. **The filter configuration file template should not contain any secrets!!**

It is the user's responsibility to copy the template file and populate the clean and smudge values. **The filter configuration file containing secrets should be excluded from backups and protected with appropriate file permissions**

## Usage ##

**no-secrets** will 'smudge' or 'clean' text input read from `STDIN` and write it to `STDOUT`.

Specify a configuration file path, filter operation (smudge|clean) and an optional filename:

`no-secrets ./no-secrets.example.json smudge inputexample.txt < inputexample.txt > outputexample.txt`

## Configuration ##

See the `no-secrets.example.json` file for details. You may specify multiple filters that will be applied against each line received from `STDIN`. Filters use regex and should include three capture groups. The second capture group is the one that will be replaced by the 'smudge' or 'clean' value specified in the filter object. 

In addition to the file mask added to `.gitattributes`, you may specify a subset file path mask for each filter. This would allow you to tailor multiple search and replace filters from a single configuration file. The file path mask is a Glob wildcard pattern and will only be used if an optional file name is provided at execution. The file mask matches against the relative path of the Git repository rootfolder.

Match all files recursively:
`**`

Match only files in the parent Git repository root folder:
`*`

Match all files in a descendant folder:
`descendantfolder/*`
