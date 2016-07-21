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
          <p>Source: {{ source }}</p>
          <p>Something tips here.</p>
        </div>
        <div>
          <ui-icon-button icon="cloud_download" tooltip="Update"></ui-icon-button>
          <ui-icon-button icon="star" color="success" tooltip="Star"></ui-icon-button>
          <ui-icon-button icon="edit" color="accent" tooltip="Edit"></ui-icon-button>
          <ui-icon-button icon="delete" color="danger" tooltip="Delete"></ui-icon-button>
        </div>
      </div>
    </ui-collapsible>
  </div>
</template>

<script lang="livescript">
export
  name: 'gloria-task'
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
  color: $md-white
  background: $md-blue

.ui-switch {
  z-index: 999;
}

.ui-collapsible {
  margin-bottom: inherit
}

.ui-collapsible-header
  color: $md-white
  background: $md-light-blue
  height: auto

  &:hover:not(.disabled)
  body[modality="keyboard"] &:focus
    background-color: $md-light-blue

.ui-collapsible-header-content
  width: 100%

.ui-collapsible-body
  border: inherit
  width: auto
</style>
