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
          :label="'TestCode' | i18n"
          :multi-line="true"
          icon="code"
          name="code"
          :value.sync="testCode"
          :placeholder="'PasteYourTestCodeHere' | i18n"
        ></ui-textbox>
        <ui-button @click="evalTest">{{ 'Test' | i18n }}</ui-button>
        <ui-alert
            :dismissible="false"
            v-show="testError"
            type="error"
        >
          {{{ testError | n2br | nbsp }}}
        </ui-alert>
        <ui-alert v-show="testResult" :dismissible="false" hide-icon>
          {{{ testResult | json | n2br | nbsp}}}
        </ui-alert>
      </article>
    </section>

    <section>
      <header>{{ 'Clear' | i18n }}</header>
      <article>
        <section class="snackbar-item">
          <ui-snackbar
            show
            persistent
            @action-clicked="showClearHistoryConfirm = true"
            action="Clear history"
            action-color="danger"
          >
            {{ 'ClearHistorySnackbar' | i18n }}
          </ui-snackbar>

          <ui-confirm
            :header="'ClearHistory' | i18n"
            type="danger"
            confirm-button-icon="delete"
            :confirm-button-text="'Clear' | i18n"
            :deny-button-text="'Cancel' | i18n"
            @confirmed="(clearHistory(), showClearHistoryConfirm = false)"
            @denied="showClearHistoryConfirm = false"
            :show.sync="showClearHistoryConfirm"
            close-on-confirm
          >
            {{ 'ClearHistoryConfirm' | i18n }}
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-snackbar
            show
            persistent
            @action-clicked="showClearTasksConfirm = true"
            :action="'ClearTasks' | i18n"
            action-color="danger"
          >
            {{ 'ClearTasksSnackbar' | i18n }}
          </ui-snackbar>

          <ui-confirm
            :header="'ClearTasks' | i18n"
            type="danger"
            :confirm-button-text="'Clear' | i18n"
            :deny-button-text="'Cancel' | i18n"
            confirm-button-icon="delete"
            @confirmed="(clearTasks(), showClearTasksConfirm = false)"
            @denied="showClearTasksConfirm = false"
            :show.sync="showClearTasksConfirm"
            close-on-confirm
          >
            {{ 'ClearTasksConfirm' | i18n }}
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-snackbar
            show
            persistent
            @action-clicked="showClearStagesConfirm = true"
            :action="'ClearStages' | i18n"
            action-color="danger"
          >
            {{ 'ClearStagesSnackbar' | i18n }}
          </ui-snackbar>

          <ui-confirm
            :header="'ClearStages' | i18n"
            type="danger"
            :confirm-button-text="'Clear' | i18n"
            :deny-button-text="'Cancel' | i18n"
            confirm-button-icon="delete"
            @confirmed="(clearStages(), showClearStagesConfirm = false)"
            @denied="showClearStagesConfirm = false"
            :show.sync="showClearStagesConfirm"
            close-on-confirm
          >
            {{ 'ClearStagesConfirm' | i18n }}
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-snackbar
            show
            persistent
            @action-clicked="showClearCachesConfirm = true"
            :action="'ClearCaches' | i18n"
            action-color="danger"
          >
            {{ 'ClearCachesSnackbar' | i18n }}
          </ui-snackbar>

          <ui-confirm
            :header="'ClearCaches' | i18n"
            type="danger"
            :confirm-button-text="'Clear' | i18n"
            :deny-button-text="'Cancel' | i18n"
            confirm-button-icon="delete"
            @confirmed="(clearCaches(), showClearCachesConfirm = false)"
            @denied="showClearCachesConfirm = false"
            :show.sync="showClearCachesConfirm"
            close-on-confirm
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
        <div>{{{ state | json | n2br | nbsp }}}</div>
      </article>
    </section>
  </div>
</template>

<script lang="livescript">
'use strict'

require! '../store.ls': store
require! '../actions/creator.ls': creator

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
    state: {}
    unsubscribe: null
  methods:
    handle-file-choose: ->
      chooser = @$els.import-file-chooser
      Array
      .from(chooser.files)
      .for-each (file) ->
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
    import-tasks: ->
      console.log @$els
      @$els.import-file-chooser.click!
    export-tasks: ->
      tasks = store.getState!.tasks.map (task) ->
        new-task = { ...task }
        new-task
      blob = new Blob [JSON.stringify(tasks, null, 2)], { type: 'application/json' }
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
          console.log err, chrome.runtime.last-error
          @$data.test-error = err.stack
        else
          console.log result
          @$data.test-result = result
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

  .snackbar-item
    width: 100%
    margin: 8px

  .ui-alert
    margin-top: 8px

  .inside
    word-break: break-all
</style>
