<template>
  <q-page class="flex flex-center q-pa-xl">
    <q-card class="q-pa-lg shadow-2 rounded-borders" style="max-width: 600px; width: 100%;">
      <q-card-section class="text-center">
        <div class="text-h5 text-primary">Aplicação de Gamificação e Inventário de Itens</div>
        <div class="text-subtitle2 q-mt-sm">
          Controle seus itens e inventário com uma abordagem gamificada!
        </div>
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section>
        <ul class="q-pl-lg">
          <li>Registrar itens e suas categorias.</li>
          <li>Gerenciar inventário e receber pontuações.</li>
          <li>Alterar local ou descartar itens.</li>
          <li>Definir limite de capacidade no inventário.</li>
        </ul>
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section class="text-center">
        <div class="text-subtitle1 q-mb-md">Entrar ou Criar novo usuário:</div>
        <q-btn color="primary" label="Ir para Login" @click="goToLogin" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>