var path = require('path'),
    _ = require('lodash'),
    webpack = require('webpack'),
    argv = require('minimist')(process.argv.slice(2));

var DEBUG = !argv.release,
    AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
        '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
        '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}',
    GLOBALS = {
        'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
        '__DEV__': DEBUG
    };

var config = {
    output: {
        path: './build/',
        publicPath: './',
        sourcePrefix: '  '
    },

    cache: DEBUG,
    debug: DEBUG,
    devtool: DEBUG ? '#inline-source-map' : false,

    stats: {
        colors: true,
        reasons: DEBUG
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin()
    ],

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER +
                '!less-loader'
            },
            {
                test: /\.gif/,
                loader: 'url-loader?limit=10000&mimetype=image/gif'
            },
            {
                test: /\.jpg/,
                loader: 'url-loader?limit=10000&mimetype=image/jpg'
            },
            {
                test: /\.png/,
                loader: 'url-loader?limit=10000&mimetype=image/png'
            },
            {
                test: /\.svg/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};

var appConfig = _.merge({}, config, {
    entry: './src/app.jsx',
    output: {
        filename: 'app.js'
    },
    plugins: config.plugins.concat([
            new webpack.DefinePlugin(_.merge(GLOBALS, {'__SERVER__': false}))
        ].concat(DEBUG ? [] : [
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.AggressiveMergingPlugin()
            ])
    )
});

module.exports = [appConfig];