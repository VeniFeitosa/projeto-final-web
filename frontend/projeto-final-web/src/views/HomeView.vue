<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import { useUserStore } from '@/stores/userStore'
import { format } from "date-fns"
import router from '@/router'
import ToastManager from '@/components/ToastManager.vue'
import { toast } from 'vue-sonner'

const eventos = ref([])
const loading = ref(true)
const userStore = useUserStore()
const uploadHelper = useUpload()

onMounted(async () => {
  try {
    const { data } = await api.get('/eventos?populate=*')
    eventos.value = data.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

// Controla a exibição dos modais
const selectedEvento = ref(null)
const showModal = ref(false)
const showLoginModal = ref(false) // Modal de login necessário
const showConfirmModal = ref(false) // Modal de confirmação de inscrição

function abrirModal(evento) {
  selectedEvento.value = evento
  showModal.value = true
}

function fecharModal() {
  showModal.value = false
}

function abrirLoginModal() {
  showLoginModal.value = true
}

function fecharLoginModal() {
  showLoginModal.value = false
}

function abrirConfirmModal(evento) {
  selectedEvento.value = evento
  showConfirmModal.value = true
}

function fecharConfirmModal() {
  showConfirmModal.value = false
}

async function inscreverSe(evento) {
  if (userStore.isAuthenticated) {
    try {
      const { data } = await api.get(`/inscricaos`, {
        params: {
          filters: {
            evento: { id: evento.id },
            user: { id: userStore.user.id }
          }
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (data.data.length > 0) {
        toast.warning('Você já está inscrito neste evento.')
        return
      }

      abrirConfirmModal(evento)

    } catch (error) {
      console.error('Erro ao verificar a inscrição:', error.response?.data || error)
      toast.error('Erro ao verificar a inscrição.')
    }
  } else {
    abrirLoginModal()
  }
}

async function confirmarInscricao() {
  try {
    await api.post('/inscricaos', {
      data: {
        evento: { id: selectedEvento.value.id },
        user: { id: userStore.user.id }
      }
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    toast.success('Inscrição realizada com sucesso!')
  } catch (error) {
    console.error('Erro ao se inscrever no evento:', error.response?.data || error)
    toast.error('Erro ao se inscrever no evento.')
  } finally {
    fecharConfirmModal()
  }
}

function redirecionarLogin() {
  fecharLoginModal()
  router.push('/login')
}
</script>

<template>
  <main>
    <!-- Toast Manager component -->
    <ToastManager />

    <div v-if="!loading" class="container mt-4">
      <h1 class="text-center mb-4">Eventos</h1>
      <div class="row">
        <div class="col-lg-4 col-md-6" v-for="evento in eventos" :key="evento.id">
          <div class="card mb-4">
            <img :src="uploadHelper(evento.imagem?.url)" class="img-fluid card-img-top" alt="Imagem do Evento" style="height: 18.75rem;object-fit: cover;object-position: center;">
            <div class="card-body" style="height: 200px;">
              <h5 class="card-title">{{ evento.nome }}</h5>
              <p class="card-text">{{ evento.descricao }}</p>
              <p class="card-text"><small class="text-muted">Data: {{ format(new Date(evento.data), 'dd/MM/yyyy HH:mm') }}</small></p>
              <p class="card-text">Categoria: <span class="badge text-bg-secondary">{{ evento.categoria?.nome }}</span></p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
              <button class="btn btn-primary" @click="abrirModal(evento)">Detalhes</button>
              <!-- Condicional para mostrar o botão de inscrição apenas se o usuário estiver autenticado -->
              <button v-if="userStore.isAuthenticated && userStore.role !== 'Admin'" class="btn btn-secondary" @click="inscreverSe(evento)">Inscrever-se</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Modal de Detalhes do Evento -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog" @click.self="fecharModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedEvento.nome }}</h5>
            <button type="button" class="btn-close" @click="fecharModal"></button>
          </div>
          <div class="modal-body">
            <img :src="uploadHelper(selectedEvento.imagem?.url)" class="img-fluid mb-3" alt="Imagem do Evento">
            <p><strong>Data:</strong> {{ format(new Date(selectedEvento.data), 'dd/MM/yyyy HH:mm') }}</p>
            <p><strong>Categoria:</strong> {{ selectedEvento.categoria.nome }}</p>
            <p><strong>Descrição:</strong> {{ selectedEvento.descricao }}</p>
            <p><strong>Endereço:</strong> {{ selectedEvento.endereco }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharModal">Fechar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Inscrição -->
    <div v-if="showConfirmModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog" @click.self="fecharConfirmModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Inscrição</h5>
            <button type="button" class="btn-close" @click="fecharConfirmModal"></button>
          </div>
          <div class="modal-body">
            <p>Deseja confirmar a inscrição no evento <strong>{{ selectedEvento.nome }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharConfirmModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="confirmarInscricao">Confirmar Inscrição</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Login Necessário -->
    <div v-if="showLoginModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog" @click.self="fecharLoginModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Login Necessário</h5>
            <button type="button" class="btn-close" @click="fecharLoginModal"></button>
          </div>
          <div class="modal-body">
            <p>Você precisa fazer login para se inscrever neste evento.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharLoginModal">Fechar</button>
            <button type="button" class="btn btn-primary" @click="redirecionarLogin">Fazer Login</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<style>
.modal-backdrop {
  display: none;
}
</style>
