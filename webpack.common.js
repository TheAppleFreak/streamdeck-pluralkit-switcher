const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        main: path.join(__dirname, "src", "ts", "index.ts"),
        switchChoosePi: path.join(__dirname, "src", "ts", "switchChoose", "pi.ts"),
        switchDirectPi: path.join(__dirname, "src", "ts", "switchDirect", "pi.ts")
    },
    output: {
        path: path.join(__dirname, "me.theapplefreak.pkswitch.sdPlugin"),
        filename: "[name].[contenthash].js",
        assetModuleFilename: "[name].[contenthash][ext]"
    },
    module: {
        rules: [
            // Source code
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ["ts-loader"]
            },
            // Images
            {
                test: /\.(?:ico|gif|png|jpe?g|svg)$/i,
                type: "asset/resource"
            },
            // Styles
            {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", {loader: MiniCssExtractPlugin.loader, options: {esModule: false}}, "css-loader", "sass-loader"]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".json", ".css", ".scss"]
    },
    plugins: [
        new NodePolyfillPlugin({
            excludeAliases: ["console"]
        }),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(__dirname, "src", "static"), to: "." },
                { from: path.join(__dirname, "src", "i18n", "sd"), to: "." }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/html/main.html"),
            filename: "main.html",
            inject: "body",
            chunks: ["main"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/html/switchChoosePi.html"),
            filename: "switchChoosePi.html",
            inject: "body",
            chunks: ["switchChoosePi"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/html/switchDirectPi.html"),
            filename: "switchDirectPi.html",
            inject: "body",
            chunks: ["switchDirectPi"]
        })
    ]
}