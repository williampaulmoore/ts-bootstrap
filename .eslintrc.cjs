/** @type {import("eslint").Linter.Config} */
const config = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    plugins: [
        "@typescript-eslint"
    ]
}

module.exports = config;

