'use strict'

require! './rollbar.ls': Rollbar
require! 'prelude-ls': { map, join, each, filter, is-type, empty, last, first }
require! 'redux': { create-store }
require! 'redux-persist': { persist-store, auto-rehydrate }
require! 'redux-batched-actions': { batch-actions, enable-batching }
require! 'browser-redux-sync': { configure-sync, sync }
require! 'rx': Rx
require! 'deep-diff': { diff }

require! './reducers/index.ls': reducers
require! './actions/creator.ls': creator
require! './eval-untrusted.ls': { eval-untrusted, inflated-request-headers }
require! './IntervalAlarmsManager.ls': IntervalAlarmsManager
require! './NavigableNotificationsManager.ls': NavigableNotificationsManager

alarms-manager = new IntervalAlarmsManager!
notifications-manager = new NavigableNotificationsManager!

function create-task-timer task, immediately = false
  function run
    redux-store.dispatch creator.increase-trigger-count task.id
    eval-untrusted task.code
    .then (data-list) ->
      if (not data-list) or (is-type 'Undefined' data-list) or ((is-type 'Array' data-list) and empty data-list)
        return

      if not is-type 'Array' data-list
        data-list = [data-list]

      redux-store.dispatch creator.commit-to-stage task.id, data-list.filter (x) -> !!x
    .catch (err) ->
      console.error err

  alarms-manager.add task.id, task.trigger-interval, run
  run! if immediately

function reset-task-timer task
  alarms-manager.remove task.id, ->
    create-task-timer task

function remove-task-timer task
  alarms-manager.remove task.id

function create-notification options
  if options.url
    window.session-storage["request.image.#{options.icon-url}"] = JSON.stringify referer: options.url
    window.session-storage["request.image.#{options.image-url}"] = JSON.stringify referer: options.url
  else
    window.session-storage["request.image.#{options.icon-url}"] = JSON.stringify referer: options.icon-url
    window.session-storage["request.image.#{options.image-url}"] = JSON.stringify referer: options.image-url
  notifications-manager.add options

chrome.runtime.on-installed.add-listener (details) ->
  this-version = chrome.runtime.get-manifest!.version
  if details.reason is 'install'
    chrome.notifications.create {
      title: chrome.i18n.get-message 'ExtensionInstalledTitle'
      message: chrome.i18n.get-message 'ExtensionInstalledMessage', this-version
      icon-url: 'assets/images/icon-128.png'
      type: 'basic'
    }, (notification-id) -> console.error chrome.runtime.lastError if chrome.runtime.lastError
  else if details.reason is 'update' and details.previous-version isnt this-version
    chrome.notifications.create {
      title: chrome.i18n.get-message 'ExtensionUpdatedTitle'
      message: chrome.i18n.get-message 'ExtensionUpdatedMessage', [details.previous-version, this-version]
      icon-url: 'assets/images/icon-128.png'
      type: 'basic'
    }, (notification-id) -> console.error chrome.runtime.lastError if chrome.runtime.lastError

chrome.runtime.on-message-external.add-listener (message, sender, send-response) ->
  switch message.type
  | 'task.install' =>
    redux-store.dispatch creator.add-task do
      name: message.name
      code: message.code
      trigger-interval: 5
      need-interaction: false
      origin: message.origin
    send-response true
    chrome.notifications.create {
      title: chrome.i18n.get-message 'TaskInstalledTitle'
      message: chrome.i18n.get-message 'TaskInstalledMessage', message.name
      icon-url: 'assets/images/icon-128.png'
      type: 'basic'
    }, (notification-id) -> console.error chrome.runtime.lastError if chrome.runtime.lastError
  | 'task.is-exist' =>
    task = redux-store.get-state!tasks.filter ({ origin }) -> origin is message.origin
    if task.length > 0
      if task[0].code is message.code
        send-response true
      else
        send-response 'diff'
    else
      send-response false
  | 'task.uninstall' =>
    redux-store.dispatch creator.remove-task-by-origin message.origin
    send-response true
  | 'task.update' =>
    redux-store.dispatch creator.update-task-by-origin message.origin, message
    send-response true
  | 'extension.version' =>
    send-response chrome.runtime.get-manifest!.version

chrome.runtime.on-message.add-listener ({ type, message }, sender, send-response) !->
  switch type
  | 'test-code' =>
    eval-untrusted message
    .then (result) ->
      console.log result
      send-response { result }
      result
    .then (data-list) ->
      if not data-list?
        return

      if not is-type 'Array' data-list
        data-list = [data-list]

      each ((data) !-> create-notification create-notification-options { name: 'Test' }, data), data-list
    .catch (err) ->
      console.log err
      send-response { err }
    return true
  | 'clear-caches' =>
    for key of window.session-storage
      if key.starts-with 'import-cripts.cache.'
        window.session-storage.remove-item key

