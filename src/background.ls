'use strict'

require! 'prelude-ls': { map, join, each, filter }
require! 'worker!./worker.ls': EvalWorker
require! 'node-uuid': uuid
require! 'redux': { create-store }
require! 'redux-persist': { persist-store, auto-rehydrate }
require! 'browser-redux-sync': { configure-sync, sync }
require! './reducers/index.ls': reducers
require! 'rx': Rx
require! 'deep-diff': { diff }
require! 'later': later

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

eval-untrusted = do ->
  callable =
    get-cookies: (url) ->
      new Promise (resolve, reject) !->
        cookies <-! chrome.cookies.get-all { url }
        resolve join '; ' map (cookie) -> "#{cookie.name}=#{cookie.value}", cookies

    set-session-storage: (url, data) ->
      window.sessionStorage[url] = JSON.stringify data
      Promise.resolve!

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
    new Promise (resolve, reject) ->
      eval-worker = new EvalWorker!
      call-remote = bind-call-remote eval-worker
      eval-worker.add-event-listener 'message', ({ data: { id, type, function-name, function-arguments } }) ->
        if type is 'call'
          callable[function-name](...function-arguments)
          .then (result) ->
            eval-worker.post-message id: id, type: 'return', function-result: result
          .catch (error) ->
            eval-worker.post-message id: id, type: 'error', error: error
      call-remote 'eval', code
      .then resolve
      .catch reject

const redux-store = create-store reducers, tasks: [], auto-rehydrate!
persistor = persist-store redux-store, configure-sync!, ->
  state = redux-store.get-state!
  source = Rx.Observable.create (observer) ->
    dispose = redux-store.subscribe -> observer.on-next redux-store.get-state!
    dispose
  source.subscribe do
    ((new-state) ->
      differences = diff state, new-state
      console.log differences
      state := new-state
    )
    ((err) -> console.log "Error: #{err}")
  ((task) ->
    console.log task
    sched = later.parse.recur().every(task.trigger-interval).minute()
    timer = later.set-interval (->
      eval-untrusted task.code
      .then (result) ->
        console.log result
      .catch (err) ->
        console.log err
    ), sched
  ) `each` filter (.is-enable), state.tasks
sync persistor
