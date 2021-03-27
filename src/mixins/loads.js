export default {
  methods: {
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
