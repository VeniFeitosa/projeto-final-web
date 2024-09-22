<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload';
const uploadHelper = useUpload()
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
import { format } from "date-fns";

const eventos = ref([])
const loading = ref(true)

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

// Controla a exibição do modal
const selectedEvento = ref(null);
const showModal = ref(false);

function abrirModal(evento) {
  selectedEvento.value = evento;
  showModal.value = true;
}

function fecharModal() {
  showModal.value = false;
}
</script>

<template>
  <main>
    <div v-if="!loading" class="container mt-4">
      <h1 class="text-center mb-4">Eventos</h1>
      <div class="row">
        <div class="col-lg-4 col-md-6" v-for="evento in eventos" :key="evento.id">
          <div class="card mb-4">
            <img :src="uploadHelper(evento.imagem?.url)" class="card-img-top" alt="Imagem do Evento" style="max-height: 300px;object-fit: cover;object-position: center;">
            <div class="card-body">
              <h5 class="card-title">{{ evento.nome }}</h5>
              <p class="card-text">{{ evento.descricao }}</p>
              <p class="card-text"><small class="text-muted">Data: {{ format(new Date(evento.data), 'dd/MM/yyyy HH:mm') }}</small></p>
              <p class="card-text">Categoria: <span class="badge text-bg-secondary">{{ evento.categoria?.nome }}</span></p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
              <button class="btn btn-primary" @click="abrirModal(evento)">Detalhes</button>
              <button v-if="userStore.isAuthenticated && userStore.role !== 'Admin'" class="btn btn-secondary">Inscrever-se</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
      <div  class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>


    <!-- Modal do Bootstrap -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog">
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
  </main>
</template>

<style>
.modal-backdrop {
  display: none;
}
</style>
