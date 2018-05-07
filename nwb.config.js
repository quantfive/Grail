module.exports = {
  npm: {
    esModules: true,
    umd: {
      global: 'grail',
      externals: {
        react: 'React'
      }
    }
  }
}
