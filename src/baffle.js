import Obfuscator from './obfuscator';

import {
    each,
    extend,
    getElements
} from './utils';

const defaults = {
    characters: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz~!@#$%^&*()-+=[]{}|;:,./<>?'.split(''),
    speed: 50
};

class Baffle {

    constructor(elements, options) {
        this.options  = extend(Object.create(defaults), options);
        this.elements = getElements(elements).map(Obfuscator);
        this.running  = false;
    }

    once() {
        each(this.elements, el => el.write(this.options.characters));
        return this;
    }

    start() {
        clearInterval(this.interval);
        this.interval = setInterval(() => this.once(), this.options.speed);
        this.running = true;
        return this;
    }

    stop() {
        clearInterval(this.interval);
        this.running = false;
        return this;
    }

    set(opts) {
        extend(this.options, opts);
        if (this.running) this.start();
        return this;
    }

    text(fn) {
        each(this.elements, el => {
            el.text(fn(el.value));
        });
        return this;
    }

    reveal(duration = 0, delay = 0) {
        // Number of cycles in duration
        let cycles = duration / this.options.speed || 1;

        const run = () => {
            clearInterval(this.interval);
            this.interval = setInterval(() => {

                // Get elements that haven't been fully revealed
                let elements = this.elements.filter(el =>
                    !el.bitmap.every(bit => !bit));

                // Decay each by pace and write
                each(elements, el => {
                    let pace = Math.ceil(el.value.length / cycles);
                    el.decay(pace).write(this.options.characters);
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
