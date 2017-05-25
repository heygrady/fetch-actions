import selectActionType from '../src/selectActionType'

describe('selectActionType', () => {
  it('returns undefined with no action', () => {
    expect(
      selectActionType()
    ).toEqual(
      undefined
    )
  })

  it('returns undefined with no action type', () => {
    const action = {}
    expect(
      selectActionType(action)
    ).toEqual(
      undefined
    )
  })

  it('returns action type', () => {
    const type = 'TEST_TYPE'
    const action = { type }
    expect(
      selectActionType(action)
    ).toEqual(
      type
    )
  })
})
