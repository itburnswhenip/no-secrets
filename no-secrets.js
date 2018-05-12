const fs = require('fs');

const FilterMode = {
    SMUDGE: 'smudge',
    CLEAN: 'clean'
};

function escapeFilter(input) {
    input =  input.replace('$', '$$$$');
    return input
};

function getFilterValue(filter) {
    if (filterMode == FilterMode.SMUDGE)
        return escapeFilter(filter.smudge);
    else
        return escapeFilter(filter.clean);
};

function filter(data) {
    let line = data.toString();
    
    for (var filter of config.filters) {
        const regexp = new RegExp(filter.regex);
        line = line.replace(regexp, '$1' + getFilterValue(filter) + '$3' );
    }

    process.stdout.write(line);
};

function getArgvFilterMode() {
    let arg = process.argv[3];

    switch (arg) {
        case 'smudge':
            return FilterMode.SMUDGE;
        case 'clean':
            return FilterMode.CLEAN;
        default: 
            console.log('Please specify the filter mode (smudge|clean). For example: node no-secrets.js ./no-secrets.json clean');
            process.exit(1);
    }
};

function getArgvConfigFile() {
    let arg = process.argv[2];

    if (arg == null || !fs.existsSync(arg)) {
        console.log('Please specify the configuration relative or absolute path. For example: node no-secrets.js ./no-secrets.json clean');
        process.exit(1);
    }
    else
        return arg;
}

const config = require(getArgvConfigFile());
const filterMode = getArgvFilterMode();
process.stdin.on("data", filter);  