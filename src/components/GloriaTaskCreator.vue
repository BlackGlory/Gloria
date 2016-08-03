<template>
  <div class="gloria-task-creator">
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
      <gloria-slider :value.sync="triggerInterval" label="Trigger interval(minutes)" icon="event"></gloria-slider>
      <p>This task will trigger once every {{ triggerInterval }} min(s).</p>
      <ui-checkbox v-el:need-interaction :value.sync="needInteraction">Notice need an interaction</ui-checkbox>
      <div slot="footer">
        <ui-button @click="(showNewDialogConfig = false, createTask())" color="primary">Finish</ui-button>
        <ui-button @click="switchDialog('showNewDialogConfig', 'showNewDialogName')">Back</ui-button>
      </div>
    </ui-modal>
  </div>
</template>

<script lang="livescript">
'use strict'

require! '../store.ls': store
require! '../actions/creator.ls': creator
require! './GloriaFab.vue': GloriaFab
require! './GloriaSlider.vue': GloriaSlider

export
  name: 'gloria-task-creator'
  components: {
    GloriaFab
    GloriaSlider
  }
  data: ->
    show-new-dialog-code: false
    show-new-dialog-name: false
    show-new-dialog-config: false
    code: ''
    name: ''
    trigger-interval: 5
    need-interaction: false
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
</script>

<style lang="stylus">
.ui-textbox-textarea
  min-height: 200px

.gloria-fab
  z-index: 1
</style>
