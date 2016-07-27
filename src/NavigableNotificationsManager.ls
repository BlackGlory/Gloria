class NavigableNotificationsManager
  allowed-options = <[type iconUrl appIconMaskUrl title message contextMessage eventTime requireInteraction imageUrl items progress buttons isClickable priority]>
  ->
    @targets = {}

    chrome.notifications.on-closed.add-listener (id) ~>
      @remove-target id

    chrome.notifications.on-clicked.add-listener (id) ~>
      target = @targets[id]

      if target
        chrome.tabs.create { url: target }
      chrome.notifications.clear id, (was-cleared) ~>
        if was-cleared
          @remove-target id

  add-target: (id, url) ->
    @targets["#{id}"] = url

  remove-target: (id) ->
    delete @targets["#{id}"]

  add: (options) ->
    id <~ chrome.notifications.create do ~>
      result = {}

      for k, v of options
        if k in allowed-options and v?
          result[k] = v

      result

    if options.url
      @add-target id, options.url

module.exports = NavigableNotificationsManager
