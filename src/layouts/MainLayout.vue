<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat to="/">
            <q-icon class="q-mx-sm" name="cloud"></q-icon>
            <span class="text-h6">Weather Picker</span>
          </q-btn>
        </q-toolbar-title>
        <div v-if="!user">
          <q-btn flat to="/login">Login</q-btn>
        </div>
        <div v-else>
          <q-btn flat>
            <q-avatar>
              <img :src="user.photoURL" />
            </q-avatar>
          </q-btn>

          <q-btn flat @click="logout">Logout</q-btn>
        </div>
      </q-toolbar>

    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MainLayout',
  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },
  mounted () {
    console.log(this.user)
  },
  data () {
    return {
    //
    }
  },
  methods: {
    async logout () {
      await this.$firebase.auth().signOut()
      this.$store.commit('user/updateUser', null)
      console.log('logout', this.user)
    }
  }
}
</script>
