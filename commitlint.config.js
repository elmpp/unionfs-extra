/**
 *  - commitlint docs - https://tinyurl.com/rswqs7q
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['wip', 'test', 'feat', 'fix', 'chore', 'docs', 'refactor', 'style', 'ci', 'perf']],
  },
}
