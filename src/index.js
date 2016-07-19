const defaults = {
    characters: [
        '\u2588',
        '\u2593',
        '\u2592',
        '\u2591',
        '\u2588',
        '\u2593',
        '\u2592',
        '\u2591',
        '\u2588',
        '\u2593',
        '\u2592',
        '\u2591',
        '\u003c',
        '\u003e',
        '\u002f'
    ],
    speed: 75
};

function scramble(el, options) {
    let opts = extend(defaults, options),
        init = el.textContent,
        map  = mapString(init, char => 1);
    setInterval(() => {
        el.textContent = obscure(init, map, opts.characters)
    }, opts.speed);
}

// Extend one object with another.
function extend(obj, ext) {
    for (let key in ext) {
        if (ext.hasOwnProperty(key)) {
            obj[key] = ext[key];
        }
    }
    return obj;
}

/**
* Map characters in a string to random characters from chars if the
* corresponding index in map is truthy.
*/
function obscure(str, map, chars) {
    return mapString(str, (char, index) => {
        return map[index] ?
            sample(chars) :
            char;
    });
}

function mapString(str, fn) {
    return str.split('').map(fn).join('');
}

// Get a random item from an array.
function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = scramble;
