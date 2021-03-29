<template>
  <q-page class="align-center">
    <q-card flat style="min-width: 400px">
      <q-card-section class="row no-wrap">
        <div class="text-h6">
          <q-icon class="q-mr-sm" size="md" color="teal" name="assignment_ind" />
          <span>station</span>
        </div>
        <q-space />
        <div class="row fit no-wrap q-ma-none q-pa-none" style="max-width: 400px;">
          <q-file class="items-center align-center" outlined dense v-model="file" @input="getSheet">
            <template after>
              <q-btn flat round icon="upload" @click="upload"></q-btn>
            </template>
          </q-file>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          :data="data"
          :columns="columns"
          row-key="name"
        >
          <template v-slot:body-cell-updateAt="props">
            <q-td :props="props">
              <div>
                {{ msToTime(props.value) }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div>
                <q-btn @click="edit(props.row)">수정</q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="popupAddr">
      <q-card style="width: 400px;">
        <q-card-section>
          <div class="text-h6">
            <q-icon name="map" />
            좌표 수정
          </div>
        </q-card-section>
        <q-card-section>
          <div v-if="select">
            {{ select.address_name }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="search" outlined dense @keyup.enter="searchPlace">
            <template append>
              <q-btn
                icon="search"
                round
                flat
                @click="searchPlace"
              ></q-btn>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section style="max-height: 120px; overflow-y: auto;">
          <q-list>
            <q-item
              v-for="(item, idx) in searchList"
              :key="idx"
              class="q-my-sm"
              clickable
              v-ripple
              @click="listClick(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.address_name }}</q-item-label>
                <q-item-label v-if="item.road_address" caption lines="1">{{ item.address_name }} {{ item.road_address.building_name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="current=null"/>
          <q-btn flat label="Submit" color="primary" v-close-popup @click="update" />
        </q-card-actions>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import loads from '../mixins/loads'
import XLSX from 'xlsx'
import moment from 'moment'
const Crypto = require('crypto-js')

export default {
  mixins: [loads],
  data () {
    return {
      columns: [
        { name: 'local', label: 'Local', field: 'local', sortable: true, align: 'center' },
        { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'center' },
        { name: 'address', label: 'Address', field: 'address', sortable: true, align: 'center' },
        { name: 'createAt', label: 'CreateAt', field: 'createAt', sortable: true, align: 'center' },
        { name: 'operation', label: 'Operation', field: 'operation', sortable: true, align: 'center' },
        { name: 'lat', label: 'Lat', field: 'lat', sortable: true, align: 'center' },
        { name: 'lng', label: 'Lng', field: 'lng', sortable: true, align: 'center' },
        { name: 'updateAt', label: 'UpdateAt', field: 'updateAt', align: 'center' },
        { name: 'action', label: 'Action', field: 'action', align: 'center' }
      ],
      data: [],
      db: null,
      file: null,
      result: null,
      search: '',
      searchList: [],
      select: null,
      popupAddr: false,
      current: null
    }
  },
  async mounted () {
    this.showLoading()
    this.db = this.$firebase.database()
    const newStation = this.db.ref('stations')
    newStation.on('value', (snapshot) => {
      console.log(snapshot.val())
      this.data = Object.values(snapshot.val())
    })
    let kakao = await this.$firebase.firestore().collection('keys').doc('kakao').get()
    kakao = kakao.data()
    const kakaoKey = {}
    kakaoKey.js = this.decode(kakao.js)
    kakaoKey.rest = this.decode(kakao.rest)
    this.$store.commit('keys/updateKakao', kakaoKey)
    this.hideLoading()
  },
  methods: {
    getSheet (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const excelFile = XLSX.read(data, { type: 'array' })
        this.result = XLSX.utils.sheet_to_json(excelFile.Sheets.Sheet1)
        console.log(this.result)
      }
      reader.readAsArrayBuffer(file)
      console.log('file pick')
    },
    async upload () {
      console.log(this.$store.state.keys.kakao.rest)
      const stations = {}
      for (let i = 0; i < this.result.length; i++) {
        const station = this.result[i]
        const place = await this.$axios.get(
          `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(station.address)}`, {
            headers:
            {
              Authorization: `KakaoAK ${this.$store.state.keys.kakao.rest}`
            }
          })
        if (place.data.documents[0]) {
          station.lat = place.data.documents[0].y
          station.lng = place.data.documents[0].x
        }
        station.updateAt = Date.now()
        stations[station.name] = station
      }
      console.log(stations)
      return this.db.ref('stations').update(stations)
    },
    handleFiles (file) {
      console.log(file.target.files)
    },
    decode (data) {
      return Crypto.AES.decrypt(data, 'password').toString(Crypto.enc.Utf8)
    },
    msToTime (ms) {
      return moment(ms).format('YYYY/MM/DD HH:mm:ss')
    },
    edit (item) {
      this.current = item
      this.popupAddr = true
      console.log(item)
    },
    async searchPlace () {
      const place = await this.$axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(this.search)}`, {
          headers:
          {
            Authorization: `KakaoAK ${this.$store.state.keys.kakao.rest}`
          }
        })
      this.searchList = place.data.documents
    },
    listClick (item) {
      this.select = item
    },
    update () {
      if (this.current) {
        const update = this.current
        update.lat = this.select.y
        update.lng = this.select.x
        this.db.ref('stations').child(this.current.name).update(update)
      }
      this.select = null
      this.current = null
    }
  }
}
</script>

<style>

</style>
