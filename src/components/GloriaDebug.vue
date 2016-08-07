<template>
  <div class="gloria-debug">
    <!--ui-button @click="showClearHistoryConfirm = true">Clear history</ui-button>
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
    <ui-button @click="showClearTasksConfirm = true">Clear tasks</ui-button>
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
    <ui-button @click="showClearStagesConfirm = true">Clear stages</ui-button>
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
  </ui-confirm-->
    <ui-textbox
      label="Test Code"
      :multi-line="true"
      icon="code"
      name="code"
      :value.sync="testCode"
      placeholder="Paste your test code here"
    ></ui-textbox>
    <ui-button @click="evalTest">Test</ui-button>
    <div>{{ testResult }}</div>
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
    test-code: ''
    test-result: ''
  methods:
    clear-history: ->
      store.dispatch creator.clear-all-notifications!
    clear-tasks: ->
      store.dispatch creator.clear-all-tasks!
    clear-stages: ->
      store.dispatch creator.clear-all-stages!
    eval-test: ->
      chrome.runtime.send-message @$data.test-code, ({ err, result }) ~>
        if err
          console.log err, runtime.last-error
          @$data.test-result = err.message
        else
          @$data.test-result = result
</script>

<style lang="stylus">
.ui-textbox-textarea
  min-height: 200px
</style>