function create-notification-options task, data
  options = {
    title: ''
    message: ''
    icon-url: 'assets/images/icon-128.png'
    type: 'basic'
    ...data
    context-message: chrome.i18n.get-message 'NotificationContextMessage', [task.name, new Date!to-locale-time-string { hour: '2-digit', minute: '2-digit' }]
    require-interaction: task.need-interaction ? false # default
    image-url: undefined
    items: undefined # just deny
    progress: undefined # just deny
    buttons: undefined # just deny
    event-time: undefined # just deny
    is-clickable: !!data.url
    priority: 0 # ranges from -2 to 2, zero is default, keep default
  }

  if data.image-url
    options <<< type: 'image', image-url: data.image-url.to-string!

  options.icon-url = 'assets/images/icon-128.png' unless options.icon-url?
  options.message = '' unless options.message?
  options.title = '' unless options.title?
  options.type = 'basic' unless options.type?

  options.title = options.title.to-string!
  options.message = options.message.to-string!
  options.icon-url = options.icon-url.to-string!

  options

function check-origin-update redux-store
  remote-tasks = redux-store.get-state!tasks.filter (x) -> x.origin

  each ((task) ->
    if /:\/\/gloria.pub\/task\/([\w\d]+)/.test task.origin
      [, remote-id] = /:\/\/gloria.pub\/task\/([\w\d]+)/.exec task.origin
      fetch "https://api.gloria.pub/task/#{remote-id}"
      .then (res) -> res.json!
      .then ({ code }) ->
        if code isnt task.code
          chrome.notifications.create JSON.stringify({ id: task.id, name: task.name, origin: task.origin }), do
            type: 'basic'
            title: chrome.i18n.get-message 'FindNewVersion', [task.name]
            message: chrome.i18n.get-message 'AutoCheckContextMessage'
            icon-url: 'assets/images/icon-128.png'
            require-interaction: true
            buttons: [{ title: chrome.i18n.get-message 'GotoSource' }, { title: chrome.i18n.get-message 'Unsynchronized' }]
          , (notification-id) -> console.error chrome.runtime.lastError if chrome.runtime.lastError
  ), remote-tasks

function check-stage redux-store
  { tasks, stages } = redux-store.get-state!

  lazy-actions = []

  each (({ id, stage }) ->
    task = tasks.find (.id is id)

    if task
      each ((data) ->
        options = create-notification-options task, data
        create-notification options
        lazy-actions.push creator.add-notification options
        lazy-actions.push creator.increase-push-count id
      ), filter (.unread), stage
      lazy-actions.push creator.mark-stage-read id
  ), stages

  redux-store.dispatch batch-actions lazy-actions

function sync-tasks redux-store
  tasks = redux-store.get-state!tasks
  lazy-actions = []

  tasks-source = Rx.Observable.create((observer) ->
    redux-store.subscribe ->
      observer.on-next redux-store.get-state!tasks
  ).debounce(1000)

  function razor x
    if x.path
      if (last x.path) in <[triggerCount pushCount origin]>
        return false
    true

  function edit-handler task
    if task.is-enable
      reset-task-timer task
    else
      remove-task-timer task

  function new-handler task
    if task.is-enable
      create-task-timer task, true

  function delete-handler task
    remove-task-timer task
    lazy-actions.push creator.clear-stage task.id

  function stop-lazy lazy-actions
    if not empty lazy-actions
      redux-store.dispatch batch-actions lazy-actions

  function change-handler new-tasks
    differences = diff tasks, new-tasks

    if differences
      tasks := new-tasks

      each ((x) ->
        switch x.kind
        | 'A' => # Array
          let x = x.item
            switch x.kind
            | 'N' => new-handler x.rhs # New
            | 'D' => delete-handler x.lhs # Deleted
        | 'E' => edit-handler new-tasks[first x.path] # Edited
      ), filter razor, differences

      stop-lazy lazy-actions

  tasks-source.subscribe change-handler, (err) -> console.error err

  each ((task) -> create-task-timer task, true), filter (.is-enable), tasks

chrome.web-request.on-before-send-headers.add-listener inflated-request-headers
, urls: ['<all_urls>']
, ['blocking', 'requestHeaders']

chrome.web-request.on-before-send-headers.add-listener (details) ->
  name = "request.image.#{details.url}"

  if window.session-storage[name] and details.type is 'image' and details.frame-id is 0 and details.parent-frame-id is -1 and details.tab-id is -1
    referer-index = false

    for i, header of details.request-headers
      if header.name is 'Referer'
        referer-index = i

    data = JSON.parse window.session-storage[name]
    details.request-headers.push name: 'Referer', value: data.referer ? details.url unless referer-index

  request-headers: details.request-headers

, urls: ['<all_urls>']
, ['blocking', 'requestHeaders']

chrome.web-request.on-completed.add-listener (details) ->
  window.session-storage.remove-item "request.id.#{details.request-id}"
, urls: ['<all_urls>']

chrome.notifications.on-button-clicked.add-listener (notification-id, button-index) ->
  try
    { id, name, origin } = JSON.parse notification-id
    if button-index is 0 # Go to source
      chrome.tabs.create { url: origin }
    else if button-index is 1 # Never sync
      redux-store.dispatch creator.remove-origin id
  catch e
    console.error e
  finally
    chrome.notifications.clear notification-id

const redux-store = create-store (enable-batching reducers), { tasks: [], notifications: [], stages: [] }, auto-rehydrate!

sync persist-store redux-store, configure-sync!, ->
  sync-tasks redux-store
  check-stage redux-store
  check-origin-update redux-store
  alarms-manager.add 'autocheck-stage', 1, -> check-stage redux-store
  alarms-manager.add 'autocheck-origin-update', 60, -> check-origin-update redux-store
