const globlib = require('glob');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

function readFile(filename) {
    return fs.readFileSync(filename).toString();
}

function resolveGlobs(globs) {
    let res = [];

    for (const glob of globs) {
        res = [...res, ...globlib.sync(glob)];
    }

    return res;
}

function removeComments(content) {
    content = content.replace(/(?<!\\)#.*/g, '');
    content = content.replace('\\#', '#');

    return content;
}

function resolveIncludes(content, filename) {
    const findIncludes = /^@include\s+.*/gm;

    return content.replace(findIncludes, include => {
        const glob = include
            .substr(9)
            .replace(/^\s+/g, '')
            .replace(/\s+$/g, '');

        const filenames = globlib.sync(path.join(path.dirname(filename), glob));

        let content = '';

        for (const filename of filenames) {
            content += '\n';
            content += preprocess(readFile(filename), filename);
        }

        return content;
    });
}

function addDirname(content, filename) {
    return content.replace('$DIR$', path.dirname(filename));
}

function preprocess(content, filename) {
    content = removeComments(content);
    content = addDirname(content, filename);
    return resolveIncludes(content, filename);
}

function getLines(content) {
    const lines = content.split('\n');

    return lines
        .map(line => {
            return line.replace(/^\s+/g, '').replace(/\s+$/g, '');
        })
        .filter(line => line.length != 0);
}

function parseLines(lines, env = {}) {
    const re = new RegExp(`\\$(${Object.keys(env).join('|')})`, 'g');

    const raw = [...lines];

    const rawColored = raw.map(line => {
        return line.replace(re, name => chalk.green(name));
    });

    const interpolated = raw.map(line => {
        return line.replace(re, name => env[name.substr(1)]);
    });

    const interpolatedColored = raw.map(line => {
        return line.replace(re, name => chalk.green(env[name.substr(1)]));
    });

    return { raw, rawColored, interpolated, interpolatedColored };
}

function parse(globs, env) {
    const filenames = resolveGlobs(globs);

    let content = '';

    for (const filename of filenames) {
        content += '\n';
        content += preprocess(readFile(filename), filename);
    }

    const lines = getLines(content);

    return parseLines(lines, env);
}

module.exports.parse = parse;
