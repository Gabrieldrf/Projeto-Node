<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md" style="max-width: 700px; margin: auto;">
      <q-card-section>
        <div class="text-h5 text-primary">Inventário de Itens</div>
        <div class="text-subtitle2">Gerencie seus itens abaixo:</div>
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
          <q-item v-for="(item, index) in items" :key="index">
            <q-item-section>
              <q-item-label>{{ item.name }} ({{ item.category }})</q-item-label>
              <q-item-label caption>Quantidade: {{ item.quantity }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat icon="edit" color="primary" @click="editItem(index)" />
              <q-btn flat icon="delete" color="negative" @click="deleteItem(index)" />
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
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="saveEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'

export default defineComponent({
  name: 'ItensPage',
  setup() {
    const newItem = reactive({
      name: '',
      category: '',
      quantity: 1
    })

    const items = ref([])

    function loadItems() {
      const saved = localStorage.getItem('inventory')
      items.value = saved ? JSON.parse(saved) : []
    }

    function saveItems() {
      localStorage.setItem('inventory', JSON.stringify(items.value))
    }

    function addItem() {
      items.value.push({ ...newItem })
      saveItems()
      newItem.name = ''
      newItem.category = ''
      newItem.quantity = 1
    }

    const canAdd = computed(() =>
      newItem.name.trim() !== '' && newItem.category.trim() !== '' && newItem.quantity > 0
    )

    function deleteItem(index) {
      items.value.splice(index, 1)
      saveItems()
    }

    // Editar item
    const editDialog = ref(false)
    const editIndex = ref(null)
    const editItemData = reactive({
      name: '',
      category: '',
      quantity: 1
    })

    function editItem(index) {
      const item = items.value[index]
      editIndex.value = index
      Object.assign(editItemData, item)
      editDialog.value = true
    }

    function saveEdit() {
      if (editIndex.value !== null) {
        items.value[editIndex.value] = { ...editItemData }
        saveItems()
        editDialog.value = false
      }
    }

    loadItems()

    return {
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
})
</script>