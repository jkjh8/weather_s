<template>
  <q-page class="flex flex-center">
    <div>
      <q-form
        @submit.prevent.stop="onSubmit"
        @reset="onReset"
      >
        <q-card style="width: 450px">
          <q-card-section>
            <div class="text-h6 text-bold">회원가입</div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <q-input
              ref="displayName"
              v-model="displayName"
              outlined
              label="Name"
              :rules="[ val => val && val.length > 0 || '이름을 입력하세요']"
              lazy-rules
            />
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
            <q-input
              ref="chkPassword"
              v-model="chkPassword"
              outlined
              :type="isChkPwd ? 'password' : 'text'"
              label="Password Check"
              :rules="[ val => val.length >= 8 && val === password || '비밀번호가 일치 하지 않습니다.']"
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
            <router-link class="q-ml-sm" to="/">돌아가기</router-link>
            <q-space />
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn class="q-ml-sm" flat label="Clear" type="reset" color="primary"/>
          </q-card-actions>
        </q-card>
        <!-- <q-btn @click="update">update</q-btn> -->
      </q-form>
    </div>
  </q-page>
</template>

<script>
import userFunc from '../mixins/user'
import loads from '../mixins/loads'
import notify from '../mixins/notify'

import Crypto from 'crypto-js'

export default {
  mixins: [userFunc, notify, loads],
  data () {
    return {
      isPwd: true,
      isChkPwd: true,
      email: '',
      password: '',
      chkPassword: '',
      displayName: '',
      db: null
    }
  },
  mounted () {
    this.db = this.$firebase.firestore()
  },
  beforeDestroy () {
    this.hideLoading()
  },
  methods: {
    onReset () {
      this.isPwd = true
      this.isChkPwd = true
      this.email = ''
      this.password = ''
      this.chkPassword = ''
      this.displayName = ''

      this.$refs.email.resetValidation()
      this.$refs.password.resetValidation()
      this.$refs.chkPassword.resetValidation()
      this.$refs.displayName.resetValidation()
    },
    updateProfile (uid, displayName) {
      this.$firebase.firestore().collection('users').doc(uid).set({ displayName: displayName }, { merge: true })
        .then(() => {
          // console.log('Document successfully written!')
        })
        // .catch((error) => {
        //   console.error('Error writing document: ', error)
        // })
    },
    async onSubmit () {
      this.showLoading()
      try {
        const user = await this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        user.user.updateProfile({ displayName: this.displayName })
        this.updateProfile(user.user.uid, this.displayName)
        this.getUserData(user.user.uid)
        this.decode(user.user.uid)
        this.sendMail(user.user)
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      } catch (err) {
        this.hideLoading()
        if (err.code === 'auth/email-already-in-use') {
          this.$q.notify({
            color: 'negative',
            message: '이미 사용된 이메일입니다.',
            icon: 'report_problem',
            position: 'center'
          })
        }
        // console.log('auth err: ', err)
      }
    },
    sendMail (user) {
      user.sendEmailVerification().then(() => {
        this.sendEmailNoti()
      })
      // .catch((err) => {
      //   console.log('err send mail', err)
      // })
    },
    decode (data) {
      const result = Crypto.AES.decrypt(data, 'password').toString(Crypto.enc.Utf8)
      console.log('uuid', result)
    }
  }
}
</script>

<style>

</style>
