<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/api'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
import { format } from "date-fns";

const inscricoes = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        const { data } = await api.get(`/inscricaos?filters[user][id][$eq]=${userStore.id}&populate[evento]=*&populate[user]=*`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        console.log(data.data)
        inscricoes.value = data.data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
})

</script>

<template>
    <div class="row justify-content-center mt-5">
        <div v-if="loading" class="spinner-grow" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        <div v-if="inscricoes.length > 0 && !loading" class="col-8">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Evento</th>
                        <th scope="col">Data</th>
                        <th scope="col">Local</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="inscricao in inscricoes" :key="inscricao.id">
                        <td>{{ inscricao.evento.nome }}</td>
                        <td>{{ format(new Date(inscricao.evento.data), 'dd/MM/yyyy HH:mm') }}</td>
                        <td>{{ inscricao.evento.local }}</td>
                        <td>
                            <button class="btn btn-danger">Cancelar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="inscricoes.length === 0 && !loading" class="col-6 card text-center">
            <div class="card-body">
                <h5 class="card-title">Nenhuma inscrição encontrada</h5>
            </div>
            <div class="card-footer">
                <RouterLink to="/" class="btn btn-primary">Ver eventos</RouterLink>
            </div>
        </div>
    </div>
</template>