require! 'prelude-ls': { map, join }
require! 'node-uuid': uuid

commit = (data) ->
  console.log data
  close!

callable =
  eval: (code) ->
    eval code

create-call-remote = (worker) ->
  (function-name, ...function-arguments) ->
    new Promise (resolve) ->
      message =
        id: uuid.v4!
        type: 'call'
        function-name: function-name
        function-arguments: function-arguments
      listener = ({ data: { id, type, function-result }}) ->
        if id is message.id
          resolve function-result
          worker.remove-event-listener 'message', listener
      worker.add-event-listener 'message', listener
      console.log message
      worker.post-message message

call-remote = create-call-remote self

native-fetch = self.fetch

fetch = (url, options = headers: {}, ...args) ->
  new Promise (resolve, reject) ->
    cookies <- (call-remote 'getCookies', url).then
    data = cookie: cookies
    data.cookie = options.headers['Cookie'] if options.headers['Cookie']
    data.origin = options.headers['Origin'] if options.headers['Origin']
    data.referer = options.headers['Referer'] if options.headers['Referer']
    <- (call-remote 'setSessionStorage', url, data).then
    options.headers['send-by'] = 'Gloria'
    native-fetch(url, options, ...args).then resolve, reject

self.add-event-listener 'message', ({ data: { id, type, function-name, function-arguments } }) ->
  if type is 'call'
    callable[function-name](...function-arguments)
    .then (result) ->
      self.post-message id: id, type: 'return', function-result: result
