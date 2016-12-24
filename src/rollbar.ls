require! 'rollbar-browser': RollbarBrowser

rollbarConfig =
  accessToken: '1461f6b0ba8c4ed8bb5f246cae30196d'
  verbose: false
  captureUncaught: true
  captureUnhandledRejections: false
  payload:
    environment: 'production'
    client:
      javascript:
        source_map_enabled: true
        code_version: chrome.runtime.get-manifest!.version
        guess_uncaught_frames: true

module.exports = RollbarBrowser.init rollbarConfig
