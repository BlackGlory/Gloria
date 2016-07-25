'use strict'

require! 'prelude-ls': { map, join, each, filter, is-type }
require! 'worker!./worker.ls': EvalWorker
require! 'node-uuid': uuid
require! 'redux': { create-store }
require! 'redux-persist': { persist-store, auto-rehydrate }
require! 'browser-redux-sync': { configure-sync, sync }
require! './reducers/index.ls': reducers
require! 'rx': Rx
require! 'deep-diff': { diff }
require! 'later': later
require! './actions/creator.ls': creator

const notification-clicked-handlers = []
const timer-dict = {}
const worker-terminate-dict = {}

get-origin = (url) -> (new URL url).origin

chrome.web-request.on-before-send-headers.add-listener (details) ->
  if window.sessionStorage[details.url]
    is-send-by-gloria = false
    cookie-index = false
    origin-index = false
    referer-index = false
    for i, header of details.request-headers
      switch header.name
      | 'send-by' => is-send-by-gloria = true if header.value is 'Gloria'
      | 'Cookie' => cookie-index = i
      | 'Origin' => origin-index = i
      | 'Referer' => referer-index = i
    if is-send-by-gloria
      data = JSON.parse window.sessionStorage[details.url]
      details.request-headers.push name: 'Cookie', value: data.cookie ? '' unless cookie-index
      details.request-headers.push name: 'Origin', value: data.origin ? get-origin details.url unless origin-index
      details.request-headers.push name: 'Referer', value: data.referer ? details.url unless referer-index
  requestHeaders: details.requestHeaders
, urls: ['<all_urls>']
, ['blocking', 'requestHeaders']

chrome.notifications.on-closed.add-listener (notification-id) ->
  delete notification-clicked-handlers[notification-id]

chrome.notifications.on-clicked.add-listener (notification-id) ->
  handler = notification-clicked-handlers[notification-id]
  if handler
    handler!
    chrome.notifications.clear notification-id
    delete notification-clicked-handlers[notification-id]

chrome.runtime.on-message.add-listener (message, sender, send-response) ->
  { promise } = eval-untrusted message
  promise
  .then (result) ->
    send-response { result }
    result
  .then (data-list) ->
    if not data-list?
      return
    if not is-type 'Array' data-list
      data-list = [data-list]
    each ((data) !->
      options = create-notification-options { name: 'Test' }, data
      notification-id <-! chrome.notifications.create options
      if data.url
        notification-clicked-handlers[notification-id] = -> chrome.tabs.create url: data.url
    ), data-list
  .catch (err) ->
    console.log err
    send-response { err }

eval-untrusted = do ->
  callable =
    get-cookies: (url) ->
      new Promise (resolve, reject) !->
        cookies <-! chrome.cookies.get-all { url }
        resolve join '; ' map (cookie) -> "#{cookie.name}=#{cookie.value}", cookies

    set-session-storage: (url, data) ->
      window.sessionStorage[url] = JSON.stringify data
      Promise.resolve!

    import-scripts: (url) ->
      new Promise (resolve, reject) !->
        fetch url
        .then (.text!)
        .then (resolve)
        .catch ({ message, stack }) ->
          reject error: { message, stack }

  bind-call-remote = (worker) ->
    (function-name, ...function-arguments) ->
      new Promise (resolve, reject) !->
        message =
          id: uuid.v4!
          type: 'call'
          function-name: function-name
          function-arguments: function-arguments
        listener = ({ data: { id, type, function-result, error }}) ->
          if id is message.id
            switch type
            | 'return' => resolve function-result
            | 'error' => reject error
            worker.remove-event-listener 'message', listener
        worker.add-event-listener 'message', listener
        worker.post-message message

  (code) ->
    eval-worker = new EvalWorker!
    call-remote = bind-call-remote eval-worker
    eval-worker.add-event-listener 'message', ({ data: { id, type, function-name, function-arguments } }) ->
      if type is 'call'
        callable[function-name](...function-arguments)
        .then (result) ->
          eval-worker.post-message id: id, type: 'return', function-result: result
        .catch (error) ->
          eval-worker.post-message id: id, type: 'error', error: error
    {
      promise: call-remote 'eval', code
      terminate: -> eval-worker.terminate!
    }

