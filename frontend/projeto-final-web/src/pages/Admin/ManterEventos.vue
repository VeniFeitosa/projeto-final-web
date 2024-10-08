<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/'
import * as bootstrap from 'bootstrap'
import { useUpload } from '@/composables/useUpload'
import ToastManager from '@/components/ToastManager.vue'
import { toast } from 'vue-sonner'
import { format } from "date-fns"

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
const categorias = ref([])
const categoriaSelecionada = ref('')
const previewImageUrl = ref(null);


onMounted(async () => {
    try {
        const { data } = await api.get('/eventos?populate=*', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        eventos.value = data.data
        console.log(data.data)

        const { data: categoriasData } = await api.get('/categorias', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        categorias.value = categoriasData.data
        console.log(categorias.value)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }

    const createModalEl = document.getElementById('createEventoModal')

    createModalEl.addEventListener('hidden.bs.modal', () => {
        console.log('Modal foi fechada!')
        if (!eventoToEdit.value || !eventoToEdit.value.id) {
            nome.value = ''
            descricao.value = ''
            endereco.value = ''
            dataEvento.value = ''
            formSubmitted.value = false
        }
    })
})

const openDeleteModal = (evento) => {
    eventoToDelete.value = evento
}

const deleteEvent = async (documentId) => {
    try {
        await api.delete(`/eventos/${documentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        eventos.value = eventos.value.filter(evento => evento.documentId !== documentId);
        toast.success('Evento excluído com sucesso!')
    } catch (error) {
        console.error('Erro ao deletar o evento:', error);
        toast.error('Erro ao excluir o evento.')
    }
};


const openCreateModal = () => {
    nome.value = ''
    descricao.value = ''
    endereco.value = ''
    dataEvento.value = ''
    imagem.value = null;
    previewImageUrl.value = null;
    formSubmitted.value = false
    eventoToEdit.value = {}
}

const openEditModal = (evento) => {
    console.log('Editar evento:', evento)
    eventoToEdit.value = evento
    nome.value = evento.nome
    descricao.value = evento.descricao
    endereco.value = evento.endereco
    dataEvento.value = format(new Date(evento.data), "yyyy-MM-dd'T'HH:mm")
    categoriaSelecionada.value = evento.categoria.documentId

    if (evento.imagem) {
        previewImageUrl.value = uploadHelper(evento.imagem?.url);
    } else {
        previewImageUrl.value = null;
    }
}

function handleUpload(event) {
  const inputEvent = event 
  const target = inputEvent.target
  imagem.value = target.files?.item(0)

  if (imagem.value) {
    previewImageUrl.value = URL.createObjectURL(imagem.value);
  }
}

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

    try {
        const response = await api.post('/upload', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
        return response.data[0];
    } catch (error) {
        console.error('Erro ao enviar a imagem:', error);
        return null;
    }
}


const submitForm = async (id) => {
    formSubmitted.value = true;
    if (!nome.value || !descricao.value || !endereco.value || !dataEvento.value || !categoriaSelecionada.value) {
        return;
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('createEventoModal'))

    if (id) {
        console.log('Editar evento', eventoToEdit.value)

        const datas = new FormData()
        datas.append('data[nome]', nome.value)
        datas.append('data[descricao]', descricao.value)
        datas.append('data[endereco]', endereco.value)
        datas.append('data[data]', dataEvento.value)
        datas.append('data[categoria]', categoriaSelecionada.value)

        if (imagem.value) {
            console.log('adicionar imagem...')
            try {
                const uploadedImage = await uploadImage(imagem.value)
                datas.append('data[imagem]', uploadedImage.id)
            } catch (error) {
                console.error('Erro ao enviar a imagem:', error)
            }
        }

        try {
            const evento = await api.put(`/eventos/${id}`, datas, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            })

            const { data } = await api.get('/eventos?populate=*', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            })
            
            eventos.value = data.data
            modal.hide()
            toast.success('Evento editado com sucesso!')
        } catch (error) {
            console.error('Erro ao criar o evento:', error)
            toast.error('Erro ao excluir evento!')   
        }
    }else{
        console.log('Criar evento', nome.value)
        const uploadedImage = await uploadImage(imagem.value)

        if (!uploadedImage) {
            return
        }

        const datas = new FormData()
        datas.append('data[nome]', nome.value)
        datas.append('data[descricao]', descricao.value)
        datas.append('data[endereco]', endereco.value)
        datas.append('data[data]', dataEvento.value)
        datas.append('data[categoria]', categoriaSelecionada.value)
        datas.append('data[imagem]', uploadedImage.id)

        try {
            const evento = await api.post('/eventos', datas, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            })

            const { data } = await api.get('/eventos?populate=*', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            })
            
            eventos.value = data.data
            modal.hide()
            toast.success('Evento criado com sucesso!')
        } catch (error) {
            console.error('Erro ao criar o evento:', error)
            toast.error('Erro ao criar evento!')   
        }
    }
    
}

</script>

<template>
    <ToastManager />
    <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="eventos.length > 0 && !loading" class="mt-5">
        <div class="d-flex align-items-center justify-content-end">
            <button class="btn btn-primary me-4" data-bs-toggle="modal" data-bs-target="#createEventoModal" @click="openCreateModal()">Cadastrar evento</button>
        </div>
        <div class="table-responsive">
            <table class="table table-hover table-sm mx-auto">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col" class="d-none d-md-table-cell">Imagem</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Nome</th>
                    <th scope="col" class="d-none d-md-table-cell">Descrição</th>
                    <th scope="col" class="d-none d-md-table-cell">Endereço</th>
                    <th scope="col">Data</th>
                    <th scope="col" style="width: 150px;"> </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(evento, index) in eventos" :key="evento.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td class="d-none d-md-table-cell">
                    <img v-if="evento.imagem" 
                        :src="uploadHelper(evento.imagem?.url)" 
                        alt="Imagem do evento" 
                        style="width: 100px; height: auto;" />
                    </td>
                    <td>{{ evento.categoria.nome }}</td>
                    <td>{{ evento.nome }}</td>
                    <td class="d-none d-md-table-cell">{{ evento.descricao }}</td>
                    <td class="d-none d-md-table-cell">{{ evento.endereco }}</td>
                    <td>{{ new Date(evento.data).toLocaleDateString() }}</td>
                    <td class="text-end" style="width: 150px;">
                    <button class="btn btn-warning btn-sm me-2" @click="openEditModal(evento)" data-bs-toggle="modal" data-bs-target="#createEventoModal">Editar</button>
                    <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteEventoModal" @click="openDeleteModal(evento)">Excluir</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-else-if="!loading">
        <div class="card text-center mx-auto mt-5" style="max-width: 60%;">
            <div class="card-body">
                <h5 class="card-title">Nenhum evento encontrado</h5>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary" @click="openCreateModal()">Cadastrar evento</button>
            </div>
        </div>
    </div>

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
                            <img v-if="previewImageUrl" :src="previewImageUrl" alt="Imagem do evento" class="img-fluid mb-3" />
                            <label for="coverInput" class="form-label">Imagem</label>
                            <input
                                @change="handleUpload"
                                type="file"
                                id="coverInput"
                                accept="image/*"
                                class="form-control"
                                :class="{ 'is-invalid': formSubmitted && !imagem && !previewImageUrl }"
                            />
                            <div v-if="formSubmitted && !imagem && !previewImageUrl" class="invalid-feedback">O imagem do evento é obrigatório.</div>
                            
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
                        <div class="mb-3">
                            <label for="eventoCategoria" class="form-label">Categoria</label>
                            <select v-model="categoriaSelecionada" id="eventoCategoria" class="form-select" :class="{ 'is-invalid': formSubmitted && !categoriaSelecionada }">
                                <option value="" disabled>Selecione uma categoria...</option>
                                <option v-for="categoria in categorias" :key="categoria.documentId" :value="categoria.documentId">
                                    {{ categoria.nome }}
                                </option>
                            </select>
                            <div v-if="formSubmitted && !categoriaSelecionada" class="invalid-feedback">A categoria do evento é obrigatória.</div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button v-if="!eventoToEdit.documentId" type="button" class="btn btn-primary" @click="submitForm()">Cadastrar</button>
                    <button v-if="eventoToEdit.documentId" type="button" class="btn btn-primary" @click="submitForm(eventoToEdit.documentId)">Salvar alterações</button>
                </div>
            </div>
        </div>
    </div>

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
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteEvent(eventoToDelete.documentId)">Excluir</button>
                </div>
            </div>
        </div>
    </div>
</template>
