const path = require('path')

module.exports = {
    entry: './src/gameinput.js',
    output: {
        library: {
            type: 'module'
        },
        filename: 'gameinput.js',
        path: path.resolve(__dirname, 'dist')
    },
    experiments: {
        outputModule: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
}
