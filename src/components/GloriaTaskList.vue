<template>
  <div class="gloria-task-list">
    <template v-for="task in tasks" track-by="id">
      <gloria-task
        :id="task.id"
        :name="task.name"
        :code="task.code"
        :origin="task.origin"
        :source="task.source"
        :trigger-interval="task.triggerInterval"
        :need-interaction="task.needInteraction"
        :trigger-count="task.triggerCount"
        :push-date="task.pushDate | relativeDate"
        :push-count="task.pushCount"
        :is-enable="task.isEnable"
      ></gloria-task>
    </template>
  </div>
</template>

<script lang="livescript">
'use strict'

require! './GloriaTask.vue': GloriaTask

export
  name: 'gloria-task-list'
  components: {
    GloriaTask
  }
  props:
    tasks:
      type: Array
      default: []
</script>

<style lang="stylus">
.gloria-task-list
  .gloria-task:not(:last-child)
    margin-bottom: 8px
</style>
