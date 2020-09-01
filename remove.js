const { spawn } = require('child_process');
const chalk = require('chalk');

function remove(lines, shell, silent) {
    const lpath_data = JSON.parse(
        process.env.LPATH_DATA ||
            '{"raw": [], "rawColored": [], "interpolated": [], "interpolatedColored": []}'
    );
    const path = (process.env.PATH || '').split(':');

    for (let i = 0; i < lines.raw.length; i++) {
        if (!path.includes(lines.interpolated[i])) {
            if (!silent)
                console.log(
                    chalk`{gray [:]} ${lines.rawColored[i]} {blue ->} ${lines.interpolatedColored[i]}`
                );
            continue;
        }

        if (!silent)
            console.log(
                chalk`{red [-]} ${lines.rawColored[i]} {blue ->} ${lines.interpolatedColored[i]}`
            );

        path.splice(path.indexOf(lines.interpolated[i]), 1);

        const idx = lpath_data.interpolated.indexOf(lines.interpolated[i]);

        lpath_data.raw.splice(idx, 1);
        lpath_data.rawColored.splice(idx, 1);
        lpath_data.interpolated.splice(idx, 1);
        lpath_data.interpolatedColored.splice(idx, 1);
    }

    process.env.LPATH_DATA = JSON.stringify(lpath_data);
    process.env.PATH = path.join(':');

    spawn(shell, [], { stdio: 'inherit' });
}

module.exports.remove = remove;
