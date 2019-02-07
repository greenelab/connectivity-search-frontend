const webpack = require("webpack");
const path = require("path");

module.exports = {
    mode: "none",
    watch: true,
    entry: path.join(__dirname, "src", "index.js"),
    output: {
        path: path.join(__dirname, "build"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/react"]
                        }
                    }
                ],
                include: path.resolve(__dirname, "./src")
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ],
                include: [path.resolve(__dirname, "./src")]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]"
                        }
                    }
                ],
                include: [path.resolve(__dirname, "./src")]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })"
        })
    ]
};
