import {
    getTruthyIndices,
    sample
} from './utils'

let isOdd = require('is-odd');

class RevealStrategyFromLeft {

    decay(count = 1, bitmap) {
        while (count--) {
            let on = getTruthyIndices(bitmap);
            bitmap[on[0]] = 0;
        }
    }
}

class RevealStrategyFromRight {

    decay(count = 1, bitmap) {
        while (count--) {
            let on = getTruthyIndices(bitmap);
            bitmap[on[on.length - 1]] = 0;
        }
    }
}

class RevealStrategyFromInside {

    decay(count = 1, bitmap) {
        while (count--) {
            let on = getTruthyIndices(bitmap);
            let middle = Math.floor(on.length / 2);
            bitmap[on[middle]] = 0;
        }
    }
}

class RevealStrategyFromOutside {

    decay(count = 1, bitmap) {
        while (count--) {
            let on = getTruthyIndices(bitmap);
            bitmap[on[isOdd(on.length) ? on.length - 1 : 0]] = 0;
        }
    }
}

class RevealStrategyFromRandom {

    decay(count = 1, bitmap) {
        while (count--) {
            let on = getTruthyIndices(bitmap);
            bitmap[sample(on)] = 0;
        }
    }
}

export function initRevealStrategy(revealFrom) {
    switch (revealFrom) {
        case 'left':
            return new RevealStrategyFromLeft();
        case 'right':
            return new RevealStrategyFromRight();
        case 'inside':
            return new RevealStrategyFromInside();
        case 'outside':
            return new RevealStrategyFromOutside();
        case 'random':
            return new RevealStrategyFromRandom();
        default:
            throw new Error(
                `Unknown value for 'reveal.from' option: ${revealFrom}.\n` +
                `Please provide one of the following values: 'left' | 'right' | 'inside' | 'outside' | 'random'.\n` +
                `In case no value is specified, 'random' will be used.`);
    }
}
