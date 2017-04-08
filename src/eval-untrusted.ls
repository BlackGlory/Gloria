'use strict'

require! 'prelude-ls': { map, join, each }
require! 'uuid/v4': uuid-v4
require! 'gloria-sandbox': { createGloriaSandbox }

function get-origin url
  (new URL url).origin

export function inflated-request-headers details
  if window.session-storage["request.id.#{details.request-id}"]
    cookie-index = false
    origin-index = false
    referer-index = false

    for i, header of details.request-headers
      switch header.name.to-lower-case!
      | 'cookie'  => cookie-index = i
      | 'origin'  => origin-index = i
      | 'referer' => referer-index = i

    data = JSON.parse window.session-storage["request.id.#{details.request-id}"]
    details.request-headers.push name: 'Cookie', value: data.cookie ? '' unless cookie-index
    details.request-headers.push name: 'Referer', value: data.referer ? details.url unless referer-index
    if origin-index
      if details.request-headers[origin-index].value is 'null'
        details.request-headers[origin-index].value = data.origin ? get-origin details.url
    else
      details.request-headers.push name: 'Origin', value: data.origin ? get-origin details.url unless origin-index

  else if window.session-storage["request.inflate.#{details.url}"]
    try
      window.session-storage["request.id.#{details.request-id}"] = window.session-storage["request.inflate.#{details.url}"]
    catch e
      if e.name is 'QuotaExceededError'
        each ((key) ->
          if key isnt "request.id.#{details.request-id}" and key isnt "request.inflate.#{details.url}"
            window.session-storage.remove-item key
        ), Object.keys window.session-storage
        window.session-storage["request.id.#{details.request-id}"] = window.session-storage["request.inflate.#{details.url}"]
      else
        console.error e

    is-send-by-gloria = false
    cookie-index = false
    origin-index = false
    referer-index = false

    for i, header of details.request-headers
      switch header.name.to-lower-case!
      | 'send-by' => is-send-by-gloria = true if header.value is 'Gloria'
      | 'cookie'  => cookie-index = i
      | 'origin'  => origin-index = i
      | 'referer' => referer-index = i

    if is-send-by-gloria
      data = JSON.parse window.session-storage["request.inflate.#{details.url}"]
      details.request-headers.push name: 'Cookie', value: data.cookie ? '' unless cookie-index
      details.request-headers.push name: 'Referer', value: data.referer ? details.url unless referer-index
      if origin-index
        if details.request-headers[origin-index].value is 'null'
          details.request-headers[origin-index].value = data.origin ? get-origin details.url
      else
        details.request-headers.push name: 'Origin', value: data.origin ? get-origin details.url unless origin-index

  request-headers: details.request-headers

export function eval-untrusted code
  new Promise (resolve, reject) ->
    createGloriaSandbox!then (sandbox) ->
      sandbox.add-event-listener 'error', ({ detail }) ->
        reject detail
      sandbox.add-event-listener 'commit', ({ detail }) ->
        resolve detail
        sandbox.destroy!
      sandbox.execute code, 1000ms * 60s
      .catch (err) ->
        reject err
        sandbox.destroy!
