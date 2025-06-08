<template>
  <q-page class="flex flex-center q-pa-xl">
    <q-card class="q-pa-lg shadow-2 rounded-borders" style="max-width: 500px; width: 100%;">
      <q-card-section class="text-center">
        <div class="text-h5 text-primary">Bem-vindo!</div>
        <div class="text-subtitle2 q-mt-sm">Cadastre-se ou entre na sua conta</div>
      </q-card-section>

      <q-separator class="q-my-md" />

      <!-- Login -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Login</div>
        <q-input
          filled
          v-model="loginUserOrEmail"
          label="Nome de usuário ou e-mail"
          dense
          :error="loginError"
        />
        <q-input
          filled
          v-model="loginPassword"
          label="Senha"
          type="password"
          dense
          class="q-mt-sm"
        />
        <q-btn
          label="Entrar"
          color="primary"
          class="q-mt-md full-width"
          @click="handleLogin"
        />
        <div v-if="loginMessage" class="text-negative q-mt-sm">{{ loginMessage }}</div>
      </q-card-section>

      <q-separator class="q-my-md" />

      <!-- Cadastro -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Cadastro</div>
        <q-input
          filled
          v-model="username"
          label="Nome de usuário"
          dense
          :error="usernameError"
        />
        <q-input
          filled
          v-model="email"
          label="E-mail"
          type="email"
          dense
          class="q-mt-sm"
          :error="emailError"
        />
        <q-input
          filled
          v-model="password"
          label="Senha"
          type="password"
          dense
          class="q-mt-sm"
          :error="passwordError"
        />
        <q-btn
          label="Cadastrar"
          color="secondary"
          class="q-mt-md full-width"
          @click="handleRegister"
          :disable="!isFormValid"
        />
        <div v-if="registerMessage" class="text-negative q-mt-sm">{{ registerMessage }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AuthPage',
  setup() {
    const router = useRouter()

    // Cadastro
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const registerMessage = ref('')

    const usernameError = computed(() => username.value.trim().length < 3)
    const emailError = computed(() => !email.value.includes('@'))
    const passwordError = computed(() => password.value.length < 6)
    const isFormValid = computed(() =>
      !usernameError.value && !emailError.value && !passwordError.value
    )

    function getUsers() {
      return JSON.parse(localStorage.getItem('users')) || []
    }

    function saveUsers(users) {
      localStorage.setItem('users', JSON.stringify(users))
    }

    function handleRegister() {
      if (!isFormValid.value) {
        registerMessage.value = 'Preencha todos os campos corretamente.'
        return
      }

      const users = getUsers()

      const exists = users.some(
        u => u.username === username.value || u.email === email.value
      )

      if (exists) {
        registerMessage.value = 'Usuário ou e-mail já cadastrado.'
        return
      }

      users.push({
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value
      })

      saveUsers(users)
      registerMessage.value = 'Cadastro realizado com sucesso!'
      setTimeout(() => {
        registerMessage.value = ''
        router.push('/itens')
      }, 1000)
    }

    // Login
    const loginUserOrEmail = ref('')
    const loginPassword = ref('')
    const loginMessage = ref('')
    const loginError = ref(false)

    function handleLogin() {
      const users = getUsers()

      const match = users.find(user =>
        (user.username === loginUserOrEmail.value || user.email === loginUserOrEmail.value) &&
        user.password === loginPassword.value
      )

      if (match) {
        loginError.value = false
        loginMessage.value = ''
        router.push('/itens')
      } else {
        loginMessage.value = 'Credenciais inválidas.'
        loginError.value = true
      }
    }

    return {
      // cadastro
      username,
      email,
      password,
      usernameError,
      emailError,
      passwordError,
      isFormValid,
      registerMessage,
      handleRegister,
      // login
      loginUserOrEmail,
      loginPassword,
      loginMessage,
      loginError,
      handleLogin
    }
  }
})
</script>