<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md" style="max-width: 700px; margin: auto;">
      <q-card-section>
        <div class="text-h5 text-primary">Inventário de Itens</div>
        <div class="text-subtitle2">Gerencie seus itens abaixo:</div>
        <div class="q-mt-sm text-caption">
          Usuário: <strong>{{ currentUser }}</strong> • Pontos: <strong>{{ userData.points }}</strong>
        </div>
      </q-card-section>

      <q-separator class="q-my-sm" />

      <!-- Formulário de novo item -->
      <q-card-section>
        <q-input filled v-model="newItem.name" label="Nome do Item" dense />
        <q-input filled v-model="newItem.category" label="Categoria" dense class="q-mt-sm" />
        <q-input filled v-model.number="newItem.quantity" type="number" label="Quantidade" dense class="q-mt-sm" />
        <q-btn label="Adicionar Item" color="primary" class="q-mt-md full-width" @click="addItem" :disable="!canAdd" />
      </q-card-section>

      <q-separator class="q-my-sm" />

      <!-- Lista de itens -->
      <q-card-section>
        <div v-if="items.length === 0" class="text-grey text-center">Nenhum item no inventário.</div>
        <q-list bordered v-else>
          <q-item v-for="item in items" :key="item.id">
            <q-item-section>
              <q-item-label>{{ item.name }} ({{ item.category }})</q-item-label>
              <q-item-label caption>Quantidade: {{ item.quantity }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat icon="edit" color="primary" @click="editItem(item)" />
              <q-btn flat icon="delete" color="negative" @click="deleteItem(item)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Diálogo de edição -->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Editar Item</div>
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="editItemData.name" label="Nome do Item" dense />
          <q-input filled v-model="editItemData.category" label="Categoria" dense class="q-mt-sm" />
          <q-input filled v-model.number="editItemData.quantity" type="number" label="Quantidade" dense class="q-mt-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup @click="editDialog = false" />
          <q-btn flat label="Salvar" color="primary" @click="saveEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import api from 'src/services/api'

export default {
  name: 'ItensPage',
  setup() {
    const currentUser = ref('')
    const userData = reactive({ points: 0 })

    const newItem = reactive({
      name: '',
      category: '',
      quantity: 1
    })

    const items = ref([])

    const editDialog = ref(false)
    const editItemData = reactive({
      id: null,
      name: '',
      category: '',
      quantity: 1
    })

    function resetNewItem() {
      newItem.name = ''
      newItem.category = ''
      newItem.quantity = 1
    }

    async function loadItems() {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
        currentUser.value = user.username || ''
        userData.points = user.points || 0

        if (!user.id) {
          console.warn('Usuário não encontrado no localStorage')
          return
        }

        const response = await api.get(`/itens?userId=${user.id}`)
        items.value = response.data
      } catch (error) {
        console.error('Erro ao carregar itens:', error)
      }
    }

    // Função para atualizar pontos do usuário
    async function updateUserPoints(pointsToAdd) {
      const user = JSON.parse(localStorage.getItem('currentUser'))
      if (!user) return

      user.points = (user.points || 0) + pointsToAdd

      try {
        const response = await api.put(`/usuarios/${user.id}`, user)
        localStorage.setItem('currentUser', JSON.stringify(response.data))
        userData.points = response.data.points // atualiza reactive local
      } catch (error) {
        console.error('Erro ao atualizar pontos:', error)
      }
    }

    async function addItem() {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
        if (!user.id) {
          console.warn('Usuário não encontrado ao adicionar item')
          return
        }

        const payload = { ...newItem, userId: user.id }
        const response = await api.post('/itens', payload)
        items.value.push(response.data)
        resetNewItem()

        await updateUserPoints(10) // adiciona 10 pontos por adicionar item
      } catch (error) {
        console.error('Erro ao adicionar item:', error)
      }
    }

    async function deleteItem(item) {
      try {
        await api.delete(`/itens/${item.id}`)
        items.value = items.value.filter(i => i.id !== item.id)

        await updateUserPoints(10) // adiciona 10 pontos por remover item
      } catch (error) {
        console.error('Erro ao excluir item:', error)
      }
    }

    function editItem(item) {
      Object.assign(editItemData, item)
      editDialog.value = true
    }

    async function saveEdit() {
      try {
        const response = await api.put(`/itens/${editItemData.id}`, {
          name: editItemData.name,
          category: editItemData.category,
          quantity: editItemData.quantity
        })

        const index = items.value.findIndex(i => i.id === editItemData.id)
        if (index !== -1) {
          items.value[index] = response.data
        }
        editDialog.value = false

        await updateUserPoints(5) // adiciona 5 pontos por editar item
      } catch (error) {
        console.error('Erro ao editar item:', error)
      }
    }

    const canAdd = computed(() =>
      newItem.name.trim() !== '' &&
      newItem.category.trim() !== '' &&
      newItem.quantity > 0
    )

    onMounted(loadItems)

    return {
      currentUser,
      userData,
      newItem,
      items,
      addItem,
      deleteItem,
      editItem,
      editDialog,
      editItemData,
      saveEdit,
      canAdd
    }
  }
}
</script>