require! 'rollbar-browser': RollbarBrowser

rollbarConfig =
  accessToken: '1461f6b0ba8c4ed8bb5f246cae30196d'
  captureUncaught: true
  payload:
    environment: 'test'

module.exports = RollbarBrowser.init rollbarConfig
