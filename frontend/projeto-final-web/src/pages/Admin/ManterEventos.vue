<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/'
import { useUserStore } from '@/stores/userStore'
import { useUpload } from '@/composables/useUpload';
const uploadHelper = useUpload()

const loading = ref(true)
const eventos = ref([])

onMounted(async () => {
    try {
        const { data } = await api.get('/eventos?populate=*')
        eventos.value = data.data
        console.log(data.data)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
})

const deleteEvent = async (id) => {
    try {
        // await api.delete(`/eventos/${id}`)
        eventos.value = eventos.value.filter(evento => evento.id !== id)
    } catch (error) {
        console.error('Erro ao deletar o evento:', error)
    }
}

const editEvent = (id) => {
    // Redirecionar ou abrir um modal para editar o evento
    console.log('Editar evento com id:', id)
}
</script>

<template>

    <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
      <div  class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-if="eventos.length > 0 && !loading" class="mt-5">
        <div class="d-flex align-items-center justify-content-end">
            <button class="btn btn-primary me-4">Cadastrar evento</button>
        </div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Imagem</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">Endereço</th>
                    <th scope="col">Data</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(evento, index) in eventos" :key="evento.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>
                        <img v-if="evento.imagem" 
                             :src="uploadHelper(evento.imagem?.url)" 
                             alt="Imagem do evento" 
                             style="width: 100px; height: auto;" />
                    </td>
                    <td>{{ evento.nome }}</td>
                    <td>{{ evento.endereco }}</td>
                    <td>{{ evento.descricao }}</td>
                    <td>{{ new Date(evento.data).toLocaleDateString() }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" @click="editEvent(evento.id)">Editar</button>
                        <button class="btn btn-danger btn-sm" @click="deleteEvent(evento.id)">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else-if="!loading">
        <!-- card eventos não encontrados -->
        <div class="card text-center mx-auto mt-5" style="max-width: 60%;">
            <div class="card-body">
                <h5 class="card-title">Nenhum evento encontrado</h5>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary">Cadastrar evento</button>
            </div>
        </div>
    </div>
</template>
