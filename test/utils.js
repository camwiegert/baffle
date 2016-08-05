import test from 'ava';
import stableFn from 'stable-fn';
import {
    mapString,
    each,
    sample,
    getTruthyIndices,
    extend
} from '../src/utils';

test('extend', t => {
    t.deepEqual(
        extend({}, { a: 'a' }),
        { a: 'a' }
    );

    t.deepEqual(
        extend({ a: 'a' }, { a: 'b' }),
        { a: 'b' }
    );

    t.deepEqual(
        extend({ a: 'a' }, { b: 'b' }),
        { a: 'a', b: 'b' }
    );

    t.deepEqual(
        extend({ a: 'a' }, {}),
        { a: 'a' }
    );
});

test('mapString', t => {
    t.true(mapString('', () => 'a') === '');
    t.true(mapString('test', () => '') === '');
});

test('each with an empty array', t => {
    let i = 0;

    const input = [];
    each(input, () => i++);
    t.true(i === 0);
});

test('each with an array', t => {
    let i = 0;

    const input = [''];
    each(input, () => i++);

    t.true(i === 1);
    t.deepEqual(input, ['']);
});

test('sample', t => {
    const arr = ['a', 'b', 'c', 'd', 'e'];

    t.false(stableFn(() => sample(arr)));

    for (let i = 0; i < 1000; i++) {
        t.is(typeof sample(arr), 'string');
    }
});

test('getTruthyIndices', t => {
    t.deepEqual(getTruthyIndices([]), []);

    const input = [
        1,        // truthy, 0
        2,        // truthy, 1
        false,    // falsy,  2
        true,     // truthy, 3
        'true',   // truthy, 4
        0,        // falsy,  5
        null,     // falsy,  6
        'a',      // falsy,  7
        '0',      // truthy, 8
        undefined // falsy,  9
    ];
    t.deepEqual(getTruthyIndices(input), [0, 1, 3, 4, 7, 8]);
});
