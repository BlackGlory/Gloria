<template>
  <div id="gloria-app">
    <ui-tabs
      type="icon-and-text" fullwidth background-color="primary" text-color="white"
      text-color-active="white" indicator-color="white"
    >
      <ui-tab icon="format_list_bulleted" header="Task">
        <div id="task-list">
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
          <gloria-task></gloria-task>
        </div>
        <gloria-fab type="mini" @click="showNewDialogCode = true" color="primary" icon="add"></gloria-fab>
        <ui-modal :show.sync="showNewDialogCode" header="Paste your code">
          <ui-textbox
            label="Task Code"
            :multi-line="true"
            icon="code"
            name="code"
            :value.sync="code"
            placeholder="Paste your fantastic code here"
          ></ui-textbox>
          <div slot="footer">
            <ui-button @click="switchDialog('showNewDialogCode', 'showNewDialogName')" color="primary">Next</ui-button>
            <ui-button @click="showNewDialogCode = false">Cancel</ui-button>
          </div>
        </ui-modal>
        <ui-modal :show.sync="showNewDialogName" header="Give it a good name">
          <ui-textbox name="name" :value.sync="name" label="Task Name" type="text" placeholder="Input a task name"></ui-textbox>
          <div slot="footer">
            <ui-button @click="switchDialog('showNewDialogName', 'showNewDialogConfig')" color="primary">Next</ui-button>
            <ui-button @click="switchDialog('showNewDialogName', 'showNewDialogCode')">Back</ui-button>
          </div>
        </ui-modal>
        <ui-modal :show.sync="showNewDialogConfig" header="Finally some configuration">
          <ui-slider :value.sync="triggerInterval" label="Trigger interval(minutes)" icon="event"></ui-slider>
          <p>This task will trigger once every {{ triggerInterval }} min(s).</p>
          <ui-checkbox v-el:is-notice-again :value.sync="isNoticeAgain">Notice until an interaction</ui-checkbox>
          <ui-tooltip :trigger="$els.isNoticeAgain" position="bottom left" content="It means that if I ignored it, notice me again."></ui-tooltip>
          <div slot="footer">
            <ui-button @click="(showNewDialogConfig = false, createTask())" color="primary">Finish</ui-button>
            <ui-button @click="switchDialog('showNewDialogConfig', 'showNewDialogName')">Back</ui-button>
          </div>
        </ui-modal>
      </ui-tab>
      <ui-tab icon="history" header="History">
        Coming soon
      </ui-tab>
      <ui-tab icon="explore" header="Explore">
        Coming soon
      </ui-tab>
      <ui-tab icon="settings" header="Setting">
        <p>Thanks for Open Source World:</p>
        <p><a href="http://livescript.net/" target="_blank">LiveScript</a></p>
        <p><a href="https://vuejs.org/" target="_blank">Vue.js</a></p>
        <p><a href="https://github.com/JosephusPaye/Keen-UI" target="_blank">Keen UI</a></p>
        <p><a href="https://webpack.github.io/" target="_blank">webpack</a></p>
      </ui-tab>
    </ui-tabs>
  </div>
</template>

<script lang="livescript">
require! './GloriaTask.vue': GloriaTask
require! './GloriaFab.vue': GloriaFab
export
  name: 'gloria-app'
  components: {
    GloriaTask
    GloriaFab
  }
  data: ->
    show-new-dialog-code: false
    show-new-dialog-name: false
    show-new-dialog-config: false
    code: ''
    name: ''
    trigger-interval: 5
    is-notice-again: false
  methods:
    switch-dialog: (current, next) ->
      this.$data[current] = false
      this.$data[next] = true
    create-task: ->
      this.$data.code = ''
      this.$data.name = ''
      this.$data.trigger-interval = 5
      this.$data.is-notice-again = false
</script>

<style lang="stylus">
#task-list .gloria-task:not(:last-child)
  margin-bottom: 8px

.ui-tabs-body
  padding-top: 8px
  padding-bottom: 8px
  height: calc(100vh - 72px - 16px)
  overflow-y: auto

.ui-textbox-textarea
  min-height: 200px

.gloria-fab
  z-index: 1
</style>
