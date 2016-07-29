module.exports = {
    context: __dirname + '/assets/js',
    entry: './main.js',
    output: {
        path: __dirname + '/assets/js',
        filename: 'main.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
};
