class IntervalAlarmsManager
  ->
    @jobs = {}

    chrome.alarms.on-alarm.add-listener ({ name }) ~>
      @jobs[name]?!

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
    chrome.alarms.clear "#{name}", (was-cleared) ~>
      if was-cleared
        @remove-job "#{name}"

      callback? was-cleared

  update: (name, period-in-minutes) ->
    chrome.alarms.clear "#{name}", (was-cleared) ->
      unless was-cleared
        chrome.alarms.get "#{name}", (alarm-info) ->
          console.log alarm-info
        # throw new Error "chrome.alrams.clear(#{name}) cannot work!"
      chrome.alarms.create "#{name}", { period-in-minutes }

module.exports = IntervalAlarmsManager
