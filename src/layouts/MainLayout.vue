<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white text-black">
        <q-toolbar-title>
          <q-btn flat to="/">
            <q-icon class="q-mx-sm" name="cloud" color="teal"></q-icon>
            <span>Weather Picker</span>
          </q-btn>
        </q-toolbar-title>
        <div v-if="user&&user.level === 0">
          <q-btn flat to="/admin">Admin</q-btn>
        </div>
        <div v-if="user">
          <q-btn flat to="/info">Info</q-btn>
        </div>
        <div v-if="!user" class="q-ma-md" >
          <q-btn color="blue" to="/login">Login</q-btn>
        </div>
        <div v-else class="q-ma-md" >
          <q-btn flat round>
            <q-avatar v-if="user.photoURL">
              <img :src="user.photoURL" />
            </q-avatar>
            <q-avatar v-else>
              <q-icon color="blue" name="account_circle" />
            </q-avatar>

            <q-menu class="no-shadow" max-width="400px" :offset="[0, 20]">
              <q-card style="width: 250px">
                <q-card-section class="text-center">
                  <q-avatar size="80px" v-if="user.photoURL">
                    <img :src="user.photoURL" />
                  </q-avatar>
                  <q-avatar size="80px" v-else>
                    <q-icon color="blue" size="xl" name="account_circle" />
                  </q-avatar>
                  <div class="q-mt-sm text-bold">{{ user.displayName }}</div>
                  <div class="q-mt-sm text-caption">{{ user.email }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="text-center">
                  <q-btn outline style="border: 1px" @click="logout">Logout</q-btn>
                </q-card-section>
              </q-card>
            </q-menu>
          </q-btn>
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
  async beforeCreate () {
    this.$firebase.auth().onAuthStateChanged(async (user) => {
      let result = null
      if (user) {
        result = await this.$firebase.firestore().collection('users').doc(user.uid).get()
        result = result.data()
        this.$store.commit('user/updateUser', result)
      } else {
        this.$store.commit('user/updateUser', result)
        if (this.$route.path !== '/') this.$router.push('/')
      }
    })
    await this.$firebase.auth().currentUser
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
