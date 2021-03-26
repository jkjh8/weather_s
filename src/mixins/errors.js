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
    }
  }
}
