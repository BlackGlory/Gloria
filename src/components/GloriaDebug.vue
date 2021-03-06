<template>
  <div class="gloria-debug">

    <section>
      <header>{{ 'ImportAndExport' | i18n }}</header>
      <article>
        <input
          v-el:import-file-chooser
          type="file"
          multiple
          accept=".json"
          style="display: none"
          @change="handleFileChoose"
        />
        <ui-button @click="importTasks">{{ 'ImportTasks' | i18n }}</ui-button>
        <a v-el:downloader download="tasks.json" style="display: none"></a>
        <ui-button @click="exportTasks">{{ 'ExportTasks' | i18n }}</ui-button>
      </article>
    </section>

    <section>
      <header>{{ 'TaskCodeTest' | i18n }}</header>
      <article>
        <ui-textbox
          icon="code"
          name="code"
          :label="'TestCode' | i18n"
          :multi-line="true"
          :value.sync="testCode"
          :placeholder="'PasteYourTestCodeHere' | i18n"
        ></ui-textbox>
        <ui-button @click="evalTest">{{ 'Test' | i18n }}</ui-button>
        <ui-alert
          type="error"
          :dismissible="false"
          v-show="testError"
        >
          {{{ testError | n2br | nbsp }}}
        </ui-alert>
        <ui-alert v-show="testResult" :dismissible="false" hide-icon>
          {{{ testResult | json | n2br | nbsp}}}
        </ui-alert>
      </article>
    </section>

    <section>
      <header>{{ 'NotificationReducer' | i18n }}</header>
      <article>
        <ui-textbox
          icon="code"
          name="code"
          :label="'ReducerCode' | i18n"
          :multi-line="true"
          :value.sync="notificationReducer"
          :placeholder="'PasteYourReducerCodeHere' | i18n"
        ></ui-textbox>
        <ui-button @click="setNotificationReducer">{{ 'Save' | i18n }}</ui-button>
      </article>
    </section>

    <section>
      <header>{{ 'Clear' | i18n }}</header>
      <article>
        <section class="snackbar-item">
          <ui-button @click="showClearHistoryConfirm = true">{{ 'ClearHistorySnackbar' | i18n }}</ui-button>

          <ui-confirm
            type="danger"
            confirm-button-icon="delete"
            close-on-confirm
            :header="'ClearHistory' | i18n"
            :confirm-button-text="'Clear' | i18n"
            :deny-button-text="'Cancel' | i18n"
            :show.sync="showClearHistoryConfirm"
            @confirmed="(clearHistory(), showClearHistoryConfirm = false)"
            @denied="showClearHistoryConfirm = false"
          >
            {{ 'ClearHistoryConfirm' | i18n }}
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-button @click="showClearTasksConfirm = true">{{ 'ClearTasksSnackbar' | i18n }}</ui-button>

          <ui-confirm
            type="danger"
            confirm-button-icon="delete"
            close-on-confirm
            :header="'ClearTasks' | i18n"
            :confirm-button-text="'Clear' | i18n"
            :deny-button-text="'Cancel' | i18n"
            :show.sync="showClearTasksConfirm"
            @confirmed="(clearTasks(), showClearTasksConfirm = false)"
            @denied="showClearTasksConfirm = false"
          >
            {{ 'ClearTasksConfirm' | i18n }}
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-button @click="showClearStagesConfirm = true">{{ 'ClearStagesSnackbar' | i18n }}</ui-button>

          <ui-confirm
            type="danger"
            confirm-button-icon="delete"
            close-on-confirm
            :header="'ClearStages' | i18n"
            :confirm-button-text="'Clear' | i18n"
            :deny-button-text="'Cancel' | i18n"
            :show.sync="showClearStagesConfirm"
            @confirmed="(clearStages(), showClearStagesConfirm = false)"
            @denied="showClearStagesConfirm = false"

          >
            {{ 'ClearStagesConfirm' | i18n }}
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-button @click="showClearCachesConfirm = true">{{ 'ClearCachesSnackbar' | i18n }}</ui-button>

          <ui-confirm
            type="danger"
            confirm-button-icon="delete"
            close-on-confirm
            :header="'ClearCaches' | i18n"
            :confirm-button-text="'Clear' | i18n"
            :deny-button-text="'Cancel' | i18n"
            :show.sync="showClearCachesConfirm"
            @confirmed="(clearCaches(), showClearCachesConfirm = false)"
            @denied="showClearCachesConfirm = false"
          >
            {{ 'ClearCachesConfirm' | i18n }}
          </ui-confirm>
        </section>
      </article>
    </section>

    <section>
      <header>{{ 'Inside' | i18n }}</header>
      <article class="inside">
        <ui-button @click="startObserveStateChange" v-show="!unsubscribe">{{ 'StartObserveStateChange' | i18n }}</ui-button>
        <ui-button @click="stopObserveStateChange" v-show="unsubscribe">{{ 'StopObserveStateChange' | i18n }}</ui-button>
        <div class="state">{{{ state | json | n2br | nbsp }}}</div>
      </article>
    </section>
  </div>
