<template>
  <div id="gloria-app">
    <ui-tabs
      type="icon-and-text" fullwidth background-color="primary" text-color="white"
      text-color-active="white" indicator-color="white"
    >
      <ui-tab icon="format_list_bulleted" header="Task">
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
        <gloria-fab @click="showNewDialogCode = true" color="primary" icon="add"></gloria-fab>
        <ui-modal :show.sync="showNewDialogCode" header="New Task">
          <textarea></textarea>
          <div slot="footer">
            <ui-button @click="switchDialog('showNewDialogCode', 'showNewDialogName')" color="primary">Next</ui-button>
            <ui-button @click="showNewDialogCode = false">Cancel</ui-button>
          </div>
        </ui-modal>
        <ui-modal :show.sync="showNewDialogName" header="New Task">
          <input type="text" />
          <div slot="footer">
            <ui-button @click="(showNewDialogName = false, createTask())" color="primary">Finish</ui-button>
            <ui-button @click="switchDialog('showNewDialogName', 'showNewDialogCode')">Back</ui-button>
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
  methods:
    switch-dialog: (current, next) ->
      this.$data[current] = false
      this.$data[next] = true
    create-task: ->
      console.log this
</script>

<style lang="stylus">
.ui-tabs-body
  height: calc(100vh - 72px)
  overflow-y: auto

.gloria-fab
  z-index: 1
</style>
