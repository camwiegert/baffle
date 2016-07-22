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

    /**
    * Set options after instantiation. Restarts the interval if
    * currently running.
    */
    set(opts) {
        this.options = extend(this.options, opts);
        if (this.state.running) {
            clearInterval(this.interval);
            this.start();
        }
        return this;
    }

    /**
    * Start the scrambler. Calls each element's transform method
    * every this.options.speed milliseconds.
    */
    start() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            each(this.elements, el => el.transform(this.options.characters));
        }, this.options.speed);
        this.state.running = true;
        return this;
    }

    /**
    * Stop the scrambler. Clears the interval and calls each
    * element's reset method.
    */
    stop() {
        clearInterval(this.interval);
        each(this.elements, el => el.reset());
        this.state.running = false;
        return this;
    }

    /**
    * Set the text and get a new bitmap for each element to
    * be used in the next cycle. If the scrambler isn't
    * running, just reset each element to catch the new text.
    */
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

    /**
    * Start a new interval, decaying each bitmap enough each
    * cycle to reveal all elements within duration milliseconds.
    * Once all elements are revealed, call stop.
    */
    reveal(duration = 1500) {
        let cycles   = duration / this.options.speed;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            let elements = this.elements.filter(isObfuscated);
            if (!elements.length) return this.stop();
            each(elements, el => {
                let pace = Math.ceil(el.text.length / cycles);
                el.map = decayBitmap(el.map, pace);
                el.transform(this.options.characters);
            });
        }, this.options.speed);
        return this;
    }

}

/**
* Convert a DOM node to a more useful form for transformation.
* Store a reference to the original element add some shorthand.
*/
function toScramblerElement(el) {
    return {
        node: el,
        text: el.textContent,
        map: getInitBitmap(el.textContent),
        reset() {
            this.node.textContent = this.text;
            this.map = getInitBitmap(this.text);
        },
        transform(characters) {
            let next = obfuscate(this.text, this.map, characters);
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
function obfuscate(str, map, chars) {
    return mapString(str, (char, index) => {
        if (char === ' ') return char;
        return map[index] ?
            sample(chars) :
            char;
    });
}

/**
* Check if an element is obfuscated.
* { map: [0,1,0], ... } => false
*/
function isObfuscated(el) {
    let map  = el.map.every(bit => !bit),
    text = el.node.textContent === el.text;
    return !map || !text;
}

/**
* Export a factory function so we don't need 'new'. Simply call
* scrambler('.selector', [options])...
*/
export default function(selector, options) {
    return new Scrambler(selector, options);
};
