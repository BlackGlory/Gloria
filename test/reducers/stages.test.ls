require! 'chai': { expect }
require! '../../src/actions/types.ls': types
require! '../../src/reducers/stages.ls': stages

describe 'stages reducer', (...) !->
  it 'should handle initial state', ->
    expect stages undefined, {}
    .to.eql []

  it 'should handle commit-to-stage insert new stage', ->
    state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    ]

    new-state = stages state, do
      type: types.commit-to-stage
      id: '2'
      next-stage: [
        { message: 'test1' }
      ]

    expect(new-state.length).to.be.equal(2)
    expect(new-state[1].id).to.be.equal('2')
    expect(new-state[1].stage).to.be.an('array')
    expect(new-state[1].stage.length).to.be.equal(1)
    expect(new-state[1].stage[0]).to.eql({ message: 'test1', unread: false })

  it 'should handle commit-to-stage insert new stage(large)', ->
    state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    ]

    new-state = stages state, do
      type: types.commit-to-stage
      id: '2'
      next-stage: [{ message: "test#{i}" } for i in [0 to 100]]

    # [{ message: 'test0' } ... { message: 'test100' }].length === 101
    # to
    # [{ message: 'test0' } ... { message: 'test99' }].length === 100

    expect(new-state.length).to.be.equal(2)
    expect(new-state[1].id).to.be.equal('2')
    expect(new-state[1].stage).to.be.an('array')
    expect(new-state[1].stage.length).to.be.equal(100)

    expect(new-state[1].stage[0]).to.eql({ message: 'test0', unread: false })
    expect(new-state[1].stage[99]).to.eql({ message: 'test99', unread: false })

  it 'should handle commit-to-stage mixin new stage', ->
    state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
      { id: '2', stage: [
        { message: 'test1', unread: false }
        { message: 'test2', unread: true }
      ]}
    ]

    # [{ message: 'test1', unread: false }, { message: 'test2', unread: true }]
    # to
    # [{ message: 'test3', unread: true }, { message: 'test1', unread: false }, { message: 'test2', unread: false }]

    new-state = stages state, do
      type: types.commit-to-stage
      id: '2'
      next-stage: [
        { message: 'test1' }
        { message: 'test2' }
        { message: 'test3' }
      ]

    expect(new-state.length).to.be.equal(2)
    expect(new-state[1].id).to.be.equal('2')
    expect(new-state[1].stage).to.be.an('array')
    expect(new-state[1].stage.length).to.be.equal(3)

    expect(new-state[1].stage[0]).to.eql({ message: 'test3', unread: true })
    expect(new-state[1].stage[1]).to.eql({ message: 'test1', unread: false })
    expect(new-state[1].stage[2]).to.eql({ message: 'test2', unread: false })

  it 'should handle commit-to-stage mixin new stage(large stage)', ->
    state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
      { id: '2', stage: [{ message: "test#{i}", unread: true } for i in [1 to 100]]}
    ]

    new-state = stages state, do
      type: types.commit-to-stage
      id: '2'
      next-stage: [
        { message: 'test99' }
        { message: 'test100' }
        { message: 'test101' }
      ]

    # [{ message: 'test1', unread: true } ... { message: 'test100', unread: true }]
    # to
    # [{ message: 'test101', unread: true }, { message: 'test99', unread: false }, { message: 'test100', unread: false} ... { message: 'test98', unread: true } ]

    expect(new-state.length).to.be.equal(2)
    expect(new-state[1].id).to.be.equal('2')
    expect(new-state[1].stage).to.be.an('array')
    expect(new-state[1].stage.length).to.be.equal(100)

    expect(new-state[1].stage[0]).to.eql({ message: 'test101', unread: true })
    expect(new-state[1].stage[1]).to.eql({ message: 'test99', unread: false })
    expect(new-state[1].stage[2]).to.eql({ message: 'test100', unread: false })
    expect(new-state[1].stage[99]).to.eql({ message: 'test97', unread: true})

  it 'should handle commit-to-stage mixin new stage(large insert)', ->
    state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
      { id: '2', stage: [{ message: 'test1', unread: true }] }
    ]

    new-state = stages state, do
      type: types.commit-to-stage
      id: '2'
      next-stage: [{ message: "test#{i}", unread: true } for i in [1 to 101]]

    # [{ message: 'test1', unread: true }]
    # to
    # [{ message: 'test2', unread: true }, ..., { message: 'test101', unread: true }]

    expect(new-state.length).to.be.equal(2)
    expect(new-state[1].id).to.be.equal('2')
    expect(new-state[1].stage).to.be.an('array')
    expect(new-state[1].stage.length).to.be.equal(100)

    expect(new-state[1].stage[0]).to.eql({ message: 'test2', unread: true })
    expect(new-state[1].stage[99]).to.eql({ message: 'test101', unread: true })

  it 'should handle clear-stage', ->
    expect stages [{ id: '1' }, { id: '2' }, { id: '3' }], do
      type: types.clear-stage
      id: '2'
    .to.eql [{ id: '1' }, { id: '3' }]

  it 'should handle clear-all-stages', ->
    expect stages [{ stage: [] }], do
      type: types.clear-all-stages
    .to.eql []

  it 'should handle mark-stage-read', ->
    expect stages [
      { id: '1', stage: [{ message: 'test1', unread: true }, { message: 'test2', unread: false }]}
      { id: '2', stage: [{ message: 'test1', unread: true }, { message: 'test2', unread: false }]}
    ], do
      type: types.mark-stage-read
      id: '2'
    .to.eql [
      { id: '1', stage: [{ message: 'test1', unread: true }, { message: 'test2', unread: false }]}
      { id: '2', stage: [{ message: 'test1', unread: false }, { message: 'test2', unread: false }]}
    ]
