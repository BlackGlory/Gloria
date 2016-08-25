'use strict'

require! 'node-uuid': uuid
require! 'rx': Rx

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
      call-remote 'getCookies', url
      .then (cookies) ->
        data = cookie: cookies
        data.cookie = options.headers['Cookie'] if options.headers['Cookie']
        data.origin = options.headers['Origin'] if options.headers['Origin']
        data.referer = options.headers['Referer'] if options.headers['Referer']
        data
      .then (data) !->
        call-remote 'setSessionStorage', "request.inflate.#{url}", data
      .then ->
        options.headers['send-by'] = 'Gloria'
        self.fetch url, options, ...args

    function import-scripts url
      call-remote 'importScripts', url
      .then (script) ->
        window = self
        eval.call window, script

    new Promise (resolve, reject) !->
      function commit data
        resolve data
        self.close!

      try
        result = do ->
          var callable, bind-call-remote, call-remote, self, close
          eval code
        if Rx.helpers.is-promise result
          result.catch ({ message, stack })->
            reject { message, stack }
            self.close!
      catch { message, stack }
        reject { message, stack }
        self.close!

self.add-event-listener 'message', ({ data: { id, type, function-name, function-arguments } }) ->
  if type is 'call'
    callable[function-name](...function-arguments)
    .then (result) -> self.post-message id: id, type: 'return', function-result: result
    .catch (error) -> self.post-message id: id, type: 'error', error: error
