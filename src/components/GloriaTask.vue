<template>
  <div class="gloria-task">
    <ui-collapsible :hide-icon="true">
      <div slot="header">
        <div class="row middle-xs">
          <div class="col-xs">
            <p><span>{{ name }}</span>
            <p>{{ 'TriggerCount' | i18n triggerCount }} {{ triggerCount | pluralize 'NounsTime' | i18n }}, {{ 'PushCount' | i18n pushCount }} {{ pushCount | pluralize 'NounsNotification' | i18n }}</p>
          </div>
          <div>
            <ui-switch :value.sync="isEnable"></ui-switch>
          </div>
        </div>
      </div>
      <div class="row middle-xs">
        <div class="col-xs">
          <gloria-slider :value.sync="triggerInterval" :label="'TriggerInterval' | i18n" icon="event"></gloria-slider>
          <p>{{ 'TaskIntervalDescription' | i18n name triggerInterval }} {{ triggerCount | pluralize 'NounsMinute' | i18n }}.</p>
          <ui-checkbox v-el:need-interaction :value.sync="needInteraction">{{ 'InteractionRequired' | i18n }}</ui-checkbox>
          <p v-show="origin">{{ 'Source' | i18n }}: <a :href="origin" target="_blank">{{ origin }}</a></p>
        </div>
        <div class="col-xs-3 end-xs">
          <ui-icon-button @click="showEditDialog = true" icon="edit" type="flat" :tooltip="'Edit' | i18n"></ui-icon-button>
          <ui-icon-button @click="showDeleteConfirm = true" icon="delete" type="flat" :tooltip="'Delete' | i18n"></ui-icon-button>
        </div>
      </div>
    </ui-collapsible>
    <ui-modal @opened="setEditDialog" @closed="setEditDialog" :show.sync="showEditDialog" :header="'Editor' | i18n">
      <ui-textbox name="editableName" :value.sync="editableName" :label="'TaskName' | i18n" type="text" :placeholder="'InputTaskName' | i18n"></ui-textbox>
      <ui-textbox
        :label="'TaskCode' | i18n"
        :multi-line="true"
        icon="code"
        name="editableCode"
        :value.sync="editableCode"
        :placeholder="'PasteYourFantasticCodeHere' | i18n"
      ></ui-textbox>
      <div slot="footer">
        <ui-button @click="(updateTask(), showEditDialog = false)" color="primary">{{ 'Save' | i18n }}</ui-button>
        <ui-button @click="showEditDialog = false">{{ 'Cancel' | i18n }}</ui-button>
      </div>
    </ui-modal>
    <ui-confirm
      :header="'DeleteTask' | i18n"
      type="danger"
      :confirm-button-text="'Delete' | i18n"
      :deny-button-text="'Cancel' | i18n"
      confirm-button-icon="delete"
      @confirmed="(removeTask(), showDeleteConfirm = false)"
      @denied="showDeleteConfirm = false"
      :show.sync="showDeleteConfirm"
      close-on-confirm
    >
      {{ 'DeleteTaskConfirm' | i18n }}
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
  background: $md-grey-300

  .ui-switch
    z-index: 1

  .ui-collapsible {
    margin-bottom: inherit
  }

  .ui-collapsible-header
    height: auto

  .ui-collapsible-header-content
    width: 100%

  .ui-collapsible-body
    border: inherit
    width: auto
</style>
