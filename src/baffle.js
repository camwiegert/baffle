import {
    each,
    extend,
    getElements
} from './utils';

import Obfuscator from './obfuscator';

const defaults = {
    characters: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz~!@#$%^&*()-+=[]{}|;:,./<>?',
    exclude: [' '],
    speed: 50
};

/**
* - Baffle -
*
* Provides an interface to one or many instances of
* the Obfuscator class. This is the public-facing class.
*
* baffle(<elements>, [options]);
*
*/

class Baffle {

    constructor(elements, options) {
        this.options  = extend(Object.create(defaults), options);
        this.elements = getElements(elements).map(Obfuscator);
        this.running  = false;
    }

    /**
    * Call the write method on each Obfuscator once, using
    * the provided characters.
    */
    once() {
        each(this.elements, el => el.write(this.options.characters, this.options.exclude));
        this.running = true;
        return this;
    }

    /**
    * Run once() every options.speed milliseconds.
    */
    start() {
        clearInterval(this.interval);
        each(this.elements, el => el.init());
        this.interval = setInterval(() => this.once(), this.options.speed);
        this.running = true;
        return this;
    }

    /**
    * Stop any running interval.
    */
    stop() {
        clearInterval(this.interval);
        this.running = false;
        return this;
    }

    /**
    * Set any options provided in the opts object. If
    * currently running, restart.
    */
    set(opts) {
        extend(this.options, opts);
        if (this.running) this.start();
        return this;
    }

    /**
    * Set the text in each element with the return value
    * of function fn, which receives the current text as
    * its only argument.
    */
    text(fn) {
        each(this.elements, el => {
            el.text(fn(el.value));
            if (!this.running) el.write();
        });
        return this;
    }

    /**
    * Start a new interval, obfuscating fewer characters
    * on each cycle at pace to finish within duration
    * milliseconds. Optionally, delay by delay millseconds.
    *
    * Once all elements are revealed, call stop() and
    * initialize each element.
    */
    reveal(duration = 0, delay = 0) {
        // Number of cycles in duration
        let cycles = duration / this.options.speed || 1;

        const run = () => {
            clearInterval(this.interval);
            this.running = true;
            this.interval = setInterval(() => {

                // Get elements that haven't been fully revealed
                let elements = this.elements.filter(el =>
                    !el.bitmap.every(bit => !bit));

                // Decay each by pace and write
                each(elements, el => {
                    let pace = Math.ceil(el.value.length / cycles);
                    el.decay(pace).write(this.options.characters, this.options.exclude);
                });

                // If all elements are revealed, stop and init
                if (!elements.length) {
                    this.stop();
                    each(this.elements, el => el.init());
                }

            }, this.options.speed);
        };

        setTimeout(run, delay);
        return this;
    }

}

// Export a factory function so we don't need 'new'.
export default (elements, options) => new Baffle(elements, options);
