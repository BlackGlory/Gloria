<template>
  <div id="gloria-app">
    <ui-tabs
      type="icon-and-text"
      fullwidth
      raised
    >
      <ui-tab icon="format_list_bulleted" header="Task">
        <div id="task-list">
          <template v-for="task in tasks" track-by="id">
            <gloria-task
              :id="task.id"
              :name="task.name"
              :code="task.code"
              :version="task.version"
              :author="task.author"
              :source="task.source"
              :trigger-interval="task.triggerInterval"
              :can-notice-repeatedly="task.canNoticeRepeatedly"
              :trigger-count="task.triggerCount"
              :push-count="task.pushCount"
              :is-enable="task.isEnable"
            ></gloria-task>
          </template>
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
          <ui-checkbox v-el:can-notice-repeatedly :value.sync="canNoticeRepeatedly">Notice until an interaction</ui-checkbox>
          <ui-tooltip :trigger="$els.canNoticeRepeatedly" position="bottom left" content="It means that if I ignored it, notice me again."></ui-tooltip>
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
require! '../store.ls': store
require! '../actions/creator.ls': creator
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
    can-notice-repeatedly: false
    tasks: @$select 'tasks'
  methods:
    switch-dialog: (current, next) ->
      @$data[current] = false
      @$data[next] = true
    create-task: ->
      store.dispatch creator.add-task {
        name: @$data.name
        code: @$data.code
        trigger-interval: @$data.trigger-interval
        can-notice-repeatedly: @$data.can-notice-repeatedly
      }
      @$data.code = ''
      @$data.name = ''
      @$data.trigger-interval = 5
      @$data.can-notice-repeatedly = false
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
