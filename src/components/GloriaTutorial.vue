<template>
  <div class="gloria-tutorial">
    <p>{{ 'EmptyTaskListDescription' | i18n}}</p>
    <p>{{{ 'InstallTaskFrom' | i18n }}}</p>
    <p>{{ 'Or' | i18n }}</p>
    <div class="row">
      <gloria-task-creator></gloria-task-creator><p>{{ 'CreateTask' | i18n }}</p>
    </div>
    <p>{{{ 'DocumentDescription' | i18n }}}</p>
  </div>
</template>

<script lang="livescript">
'use strict'

require! './GloriaTaskCreator.vue': GloriaTaskCreator

export
  name: 'gloria-tutorial'
  components: {
    GloriaTaskCreator
  }
</script>

<style lang="stylus">
.gloria-tutorial
  margin: 20px
  font-size: 150%

  .gloria-fab
    position: inherit
</style>
