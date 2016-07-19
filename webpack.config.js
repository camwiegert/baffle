const webpack = require('webpack'),
      package = require('./package');

const banner = `Scrambler.js ${package.version} - ${package.description}\nCopyright (c) ${ new Date().getFullYear() } ${package.author} - ${package.homepage}\nLicense: ${package.license}`;

module.exports = {
    context: __dirname + '/src',
    entry: './index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'scrambler.min.js',
        'library': 'scrambler',
        'libraryTarget': 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};
