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
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data: () => {
    return {
      //
    }
  },
  methods: {
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
