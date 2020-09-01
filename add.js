const { spawn } = require('child_process');
const chalk = require('chalk');

function add(lines, shell, silent) {
    const lpath_data = JSON.parse(
        process.env.LPATH_DATA ||
            '{"raw": [], "rawColored": [], "interpolated": [], "interpolatedColored": []}'
    );
    const path = (process.env.PATH || '').split(':');

    for (let i = 0; i < lines.raw.length; i++) {
        if (path.includes(lines.interpolated[i])) {
            if (!silent)
                console.log(
                    chalk`{gray [:]} ${lines.rawColored[i]} {blue ->} ${lines.interpolatedColored[i]}`
                );
            continue;
        }

        if (!silent)
            console.log(
                chalk`{green [+]} ${lines.rawColored[i]} {blue ->} ${lines.interpolatedColored[i]}`
            );

        path.push(lines.interpolated[i]);

        lpath_data.raw.push(lines.raw[i]);
        lpath_data.rawColored.push(lines.rawColored[i]);
        lpath_data.interpolated.push(lines.interpolated[i]);
        lpath_data.interpolatedColored.push(lines.interpolatedColored[i]);
    }

    process.env.LPATH_DATA = JSON.stringify(lpath_data);
    process.env.PATH = path.join(':');

    spawn(shell, [], { stdio: 'inherit' });
}

module.exports.add = add;
