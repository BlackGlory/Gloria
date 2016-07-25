'use strict'

require! 'node-uuid': uuid

native-fetch = self.fetch

fetch = (url, options = headers: {}, ...args) ->
  new Promise (resolve, reject) !->
    cookies <-! (call-remote 'getCookies', url).then
    data = cookie: cookies
    data.cookie = options.headers['Cookie'] if options.headers['Cookie']
    data.origin = options.headers['Origin'] if options.headers['Origin']
    data.referer = options.headers['Referer'] if options.headers['Referer']
    <-! (call-remote 'setSessionStorage', url, data).then
    options.headers['send-by'] = 'Gloria'
    native-fetch(url, options, ...args).then resolve, reject

callable =
  eval: (code) ->
    import-scripts = (url) ->
      new Promise (resolve, reject) !->
        call-remote 'importScripts', url
        .then (script) ->
          window = self
          resolve eval.call(window, script)
        .catch reject
    new Promise (resolve, reject) !->
      commit = (data) !->
        resolve data
        close!
      try
        var callable, bind-call-remote, call-remote, native-fetch, self
        eval code
      catch { message, stack }
        reject { message, stack }
        close!

bind-call-remote = (worker) ->
  (function-name, ...function-arguments) ->
    new Promise (resolve) !->
      message =
        id: uuid.v4!
        type: 'call'
        function-name: function-name
        function-arguments: function-arguments
      listener = ({ data: { id, type, function-result }}) ->
        if id is message.id
          switch type
          | 'return' => resolve function-result
          | 'error' => reject error
          worker.remove-event-listener 'message', listener
      worker.add-event-listener 'message', listener
      worker.post-message message

call-remote = bind-call-remote self

self.add-event-listener 'message', ({ data: { id, type, function-name, function-arguments } }) ->
  if type is 'call'
    callable[function-name](...function-arguments)
    .then (result) ->
      self.post-message id: id, type: 'return', function-result: result
    .catch (error) ->
      self.post-message id: id, type: 'error', error: error
