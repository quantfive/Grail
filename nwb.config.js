module.exports = {
  type: 'react-component',
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
