<template>
  <q-layout view="lHh Lpr lFf">

    <!-- TOPO -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" aria-label="Menu" />
        <q-toolbar-title>
          Inventário Quasar
        </q-toolbar-title>
        <q-btn flat icon="person" @click="goToLogin" />
      </q-toolbar>
    </q-header>

    <!-- MENU LATERAL -->
    <q-drawer show-if-above v-model="leftDrawerOpen" bordered>
      <q-list>

        <q-item-label header>Menu</q-item-label>

        <q-item clickable v-ripple to="/home">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Início</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/itens">
          <q-item-section avatar><q-icon name="inventory" /></q-item-section>
          <q-item-section>Inventário</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/login">
          <q-item-section avatar><q-icon name="login" /></q-item-section>
          <q-item-section>Login</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- CONTEÚDO PRINCIPAL -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const router = useRouter()

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    function goToLogin () {
      router.push('/login')
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      goToLogin
    }
  }
}
</script>
