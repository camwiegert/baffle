import {
    getTruthyIndices,
    mapString,
    extend,
    each,
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
    speed: 50
};

class Scrambler {

    constructor(selector, opts) {
        this.options  = extend(Object.create(defaults), opts);
        this.elements = [...document.querySelectorAll(selector)].map(toScramblerElement);
        this.state = {
            running: false
        };
    }

    set(opts) {
        this.options = extend(this.options, opts);
        if (this.state.running) {
            clearInterval(this.interval);
            this.start();
        }
        return this;
    }

    start() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            each(this.elements, el => el.transform(this.options.characters));
        }, this.options.speed);
        this.state.running = true;
        return this;
    }

    stop() {
        clearInterval(this.interval);
        each(this.elements, el => {
            el.reset();
            el.map = getInitBitmap(el.text);
        });
        this.state.running = false;
        return this;
    }

    text(str) {
        if (typeof str !== 'string') return this;
        this.elements.forEach(el => {
            el.text = str;
            el.map = getInitBitmap(str);
        });
        if (!this.state.running) {
            each(this.elements, el => el.reset());
        }
        return this;
    }

    reveal(duration = 1500) {
        let cycles = duration / this.options.speed, revealed = [];
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            each(this.elements, el => {
                if (revealed.indexOf(el) > -1) return false;
                let pace = Math.ceil(el.text.length / cycles);
                el.map = decayBitmap(el.map, pace);
                el.transform(this.options.characters);
                if (el.map.every(bit => !bit)) revealed.push(el);
            });
            if (revealed.length === this.elements.length) {
                return this.stop();
            }
        }, this.options.speed);
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
* Take a bitmap, leave 0s untouched and flip count 1s, randomly chosen.
* ([1,0,1], 1) => [1,0,0]
*/
function decayBitmap(bitmap, count) {
    let next = bitmap.slice();
    while (count--) {
        let on = getTruthyIndices(next);
        if (!on.length) return next;
        next[sample(on)] = 0;
    }
    return next;
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
