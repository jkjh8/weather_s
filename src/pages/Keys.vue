<template>
  <q-page class="flex justify-center">
    <q-card flat style="width: 600px">
      <q-card-section>
        <div class="text-h6">
          <q-icon class="q-mr-sm" size="md" color="teal" name="vpn_key" />
          <span>API KEY</span>
        </div>
      </q-card-section>

      <q-card-section>
        <div>
          <q-input
            v-model="datakey"
            label="공공데이터 API"
            outlined
          >
          </q-input>
        </div>
        <div>
          <q-input
            v-model="kakaoRest"
            class="q-my-md"
            label="카카오 REST"
            outlined
          >
          </q-input>
        </div>
        <div>
          <q-input
            v-model="kakaoJs"
            label="카카오 JS"
            outlined
          >
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn class="q-mx-sm" @click="clear">Clear</q-btn>
        <q-btn class="q-mx-sm" color="primary" @click="submit">Submit</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import loads from '../mixins/loads'
import Crypto from 'crypto-js'

export default {
  mixins: [loads],
  data () {
    return {
      datakey: '',
      kakaoRest: '',
      kakaoJs: '',
      db: null
    }
  },
  async mounted () {
    this.showLoading()
    this.db = this.$firebase.database()
    await this.getKeys()
    this.hideLoading()
  },
  methods: {
    async getKeys () {
      const d = await this.db.ref('keys').child('data').get()
      const k = await this.db.ref('keys').child('kakao').get()
      if (d.exists() && k.exists()) {
        const data = d.val()
        this.datakey = data.key
        const kakao = k.val()
        this.kakaoRest = kakao.rest
        this.kakaoJs = kakao.js
      }
    },
    async submit () {
      const d = await this.encode(this.datakey)
      const kr = await this.encode(this.kakaoRest)
      const kj = await this.encode(this.kakaoJs)
      await this.db.ref('keys').child('data').update({ key: d })
      await this.db.ref('keys').child('kakao').update({ rest: kr, js: kj })
      this.getKeys()
    },
    clear () {
      this.data.key = ''
      this.kakao.rest = ''
      this.kakao.js = ''
    },
    encode (data) {
      return Crypto.AES.encrypt(data, 'password').toString()
    },
    decode (data) {
      return Crypto.AES.decrypt(data, 'password').toString(Crypto.enc.Utf8)
    }
  }
}
</script>

<style>

</style>
