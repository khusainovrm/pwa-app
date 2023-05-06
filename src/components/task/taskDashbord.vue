<template>
  <div>
    <h5 class="q-mb-md">Задачи</h5>
    <q-btn class="q-mb-md" label="+" color="primary" @click="showCreateDialog = true" />
    <div class="task-list">
      <TaskItem v-for="task in list" :key="task._id" :item="task" :remove="removeTask" />
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
import { onMounted, ref } from 'vue'
import { fetchTasks, createTask, deleteTask } from '@/api/task'
import { rErrorNotify } from '@/utils/notify'
import { getErrorMessage } from '@/api'

const list = ref<Task[]>([])
const showCreateDialog = ref(false)
const taskName = ref('')
const loadingCreation = ref(false)

const create = async () => {
  if (!taskName.value.length) {
    return
  }
  try {
    loadingCreation.value = true
    const task = await createTask(taskName.value)
    list.value.push(task)
    showCreateDialog.value = false
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
  } catch (error) {
    rErrorNotify(getErrorMessage(error, 'Ошибка при удалении задачи'))
  }
}

onMounted(async () => {
  try {
    list.value = await fetchTasks()
  } catch (error) {
    rErrorNotify(getErrorMessage(error, 'Ошибка при загрузке задач'))
  }
})
</script>

<style scoped lang="scss">
.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
