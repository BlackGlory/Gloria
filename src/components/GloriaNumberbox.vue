<template>
  <div class="gloria-slider">
    <ui-textbox
      type="number"
      :validate-on-blur="false"
      :label="label"
      :name="name"
      :icon="icon"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :value.sync="textboxValue"
      :help-text="helpText"
      :validation-rules="validationRules"
    ></ui-textbox>
  </div>
</template>

<script lang="livescript">
'use strict'

require! 'keen-ui/lib/UiTextbox': UiTextbox

function get-value value, min, max
  try
    if value < min
      return parse-int min
    else if value > max
      return parse-int max
    else
      return parse-int value
  catch e
    return min

export
  name: 'gloria-numberbox'
  components: {
    UiTextbox
  }
  data: ->
    textbox-value: get-value @value, @min, @max
  computed:
    validation-rules: ->
      "numeric|min:#{@min}|max:#{@max}"
  ready: ->
    @$watch '$data.textboxValue', ((textbox-value) ~>
      @textbox-value = get-value textbox-value, @min, @max
      @value = @textbox-value
    ), immediate: true
  props:
    label:
      type: String
    name:
      type: String
      required: true
    icon:
      type: String
    placeholder:
      type: String
    min:
      type: Number
      default: 1
    max:
      type: Number
      default: 100
    value:
      type: Number
      required: true
      two-way: true
    help-text:
      type: String
</script>

<style lang="stylus">
</style>
