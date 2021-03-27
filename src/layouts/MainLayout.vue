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
          <q-btn flat to="/keys">Api Key</q-btn>
        </div>
        <div v-if="user&&user.level === 0">
          <q-btn flat to="/Users">Users</q-btn>
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
                  <div
                    v-if="currentUser && !currentUser.emailVerified"
                  >
                    <q-btn
                      class="q-mt-md"
                      flat
                      @click="sendMail"
                    >
                      인증 메일 재발송
                    </q-btn>
                  </div>
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
import notify from '../mixins/notify'
import errors from '../mixins/errors'
import user from '../mixins/user'

export default {
  name: 'MainLayout',
  mixins: [errors, notify, user],
  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },
  async created () {
    this.$firebase.auth().onAuthStateChanged(async (user) => {
      this.currentUser = user
      if (user) {
        this.verified()
        this.getUserData(user.uid)
      } else {
        this.$store.commit('user/updateUser', null)
        this.$store.commit('user/updateVerify', false)
        if (this.$route.path !== '/') this.$router.push('/')
      }
    })
    await this.$firebase.auth().currentUser
  },
  data () {
    return {
      currentUser: null
    }
  },
  methods: {
    async logout () {
      await this.$firebase.auth().signOut()
      this.$store.commit('user/updateUser', null)
    },
    verified () {
      if (this.currentUser.emailVerified) {
        this.$store.commit('user/updateVerify', true)
      } else {
        this.userNotVerified()
        this.$store.commit('user/updateVerify', false)
      }
    },
    sendMail () {
      this.currentUser.sendEmailVerification().then(() => {
        this.sendEmailNoti()
      })
      // .catch((err) => {
      //   console.log('err send mail', err)
      // })
    }
  }
}
</script>
