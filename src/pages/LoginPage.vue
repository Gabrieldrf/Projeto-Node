<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-md" style="width: 300px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="username"
          label="Nome de Usuário"
          filled
          dense
          @keyup.enter="login"
        />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="password"
          label="Senha"
          type="password"
          filled
          dense
          @keyup.enter="login"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Entrar"
          color="primary"
          :disable="!username || !password"
          @click="login"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import api from 'src/services/api'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      const trimmedUser = this.username.trim()
      const trimmedPass = this.password.trim()
      if (!trimmedUser || !trimmedPass) return

      try {
        // Buscar usuário pelo username
        const res = await api.get(`/usuarios?username=${trimmedUser}`)

        if (res.data.length === 0) {
          // Se não existir, cria com 0 pontos e senha
          const createRes = await api.post('/usuarios', {
            username: trimmedUser,
            password: trimmedPass,
            points: 0
          })
          const user = createRes.data
          localStorage.setItem('currentUser', JSON.stringify(user))
          this.$router.push('/inventario')
        } else {
          const user = res.data[0]
          // Verifica se senha bate
          if (user.password === trimmedPass) {
            // Garantir que o localStorage tenha a pontuação atualizada
            localStorage.setItem('currentUser', JSON.stringify(user))
            this.$router.push('/inventario')
          } else {
            alert('Senha incorreta!')
          }
        }
      } catch (err) {
        console.error('Erro no login:', err)
      }
    }
  }
}
</script>