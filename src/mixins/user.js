export default {
  methods: {
    validEmail (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    showLoading () {
      this.$q.loading.show({
        message: '잠시만 기다려 주세요.'
      })
    },
    hideLoading () {
      this.$q.loading.hide()
    }
  }
}
