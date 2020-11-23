const path = require('path');

module.exports = {
    mode: 'production', // "production" | "development" | "none"
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    entry: './handler.js', // string | object | array
    // defaults to ./src
    // Here the application starts executing
    // and webpack starts bundling
    output: {
        // options related to how webpack emits results
        path: path.resolve(__dirname, 'dist'), // string (default)
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: 'handler.js', // string (default)
        libraryTarget: 'commonjs'
    },
    target: 'node'
};
