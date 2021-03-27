<template>
  <q-page class="flex flex-center">
    <div style="position: relative; bottom: 100px; right: 80px;" @click="logo">
      <q-icon style="position: absolute;" size="200px" name="cloud" color="teal"></q-icon>
      <span >
        <div
          class="text-h6"
          style="position: absolute; top: 30px; left: 120px;">
          Weather
        </div>
        <div
          style="position: absolute; top: 55px; left: 140px;">Picker</div>
      </span>
    </div>
    <!-- <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link> -->
    <!-- <div>원본:{{ pass }}</div>
    <div>암호:{{ encodePass }}</div>
    <div>복호:{{ decodePass }}</div>
    <div class="row">
      <q-input style="width: 500px" v-model="pass"></q-input>
      <q-btn @click="encode">암호화</q-btn>
      <q-btn @click="decode">복호화</q-btn>
    </div>
    <div>
      <q-input v-model="dkey" style="width: 500px"></q-input>
      <q-input style="width: 500px" v-model="value"></q-input>
      <q-btn>update</q-btn>
    </div> -->
    <!-- <div class="main flex flex-center">
      <div class="text-h3 text-bold text-white">Weather Picker</div>
    </div> -->
  </q-page>
</template>

<script>
import Crypto from 'crypto-js'
export default {
  name: 'PageIndex',
  data: () => {
    return {
      pass: '',
      encodePass: '',
      decodePass: '',
      key: 'password',
      dkey: '',
      value: ''
    }
  },
  async mounted () {
    // await this.$firebase.auth().currentUser
  },
  methods: {
    encode () {
      this.encodePass = Crypto.AES.encrypt(this.pass, this.key).toString()
    },
    decode () {
      this.decodePass = Crypto.AES.decrypt(this.encodePass, this.key).toString(Crypto.enc.Utf8)
    },
    update () {
      this.$firebase.database().ref('users/admin').set({
        name: 'admin',
        email: 'jkjh82@gmail.com',
        level: 0,
        uuid: '543b2f24-8c53-11eb-8dcd-0242ac130003',
        call: 0
      })
    },
    logo () {
      console.log('logo')
      if (this.$store.state.user.user) {
        this.$router.push('/info')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>
.main {
  width: 60%;
  height: 500px;
  background: #082855;
  border-radius: 100px;
}
</style>
