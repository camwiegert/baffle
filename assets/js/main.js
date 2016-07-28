(function(){

    var gibberish = [
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

    baffle('.headline', {
        characters: gibberish
    }).start().reveal(1500, 3000);

    var demoHolder = document.querySelector('.demo-holder'),
        demo       = baffle(document.querySelector('.demo'));

    demoHolder.addEventListener('click', function() {
        demo.start().reveal(1000, 1000);
    });

})();
