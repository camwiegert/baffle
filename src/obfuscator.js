import {
    getTruthyIndices,
    mapString,
    sample
} from './utils';

/**
* - Obfuscator -
*
* Provides a low-level interface to obfuscate and reveal
* a string based on its corresponding bitmap.
*
* ('hello', [0,1,0,1,0], '*') => '*e*l*o'
*
*/
class Obfuscator {

    constructor(str) {
        this.value = str;
        this.init();
    }

    /**
    * Set the bitmap to an array of 1s, with length equal to this.value.
    */
    init() {
        this.bitmap = this.value.split('').map(() => 1);
        return this;
    }

    /**
    * Create and return a string by mapping each character in
    * this.value to either one of the provided characters randomly
    * or to itself, depending on whether the corresponding bitmap
    * index is truthy.
    */
    render(characters = [], exclude = []) {

        // If no characters are provided, return the raw value.
        if (!characters.length) return this.value;
        return mapString(this.value, (char, index) => {

            // Skip any characters that are passed as exclude.
            if (exclude.indexOf(char) > -1) return char;

            /**
            * If corresponding bitmap index is truthy, return
            * a randomly chosen character from characters, else
            * return this character.
            */
            return this.bitmap[index] ?
                sample(characters) :
                char;
        });
    }

    /**
    * Set count of the truthy indices in this.bitmap to 0,
    * chosen randomly.
    */
    decay(count = 1) {
        while (count--) {
            let on = getTruthyIndices(this.bitmap);
            this.bitmap[sample(on)] = 0;
        }
        return this;
    }

    /**
    * Change this.value to a new string and reset this.bitmap
    * to match.
    */
    text(str = this.value) {
        this.value = str;
        this.init();
        return this;
    }

}

/**
* - ObfuscatorElement -
*
* Extends Obfuscator to be able to wrap a DOM element and
* update its textContent.
*
* (<p>Hi Mom!</p>).write('*~•+') => <p>•~ *+~•</p>
*
*/
class ObfuscatorElement extends Obfuscator {

    constructor(element) {
        super(element.textContent);
        this.element = element;
    }

    write(chars, exclude) {
        this.element.textContent = this.render(chars, exclude);
        return this;
    }

}

// Export a factory function so we don't need 'new'.
export default (element) => new ObfuscatorElement(element);
