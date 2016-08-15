# baffle.js
A tiny javascript library **for obfuscating and revealing text** in DOM elements.

[camwiegert.github.io/baffle](https://camwiegert.github.io/baffle)

> <img src="https://camwiegert.github.io/baffle/assets/images/baffle.js.png" width="500" alt="baffle.js">


- ~1.8kb gzipped :zap:
- Dependency-free :tada:
- IE9+ :heavy_check_mark:

```javascript
// Select elements and start.
let b = baffle('.someSelector').start();

// Do something else.
someAsyncFunction(result => {
    // Change the text and reveal over 1500ms.
    b.text(text => result.text).reveal(1500);
});
```

---

## Getting Started

#### Step 0: Install

[Download the latest release](https://raw.githubusercontent.com/camwiegert/baffle/master/dist/baffle.min.js) or install with npm.

```sh
npm install --save baffle
```

#### Step 1: Reference
If you linked baffle directly in your HTML, you can use `window.baffle`. If you're using a module bundler, you'll need to import baffle.

```javascript
// CommonJS
let baffle = require('baffle');

// ES6
import baffle from 'baffle';
```

#### Step 2: Initialize
To initialize baffle, all you need to do is call it with some elements. You can pass a NodeList, Node, or CSS selector.

```javascript
// With a selector.
let b = baffle('.baffle');

// With a NodeList
let b = baffle(document.querySelectorAll('.baffle'));

// With a Node
let b = baffle(document.querySelector('.baffle'));
```

#### Step 3: Use It
Once you have a baffle instance, you have access to all of the baffle methods. Usually, you'll want to `b.start()` and, eventually, `b.reveal()`.

```javascript
// Start obfuscating...
b.start();

// Or stop obfuscating...
b.stop();

// Obfuscate once...
b.once();

// You can set options after initializing...
b.set({...options});

// Or change the text at any time...
b.text(text => 'Hi Mom!');

// Eventually, you'll want to reveal your text...
b.reveal(1000);

// And they're all chainable...
b.start()
    .set({ speed: 100 })
    .text(text => 'Hi dad!')
    .reveal(1000);
```

## Options
You can set options on baffle during initialization or anytime afterward with `baffle.set()`.

```javascript
// During initialize
baffle('.baffle', {
    characters: '+#-•=~*',
    speed: 75
});

// Any time with set()
b.set({
    characters: '¯\_(ツ)_/¯',
    speed: 25
});
```

> ### `options.characters`
> The characters baffle uses to obfuscate your text. It can be a string or an array of characters.
>
> **Default:** `'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz~!@#$%^&*()-+=[]{}|;:,./<>?'`

> ### `options.exclude`
> These are the characters that baffle ignores in your text when obfuscating it. You can pass in an array of characters.
>
> **Default:** `[' ']`

> ### `options.speed`
> This is the frequency (in milliseconds) at which baffle updates your text when running.
>
> **Default:** `50`

## Methods
An instance of baffle has six methods, all of which are chainable.

> ###`baffle.once()`
> Obfuscates each element once, using `options.characters`.

> ###`baffle.start()`
> Starts obfuscating your elements, updating every `options.speed` milliseconds.

> ###`baffle.stop()`
> Stops obfuscating your elements. This won't reveal your text. It will only stop updating it. To reveal it, use `reveal()`.

> ###`baffle.reveal([duration], [delay])`
> Reveals your text over `duration` milliseconds (default: `0`), with the option to delay by `delay` milliseconds.

> ###`baffle.set([options])`
> Updates instance options using the passed `options` object. You can set any number of keys, even while running.

> ###`baffle.text(fn)`
> Updates the text in each element of your instance using function `fn`, which receives the current text as it's only parameter. The value returned from `fn` will be used as the new text.

---

- **License** MIT
- **Made by** [Cam Wiegert](http://camwiegert.com)
- **Inspired by** [Oak](http://oak.is/)
