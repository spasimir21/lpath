const chalk = require('chalk');
const arg = require('arg');
const parse = require('./fileFormat').parse;
const remove = require('./remove').remove;
const add = require('./add').add;
const ls = require('./ls').ls;

const args = arg({
    '--silent': Boolean,
    '--help': Boolean,
    '--shell': String,
    '-s': '--silent',
    '-h': '--help',
});

if (args['--help']) {
    console.log('Usage: lpath <action> [options...]');
    //prettier-ignore
    console.log('     --shell <shell>    Which shell to transfer to. Default is bash.');
    //prettier-ignore
    console.log(' -s, --silent           Stops all logging (Except for errors).');
    console.log(' -h, --help             Displays this help screen.');
    console.log('');
    console.log('Actions:');
    console.log('     add [globs...]     Adds these files to the path.');
    console.log('     remove [globs...]  Removes these files from the path.');
    console.log('     ls                 Lists everything from the path.');
    process.exit(0);
}

if (args._.length == 0) {
    process.stderr.write(chalk.red('No action was provided!\n'));
    process.exit(1);
}

if (!['add', 'remove', 'ls', 'cleanup'].includes(args._[0])) {
    process.stderr.write(chalk.red('Unknown action!\n'));
    process.exit(1);
}

if (args._[0] == 'ls') {
    try {
        ls(args['--silent']);
    } catch (err) {
        process.stderr.write(
            chalk.red(
                'Something went wrong! Might have insufficient permissions.\n'
            )
        );
        process.exit(1);
    }
}

if (args._[0] == 'add') {
    if (args._.length == 1) {
        process.stderr.write(chalk.red('No input globs were provided!\n'));
        process.exit(1);
    }

    try {
        add(
            parse(args._.slice(1), process.env),
            args['--shell'] || 'bash',
            args['--silent']
        );
    } catch (err) {
        process.stderr.write(
            chalk.red(
                'Something went wrong! Might have insufficient permissions.\n'
            )
        );
        console.log(err);
        process.exit(1);
    }
}

if (args._[0] == 'remove') {
    if (args._.length == 1) {
        process.stderr.write(chalk.red('No input globs were provided!\n'));
        process.exit(1);
    }

    try {
        remove(
            parse(args._.slice(1), process.env),
            args['--shell'] || 'bash',
            args['--silent']
        );
    } catch (err) {
        process.stderr.write(
            chalk.red(
                'Something went wrong! Might have insufficient permissions.\n'
            )
        );
        process.exit(1);
    }
}
