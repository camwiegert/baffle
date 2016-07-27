# baffle.js

> <img src="https://camwiegert.github.io/baffle/assets/images/baffle.js.png" width="500"/>

baffle is a tiny (~1.6kb) javascript utility **for obfuscating and revealing text** in DOM elements.

```javascript
// Basic usage
let b = baffle('.someSelector').start();
someAsyncFunction(result => {
    b.text(result.text).reveal();
});
```

## Getting Started

#### Step 0: Install

[Download the latest release](https://raw.githubusercontent.com/camwiegert/baffle/master/dist/baffle.min.js) or install with npm.

```sh
npm install --save baffle
```

#### Step 1: Reference

If you linked baffle directly in your HTML, you'll find baffle at `window.baffle`. If you're using a module bundler, you'll need to import baffle.

```javascript
// CommonJS
let baffle = require('baffle');

// ES6
import baffle from 'baffle';
```

#### Step 2: Initialize

To initialize baffle, all you need to do is call it with a selector. You'll want to keep a reference to the instance.

```javascript
// Attaches baffle to any DOM element with class 'baffle'.
let b = baffle('.baffle');
```

#### Step 3: Use It

Once you have a baffle instance, you have access to all of the baffle methods. Usually, you'll want to `b.start()` and, eventually, `b.reveal()`.

```javascript
// Start obfuscating...
b.start();

// Or stop obfuscating...
b.stop();

// You can set options after intializing...
b.set({...options});

// Or change the text at any time...
b.text('Hi mom!');

// Eventually, you'll want to reveal your text...
b.reveal();

// And they're all chainable...
b.stop()
    .start()
    .set({ speed: 100 })
    .text('Hi dad!')
    .reveal();
```
