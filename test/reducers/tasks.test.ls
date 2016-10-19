require! 'chai': { expect }
require! '../../src/actions/types.ls': types
require! '../../src/reducers/tasks.ls': tasks

describe 'tasks reducer', (...) !->
  it 'should handle initial state', ->
    expect tasks undefined, {}
    .to.eql []

  it 'should handle add-task', ->
    state = tasks [], do
      type: types.add-task
      name: 'TestName'
      code: 'TestCode'
      trigger-interval: 1
      need-interaction: false
      trigger-count: 0
      push-count: 0
      is-enable: true
      origin: ''

    expect(state.length).to.be.equal(1)
    expect(state[0]).to.be.an('object')
    expect(state[0].id).to.be.a('string')
    expect(state[0].name).to.be.equal('TestName')
    expect(state[0].code).to.be.equal('TestCode')
    expect(state[0].trigger-interval).to.be.equal(1)
    expect(state[0].need-interaction).to.be.equal(false)
    expect(state[0].trigger-count).to.be.equal(0)
    expect(state[0].push-count).to.be.equal(0)
    expect(state[0].is-enable).to.be.equal(true)
    expect(state[0].origin).to.be.equal('')

  it 'should handle update-task', ->
    expect tasks [
      id: '1'
      name: 'NameBefore'
      code: 'CodeBefore'
    ], do
      type: types.update-task
      id: '1'
      name: 'NameAfter'
      code: 'CodeAfter'
    .to.eql [
      id: '1'
      name: 'NameAfter'
      code: 'CodeAfter'
    ]

  it 'should handle update-task-by-origin', ->
    expect tasks [
      id: '1'
      origin: 'TestOrigin'
      code: 'CodeBefore'
    ], do
      type: types.update-task-by-origin
      origin: 'TestOrigin'
      code: 'CodeAfter'
    .to.eql [
      id: '1'
      origin: 'TestOrigin'
      code: 'CodeAfter'
    ]

  it 'should handle remove-task', ->
    expect tasks [
      id: '1'
    ], do
      type: types.remove-task
      id: '1'
    .to.eql []

  it 'should handle remove-task-by-origin', ->
    expect tasks [
      origin: 'TestOrigin'
    ], do
      type: types.remove-task-by-origin
      origin: 'TestOrigin'
    .to.eql []

  it 'should handle set-trigger-interval', ->
    expect tasks [
      id: '1'
      trigger-interval: 1
    ], do
      type: types.set-trigger-interval
      id: '1'
      trigger-interval: 5
    .to.eql [
      id: '1'
      trigger-interval: 5
    ]

  it 'should handle set-need-interaction', ->
    expect tasks [
      id: '1'
      need-interaction: false
    ], do
      type: types.set-need-interaction
      id: '1'
      need-interaction: true
    .to.eql [
      id: '1'
      need-interaction: true
    ]

  it 'should handle set-is-enable', ->
    expect tasks [
      id: '1'
      is-enable: false
    ], do
      type: types.set-is-enable
      id: '1'
      is-enable: true
    .to.eql [
      id: '1'
      is-enable: true
    ]

  it 'should handle increase-trigger-count', ->
    date = new Date!
    expect tasks [
      id: '1'
      trigger-count: 0
    ], {
      type: types.increase-trigger-count
      id: '1'
      date
    }
    .to.eql [
      id: '1'
      trigger-count: 1
      trigger-date: date
    ]

  it 'should handle increase-push-count', ->
    date = new Date!
    expect tasks [
      id: '1'
      push-count: 0
    ], {
      type: types.increase-push-count
      id: '1'
      date
    }
    .to.eql [
      id: '1'
      push-count: 1
      push-date: date
    ]

  it 'should handle clear-all-tasks', ->
    expect tasks [
      id: '1'
    ], do
      type: types.clear-all-tasks
    .to.eql []

  it 'should handle merge-tasks', ->
    expect tasks [
      { id: '1', name: 'TestName1' }
      { id: '2', name: 'TestName2Before' }
    ], do
      type: types.merge-tasks
      new-tasks: [
        { id: '2', name: 'TestName2After' }
        { id: '3', name: 'TestName3' }
      ]
    .to.eql [
      { id: '1', name: 'TestName1' }
      { id: '2', name: 'TestName2After' }
      { id: '3', name: 'TestName3' }
    ]

  it 'should handle remove-origin', ->
    expect tasks [
      { id: '1', origin: 'TestOrigin' }
      { id: '2', origin: 'TestOrigin' }
    ], do
      type: types.remove-origin
      id: '2'
    .to.eql [
      { id: '1', origin: 'TestOrigin' }
      { id: '2' }
    ]
