<template>
  <div class="row gloria-task">
    <ui-collapsible :hide-icon="true">
      <div slot="header">
        <div class="row middle-xs">
          <div class="col-xs">
            <p><span>{{ name }}</span>&nbsp;<span>{{ version }}</span>&nbsp;<span>By {{ author }}</span></p>
            <p>Triggered {{ triggerCount }} times, Pushed {{ pushCount }} Notifications.</p>
          </div>
          <div>
            <ui-switch name="enable" :value.sync="true"></ui-switch>
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
          <ui-icon-button icon="edit" type="flat" tooltip="Edit"></ui-icon-button>
          <ui-icon-button icon="delete" type="flat" tooltip="Delete"></ui-icon-button>
        </div>
      </div>
    </ui-collapsible>
  </div>
</template>

<script lang="livescript">
export
  name: 'gloria-task'
  data: ->
    can-notice-repeatedly: false
    trigger-interval: 5
  props:
    name:
      type: String
      default: 'Task'
    version:
      type: String
      default: '1.0.0'
    author:
      type: String
      default: 'Unkonwn'
    source:
      type: String
      default: 'Unkonwn'
    trigger-count:
      type: Number
      default: 0
    push-count:
      type: Number
      default: 0
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
