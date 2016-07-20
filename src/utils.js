// Extend one object with another.
export function extend(obj, ext) {
    for (let key in ext) {
        if (ext.hasOwnProperty(key)) {
            obj[key] = ext[key];
        }
    }
    return obj;
}

// Transform each character in a string.
export function mapString(str, fn) {
    return str.split('').map(fn).join('');
}

// Return random boolean with probability.
export function maybe(prob = 0.5) {
    return Math.random() - prob < 0;
}

// Get a random item from an array.
export function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
