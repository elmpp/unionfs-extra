/**
 *  - husky docs - https://tinyurl.com/o3huzj2
 *  - supported hook names - https://tinyurl.com/sfmbsoe
 */
module.exports = {
  hooks: {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
