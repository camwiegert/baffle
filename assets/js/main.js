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

let demoOnce   = document.querySelector('.js-demo-once');
let demoStart  = document.querySelector('.js-demo-start');
let demoStop   = document.querySelector('.js-demo-stop');
let demoReveal = document.querySelector('.js-demo-reveal');
let demoText   = document.querySelector('.js-demo-text');
let demo       = baffle('.js-demo', { characters: gibberish });

demoOnce.addEventListener('click', function(e) {
    e.preventDefault();
    demo.once();
});

demoStart.addEventListener('click', function(e) {
    e.preventDefault();
    demo.start();
});

demoStop.addEventListener('click', function(e) {
    e.preventDefault();
    demo.stop();
});

demoReveal.addEventListener('click', function(e) {
    e.preventDefault();
    demo.reveal(1000);
});

demoText.addEventListener('click', function(e) {
    e.preventDefault();
    demo.text(text => text.split('').reverse().join(''));
});
