<template>
  <q-page class="align-center">
    <q-card flat style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">
          <q-icon class="q-mr-sm" size="md" color="teal" name="assignment_ind" />
          <span>station</span>
        </div>
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
import loads from '../mixins/loads'

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
        { name: 'updateAt', label: 'UpdateAt', field: 'updateAt', align: 'center' }
      ],
      data: [],
      db: null
    }
  },
  async mounted () {
    // this.showLoading()
    // this.db = this.$firebase.firestore().collection('users')
    // await this.getUserInfo()
    // this.hideLoading()
  },
  methods: {
    async getUserInfo () {
      this.data = []
      const users = await this.db.get()
      users.forEach(user => {
        const u = user.data()
        u.id = user.id
        this.data.push(u)
      })
    },
    async enable (uid, value) {
      this.db.doc(uid).set({ enable: value }, { merge: true })
        .then(res => {
          this.getUserInfo()
        })
        // .catch(err => {
        //   console.log(err)
        // })
    }
  }
}
</script>

<style>

</style>
