<script setup>
  import TheWelcome from '../components/TheWelcome.vue'
  import { ref } from 'vue'

  // Mock de eventos usando ref
  const eventos = ref([
      {
        id: 1,
        nome: "Evento de Tecnologia",
        data: "2024-10-01",
        descricao: "Um evento focado nas novas tendências em tecnologia.",
        imagem: "https://via.placeholder.com/400x200"
      },
      {
        id: 2,
        nome: "Conferência de Marketing",
        data: "2024-10-10",
        descricao: "Explore as melhores práticas em marketing digital.",
        imagem: "https://via.placeholder.com/400x200"
      },
      {
        id: 3,
        nome: "Feira de Startups",
        data: "2024-11-05",
        descricao: "Apresentação de startups inovadoras e networking.",
        imagem: "https://via.placeholder.com/400x200"
      },
      {
        id: 4,
        nome: "Sana",
        data: "2024-11-05",
        descricao: "Apresentação de startups inovadoras e networking.",
        imagem: "https://via.placeholder.com/400x200"
      }
    ]);
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
            <button class="btn btn-primary">Detalhes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </main>
</template>
