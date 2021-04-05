<template>
  <q-page class="align-center">
    <q-card flat style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">
          <q-icon class="q-mr-sm" size="md" color="teal" name="assignment_ind" />
          <span>Users</span>
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
        { name: 'name', label: 'Name', field: 'displayName', sortable: true, align: 'center' },
        { name: 'email', label: 'E-Mail', field: 'email', sortable: true, align: 'center' },
        { name: 'uuid', label: 'UUID', field: 'uuid', sortable: true, align: 'center' },
        { name: 'calls', label: 'Calls', field: 'calls', sortable: true, align: 'center' },
        { name: 'level', label: 'Level', field: 'level', sortable: true, align: 'center' },
        { name: 'enable', label: 'Enable', field: 'enable', sortable: true, align: 'center' },
        { name: 'action', label: 'Action', field: 'action', align: 'center' }
      ],
      data: [],
      db: null
    }
  },
  async mounted () {
    this.showLoading()
    this.db = this.$firebase.database()
    await this.getUserInfo()
    this.hideLoading()
  },
  methods: {
    async getUserInfo () {
      this.data = []
      const users = await this.db.ref('users').get()
      users.forEach(user => {
        const u = user.val()
        u.id = user.key
        this.data.push(u)
      })
    },
    async enable (uid, value) {
      this.db.ref('users').child(uid).update({ enable: value })
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
