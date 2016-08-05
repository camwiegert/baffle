import test from 'ava';
import obfuscator from '../src/obfuscator';

test('Obfuscator', t => {
    const element = { textContent: 'test' };
    const instance = obfuscator(element);

    t.true(instance.element === element);
    t.true(instance.value === 'test');
    t.deepEqual(instance.bitmap, [1, 1, 1, 1]);
});

test('Obfuscator text()', t => {
    const element = { textContent: 'test' };
    const instance = obfuscator(element);

    instance.text('set');

    t.true(instance.element === element);
    t.true(instance.value === 'set');
    t.deepEqual(instance.bitmap, [1, 1, 1]);
});

test('Obfuscator init()', t => {
    const element = { textContent: 'test' };
    const instance = obfuscator(element);

    const newValue = 'changed';
    instance.value = newValue;
    instance.init();

    t.true(instance.element === element);
    t.true(instance.value === newValue);
    t.true(instance.bitmap.length === newValue.length);
});

test('Obfuscator decay()', t => {
    const element = { textContent: 't' };
    const instance = obfuscator(element);

    t.true(instance.value === 't');
    t.deepEqual(instance.bitmap, [1]);

    instance.decay();

    t.true(instance.value === 't');
    t.deepEqual(instance.bitmap, [0]);
});

test('Obfuscator render()', t => {
    const tElement = { textContent: 't' };
    const wordsElement = { textContent: 'word word' };

    t.true(obfuscator(tElement).render('a') === 'a');
    t.true(obfuscator(tElement).render('a', 't') === 't');
    t.true(obfuscator(wordsElement).render('a') === 'aaaa aaaa');
    t.true(obfuscator(wordsElement).render('a', '') === 'aaaaaaaaa');
});
