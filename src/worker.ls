'use strict'

require! 'node-uuid': uuid

callable =
  eval: (code) ->
    function call-remote function-name, ...function-arguments
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

            self.remove-event-listener 'message', listener

        self.add-event-listener 'message', listener
        self.post-message message

    function fetch url, options = headers: {}, ...args
      new Promise (resolve, reject) !->
        call-remote 'getCookies', url
        .then (cookies) ->
          data = cookie: cookies
          data.cookie = options.headers['Cookie'] if options.headers['Cookie']
          data.origin = options.headers['Origin'] if options.headers['Origin']
          data.referer = options.headers['Referer'] if options.headers['Referer']
          data
        .then (data) !->
          call-remote 'setSessionStorage', url, data
        .then !->
          options.headers['send-by'] = 'Gloria'
          self.fetch url, options, ...args
          .then resolve, reject
        .catch reject

    function import-scripts url
      new Promise (resolve, reject) !->
        call-remote 'importScripts', url
        .then (script) !->
          window = self
          resolve eval.call window, script
        .catch reject

    new Promise (resolve, reject) !->
      function commit data
        resolve data
        self.close!

      try
        do ->
          var callable, bind-call-remote, call-remote,  self, close
          eval code
      catch { message, stack }
        reject { message, stack }
        self.close!

self.add-event-listener 'message', ({ data: { id, type, function-name, function-arguments } }) ->
  if type is 'call'
    callable[function-name](...function-arguments)
    .then (result) -> self.post-message id: id, type: 'return', function-result: result
    .catch (error) -> self.post-message id: id, type: 'error', error: error
