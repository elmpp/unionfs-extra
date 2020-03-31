const commonRules = {
  singleQuote: true,
  bracketSpacing: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
}

module.exports = {
  printWidth: 120,
  overrides: [
    {
      files: ['*.js', '*.js.hbs'],
      options: {
        ...commonRules,
        parser: 'babel',
      },
    },
    {
      files: ['*.ts', '*.tsx', '*.ts.hbs', '*.tsx.hbs'],
      options: {
        ...commonRules,
        parser: 'typescript',
      },
    },
  ],
}
