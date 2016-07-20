'use strict'

require! 'prelude-ls': { map, join }
require! 'worker!./worker.ls': EvalWorker
require! 'node-uuid': uuid

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

evalUntrusted = do ->
  callable =
    getCookies: (url) ->
      new Promise (resolve, reject) !->
        cookies <-! chrome.cookies.get-all { url }
        resolve join '; ' map (cookie) -> "#{cookie.name}=#{cookie.value}", cookies

    setSessionStorage: (url, data) ->
      window.sessionStorage[url] = JSON.stringify data
      Promise.resolve!

  create-call-remote = (worker) ->
    (function-name, ...function-arguments) ->
      new Promise (resolve) !->
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
        worker.post-message message

  (code) ->
    new Promise (resolve, reject) ->
      eval-worker = new EvalWorker!
      call-remote = create-call-remote eval-worker
      eval-worker.add-event-listener 'message', ({ data: { id, type, function-name, function-arguments } }) ->
        if type is 'call'
          callable[function-name](...function-arguments)
          .then (result) ->
            eval-worker.post-message id: id, type: 'return', function-result: result
      call-remote 'eval', code
      .then resolve
      .catch reject

evalUntrusted """
fetch('http://www.xiami.com/song/gethqsong/sid/1769402975')
.then(res => res.json())
.then(commit, err => console.log(err))
"""
.then (result) -> console.log result
