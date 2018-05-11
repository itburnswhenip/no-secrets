const config = require("./no-git-secrets.config.json");

function escapeFilter(input) {
    input =  input.replace('$', '$$$$');
    return input
};

function filter(data) {
    var line = data.toString();
    
    for (var filter of config.filters) {
        const regexp = new RegExp(filter.regex);

        if (filterMode == FilterMode.SMUDGE)
            line = line.replace(regexp, '$1' + escapeFilter(filter.smudge) + '$3' );
        else if (filterMode == FilterMode.CLEAN)
            line = line.replace(regexp, '$1' + escapeFilter(filter.clean) + '$3' );
    }

    process.stdout.write(line);
};

const FilterMode = {
    SMUDGE: 'smudge',
    CLEAN: 'clean'
};

var filterMode = FilterMode.SMUDGE;

if (process.argv[2] === 'smudge')
    filterMode = FilterMode.SMUDGE;
else if (process.argv[2] === 'clean')
    filterMode = FilterMode.CLEAN;
else {
    console.log('Please specify the filter mode (smudge|clean) for example: node no-git-secrets.js clean');
    process.exit(1);
}

process.stdin.on("data", filter);  