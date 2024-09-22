<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/'
import * as bootstrap from 'bootstrap'
import { useUpload } from '@/composables/useUpload'
const uploadHelper = useUpload()

const loading = ref(true)
const eventos = ref([])
const eventoToDelete = ref({})
const eventoToEdit = ref({})

const imagem = ref()
const nome = ref('')
const descricao = ref('')
const endereco = ref('')
const dataEvento = ref('')
const formSubmitted = ref(false)

onMounted(async () => {
    try {
        const { data } = await api.get('/eventos?populate=*', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        eventos.value = data.data
        console.log(data.data)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }

    // Ouvir o evento de fechamento da modal
    const createModalEl = document.getElementById('createEventoModal')

    createModalEl.addEventListener('hidden.bs.modal', () => {
        console.log('Modal foi fechada!')
        if (!eventoToEdit.value || !eventoToEdit.value.id) {
            // Limpar campos quando não houver evento sendo editado (modo de criação)
            nome.value = ''
            descricao.value = ''
            endereco.value = ''
            dataEvento.value = ''
            formSubmitted.value = false
        }

        eventoToEdit.value = {}
    })
})

const openDeleteModal = (evento) => {
    eventoToDelete.value = evento
}

const deleteEvent = async (id) => {
    try {
        await api.delete(`/eventos/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        eventos.value = eventos.value.filter(evento => evento.id !== id)
        // toast de sucesso
    } catch (error) {
        console.error('Erro ao deletar o evento:', error)
    }
}

const openCreateModal = () => {
    nome.value = ''
    descricao.value = ''
    endereco.value = ''
    dataEvento.value = ''
    formSubmitted.value = false
    eventoToEdit.value = {}
}

const openEditModal = (evento) => {
    console.log('Editar evento:', evento)
    eventoToEdit.value = evento
    nome.value = evento.nome
    descricao.value = evento.descricao
    endereco.value = evento.endereco
    dataEvento.value = new Date(evento.data).toISOString().substring(0, 10) // Formatando data
}

function handleUpload(event) {
  const inputEvent = event 
  const target = inputEvent.target
  imagem.value = target.files?.item(0)
}

const submitForm = async (id) => {
    formSubmitted.value = true
    if (!nome.value || !descricao.value || !endereco.value || !dataEvento.value) {
        return
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('createEventoModal'))

    if (id) {
        // Editar evento
        console.log('Editar evento', nome.value)
        // try {
        //     const { data } = await api.put(`/eventos/${id}`, {
        //         data: {
        //             nome: nome.value,
        //             descricao: descricao.value,
        //             endereco: endereco.value,
        //             data: dataEvento.value
        //         }
        //     }, {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem('jwt')}`
        //         }
        //     })
        //     console.log(data)
        //     const index = eventos.value.findIndex(evento => evento.id === id)
        //     eventos.value[index] = data.data
        //     modal.hide()
        // } catch (error) {
        //     console.error('Erro ao editar o evento:', error)
        // }
    } else {
        // Criar evento
        console.log('Criar evento', nome.value)
        try {
            const datas = new FormData()
            datas.append(
                'data',
                JSON.stringify({
                    nome: nome.value,
                    descricao: descricao.value,
                    endereco: endereco.value,
                    data: dataEvento.value,
                    categoria: 'k29rgf0e6jqmncq0xf6y31at',
                })
            )
            datas.append('files.imagem', imagem.value)
            console.log(datas.get('data'))
            console.log(datas.get('files.imagem'))
            // Removendo o cabeçalho 'contentType' para deixar Axios detectar automaticamente
            const evento = await api.post('/eventos', datas , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                }
            })

            console.log(evento.data.data)
            eventos.value.push(evento.data.data)
            modal.hide()
            // toast de sucesso
        } catch (error) {
            console.error('Erro ao criar o evento:', error)
        }

    }
}
</script>

<template>
    <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="eventos.length > 0 && !loading" class="mt-5">
        <div class="d-flex align-items-center justify-content-end">
            <!-- modal trigger -->
            <button class="btn btn-primary me-4" data-bs-toggle="modal" data-bs-target="#createEventoModal" @click="openCreateModal()">Cadastrar evento</button>
        </div>
        <table class="table table-hover table-sm mx-auto">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Imagem</th>
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
                    <td>{{ evento.descricao }}</td>
                    <td>{{ evento.endereco }}</td>
                    <td>{{ new Date(evento.data).toLocaleDateString() }}</td>
                    <td class="text-end">
                        <button class="btn btn-warning btn-sm me-2" @click="openEditModal(evento)" data-bs-toggle="modal" data-bs-target="#createEventoModal">Editar</button>
                        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteEventoModal" @click="openDeleteModal(evento)">Excluir</button>
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
                <button class="btn btn-primary" @click="openCreateModal()">Cadastrar evento</button>
            </div>
        </div>
    </div>

    <!-- Create evento modal -->
    <div class="modal fade" id="createEventoModal" tabindex="-1" aria-labelledby="createEventoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createEventoModalLabel">Cadastrar evento</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="coverInput" class="form-label">Imagem</label>
                            <input
                                @change="handleUpload"
                                type="file"
                                id="coverInput"
                                accept="image/*"
                                class="form-control"
                                :class="{ 'is-invalid': formSubmitted && !imagem }"
                            />
                            <div v-if="formSubmitted && !imagem" class="invalid-feedback">O imagem do evento é obrigatório.</div>
                            
                        </div>
                        <div class="mb-3">
                            <label for="eventoNome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="eventoNome" placeholder="Digite o nome do evento..." v-model="nome" :class="{ 'is-invalid': formSubmitted && !nome }">
                            <div v-if="formSubmitted && !nome" class="invalid-feedback">O nome do evento é obrigatório.</div>
                        </div>
                        <div class="mb-3">
                            <label for="eventoDescricao" class="form-label">Descrição</label>
                            <input type="text" class="form-control" id="eventoDescricao" placeholder="Digite a descrição do evento..." v-model="descricao" :class="{ 'is-invalid': formSubmitted && !descricao }">
                            <div v-if="formSubmitted && !descricao" class="invalid-feedback">A descrição do evento é obrigatória.</div>
                        </div>
                        <div class="mb-3">
                            <label for="eventoEndereco" class="form-label">Endereço</label>
                            <input type="text" class="form-control" id="eventoEndereco" placeholder="Digite o endereço do evento..." v-model="endereco" :class="{ 'is-invalid': formSubmitted && !endereco }">
                            <div v-if="formSubmitted && !endereco" class="invalid-feedback">O endereço do evento é obrigatório.</div>
                        </div>
                        <div class="mb-3">
                            <label for="eventoData" class="form-label">Data</label>
                            <input type="datetime-local" class="form-control" id="eventoData" v-model="dataEvento" :class="{ 'is-invalid': formSubmitted && !dataEvento }">
                            <div v-if="formSubmitted && !dataEvento" class="invalid-feedback">A data do evento é obrigatória.</div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" @click="submitForm(eventoToEdit.id)">Salvar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete modal -->
    <div class="modal fade" id="deleteEventoModal" tabindex="-1" aria-labelledby="deleteEventoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteEventoModalLabel">Confirmar exclusão</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Tem certeza que deseja excluir o evento "{{ eventoToDelete.nome }}"?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" @click="deleteEvent(eventoToDelete.documentId)">Excluir</button>
                </div>
            </div>
        </div>
    </div>
</template>
