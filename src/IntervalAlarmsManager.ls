class IntervalAlarmsManager
  ->
    @jobs = {}

    chrome.alarms.on-alarm.add-listener ({ name }) ~>
      try
        @jobs[name]?!
      catch e
        console.error e

  add-job: (name, job) ->
    @jobs["#{name}"] = job

  remove-job: (name) ->
    delete @jobs["#{name}"]

  add: (name, period-in-minutes, job) ->
    if period-in-minutes < 1
      period-in-minutes = 1
    @add-job "#{name}", job
    chrome.alarms.create "#{name}", { period-in-minutes }

  remove: (name, callback) ->
    chrome.alarms.clear "#{name}", ~>
      @remove-job "#{name}"
      callback?!

module.exports = IntervalAlarmsManager
