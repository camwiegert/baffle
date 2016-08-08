import test from 'ava';
import baffle from '../src/baffle';

test.beforeEach('clean up DOM tree', () => {
  document.body.innerHTML = '';
})

test('throws when initialized empty', t => {
  t.throws(() => baffle(), `Cannot read property 'nodeType' of undefined`);
});

test('initializes with dom node', t => {
  const el = document.createElement('p');
  el.textContent = "Test";
  document.body.appendChild(el);

  const instance = baffle(el);
  t.true(instance.elements.length === 1);
  t.true(instance.running === false)
});

test('initializes with dom nodes', t => {
  const p1 = document.createElement('p');
  p1.textContent = "Test 2";
  const p2 = document.createElement('p');
  p2.textContent = "Test 2";

  document.body.appendChild(p1);
  document.body.appendChild(p2);

  const list = document.querySelectorAll('p');

  const instance = baffle(list);

  t.true(instance.elements.length === 2);
  t.true(instance.running === false)
});

test('initializes with a string', t => {
  const el = document.createElement('p');
  el.textContent = "Test";
  el.classList.add("text");
  document.body.appendChild(el);

  const instance = baffle('.text');
  t.true(instance.elements.length === 1);
  t.true(instance.running === false);
});

test('initializes with options', t => {
  const el = document.createElement('p');
  el.textContent = "Test";
  el.classList.add("text");
  document.body.appendChild(el);

  const instance = baffle('.text', {
    characters: 'abc',
    speed: 100,
  });
  t.true(instance.options.characters === 'abc');
  t.true(instance.options.speed === 100);
});

test('initializes with invalid options', t => {
  const el = document.createElement('p');
  el.textContent = "Test";
  el.classList.add("text");
  document.body.appendChild(el);

  const instance = baffle('.text', {
    characters: ['abc', 'test'],
    speed: -100,
  });
  t.deepEqual(instance.options.characters, ['abc', 'test']);
  t.true(instance.options.speed === -100);
});

test('once()', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.once();
  t.true(instance.running === true);
  t.true(el.textContent !== 'Test');
});

test('once() can be chained', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el).once();
  t.true(instance.running === true);
  t.true(el.textContent !== 'Test');
});

test('stop() without previous start()', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.stop();
  t.true(instance.running === false);
  t.true(el.textContent === 'Test');
});

test('stop() can be chained', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el).stop();
  t.true(instance.running === false);
  t.true(el.textContent === 'Test');
});

test('stop() after once() doesn\'t reveal', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.once();
  t.true(instance.running === true);
  t.true(el.textContent !== 'Test');

  instance.stop();
  t.true(instance.running === false);
  t.true(el.textContent !== 'Test');
});

test('stop() after once() doesn\'t reveal', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.once();
  t.true(instance.running === true);
  t.true(el.textContent !== 'Test');

  instance.stop();
  t.true(instance.running === false);
  t.true(el.textContent !== 'Test');
});

test('text() with fn returning string', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.text(text => `${text}!`);
  t.true(el.textContent === 'Test!');
  t.true(instance.running === false);
});

test('text() fails with fn returning object', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  t.throws(() => instance.text({}), 'fn is not a function');
});

test('set() with proper ', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.set({
    characters: 'abc',
    speed: 5,
  })

  t.true(instance.options.characters === 'abc');
  t.true(instance.options.speed === 5);
});

test('set() doesn\'t fail with wrong options', t => {
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.set({
    characters: ['abc', 'cde'],
    speed: -10,
  })

  t.deepEqual(instance.options.characters, ['abc', 'cde']);
  t.true(instance.options.speed === -10);
});

test.cb('start() doesn\'t start immediatly, but after a timeout', t => {
  t.plan(4);
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.start();

  t.true(el.textContent === 'Test');
  t.true(instance.running === true);

  return setTimeout(() => {
    t.true(el.textContent !== 'Test');
    t.true(instance.running === true);
    t.end();
  }, 200);
});

test.cb('reveal() reveals after a cycle', t => {
  t.plan(4);
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.start()
  instance.reveal();

  t.true(el.textContent === 'Test');
  t.true(instance.running === true);

  return setTimeout(() => {
    t.true(el.textContent === 'Test');
    t.true(instance.running === true);
    t.end();
  }, 10);
});

test.cb('reveal(50) reveals after a cycle', t => {
  t.plan(4);
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);
  instance.start()
  instance.reveal(50);

  t.true(el.textContent === 'Test');
  t.true(instance.running === true);

  return setTimeout(() => {
    t.true(el.textContent === 'Test');
    t.true(instance.running === true);
    t.end();
  }, 50);
});

test.cb('reveal(0, 100) reveals after 200ms', t => {
  t.plan(4);
  const el = document.createElement('p');
  el.textContent = "Test";

  const instance = baffle(el);

  instance.start()
  instance.reveal(0, 100);

  t.true(el.textContent === 'Test');
  t.true(instance.running === true);

  return setTimeout(() => {
    t.true(el.textContent === 'Test');
    t.true(instance.running === true);
    t.end();
  }, 200);
});
