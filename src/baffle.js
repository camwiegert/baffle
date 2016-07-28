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

}

// Export a factory function so we don't need 'new'.
export default (elements, options) => new Baffle(elements, options);