</template>

<script lang="livescript">
'use strict'

require! '../store.ls': store
require! '../actions/creator.ls': creator
require! 'prelude-ls': { each }

export
  name: 'gloria-debug'
  data: ->
    show-clear-history-confirm: false
    show-clear-tasks-confirm: false
    show-clear-stages-confirm: false
    show-clear-caches-confirm: false
    test-code: ''
    test-result: ''
    test-error: ''
    notification-reducer: ''
    state: {}
    unsubscribe: null
  props:
    configs:
      type: Object
      default: {}
  ready: ->
    @$watch 'configs.NotificationReducer', ((val) ~>
      @$data.notification-reducer = val
    ), immediate: true
  methods:
    handle-file-choose: ->
      chooser = @$els.import-file-chooser
      each ((file) ->
        reader = new FileReader!
        reader.onload = (evt) ->
          new-tasks = []
          try
            new-tasks = JSON.parse evt.target.result
            console.log new-tasks
          catch e
            console.error e.message
          store.dispatch creator.merge-tasks new-tasks
          chooser.value = ''

        reader.readAsText file
      ), chooser.files

    import-tasks: ->
      @$els.import-file-chooser.click!

    export-tasks: ->
      tasks = store.get-state!tasks.map (task) ->
        new-task = { ...task }
        new-task
      blob = new Blob [JSON.stringify(tasks, null, 2indents)], { type: 'application/json' }
      downloader = @$els.downloader
      downloader.href = URL.create-objectURL blob
      downloader.click!
      URL.revoke-objectURL blob

    start-observe-state-change: ->
      unless @$data.unsubscribe
        @$data.unsubscribe = store.subscribe ~>
          @$data.state = store.get-state!

    stop-observe-state-change: ->
      if @$data.unsubscribe
        @$data.unsubscribe!
        @$data.unsubscribe = null

    clear-history: ->
      store.dispatch creator.clear-all-notifications!

    clear-tasks: ->
      store.dispatch creator.clear-all-tasks!
      store.dispatch creator.clear-all-stages!

    clear-stages: ->
      store.dispatch creator.clear-all-stages!

    clear-caches: ->
      chrome.runtime.send-message { type: 'clear-caches' }

    eval-test: ->
      @$data.test-error = ''
      @$data.test-result = ''
      chrome.runtime.send-message { type: 'test-code', message: @$data.test-code }, ({ err, result }) ~>
        if err
          @$data.test-error = err.message
        else
          @$data.test-result = result

    set-notification-reducer: ->
      store.dispatch creator.set-config 'NotificationReducer', @$data.notification-reducer
</script>

<style lang="stylus">
@import '~keen-ui/src/styles/md-colors'

.gloria-debug
  > section
    border: 1px solid $md-grey-300

    &:not(:last-child)
      margin-bottom: 8px

    header
      padding-left: 1rem
      height: 3rem
      font-size: 1rem
      line-height: 3rem
      background-color: $md-grey-100

    article
      padding: 8px

  .ui-textbox-textarea
    min-height: 200px

  .snackbar-item:not(:last-child)
    width: 100%
    margin-bottom: 8px

  .ui-alert
    margin-top: 8px
    word-break: break-all

  .inside
    word-break: break-all

    .state
      margin-top: 8px
      border: 1px solid $md-grey-300
      padding: 8px
</style>
