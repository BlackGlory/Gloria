<template>
  <div class="gloria-app">
    <ui-tabs
      type="icon-and-text"
      fullwidth
      raised
    >
      <ui-tab icon="format_list_bulleted" :header="'Task' | i18n">
        <template v-if="tasks.length > 0">
          <gloria-task-list :tasks="tasks"></gloria-task-list>
          <gloria-task-creator></gloria-task-creator>
        </template>
        <template v-if="tasks.length === 0">
          <gloria-tutorial></gloria-tutorial>
        </template>
      </ui-tab>
      <ui-tab icon="history" :header="'History' | i18n">
        <template v-if="notifications.length > 0">
          <gloria-notification-list :notifications="notifications"></gloria-notification-list>
        </template>
        <div class="description" v-if="notifications.length === 0">
          {{ 'EmptyHistoryDescription' | i18n }}
        </div>
      </ui-tab>
      <ui-tab icon="settings" :header="'Advanced' | i18n">
        <gloria-debug :config="config"></gloria-debug>
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
require! './GloriaTutorial.vue': GloriaTutorial

export
  name: 'gloria-app'
  components: {
    GloriaDebug
    GloriaTaskList
    GloriaTaskCreator
    GloriaNotificationList
    GloriaTutorial
  }
  data: ->
    tasks: @$select 'tasks'
    notifications: @$select 'notifications'
    config: @$select 'config'
</script>

<style lang="stylus">
.gloria-app
  .ui-tabs-body
    padding: 8px
    height: calc(100vh - 72px - 16px)
    overflow-y: auto

  .description
    text-align: center
</style>
