<template>
  <q-page class="flex flex-center">
    <q-card style="width: 450px">
      <q-card-section class="row items-center">
        <q-icon class="q-px-sm" size="sm" name="login" color="teal"></q-icon>
        <div class="text-h6 text-bold">로그인</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row items-center q-ma-none">
        <q-btn
          class="full-width"
          flat
          @click="loginWithGoogle"
        >
          <q-avatar class="q-mr-sm" size="24px">
            <img src="~assets/google.png" />
          </q-avatar>
          <span class="text-subtitle1">구글로 로그인</span>
        </q-btn>
      </q-card-section>
      <q-form
        @submit.prevent.stop="onSubmit"
        @reset="onReset"
      >
        <q-card-section>
          <q-input
              ref="email"
              v-model="email"
              outlined
              label="E-Mail"
              :rules="[ val => val && validEmail(val) || '이메일을 주소를 확인해주세요.']"
              lazy-rules
            />
            <q-input
              ref="password"
              v-model="password"
              outlined
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              :rules="[ val => val.length >= 8 || '비밀번호는 최소 8자 이상 입력하세요']"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
        </q-card-section>

        <q-card-actions>
          <router-link class="q-ml-sm" to="/register">회원가입</router-link>
          <q-space />
          <q-btn label="Submit" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import userFunc from '../mixins/user'
import errors from '../mixins/errors'

export default {
  name: 'Login',
  mixins: [userFunc, errors],
  data () {
    return {
      isPwd: true,
      email: '',
      password: ''
    }
  },
  mounted () {
    // this.ui = new this.$ui.auth.AuthUI(this.$firebase.auth())
    // this.ui.start('#firebaseui-auth-container', this.uiConfig)
  },
  beforeDestroy () {
    this.hideLoading()
  },
  methods: {
    async onSubmit () {
      this.showLoading()
      try {
        const user = await this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        if (user) {
          this.$router.push('/')
        }
      } catch (err) {
        this.hideLoading()
        this.loginError(err)
      }
    },
    onReset () {
      this.email = ''
      this.password = ''
    },
    async loginWithGoogle () {
      this.showLoading()
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.$firebase.auth().languageCode = 'ko'
      try {
        const result = await this.$firebase.auth().signInWithPopup(provider)
        this.$router.push('/')
      } catch (err) {
        this.hideLoading()
        this.loginError(err)
      }
    }
  }
}
</script>

<style>

</style>