create-notification-options = (task, data) ->
  options =
    type: 'basic'
    icon-url: data.icon-url ? 'data:image/jpeg;base64,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QAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBm6vo2keINOutH17StN1vSb6Iw3ul6vY2upadeQt96K6sryKa2uIj3jmidT3FRUp06sJU6sIVKc01KFSMZwknupRknFp9U00Z1aVKvTnSrU6dalUi4zpVYRqU5xas4zhNOMotNpppprRnxf4m/4JrfsLeLdZh17VP2bPANnqUF5Bfxv4XOveCLP7VbypNHJJpfgvWdA0udTKivNDNZSQXB3C4jlDuG+XzHgfhXNaOLw+Myil7LG0a2HxH1TEYzLqjp14OnV9lWy7E4WthqjjJ8tfDVKNenJ+0p1IVEpHzNHgfhChmeDzejw7ldPHYDGYfH4aSw0fqyxOFrQr0ZV8vd8vxdNVacXUw+LwtfDV481OvSqU5zjLubH9iX9l7T7hLmH4VWc8iFWVdT8S+NdZt8qwYZtNX8S31qwJADq0JWRflcMvFfl+A+jB4EZbV9thPD3Aqfu3jic24ix1KXK21zUMdnGIoStd/FTd02noft9fxa8Q8TB06vEldRaavRwOV4eavvaph8DSqRem8Zproz6F8M+DfCXgux/szwf4Y8P+FtPJDNZeH9IsNHtncDAeSKwt4Elkxx5kgZz3av2DI+GuHuGcN9T4dyPKcjwtoxdDKcvwuApzUHJx9pHDUqftGnObUqnNK8pO95O/wARj80zLNa31jM8wxmYV9lVxuJrYmaXaMq05uK8o2XkdJXtnCFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAH/2Q=='
    app-icon-mask-url: data.app-icon-mask-url
    title: data.title ? ''
    message: data.message ? ''
    context-message: "By #{task.name} #{new Date!to-locale-time-string { hour: '2-digit', minute: '2-digit' }}"
    event-time: data.event-time # unreliable
    require-interaction: task.need-interaction ? false # default
    image-url: undefined
    items: undefined
    progress: undefined
    buttons: undefined # just deny
    is-clickable: !!data.url
    priority: 0 # ranges from -2 to 2, zero is default, keep default
  switch
  | data.image-url => options <<< type: 'image', image-url: data.image-url
  | data.items => options <<< type: 'list', items: data.items
  | data.progress => options <<< type: 'progress', progress: data.progress
  | otherwise => \something
  options

terminate-worker = ({ id }) !->
  if worker-terminate-dict[id]
    worker-terminate-dict[id]!
  delete worker-terminate-dict[id]

create-task-timer = (task) ->
  sched = later.parse.recur().every(task.trigger-interval).minute()
  later.set-interval (!->
    { promise, terminate } = eval-untrusted task.code
    worker-terminate-dict[task.id] = terminate
    promise
    .then (data-list) ->
      if not data-list?
        return
      if not is-type 'Array' data-list
        data-list = [data-list]
      each ((data) !->
        redux-store.dispatch creator.increase-push-count task.id
        options = create-notification-options task, data
        notification-id <-! chrome.notifications.create options
        if data.url
          notification-clicked-handlers[notification-id] = -> chrome.tabs.create url: data.url
        redux-store.dispatch creator.add-notification options
      ), data-list
    .catch (err) ->
      console.log err
    redux-store.dispatch creator.increase-trigger-count task.id
  ), sched

const redux-store = create-store reducers, { tasks: [], notifications: [] }, auto-rehydrate!
persistor = persist-store redux-store, configure-sync!, ->
  tasks = redux-store.get-state!tasks
  source = Rx.Observable.create (observer) ->
    dispose = redux-store.subscribe ->
      observer.on-next redux-store.get-state!tasks
    dispose
  razor = (x) ->
    if x.path
      if x.path[1] in <[triggerCount pushCount]>
        return false
    true
  source.subscribe do
    ((new-tasks) ->
      differences = diff tasks, new-tasks
      if differences
        each ((x) ->
          switch x.kind
          case 'A' # Array
            let x = x.item
              switch x.kind
              case 'N' # New
                task = x.rhs
                if task.is-enable
                  timer-dict[task.id] = create-task-timer task
              case 'D' # Deleted
                task = x.lhs
                timer-dict[task.id].clear!
                terminate-worker task
                delete timer-dict[task.id]
          case 'E' # Edited
            task = new-tasks[x.path[0]]
            timer-dict[task.id].clear!
            terminate-worker task
            if task.is-enable
              timer-dict[task.id] = create-task-timer task
        ), filter razor, differences
        tasks := new-tasks
    ),
    ((err) -> console.log "Error: #{err}")
  ((task) -> timer-dict[task.id] = create-task-timer task
  ) `each` filter (.is-enable), tasks
sync persistor
