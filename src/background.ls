'use strict'

require! 'prelude-ls': { map, join }

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

native-fetch = window.fetch

fetch = (url, options = headers: {}, ...args) ->
  new Promise (resolve, reject) ->
    chrome.cookies.get-all { url }, (cookies) ->
      data = cookie: join '; ' map (cookie) -> "#{cookie.name}=#{cookie.value}", cookies
      data.cookie = options.headers['Cookie'] if options.headers['Cookie']
      data.origin = options.headers['Origin'] if options.headers['Origin']
      data.referer = options.headers['Referer'] if options.headers['Referer']
      options.headers['send-by'] = 'Gloria'
      window.sessionStorage[url] = JSON.stringify data
      native-fetch(url, options, ...args).then resolve, reject

f = new Function 'window', 'fetch', '"use strict";' + '''
return new Promise((resolve, reject) => {
  fetch('http://www.xiami.com/song/gethqsong/sid/1769402975')
  .then(res => res.json())
  .then(resolve, reject)
})
'''

f({}, fetch).then((x) -> console.log x)
