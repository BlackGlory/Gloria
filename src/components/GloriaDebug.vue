<template>
  <div class="gloria-debug">

    <section>
      <header>Import and Export</header>
      <article>
        <input
          v-el:import-file-chooser
          type="file"
          multiple
          accept=".json"
          style="display: none"
          @change="handleFileChoose"
        />
        <ui-button @click="importTasks">Import Tasks</ui-button>
        <a v-el:downloader download="tasks.json" style="display: none"></a>
        <ui-button @click="exportTasks">Export Tasks</ui-button>
      </article>
    </section>

    <section>
      <header>Task code test</header>
      <article>
        <ui-textbox
          label="Test Code"
          :multi-line="true"
          icon="code"
          name="code"
          :value.sync="testCode"
          placeholder="Paste your test code here"
        ></ui-textbox>
        <ui-button @click="evalTest">Test</ui-button>
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
      <header>Clear</header>
      <article>
        <section class="snackbar-item">
          <ui-snackbar
            show persistent @action-clicked="showClearHistoryConfirm = true" action="Clear history" action-color="danger"
          >
            This will clear all Gloria notifications history.
          </ui-snackbar>

          <ui-confirm
            header="Clear history"
            type="danger"
            confirm-button-text="Clear"
            confirm-button-icon="delete" deny-button-text="Cancel"
            @confirmed="(clearHistory(), showClearHistoryConfirm = false)"
            @denied="showClearHistoryConfirm = false"
            :show.sync="showClearHistoryConfirm" close-on-confirm
          >
          Are you sure you want to clear history?
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-snackbar
            show persistent @action-clicked="showClearTasksConfirm = true" action="Clear tasks" action-color="danger"
          >
            This will clear all Gloria tasks.
          </ui-snackbar>

          <ui-confirm
            header="Clear tasks"
            type="danger"
            confirm-button-text="Clear"
            confirm-button-icon="delete" deny-button-text="Cancel"
            @confirmed="(clearTasks(), showClearTasksConfirm = false)"
            @denied="showClearTasksConfirm = false"
            :show.sync="showClearTasksConfirm" close-on-confirm
          >
          Are you sure you want to clear tasks?
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-snackbar
            show persistent @action-clicked="showClearStagesConfirm = true" action="Clear stages" action-color="danger"
          >
            This will clear all Gloria stages(an internal component to cache notifications).
          </ui-snackbar>

          <ui-confirm
            header="Clear stages"
            type="danger"
            confirm-button-text="Clear"
            confirm-button-icon="delete" deny-button-text="Cancel"
            @confirmed="(clearStages(), showClearStagesConfirm = false)"
            @denied="showClearStagesConfirm = false"
            :show.sync="showClearStagesConfirm" close-on-confirm
          >
          Are you sure you want to clear stages?
          </ui-confirm>
        </section>

        <section class="snackbar-item">
          <ui-snackbar
            show persistent @action-clicked="showClearCachesConfirm = true" action="Clear caches" action-color="danger"
          >
            This will clear all Gloria caches(an internal component to cache network requests).
          </ui-snackbar>

          <ui-confirm
            header="Clear caches"
            type="danger"
            confirm-button-text="Clear"
            confirm-button-icon="delete" deny-button-text="Cancel"
            @confirmed="(clearCaches(), showClearCachesConfirm = false)"
            @denied="showClearCachesConfirm = false"
            :show.sync="showClearCachesConfirm" close-on-confirm
          >
          Are you sure you want to clear caches?
          </ui-confirm>
        </section>
      </article>
    </section>

    <section>
      <header>Inside</header>
      <article class="inside">
        <ui-button @click="startObserveStateChange" v-show="!unsubscribe">Start observe state change</ui-button>
        <ui-button @click="stopObserveStateChange" v-show="unsubscribe">Stop observe state change</ui-button>
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
