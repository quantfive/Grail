module.exports = {
  npm: {
    esModules: true,
    umd: {
      global: 'grail',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    config(config) {
      // config.target = 'node'
      // config.node = { fs: 'empty', child_process: 'empty' }
      // config.target = 'web'
      return config
    }
  }
}