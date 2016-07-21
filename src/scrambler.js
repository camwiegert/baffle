import {
    mapString,
    extend,
    maybe,
    sample
} from './utils';

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

function scrambler(el, options) {
    let opts = extend(defaults, options),
        text = el.textContent,
        map  = getInitBitmap(text, opts.chance);

    const run = () => el.textContent = obscure(text, map, opts.characters);
    let interval = setInterval(run, opts.speed);

    return {
        start() {
            clearInterval(interval);
            interval = setInterval(run, opts.speed);
            return this;
        },
        stop() {
            clearInterval(interval);
            el.textContent = text;
            return this;
        },
        text(str) {
            map = getInitBitmap(str, opts.chance);
            text = str;
            return this;
        },
        reveal(prob) {
            clearInterval(interval);
            interval = setInterval(() => {
                map = decayBitmap(map, prob);
                run();
                if (map.every(bit => bit === 0)) {
                    clearInterval(interval);
                    map = getInitBitmap(text, opts.chance);
                }
            }, opts.speed);
            return this;
        }
    };
}

/**
* Take a string and return an array where the corresponding index
* is either 0 or 1.
* 'hello' => [1,1,1,1,1]
*/
function getInitBitmap(str, prob = 1) {
    return str
        .split('')
        .map(() => maybe(prob) ? 1 : 0);
}

/**
* Take a bitmap, leave 0s untouched and flips 1s with prob chance.
* [1,0,1] => [0,0,1]
*/
function decayBitmap(bitmap, prob = 0.15) {
    return bitmap.map(bit => {
        if (!bit) return bit;
        return maybe(prob) ? 0 : 1;
    });
}

/**
* Map characters in a string to random characters from chars if the
* corresponding index in map is truthy.
* ('hello', [1,0,1,0,1], ['*']) => '*e*l*'
*/
function obscure(str, map, chars) {
    return mapString(str, (char, index) => {
        if (char === ' ') return char;
        return map[index] ?
            sample(chars) :
            char;
    });
}

export default scrambler;
