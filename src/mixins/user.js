export default {
  methods: {
    validEmail (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    async getUserData (uid) {
      const u = await this.$firebase.firestore().collection('users').doc(uid).get()
      const ud = await u.data()
      if (ud) {
        this.$store.commit('user/updateUser', ud)
      } else {
        // this.userDbError()
      }
    }
  }
}
