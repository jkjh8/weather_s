<template>
  <q-page class="flex flex-center">
    <q-card style="min-width: 400px;">
      <q-card-section>
        <div class="text-h6">
          <q-icon class="q-mr-sm" color="teal" size="md" name="info" />
          <span>INFO</span>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="account_circle"></q-icon>
            </q-item-section>
            <q-item-section>{{user.displayName}}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="email"></q-icon>
            </q-item-section>
            <q-item-section>{{user.email}}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="vpn_key"></q-icon>
            </q-item-section>
            <q-item-section>{{user.uuid}}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="info"></q-icon>
            </q-item-section>
            <q-item-section v-if="user.enable">키가 활성화 되었습니다.</q-item-section>
            <q-item-section v-else class="text-red">키가 활성화 되지 않았습니다.</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Info',
  computed: {
    ...mapState({
      user: state => state.user.user,
      verified: state => state.user.verified
    })
  }
}
</script>

<style>

</style>
