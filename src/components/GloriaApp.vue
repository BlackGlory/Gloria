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
              :need-interaction="task.needInteraction"
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
          <ui-checkbox v-el:need-interaction :value.sync="needInteraction">Notice need an interaction</ui-checkbox>
          <div slot="footer">
            <ui-button @click="(showNewDialogConfig = false, createTask())" color="primary">Finish</ui-button>
            <ui-button @click="switchDialog('showNewDialogConfig', 'showNewDialogName')">Back</ui-button>
          </div>
        </ui-modal>
      </ui-tab>
      <ui-tab icon="history" header="History">
        <div id="notification-list">
          <template v-for="notification in notifications" track-by="id">
            <gloria-notification
              :options="notification.options"
            ></gloria-notification>
          </template>
        </div>
      </ui-tab>
      <ui-tab icon="explore" header="Explore">
        Coming soon
      </ui-tab>
      <ui-tab icon="settings" header="Setting">
        <ui-button @click="showClearHistoryConfirm = true">Clear history</ui-button>
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
      </ui-tab>
    </ui-tabs>
  </div>
</template>

<script lang="livescript">
require! '../store.ls': store
require! '../actions/creator.ls': creator
require! './GloriaTask.vue': GloriaTask
require! './GloriaFab.vue': GloriaFab
require! './GloriaNotification.vue': GloriaNotification

export
  name: 'gloria-app'
  components: {
    GloriaTask
    GloriaFab
    GloriaNotification
  }
  data: ->
    show-new-dialog-code: false
    show-new-dialog-name: false
    show-new-dialog-config: false
    show-clear-history-confirm: false
    show-clear-tasks-confirm: false
    code: ''
    name: ''
    trigger-interval: 5
    need-interaction: false
    tasks: @$select 'tasks'
    notifications: @$select 'notifications'
  methods:
    switch-dialog: (current, next) ->
      @$data[current] = false
      @$data[next] = true
    create-task: ->
      store.dispatch creator.add-task {
        name: @$data.name
        code: @$data.code
        trigger-interval: @$data.trigger-interval
        need-interaction: @$data.need-interaction
      }
      @$data.code = ''
      @$data.name = ''
      @$data.trigger-interval = 5
      @$data.need-interaction = false
    clear-history: ->
      store.dispatch creator.clear-all-notifications!
    clear-tasks: ->
      store.dispatch creator.clear-all-tasks!
</script>

<style lang="stylus">
#task-list .gloria-task
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
