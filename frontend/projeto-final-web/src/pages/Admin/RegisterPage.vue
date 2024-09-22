<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError.js'

// Campos de registro
const firstName = ref('')
const lastName = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const exception = ref(undefined)
const router = useRouter()

// Para controlar a validação
const formSubmitted = ref(false)

// Função de validação simples de e-mail: deve conter "@" seguido de um "."
function isValidEmail(email) {
  return email.includes('@') && email.split('@')[1]?.includes('.')
}

async function register() {
  formSubmitted.value = true
  if (!firstName.value || !lastName.value || !username.value || !isValidEmail(email.value) || !password.value) {
    return
  }

  try {
    loading.value = true
    exception.value = undefined
    // Enviar dados de registro para a API
    const { data } = await api.post('/users', {
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      email: email.value,
      password: password.value,
      role: 1,
      confirmed: true
    })

    const { jwt } = data
    // Redirecionar após o sucesso
    router.push('/login')
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-6 card">
      <div class="card-body">
        <h5 class="card-title">Sign Up</h5>
        <div v-if="exception" class="alert alert-danger" role="alert">
          {{ exception.error.message }}
        </div>
        <div v-if="loading" class="spinner-grow" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <form v-else @submit.prevent="register" novalidate>
          <div class="mb-3">
            <label for="firstNameInput" class="form-label">Nome:</label>
            <input
              type="text"
              class="form-control"
              id="firstNameInput"
              v-model="firstName"
              placeholder="Insira seu nome"
              :class="{ 'is-invalid': formSubmitted && !firstName }"
              required
            />
            <div v-if="formSubmitted && !firstName" class="invalid-feedback">
              O nome é obrigatório.
            </div>
          </div>

          <div class="mb-3">
            <label for="lastNameInput" class="form-label">Sobrenome:</label>
            <input
              type="text"
              class="form-control"
              id="lastNameInput"
              v-model="lastName"
              placeholder="Insira seu sobrenome"
              :class="{ 'is-invalid': formSubmitted && !lastName }"
              required
            />
            <div v-if="formSubmitted && !lastName" class="invalid-feedback">
              O sobrenome é obrigatório.
            </div>
          </div>

          <div class="mb-3">
            <label for="usernameInput" class="form-label">Username:</label>
            <input
              type="text"
              class="form-control"
              id="usernameInput"
              v-model="username"
              placeholder="Escolha um nome de usuário"
              :class="{ 'is-invalid': formSubmitted && !username }"
              required
            />
            <div v-if="formSubmitted && !username" class="invalid-feedback">
              O nome de usuário é obrigatório.
            </div>
          </div>

          <div class="mb-3">
            <label for="emailInput" class="form-label">Email:</label>
            <input
              type="email"
              class="form-control"
              id="emailInput"
              v-model="email"
              placeholder="Insira seu email"
              :class="{ 'is-invalid': formSubmitted && !isValidEmail(email) }"
              required
            />
            <div v-if="formSubmitted && !isValidEmail(email)" class="invalid-feedback">
              Você deve informar um email válido.
            </div>
          </div>

          <div class="mb-3">
            <label for="passwordInput" class="form-label">Senha:</label>
            <input
              type="password"
              class="form-control"
              id="passwordInput"
              v-model="password"
              placeholder="Crie uma senha"
              :class="{ 'is-invalid': formSubmitted && !password }"
              required
            />
            <div v-if="formSubmitted && !password" class="invalid-feedback">
              A senha é um campo obrigatório.
            </div>
          </div>

          <div class="mb-3">
            <input type="submit" class="float-end btn btn-primary" value="Registrar" />
            <button type="button" @click="router.push('/login')" class="float-start btn btn-secondary">
              Voltar para Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
