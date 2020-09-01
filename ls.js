const chalk = require('chalk');

function ls(silent) {
    const lpath_data = JSON.parse(
        process.env.LPATH_DATA ||
            '{"raw": [], "rawColored": [], "interpolated": [], "interpolatedColored": []}'
    );

    for (let i = 0; i < lpath_data.raw.length; i++) {
        if (!silent)
            console.log(
                chalk`${lpath_data.rawColored[i]} {blue ->} ${lpath_data.interpolatedColored[i]}`
            );
    }
}

module.exports.ls = ls;
