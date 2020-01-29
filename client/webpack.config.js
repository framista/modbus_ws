const path = require("path");

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "bundle.min.js",
        path: path.resolve(__dirname, "./dist/js")
    },
    watch: false,
    mode: "development",
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
}