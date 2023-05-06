<template>
  <div>
    <h5 class="q-mb-md">Задачи</h5>
    <q-btn class="q-mb-md" label="+" color="primary" @click="showCreateDialog = true" />
    <div class="task-list">
      <div class="task-list__inner-container">
        <div class="task-list-column" v-for="column in columns" :key="column.name">
          <h5>{{ column.name }}</h5>
          <div class="task-list__items">
            <TaskItem
              v-for="task in column.items"
              :key="task._id"
              :item="task"
              :remove="removeTask"
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showCreateDialog">
      <q-card class="q-pa-md">
        <q-card-section>
          <h6>Что сделать?</h6>
          <q-input v-model="taskName" />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Создать" color="primary" @click="create" :disable="loadingCreation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import TaskItem from '@/components/task/taskItem.vue'
import type { Task } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { fetchTasks, createTask, deleteTask } from '@/api/task'
import { rErrorNotify } from '@/utils/notify'
import { getErrorMessage } from '@/api'

const list = ref<Task[]>([])
const showCreateDialog = ref(false)
const taskName = ref('')
const loadingCreation = ref(false)
const columnNames = ['new', 'doing', 'done']

const columns = computed(() => {
  return columnNames.map((name) => {
    return {
      name,
      items: columnsByTasks.value[name] || []
    }
  })
})
const columnsByTasks = computed(() => {
  return list.value.reduce<{ [key: string]: Task[] }>((acc, curr: Task) => {
    if (curr.type in acc) {
      acc[`${curr.type}`].push(curr)
    } else {
      acc[`${curr.type}`] = [curr]
    }
    return acc
  }, {})
})

const getTasks = async (updateList = true) => {
  try {
    const response = await fetchTasks()
    if (updateList) {
      list.value = response
    }
  } catch (error) {
    rErrorNotify(getErrorMessage(error, 'Ошибка при загрузке задач'))
  }
}
const create = async () => {
  if (!taskName.value.length) {
    return
  }
  try {
    loadingCreation.value = true
    const task = await createTask(taskName.value)

    list.value.push(task)
    showCreateDialog.value = false
    getTasks(false)
  } catch (error) {
    rErrorNotify(getErrorMessage(error, 'Ошибка при создании задачи'))
  } finally {
    loadingCreation.value = false
  }
}
const removeTask = async (id: number) => {
  try {
    await deleteTask(id)
    list.value = list.value.filter((i) => i._id !== id)
    getTasks(false)
  } catch (error) {
    rErrorNotify(getErrorMessage(error, 'Ошибка при удалении задачи'))
  }
}

onMounted(() => {
  getTasks()
})
</script>

<style scoped lang="scss">
.task-list {
  overflow: hidden;
  &-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 250px;
    border: 1px solid;
    padding: 16px;
  }

  &__inner-container {
    display: flex;
    flex-direction: row;
    gap: 16px;
    overflow: auto;
    padding: 2px;
  }
  &__items {
    display: flex;
    flex: 1;
    flex-flow: column;
    gap: 16px;
  }
}
</style>
