export default {
  methods: {
    loginError (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          this.$q.notify({
            timeout: 1000,
            color: 'negative',
            message: '가입되지 않은 사용자 입니다.',
            icon: 'report_problem',
            position: 'center',
            actions: [{ icon: 'close', color: 'white' }]
          })
          break

        case 'auth/wrong-password':
          this.$q.notify({
            timeout: 1000,
            color: 'negative',
            message: '비밀 번호가 일치 하지 않습니다.',
            icon: 'report_problem',
            position: 'center',
            actions: [{ icon: 'close', color: 'white' }]
          })
          break
      }
    },
    registerError (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          this.$q.notify({
            timeout: 1000,
            color: 'negative',
            message: '이미 사용된 이메일입니다.',
            icon: 'report_problem',
            position: 'center',
            actions: [{ icon: 'close', color: 'white' }]
          })
          break
      }
    },
    userDbError () {
      this.$q.notify({
        timeout: 1000,
        color: 'negative',
        message: '사용자 계정 정보에 문제가 있어 불러 올수 없습니다.',
        caption: '관리자에게 문의하세요.',
        icon: 'report_problem',
        position: 'center',
        actions: [{ icon: 'close', color: 'white' }]
      })
    },
    userNotVerified () {
      this.$q.notify({
        timeout: 1000,
        color: 'negative',
        message: '인증되지 않은 사용자 입니다.',
        caption: '이메일 인증이 완료되지 않았습니다.',
        icon: 'report_problem',
        position: 'center',
        actions: [{ icon: 'close', color: 'white' }]
      })
    }
  }
}
