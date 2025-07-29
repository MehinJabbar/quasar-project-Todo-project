<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import supabaseClient from "../supabase";

const route = useRoute();
const task = ref(null);
const loading = ref(true);

const fetchTask = async () => {
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("id", route.params.id)
    .single();

  if (error) {
    console.error("Error fetching task:", error);
  } else {
    task.value = data;
  }
  loading.value = false;
};

onMounted(fetchTask);

const onClick = () => {
  console.log("Chip clicked");
};
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-md">

        <!-- Loading state -->
        <div v-if="loading" class="text-center q-my-lg">
          <q-spinner color="primary" size="40px" />
          <div>Loading task...</div>
        </div>

        <!-- Task details -->
        <div v-else-if="task">
          <q-card class="q-pa-md" style="max-width: 650px; margin: auto;">
            <q-card-section>
              <div class="text-h5">{{ task.name }}</div>
              <div class="text-body1 q-mt-sm">{{ task.description }}</div>
              <div class="text-caption text-grey q-mt-sm">
                Due date: {{ task.due_date }}
              </div>
            </q-card-section>
          </q-card>

          <!-- Example Table -->
          <div class="q-pa-md">
            <q-markup-table flat bordered>
              <thead class="bg-teal text-white">
                <tr>
                  <th colspan="5">
                    <div class="row items-center no-wrap">
                      <q-img
                        src="https://cdn.quasar.dev/img/donuts.png"
                        style="width: 70px"
                        class="rounded-borders"
                        :ratio="1"
                      />
                      <div class="text-h4 q-ml-md">{{ task.name }}</div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th class="text-left">Dessert (100g serving)</th>
                  <th class="text-right">Calories</th>
                  <th class="text-right">Fat (g)</th>
                  <th class="text-right">Carbs (g)</th>
                  <th class="text-right">Protein (g)</th>
                </tr>
              </thead>
              <tbody :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <tr>
                  <td class="text-left">Frozen Yogurt</td>
                  <td class="text-right">159</td>
                  <td class="text-right">6</td>
                  <td class="text-right">24</td>
                  <td class="text-right">4</td>
                </tr>
                <tr>
                  <td class="text-left">Ice cream sandwich</td>
                  <td class="text-right">237</td>
                  <td class="text-right">9</td>
                  <td class="text-right">37</td>
                  <td class="text-right">4.3</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <!-- Example Chips -->
          <div class="q-pa-md">
            <q-chip clickable @click="onClick" color="primary" text-color="white" icon="event">
              Add to calendar
            </q-chip>
            <q-chip clickable @click="onClick" icon="bookmark">
              Bookmark
            </q-chip>
            <q-chip clickable @click="onClick" color="teal" text-color="white" icon="bookmark">
              Bookmark
            </q-chip>
            <q-chip clickable @click="onClick" color="red" text-color="white" icon="alarm" label="Set alarm" />
            <q-chip clickable @click="onClick" color="orange" text-color="white" icon="directions">
              Get directions
            </q-chip>
          </div>
        </div>

        <!-- If no task found -->
        <div v-else class="text-center text-grey q-my-lg">
          Task not found.
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>
