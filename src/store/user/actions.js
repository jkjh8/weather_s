export function updateUser ({ commit }, payload) {
  console.log(payload)
  commit('updateUser', payload)
}
