<template>
  <div class="gloria-task">
    <ui-collapsible :hide-icon="true">
      <div slot="header">
        <div class="row middle-xs">
          <div class="col-xs">
            <p><span>{{ name }}</span>
            <p>Triggered {{ triggerCount }} {{ triggerCount | pluralize 'time' }}, Pushed {{ pushCount }} {{ pushCount | pluralize 'notification' }}</p>
          </div>
          <div>
            <ui-switch :value.sync="isEnable"></ui-switch>
          </div>
        </div>
      </div>
      <div class="row middle-xs">
        <div class="col-xs">
          <gloria-slider :value.sync="triggerInterval" label="Trigger interval(minutes)" icon="event"></gloria-slider>
          <p>Task {{ name }} will trigger every {{ triggerInterval }} {{ triggerInterval | pluralize 'minute' }}.</p>
          <ui-checkbox v-el:need-interaction :value.sync="needInteraction">Notice need an interaction</ui-checkbox>
          <p v-show="origin">Source: <a :href="origin" target="_blank">{{ origin }}</a></p>
        </div>
        <div class="col-xs-3 end-xs">
          <ui-icon-button @click="showEditDialog = true" icon="edit" type="flat" tooltip="Edit"></ui-icon-button>
          <ui-icon-button @click="showDeleteConfirm = true" icon="delete" type="flat" tooltip="Delete"></ui-icon-button>
        </div>
      </div>
    </ui-collapsible>
    <ui-modal @opened="setEditDialog" @closed="setEditDialog" :show.sync="showEditDialog" header="Editor">
      <ui-textbox name="editableName" :value.sync="editableName" label="Task Name" type="text" placeholder="Input a task name"></ui-textbox>
      <ui-textbox
        label="Task Code"
        :multi-line="true"
        icon="code"
        name="editableCode"
        :value.sync="editableCode"
        placeholder="Paste your fantastic code here"
      ></ui-textbox>
      <div slot="footer">
        <ui-button @click="(editTask(), showEditDialog = false)" color="primary">Save</ui-button>
        <ui-button @click="showEditDialog = false">Cancel</ui-button>
      </div>
    </ui-modal>
    <ui-confirm
      header="Delete task"
      type="danger"
      confirm-button-text="Delete"
      confirm-button-icon="delete" deny-button-text="Cancel"
      @confirmed="(removeTask(), showDeleteConfirm = false)"
      @denied="showDeleteConfirm = false"
      :show.sync="showDeleteConfirm" close-on-confirm
    >
    Are you sure you want to delete the task?
    </ui-confirm>
  </div>
</template>

<script lang="livescript">
'use strict'

require! '../store.ls': store
require! '../actions/creator.ls': creator
require! './GloriaSlider.vue': GloriaSlider

export
  name: 'gloria-task'
  components: {
    GloriaSlider
  }
  data: ->
    show-delete-confirm: false
    show-edit-dialog: false
    editable-name: ''
    editable-code: ''
  methods:
    set-edit-dialog: ->
      @$data.editable-code = @code
      @$data.editable-name = @name
    update-task: ->
      store.dispatch creator.update-task @id, { name: @$data.editable-name, code: @$data.editable-code }
    remove-task: ->
      store.dispatch creator.remove-task @id
      store.dispatch creator.clear-stage @id
  watch:
    trigger-interval: ->
      store.dispatch creator.set-trigger-interval @id, @trigger-interval
    need-interaction: ->
      store.dispatch creator.set-need-interaction @id, @need-interaction
    is-enable: ->
      store.dispatch creator.set-is-enable @id, @is-enable
  props:
    id:
      type: String
    code:
      type: String
    name:
      type: String
    source:
      type: String
    trigger-count:
      type: Number
    push-count:
      type: Number
    trigger-interval:
      type: Number
    need-interaction:
      type: Boolean
    is-enable:
      type: Boolean
    origin:
      type: String
</script>

<style lang="stylus">
@import '~keen-ui/src/styles/md-colors'

.gloria-task
  // color: $md-white
  // background: $md-blue-600
  background: $md-grey-300

  .ui-switch
    z-index: 1

  .ui-collapsible {
    margin-bottom: inherit
  }

  .ui-collapsible-header
    // color: $md-white
    // background: $md-blue
    height: auto

    &:hover:not(.disabled)
    body[modality="keyboard"] &:focus
      // background-color: $md-blue-400

  .ui-collapsible-header-content
    width: 100%

  .ui-collapsible-body
    border: inherit
    width: auto
</style>
