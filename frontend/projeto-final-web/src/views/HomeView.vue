<script setup>
import { ref } from 'vue'

// Mock de eventos usando ref
const eventos = ref([
  {
    id: 1,
    nome: "Evento de Tecnologia",
    categoria: "Tecnologia",
    data: "2024-10-01",
    descricao: "Um evento focado nas novas tendências em tecnologia.",
    imagem: "https://via.placeholder.com/400x200",
    detalhes: "Aqui estão mais informações sobre o evento de tecnologia."
  },
  {
    id: 2,
    nome: "Conferência de Marketing",
    data: "2024-10-10",
    categoria: "Marketing",
    descricao: "Explore as melhores práticas em marketing digital.",
    imagem: "https://via.placeholder.com/400x200",
    detalhes: "Aqui estão mais informações sobre a conferência de marketing."
  },
  {
    id: 3,
    nome: "Feira de Startups",
    data: "2024-11-05",
    categoria: "Startups",
    descricao: "Apresentação de startups inovadoras e networking.",
    imagem: "https://via.placeholder.com/400x200",
    detalhes: "Aqui estão mais informações sobre a feira de startups."
  },
  {
    id: 4,
    nome: "Sana",
    data: "2024-11-05",
    categoria: "Anime",
    descricao: "Evento voltado para cultura pop e geek.",
    imagem: "https://via.placeholder.com/400x200",
    detalhes: "Aqui estão mais informações sobre o evento Sana."
  }
]);

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
    <div class="container mt-4">
      <h1 class="text-center mb-4">Eventos</h1>
      <div class="row">
        <div class="col-md-4" v-for="evento in eventos" :key="evento.id">
          <div class="card mb-4">
            <img :src="evento.imagem" class="card-img-top" alt="Imagem do Evento">
            <div class="card-body">
              <h5 class="card-title">{{ evento.nome }}</h5>
              <p class="card-text">{{ evento.descricao }}</p>
              <p class="card-text"><small class="text-muted">Data: {{ evento.data }}</small></p>
              <p class="card-text"><small class="text-muted">Categoria: {{ evento.categoria }}</small></p>
              <button class="btn btn-primary" @click="abrirModal(evento)">Detalhes</button>
            </div>
          </div>
        </div>
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
            <img :src="selectedEvento.imagem" class="img-fluid mb-3" alt="Imagem do Evento">
            <p><strong>Data:</strong> {{ selectedEvento.data }}</p>
            <p><strong>Categoria:</strong> {{ selectedEvento.categoria }}</p>
            <p><strong>Detalhes:</strong> {{ selectedEvento.detalhes }}</p>
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
