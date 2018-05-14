# no-secrets #

Smudge and clean filter script for keeping secrets out of your Git repositories and build systems.

## Install ##

**no-secrets** should be installed globally and will create a command called `no-secrets`. This is necessary since Git smudge and clean filters require your command to be available in the environment path.

## Usage ##

**no-secrets** will 'smudge' or 'clean' text input read from `STDIN` and write it to `STDOUT`.

Specify a configuration file path and filter operation (smudge|clean):

`node no-secrets.js ./no-secrets.example.json smudge < inputexample.txt > outputexample.txt`

## Configuration ##

See the `no-secrets.example.json` file for details. You may specify multiple filters that will be applied against each line received from `STDIN`. Filters use regex and should include three capture groups. The second capture group is the one that will be replaced by the 'smudge' or 'clean' value specified in the filter object. 