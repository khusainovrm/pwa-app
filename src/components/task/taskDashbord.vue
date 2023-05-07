<template>
  <div class="task-dashboard">
    <h5 class="q-mb-md q-px-md">Задачи 😀😀</h5>

    <transition name="fade" mode="out-in">
      <div v-if="loading" class="loading">
        <q-spinner size="3rem" />
      </div>
      <div v-else-if="!list.length">
        <p class="q-px-md">Создайте задачу</p>
        <q-btn class="q-mb-md q-mx-md" label="+" color="primary" @click="showCreateDialog = true" />
      </div>
      <div v-else>
        <q-btn class="q-mb-md q-mx-md" label="+" color="primary" @click="showCreateDialog = true" />
        <div class="task-list">
          <div class="task-list__inner-container">
            <div class="task-list-column" v-for="column in columns" :key="column.name">
              <h5>{{ column.name }}</h5>

              <draggable
                v-model="column.items"
                v-bind="dragOptions"
                @start="onDragStart"
                @end="onDragEnd"
                item-key="_id"
                class="task-list__items"
                :data-column-name="column.name"
                :force-fallback="true"
                :delay="$q.platform.is.mobile ? 200 : 0"
              >
                <template #item="{ element }">
                  <TaskItem
                    :key="element._id"
                    :item="element"
                    :remove="removeTask"
                    :data-id="element._id"
                    class="list-draggable-item"
                  />
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </transition>

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
import draggable from 'vuedraggable'
import TaskItem from '@/components/task/taskItem.vue'
import type { Task } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { createTask, deleteTask, fetchTasks, updateTaks } from '@/api/task'
import { rErrorNotify } from '@/utils/notify'
import { getErrorMessage } from '@/api'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const list = ref<Task[]>([])
const loading = ref(true)
const showCreateDialog = ref(false)
const taskName = ref('')
const loadingCreation = ref(false)
const columnNames = ['new', 'doing', 'done']
const columns = ref<{ name: string; items: Task[] }[]>([])
const drag = ref(false)
const dragOptions = {
  animation: 200,
  group: 'tasks',
  disabled: drag.value,
  ghostClass: 'ghost'
}

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

const getTasks = async () => {
  try {
    list.value = await fetchTasks()

    columns.value = columnNames.map((name) => {
      return {
        name,
        items: columnsByTasks.value[name] || []
      }
    })
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
    getTasks()
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
    getTasks()
  } catch (error) {
    rErrorNotify(getErrorMessage(error, 'Ошибка при удалении задачи'))
  }
}
const chageOrder = async (task: Task) => {
  try {
    await updateTaks(task)
    getTasks()
  } catch (error) {
    rErrorNotify(getErrorMessage(error, 'Ошибка при изменении порядка задачи'))
  }
}

const onDragStart = (e: any) => {
  drag.value = true
  navigator.vibrate(100)
}

const onDragEnd = async (e: any) => {
  const foundTask = list.value.find((task) => task._id === e.item.dataset.id)
  if (foundTask) {
    await chageOrder({ ...foundTask, type: e.to.dataset.columnName })
  }
  drag.value = false
}

onMounted(async () => {
  loading.value = true
  await getTasks()
  loading.value = false
})
</script>

<style scoped lang="scss">
.loading {
  display: grid;
  place-items: center;
  min-height: 250px;
}
.task-dashboard {
}
.task-list {
  overflow: hidden;
  height: calc(100vh - 172px);
  &-column {
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 250px;

    padding: 16px;
  }

  &__inner-container {
    display: flex;
    flex-direction: row;
    gap: 16px;
    height: 100%;
    overflow: auto;
    padding: 2px;
  }
  &__items {
    border: 1px solid;
    display: flex;
    flex: 1;
    flex-flow: column;
    gap: 16px;
  }
}
</style>
