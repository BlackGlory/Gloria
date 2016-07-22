<template>
  <div class="row gloria-task">
    <ui-collapsible :hide-icon="true">
      <div slot="header">
        <div class="row middle-xs">
          <div class="col-xs">
            <p><span>{{ name }}</span><span v-if="version">&nbsp;{{ version }}</span><span v-if="author">&nbsp;By {{ author }}</span></p>
            <p>Triggered {{ triggerCount }} times, Pushed {{ pushCount }} notifications.</p>
          </div>
          <div>
            <ui-switch :value.sync="isEnable"></ui-switch>
          </div>
        </div>
      </div>
      <div class="row middle-xs">
        <div class="col-xs">
          <ui-slider :value.sync="triggerInterval" label="Trigger interval(minutes)" icon="event"></ui-slider>
          <p>This task will trigger once every {{ triggerInterval }} min(s).</p>
          <ui-checkbox v-el:can-notice-repeatedly :value.sync="canNoticeRepeatedly">Notice until an interaction</ui-checkbox>
          <ui-tooltip :trigger="$els.canNoticeRepeatedly" position="bottom left" content="It means that if I ignored it, notice me again."></ui-tooltip>
          <!--p>Source: {{ source }}</p-->
          <!--p>Something tips here.</p-->
        </div>
        <div class="col-xs-3 end-xs">
          <!--ui-icon-button icon="cloud_download" type="flat" tooltip="Update"></ui-icon-button-->
          <!--ui-icon-button icon="star" type="flat" tooltip="Star"></ui-icon-button-->
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
require! '../store.ls': store
require! '../actions/creator.ls': creator

export
  name: 'gloria-task'
  data: ->
    show-delete-confirm: false
    show-edit-dialog: false
    editable-name: ''
    editable-code: ''
  methods:
    set-edit-dialog: ->
      @$data.editable-code = @code
      @$data.editable-name = @name
    edit-task: ->
      store.dispatch creator.edit-task @id, { name: @$data.editable-name, code: @$data.editable-code }
    remove-task: ->
      store.dispatch creator.remove-task @id
  watch:
    trigger-interval: ->
      store.dispatch creator.set-trigger-interval @id, @trigger-interval
    can-notice-repeatedly: ->
      store.dispatch creator.set-can-notice-repeatly @id, @can-notice-repeatedly
    is-enable: ->
      store.dispatch creator.set-is-enable @id, @is-enable
  props:
    id:
      type: Number
    code:
      type: String
    name:
      type: String
    version:
      type: String
    author:
      type: String
    source:
      type: String
    trigger-count:
      type: Number
    push-count:
      type: Number
    trigger-interval:
      type: Number
    can-notice-repeatedly:
      type: Boolean
    is-enable:
      type: Boolean
</script>

<style lang="stylus">
@import '../../node_modules/keen-ui/src/styles/md-colors'

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
