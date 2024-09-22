<script setup>
import ToastManager from '@/components/ToastManager.vue'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/api'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue-sonner'
import { format } from "date-fns"
import { useUpload } from '@/composables/useUpload'

const userStore = useUserStore()
const inscricoes = ref([])
const loading = ref(true)
const uploadHelper = useUpload()

onMounted(async () => {
    try {
        const { data } = await api.get(`/inscricaos?filters[user][id][$eq]=${userStore.id}&populate[evento]=*&populate[user]=*`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        inscricoes.value = data.data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
})

async function cancelarInscricao(inscricaoId) {
    try {
        await api.delete(`/inscricaos/${inscricaoId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        // Remover a inscrição da lista
        inscricoes.value = inscricoes.value.filter(inscricao => inscricao.id !== inscricaoId)
        
        // Mostrar toast de sucesso
        toast.success('Inscrição cancelada com sucesso!',)
    } catch (error) {
        console.error('Erro ao cancelar a inscrição:', error)
        toast.error('Erro ao cancelar a inscrição.')
    }
}
</script>

<template>
    <!-- ToastManager Component -->
    <ToastManager />

    <div class="row justify-content-center mt-5" v-if="inscricoes.length > 0 && !loading">
        <div v-if="loading" class="spinner-grow" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div v-for="inscricao in inscricoes" :key="inscricao.id" class="col-lg-4 col-md-6">
            <div class="card mb-4">
                <!-- <img :src="uploadHelper(inscricao.evento.imagem?.url)" class="card-img-top" alt="Imagem do Evento" style="max-height: 300px;object-fit: cover;object-position: center;"> -->
                <div class="card-body">
                    <h5 class="card-title">{{ inscricao.evento.nome }}</h5>
                    <p class="card-text">{{ inscricao.evento.descricao }}</p>
                    <p class="card-text"><small class="text-muted">Data: {{ format(new Date(inscricao.evento.data), 'dd/MM/yyyy HH:mm') }}</small></p>
                    <!-- <p class="card-text">Categoria: <span class="badge text-bg-secondary">{{ inscricao.evento.categoria?.nome }}</span></p> -->
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <button class="btn btn-danger" @click="cancelarInscricao(inscricao.id)">Cancelar inscrição</button>
                </div>
            </div>
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
