<template>
  <div class="gloria-app">
    <ui-tabs
      type="icon-and-text"
      fullwidth
      raised
    >
      <ui-tab icon="format_list_bulleted" header="Task">
        <gloria-task-list :tasks="tasks"></gloria-task-list>
        <gloria-task-creator></gloria-task-creator>
      </ui-tab>
      <ui-tab icon="history" header="History">
        <gloria-notification-list :notifications="notifications"></gloria-notification-list>
      </ui-tab>
      <ui-tab icon="settings" header="Advanced">
        <gloria-debug></gloria-debug>
      </ui-tab>
    </ui-tabs>
  </div>
</template>

<script lang="livescript">
'use strict'

require! '../store.ls': store
require! '../actions/creator.ls': creator

require! './GloriaDebug.vue': GloriaDebug
require! './GloriaTaskList.vue': GloriaTaskList
require! './GloriaTaskCreator.vue': GloriaTaskCreator
require! './GloriaNotificationList.vue': GloriaNotificationList

export
  name: 'gloria-app'
  components: {
    GloriaDebug
    GloriaTaskList
    GloriaTaskCreator
    GloriaNotificationList
  }
  data: ->
    tasks: @$select 'tasks'
    notifications: @$select 'notifications'
</script>

<style lang="stylus">
.gloria-app
  .ui-tabs-body
    padding: 8px
    height: calc(100vh - 72px - 16px)
    overflow-y: auto
</style>
