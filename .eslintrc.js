module.exports = {
  "root": true,
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": "tsconfig.json",
        "createDefaultProgram": true,
        "tsconfigRootDir": __dirname,
        "sourceType": "module",
      },
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:prettier/recommended"
      ],
      "rules": {
        "prettier/prettier": [
          "error",
          {
              "bracketSpacing": true,
              "printWidth": 140,
              "semi": true,
              "singleQuote": true,
              "trailingComma": "all",
              "arrowParens": "always",
              "endOfLine": "auto"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ],
        "lines-between-class-members": [
            "error",
            "always",
            {"exceptAfterSingleLine": true}
        ],
        // turn off core rules
        "no-shadow": "off",
        "no-unused-vars": "off",
        "camelcase": "off",
        "class-methods-use-this": "off",
        "no-process-exit": "off",
        // turn on typescript rules
        "@typescript-eslint/no-shadow": ["error"],
        "@typescript-eslint/no-unused-vars": ["error"],
        "import/prefer-default-export": "off"
      }
    },
    {
      "files": [
        "*.html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended"
      ],
      "rules": {}
    }
  ]
}
