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

class Scrambler {

    constructor(selector, opts) {
        this.options  = extend(Object.create(defaults), opts);
        this.elements = [...document.querySelectorAll(selector)].map(toScramblerElement);
        this.state = {
            running: false
        };
    }

    start() {
        this.interval = setInterval(() => {
            this.elements.forEach(el => el.transform(this.options.characters));
        }, this.options.speed);
        this.state.running = true;
        return this;
    }

    stop() {
        clearInterval(this.interval);
        this.elements.forEach(el => el.reset());
        this.state.running = false;
        return this;
    }

    text(str) {
        this.elements.forEach(el => {
            el.text = str;
            el.map = getInitBitmap(str);
        });
        if (!this.state.running) {
            this.elements.forEach(el => el.reset());
        }
        return this;
    }

}

/**
* Convert a DOM node to a more useful form for transformation.
*/
function toScramblerElement(el) {
    return {
        node: el,
        text: el.textContent,
        map: getInitBitmap(el.textContent),
        reset() {
            this.node.textContent = this.text;
        },
        transform(characters) {
            let next = obscure(this.text, this.map, characters);
            this.node.textContent = next;
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

export default function(selector, options) {
    return new Scrambler(selector, options);
};
