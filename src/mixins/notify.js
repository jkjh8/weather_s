export default {
  methods: {
    sendEmailNoti () {
      this.$q.notify({
        timeout: 1000,
        color: 'positive',
        message: '가입하신 계정으로 인증 메일을 발송 했습니다.',
        caption: '인증후 사용이 가능합니다..',
        position: 'center',
        actions: [{ icon: 'close', color: 'white' }]
      })
    }
  }
}
