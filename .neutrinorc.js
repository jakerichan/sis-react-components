const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
  use: [
    '@neutrinojs/standardjs',
    ['@neutrinojs/react-components', {
      babel: {
        plugins: [
          ['babel-plugin-root-import', [{
            'rootPathSuffix': 'src/components'
          }]]
        ]
      }
    }],
    (neutrino) => {
      // remove unused filetypes
      neutrino.config.resolve.extensions.delete('.jsx')
      neutrino.config.resolve.extensions.delete('.ts')
      neutrino.config.resolve.extensions.delete('.vue')
      neutrino.config.resolve.extensions.delete('.tsx')
      neutrino.config.resolve.extensions.delete('.mjs')
    },
    (neutrino) => {
      neutrino.config.resolve
        .modules
        .add(neutrino.options.source)
    },
    ['@neutrinojs/style-loader', {
      extract: {
        plugin: {
          filename: 'styles/[name].css'
        }
      },
      loaders: [
        {
          loader: 'postcss-loader',
          useId: 'postcss',
          options: {
            plugins: [
              require('postcss-mixins'),
              require('autoprefixer'),
              require('precss'),
              postcssPresetEnv({
                stage: 2
              })
            ]
          }
        }
      ]
    }],
    ['@neutrinojs/jest', {
      setupTestFrameworkScriptFile: '<rootDir>/jest/test-setup.js',
      setupFiles: [
        '<rootDir>/jest/raf-polyfill.js'
      ]
    }],
  ]
}
