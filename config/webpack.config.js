//webpack.config.js
const path = require("path");
const pkg = require("../package");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");

const externals = ["firebase-admin", "lodash"];

const genPackage = () => ({
  name: "test",
  dependencies: externals.reduce(
    (acc, name) =>
      Object.assign({}, acc, {
        [name]: pkg.dependencies[name] || pkg.devDependencies[name],
      }),
    {}
  ),
});

module.exports = {
  target: "node",
  resolve: {
    mainFields: ["module", "main"],
  },
  externals: externals.reduce(
    (acc, name) => Object.assign({}, acc, { [name]: true }),
    {}
  ),
  plugins: [new GenerateJsonPlugin("package.json", genPackage())],
  mode: "development",
  optimization: { minimize: false },
};
