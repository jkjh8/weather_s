<template>
  <q-page class="align-center">
    <q-card flat style="min-width: 400px">
      <q-card-section class="fit row no-wrap">
        <span class="text-h6">
          <q-icon class="q-mr-sm" size="md" color="teal" name="assignment_ind" />
          <span>Dust</span>
        </span>
        <span class="q-mx-md">Update At {{ time }}</span>
        <q-space />
        <q-btn @click="update">Update</q-btn>
      </q-card-section>

      <q-card-section>
        <q-table
          :data="data"
          :columns="columns"
          row-key="name"
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div>
                <q-btn
                  flat
                  round
                  icon="check_circle"
                  color="teal"
                  @click="enable(props.row.id, true)"
                ></q-btn>
                <q-btn
                  flat
                  round
                  icon="block"
                  color="red-10"
                  @click="enable(props.row.id, false)"
                ></q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import moment from 'moment'
import loads from '../mixins/loads'

export default {
  mixins: [loads],
  computed: {
    time () {
      return moment(this.updatedAt).format('YYYY-MM-DD hh:mm:ss a')
    }
  },
  data () {
    return {
      updatedAt: '',
      columns: [
        { name: 'location', label: 'Local', field: 'sidoName', sortable: true, align: 'center' },
        { name: 'name', label: 'Name', field: 'stationName', sortable: true, align: 'center' },
        { name: 'time', label: 'Time', field: 'dataTime', sortable: true, align: 'center' },
        { name: 'khaiGrade', label: 'khaiGrade', field: 'khaiGrade', align: 'center' },
        { name: 'khaiValue', label: 'khaiValue', field: 'khaiValue', align: 'center' },
        { name: 'pm10Grade', label: 'pm10Grade', field: 'pm10Grade', align: 'center' },
        { name: 'pm10Value', label: 'pm10Value', field: 'pm10Value', align: 'center' },
        { name: 'pm25Grade', label: 'pm25Grade', field: 'pm25Grade', align: 'center' },
        { name: 'pm25Value', label: 'pm25Value', field: 'pm25Value', align: 'center' }
      ],
      data: [],
      db: null,
      callDustAll: null
    }
  },
  async mounted () {
    this.showLoading()
    this.db = this.$firebase.database()
    this.callDustAll = this.$firebase.functions().httpsCallable('getDustAll')
    await this.getDust()
    this.hideLoading()
  },
  methods: {
    async getDust () {
      this.data = []
      const r = await this.db.ref('dust').get()
      const rv = r.val()
      this.updatedAt = rv.updatedAt
      this.data = Object.values(rv.stations)

      // users.forEach(user => {
      //   const u = user.val()
      //   u.id = user.key
      //   this.data.push(u)
      // })
    },
    async enable (uid, value) {
      this.db.ref('users').child(uid).update({ enable: value })
        .then(res => {
          this.getUserInfo()
        })
        // .catch(err => {
        //   console.log(err)
        // })
    },
    async update () {
      this.callDustAll()
    }
  }
}
</script>

<style>

</style>
