module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
  ],
  "overrides": [
    {
      "env": {
        "node": true,
      },
      "files": [
        ".eslintrc.{js,cjs}",
      ],
      "parserOptions": {
        "sourceType": "script",
      },
    },
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser",
    "sourceType": "module",
  },
  "plugins": [
    "@typescript-eslint",
    "vue",
  ],
  "rules": {
    "semi": [2, "always"], //语句强制分号结尾
    "comma-dangle": [1, "always-multiline"], //行模式必须带逗号，单行模式不能带逗号
    "indent": [2, 2], //缩进风格
    "space-before-function-paren": ["error", "always"], //函数定义时括号前面要不要有空格
    "arrow-spacing": ["error", { "before": true, "after": true }], //=>的前/后括号
    "@typescript-eslint/no-explicit-any": ["off"],
    "quotes": [2, "double"], //引号类型 `` "" ''
    "space-infix-ops": 2, //中缀操作符周围要不要有空格
    "comma-spacing": [2, { "before": false, "after": true }],
    "block-spacing": [2, "always"],
    "space-in-parens": [2, "never"],
    "keyword-spacing": [
      2,
      {
        before: true,
        after: true,
      },
    ],
  },
  "globals":{
    "Cesium":true,
  },
};
