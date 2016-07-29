import hljs from 'highlight.js';

hljs.initHighlightingOnLoad();

let gibberish = [
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
];

baffle('.header-headline', {
    characters: gibberish
}).start().reveal(1500, 2500);

baffle('.sectionHeader a')
    .start()
    .reveal(1500, 1500);
