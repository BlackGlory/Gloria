require! 'chai': { expect }
require! '../../src/actions/types.ls': types
require! '../../src/actions/creator.ls': creator

describe 'tasks action creator', (...) !->
  it 'should create add-task', ->
    expect creator.add-task do
      name: 'TestName'
      code: 'TestCode'
      trigger-interval: 1
      need-interaction: false
    .to.eql do
      type: types.add-task
      name: 'TestName'
      code: 'TestCode'
      trigger-interval: 1
      need-interaction: false
      trigger-count: 0
      push-count: 0
      is-enable: true
      origin: ''

  it 'should create update-task', ->
    expect creator.update-task 'TestId', do
      name: 'TestName'
      code: 'TestCode'
    .to.eql do
      type: types.update-task
      id: 'TestId'
      name: 'TestName'
      code: 'TestCode'

  it 'should create update-task-by-origin', ->
    expect creator.update-task-by-origin 'TestOrigin', do
      code: 'TestCode'
    .to.eql do
      type: types.update-task-by-origin
      origin: 'TestOrigin'
      code: 'TestCode'

  it 'should create remove-task', ->
    expect creator.remove-task 'TestId'
    .to.eql do
      type: types.remove-task
      id: 'TestId'

  it 'should create remove-task-by-origin', ->
    expect creator.remove-task-by-origin 'TestOrigin'
    .to.eql do
      type: types.remove-task-by-origin
      origin: 'TestOrigin'

  it 'should create set-trigger-interval', ->
    expect creator.set-trigger-interval 'TestId', 1
    .to.eql do
      type: types.set-trigger-interval
      id: 'TestId'
      trigger-interval: 1

  it 'should create set-need-interaction', ->
    expect creator.set-need-interaction 'TestId', false
    .to.eql do
      type: types.set-need-interaction
      id: 'TestId'
      need-interaction: false

  it 'should create set-is-enable', ->
    expect creator.set-is-enable 'TestId', false
    .to.eql do
      type: types.set-is-enable
      id: 'TestId'
      is-enable: false

  it 'should create increase-trigger-count', ->
    expect creator.increase-trigger-count 'TestId'
    .to.eql do
      type: types.increase-trigger-count
      id: 'TestId'

  it 'should create increase-push-count', ->
    expect creator.increase-push-count 'TestId'
    .to.eql do
      type: types.increase-push-count
      id: 'TestId'

  it 'should create clear-all-tasks', ->
    expect creator.clear-all-tasks!
    .to.eql do
      type: types.clear-all-tasks

  it 'should create merge-tasks', ->
    expect creator.merge-tasks []
    .to.eql do
      type: types.merge-tasks
      new-tasks: []

describe 'notifications action creator', (...) !->
  it 'should create add-notification', ->
    expect creator.add-notification {}
    .to.eql do
      type: types.add-notification
      options: {}

  it 'should clear-all-notifications', ->
    expect creator.clear-all-notifications!
    .to.eql do
      type: types.clear-all-notifications

describe 'stages action creator', (...) !->
  it 'should commit-to-stage', ->
    expect creator.commit-to-stage 'TestId', []
    .to.eql do
      type: types.commit-to-stage
      id: 'TestId'
      next-stage: []

  it 'should clear-stage', ->
    expect creator.clear-stage 'TestId'
    .to.eql do
      type: types.clear-stage
      id: 'TestId'

  it 'should clear-all-stages', ->
    expect creator.clear-all-stages!
    .to.eql do
      type: types.clear-all-stages

  it 'should mark-stage-read', ->
    expect creator.mark-stage-read 'TestId'
    .to.eql do
      type: types.mark-stage-read
      id: 'TestId'
