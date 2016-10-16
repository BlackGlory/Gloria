class NavigableNotificationsManager
  allowed-options = <[type iconUrl appIconMaskUrl title message contextMessage eventTime requireInteraction imageUrl items progress buttons isClickable priority]>

  ->
    @targets = {}

    chrome.notifications.on-closed.add-listener (id) ~>
      @remove-target id

    chrome.notifications.on-clicked.add-listener (id) !~>
      target = @targets[id]

      if target
        try
          target = (new URL target).href
        catch error
          console.error error
        finally
          chrome.tabs.query url: target.replace(/^https?/, '*'), (tabs) ->
            if not chrome.runtime.lastError and tabs[0]
              chrome.tabs.highlight window-id: tabs[0].windowId, tabs: tabs[0].index
            else
              chrome.windows.getCurrent windowTypes: ['normal'], (window) ->
                if not chrome.runtime.lastError and window
                  chrome.tabs.create url: target
                else
                  chrome.windows.create (window) ->
                    chrome.tabs.create url: target, windowId: window.id

      chrome.notifications.clear id, (was-cleared) ~>
        console.error chrome.runtime.lastError if chrome.runtime.lastError
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

    console.error chrome.runtime.lastError if chrome.runtime.lastError

    if options.url
      @add-target id, options.url

module.exports = NavigableNotificationsManager
