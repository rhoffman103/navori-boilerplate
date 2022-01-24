const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

const config = {
  mode: "development",
  entry: {
    index: {
      import: ["./src/js/index.js", "./src/styles/index.css"]
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "src", "index.html")
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: { transpileOnly: true }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: "single",
    moduleIds: "deterministic",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    // minimize: true,
  },
};

if (!isProd) {
  config.devtool = "inline-source-map"
}

module.exports = config;