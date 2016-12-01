require! 'prelude-ls': { fold, first, map, filter }
require! 'parse-favicon': parse-favicon

const NOTIFICATION_ICON_WIDTH = 80px
const NOTIFICATION_ICON_HEIGHT = 80px
const NOTIFICATION_ICON_RATIO = NOTIFICATION_ICON_WIDTH / NOTIFICATION_ICON_HEIGHT

const NOTIFICATION_IMAGE_WIDTH = 360px
const NOTIFICATION_IMAGE_HEIGHT = 240px
const NOTIFICATION_IMAGE_RATIO = NOTIFICATION_IMAGE_WIDTH / NOTIFICATION_IMAGE_HEIGHT

function load-image url
  new Promise (resolve, reject) ->
    try
      img = new Image

      img.add-event-listener 'load', ->
        resolve img

      img.add-event-listener 'error', reject

      img.src = url
    catch err
      reject err

function create-canvas width, height
  canvas = document.create-element 'canvas'
  canvas.width = width
  canvas.height = height
  return canvas

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
            if not chrome.runtime.last-error and tabs[0]
              chrome.tabs.highlight window-id: tabs[0].window-id, tabs: tabs[0].index
            else
              chrome.windows.get-current window-types: ['normal'], (window) ->
                if not chrome.runtime.last-error and window
                  chrome.tabs.create url: target
                else
                  chrome.windows.create (window) ->
                    chrome.tabs.create url: target, window-id: window.id

      chrome.notifications.clear id, (was-cleared) ~>
        console.error chrome.runtime.last-error if chrome.runtime.last-error
        if was-cleared
          @remove-target id

  add-target: (id, url) ->
    @targets["#{id}"] = url

  remove-target: (id) ->
    delete @targets["#{id}"]

  add: (options) ->
    ~function create-notification options
      id <~ chrome.notifications.create do ~>
        result = {}
        for k, v of options
          if k in allowed-options and v?
            result[k] = v
        result
      console.error chrome.runtime.last-error if chrome.runtime.last-error
      if options.url
        @add-target id, options.url

    function scale-image options
      new Promise (resolve, reject) ->
        if options.image-url
          load-image options.image-url
          .then (img) ->
            if img.width > NOTIFICATION_IMAGE_HEIGHT or img.height > NOTIFICATION_IMAGE_HEIGHT
              if img.width / img.height > NOTIFICATION_IMAGE_RATIO * 2
                canvas = create-canvas img.height * NOTIFICATION_IMAGE_RATIO, img.width
                ctx = canvas.get-context '2d'
                ctx.draw-image img, 0, 0, img.height * NOTIFICATION_IMAGE_RATIO, img.width, 0, 0, canvas.width, canvas.height
                /*
                canvas = create-canvas NOTIFICATION_IMAGE_WIDTH, NOTIFICATION_IMAGE_HEIGHT
                ctx = canvas.get-context '2d'
                ctx.draw-image img, 0, 0, img.width, img.height, 0, 0, canvas.height / img.height * img.width, canvas.height
                */
                return canvas.to-dataURL!
              else if img.width / img.height < NOTIFICATION_IMAGE_RATIO / 2
                canvas = create-canvas img.width, img.width / NOTIFICATION_IMAGE_RATIO
                ctx = canvas.get-context '2d'
                ctx.draw-image img, 0, 0, img.width, img.width / NOTIFICATION_IMAGE_RATIO, 0, 0, canvas.width, canvas.height
                /*
                canvas = create-canvas NOTIFICATION_IMAGE_WIDTH, NOTIFICATION_IMAGE_HEIGHT
                ctx = canvas.get-context '2d'
                ctx.draw-image img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.width / img.width * img.height
                */
                return canvas.to-dataURL!
            return null
          .then resolve
          .catch reject
        else
          resolve!

    function detect-icon options
      new Promise (resolve, reject) ->
        if options.icon-url is 'assets/images/icon-128.png' and options.url
          fetch options.url
          .then (res) -> res.text!
          .then (html) -> parse-favicon html, { baseURI: options.url, allow-use-network: true, allow-parse-image: true, timeout: 1000ms * 60s }
          .then (icon-list) ->
            if icon-list
              icon-list = filter ((icon) ->
                if icon.size
                  [width, height] = map Number, icon.size.split 'x'
                  width >= NOTIFICATION_ICON_WIDTH and height >= NOTIFICATION_ICON_HEIGHT
                else
                  false
              ), icon-list
              if icon-list.length > 0
                icon = fold ((result, current) ->
                  [result-width, result-height] = map Number, result.size?.split 'x'
                  [current-width, current-height] = map Number, current.size?.split 'x'
                  if result-width * result-height < current-width * current-height
                    result
                  else
                    current
                ), first(icon-list), icon-list
                return icon.url
            return null
          .then resolve
          .catch reject
        else
          resolve!


    Promise.all [detect-icon(options), scale-image(options)]
    .then ([icon-url, image-url]) ->
      options.icon-url = icon-url if icon-url
      options.image-url = image-url if image-url
    .catch console.error
    .then ->
      create-notification options

module.exports = NavigableNotificationsManager
