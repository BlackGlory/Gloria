import types from '../../src/actions/types'
import stages from '../../src/reducers/stages'
import { range } from '../helpers'

describe('stages reducer', () => {
  test('should handle initial state', () => {
    expect(stages(undefined, {})).toEqual([])
  })

  test('should handle commit-single-to-stage insert new stage', () => {
    const state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    ]
    const newState = stages(state, {
      type: types.commitSingleToStage
    , id: '2'
    , nextStage: { message: 'test2' }
    })

    expect(newState.length).toEqual(2)
    expect(newState[1].id).toEqual('2')
    expect(newState[1].stage).toBeObject()
    expect(newState[1].stage).toEqual({ message: 'test2', unread: false})
  })

  test('should handle commit-single-to-stage mixin new stage', () => {
    const state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    , { id: '2', stage: { message: 'test1', unread: true }}
    ]

    const newState1 = stages(state, {
      type: types.commitSingleToStage
    , id: '2'
    , nextStage: { message: 'test1' }
    })
    expect(newState1[1].stage).toEqual({ message: 'test1', unread: false })

    const newState2 = stages(newState1, {
      type: types.commitSingleToStage
    , id: '2'
    , nextStage: { message: 'test2' }
    })
    expect(newState2[1].stage).toEqual({ message: 'test2', unread: true })
  })

  test('should handle commit-to-stage insert new stage', () => {
    const state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    ]
    const newState = stages(state, {
      type: types.commitToStage
    , id: '2'
    , nextStage: [
        { message: 'test1' }
      ]
    })

    expect(newState.length).toEqual(2)
    expect(newState[1].id).toEqual('2')
    expect(newState[1].stage).toBeArray()
    expect(newState[1].stage.length).toEqual(1)
    expect(newState[1].stage[0]).toEqual({ message: 'test1', unread: false })
  })

  test('should handle commit-to-stage insert new stage(large)', () => {
    const state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    ]
    const newState = stages(state, {
      type: types.commitToStage
    , id: '2'
    , nextStage: [...range(0, 100)].map(i => ({ message: `test${ i }` }))
    })

    /*
     [{ message: 'test0' } ... { message: 'test100' }].length === 101
     to
     [{ message: 'test0' } ... { message: 'test99' }].length === 100
    */

    expect(newState.length).toEqual(2)
    expect(newState[1].id).toEqual('2')
    expect(newState[1].stage).toBeArray()
    expect(newState[1].stage.length).toEqual(100)
    expect(newState[1].stage[0]).toEqual({ message: 'test0', unread: false })
    expect(newState[1].stage[99]).toEqual({ message: 'test99', unread: false })
  })

  test('should handle commit-to-stage mixin new stage', () => {
    const state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    , { id: '2', stage: [
        { message: 'test1', unread: false }
      , { message: 'test2', unread: true }
      ]}
    ]

    /*
     [{ message: 'test1', unread: false }, { message: 'test2', unread: true }]
     to
     [{ message: 'test3', unread: true }, { message: 'test1', unread: false }, { message: 'test2', unread: false }]
    */
    const newState = stages(state, {
      type: types.commitToStage,
      id: '2',
      nextStage: [
        { message: 'test1' }
      , { message: 'test2' }
      , { message: 'test3' }
      ]
    })

    expect(newState.length).toEqual(2)
    expect(newState[1].id).toEqual('2')
    expect(newState[1].stage).toBeArray()
    expect(newState[1].stage.length).toEqual(3)
    expect(newState[1].stage[0]).toEqual({ message: 'test3', unread: true })
    expect(newState[1].stage[1]).toEqual({ message: 'test1', unread: false })
    expect(newState[1].stage[2]).toEqual({ message: 'test2', unread: false })
  })

  test('should handle commit-to-stage mixin new stage(large stage)', () => {
    const state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    , { id: '2', stage: [...range(1, 100)].map(i => ({ message: `test${ i }`, unread: true })) }
    ]
    const newState = stages(state, {
      type: types.commitToStage,
      id: '2',
      nextStage: [
        { message: 'test99' }
      , { message: 'test100' }
      , { message: 'test101' }
      ]
    })

    /*
      [{ message: 'test1', unread: true } ... { message: 'test100', unread: true }]
      to
      [{ message: 'test101', unread: true }, { message: 'test99', unread: false }, { message: 'test100', unread: false} ... { message: 'test98', unread: true } ]
    */

    expect(newState.length).toEqual(2)
    expect(newState[1].id).toEqual('2')
    expect(newState[1].stage).toBeArray()
    expect(newState[1].stage.length).toEqual(100)

    expect(newState[1].stage[0]).toEqual({ message: 'test101', unread: true })
    expect(newState[1].stage[1]).toEqual({ message: 'test99', unread: false })
    expect(newState[1].stage[2]).toEqual({ message: 'test100', unread: false })
    expect(newState[1].stage[99]).toEqual({ message: 'test97', unread: true })
  })

  test('should handle commit-to-stage mixin new stage(large insert)', () => {
    const state = [
      { id: '1', stage: [{ message: 'test1', unread: true }] }
    , { id: '2', stage: [{ message: 'test1', unread: true }] }
    ]
    const newState = stages(state, {
      type: types.commitToStage,
      id: '2',
      nextStage: [...range(1, 101)].map(i => ({
        message: `test${ i }`
      , unread: true
      }))
    })

    /*
     [{ message: 'test1', unread: true }]
     to
     [{ message: 'test2', unread: true }, ..., { message: 'test101', unread: true }]
    */

    expect(newState.length).toEqual(2)
    expect(newState[1].id).toEqual('2')
    expect(newState[1].stage).toBeArray()
    expect(newState[1].stage.length).toEqual(100)
    expect(newState[1].stage[0]).toEqual({ message: 'test2', unread: true })
    expect(newState[1].stage[99]).toEqual({ message: 'test101', unread: true })
  })

  test('should handle clear-stage', () => {
    expect(
      stages(
        [{ id: '1' }, { id: '2' }, { id: '3' }]
      , { type: types.clearStage, id: '2' }
      )
    )
    .toEqual([{ id: '1' }, { id: '3' }])
  })

  test('should handle clear-all-stages', () => {
    expect(
      stages(
        [{ stage: [] }]
      , { type: types.clearAllStages }
      )
    )
    .toEqual([])
  })

  test('should handle mark-stage-read', () => {
    expect(
      stages([
        { id: '1', stage: [{ message: 'test1', unread: true }, { message: 'test2', unread: false }]}
      , { id: '2', stage: [{ message: 'test1', unread: true }, { message: 'test2', unread: false }]}
      ]
      , {
        type: types.markStageRead,
        id: '2'
        }
      )
    )
    .toEqual([
      { id: '1', stage: [{ message: 'test1', unread: true }, { message: 'test2', unread: false }]}
    , { id: '2', stage: [{ message: 'test1', unread: false }, { message: 'test2', unread: false }]}
    ])
  })

  test('should handle merge-stages', () => {
    expect(
      stages(
        [
          { id: '1', stage: ['Test1'] }
        , { id: '2', stage: ['Test2'] }
        ]
      , {
          type: types.mergeStages
        , newStages: [
            { id: '2', stage: ['Test3'] }
          , { id: '3', stage: ['Test4'] }
          ]
        }
      )
    )
    .toEqual([
      { id: '1', stage: ['Test1'] }
    , { id: '2', stage: ['Test3'] }
    , { id: '3', stage: ['Test4'] }
    ])
  })
})