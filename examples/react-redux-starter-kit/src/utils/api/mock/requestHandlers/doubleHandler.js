export default (request, action) => {
  const { payload } = action
  const counter = payload * 2
  return { counter }
}
