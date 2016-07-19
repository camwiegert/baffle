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
    speed: 50,
    chance: 1
};

function scramble(el, options) {
    let opts = extend(defaults, options),
        init = el.textContent,
        map  = getInitBitmap(init, opts.chance),
        interval;

    const run = () => el.textContent = obscure(init, map, opts.characters);

    return {
        start() {
            clearInterval(interval);
            interval = setInterval(run, opts.speed);
            return this;
        },
        stop() {
            clearInterval(interval);
            el.textContent = init;
            return this;
        }
    };
}

/**
* Take a string and return an array where the corresponding index
* is either 0 or 1.
*/
function getInitBitmap(str, prob) {
    return str
        .split('')
        .map(() => maybe(prob) ? 1 : 0);
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

// Extend one object with another.
function extend(obj, ext) {
    for (let key in ext) {
        if (ext.hasOwnProperty(key)) {
            obj[key] = ext[key];
        }
    }
    return obj;
}

// Transform each character in a string.
function mapString(str, fn) {
    return str.split('').map(fn).join('');
}

// Return random boolean with probability.
function maybe(prob = 0.5) {
    return Math.random() - prob < 0;
}

// Get a random item from an array.
function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = scramble;
