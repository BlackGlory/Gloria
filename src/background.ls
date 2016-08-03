'use strict'

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

create-task-timer = (task) ->
  alarms-manager.add task.id, task.trigger-interval, ->
    eval-untrusted task.code
    .then (data-list) ->
      if (not data-list) or (is-type 'Undefined' data-list) or ((is-type 'Array' data-list) and empty data-list)
        return

      if not is-type 'Array' data-list
        data-list = [data-list]

      redux-store.dispatch batch-actions [
        creator.increase-push-count task.id
        creator.commit-to-stage task.id, data-list.filter (x) -> !!x
      ]
    .catch (err) ->
      console.log err

    redux-store.dispatch creator.increase-trigger-count task.id

reset-task-timer = (task) ->
  alarms-manager.update task.id, task.trigger-interval

remove-task-timer = (task) ->
  alarms-manager.remove task.id

create-notification = (options) ->
  notifications-manager.add options

chrome.runtime.on-message-external.add-listener (message, sender, send-response) ->
  redux-store.dispatch creator.add-task {
    name: message.name
    code: message.code
    trigger-interval: 5
    need-interaction: false
  }
  send-response!

chrome.runtime.on-message.add-listener (message, sender, send-response) ->
  console.log sender
  eval-untrusted message
  .then (result) ->
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

function create-notification-options task, data
  options = {
    title: ''
    message: ''
    icon-url: 'assets/images/icon-128.png'
    ...data
    type: 'basic'
    context-message: "By #{task.name} #{new Date!to-locale-time-string { hour: '2-digit', minute: '2-digit' }}"
    require-interaction: task.need-interaction ? false # default
    image-url: undefined
    items: undefined
    progress: undefined
    buttons: undefined # just deny
    is-clickable: !!data.url
    priority: 0 # ranges from -2 to 2, zero is default, keep default
  }

  switch
  | data.image-url => options <<< type: 'image', image-url: data.image-url
  | data.items => options <<< type: 'list', items: data.items
  | data.progress => options <<< type: 'progress', progress: data.progress
  | otherwise => \something

  options

function sync-stages redux-store
  stages = redux-store.get-state!stages
  lazy-actions = []

  stages-source = Rx.Observable.create (observer) ->
    redux-store.subscribe ->
      observer.on-next redux-store.get-state!stages

  function razor x
    if x.path
      if (last x.path) in <[unread updatedAt createdAt]>
        return false
    true

  function stop-lazy
    if not empty lazy-actions
      redux-store.dispatch batch-actions lazy-actions
      lazy-actions := []

  function change-handler new-stages
    differences = diff stages, new-stages

    if differences
      stages := new-stages

      if not empty differences.filter razor
        each (({ id, stage }) ->
          task = redux-store.get-state!tasks.find (.id is id)
          each ((data) ->
            options = create-notification-options task, data
            create-notification options
            lazy-actions.push creator.add-notification options
          ), filter (.unread), stage
          lazy-actions.push creator.mark-stage-read id
        ), new-stages

        stop-lazy!

  stages-source.subscribe change-handler, (err) -> console.log "Error: #{err}"

function sync-tasks redux-store
  tasks = redux-store.get-state!tasks
  lazy-actions = []

  tasks-source = Rx.Observable.create (observer) ->
    redux-store.subscribe ->
      observer.on-next redux-store.get-state!tasks

  function razor x
    if x.path
      if (last x.path) in <[triggerCount pushCount]>
        return false
    true

  function edit-handler task
    if task.is-enable
      reset-task-timer task
    else
      remove-task-timer task

  function new-handler task
    if task.is-enable
      create-task-timer task

  function delete-handler task
    remove-task-timer task
    lazy-actions.push creator.clear-stage task.id

  function stop-lazy
    if not empty lazy-actions
      redux-store.dispatch batch-actions lazy-actions
      lazy-actions := []

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
      stop-lazy!

  tasks-source.subscribe change-handler, (err) -> console.log "Error: #{err}"

  each ((task) -> create-task-timer task), filter (.is-enable), tasks

chrome.web-request.on-before-send-headers.add-listener inflated-request-headers
, urls: ['<all_urls>']
, ['blocking', 'requestHeaders']

const redux-store = create-store (enable-batching reducers), { tasks: [], notifications: [], stages: [] }, auto-rehydrate!

sync persist-store redux-store, configure-sync!, ->
  sync-stages redux-store
  sync-tasks redux-store
