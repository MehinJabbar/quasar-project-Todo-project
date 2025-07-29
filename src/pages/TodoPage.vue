<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import supabaseClient from "../supabase";

const router = useRouter();
const userProfile = ref(null);
const tasks = ref([]);
const newTask = ref({ name: "", description: "", due_date: "" });

// Scroll area styles
const thumbStyle = {
  right: "4px",
  borderRadius: "5px",
  backgroundColor: "#027be3",
  width: "4px",
  opacity: 0.75,
};
const barStyle = {
  right: "2px",
  borderRadius: "9px",
  backgroundColor: "#027be3",
  width: "2px",
  opacity: 0.2,
};

// --- AUTH & PROFILE ---
const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return user;
};

const fetchUserProfile = async () => {
  const user = await getUser();
  if (!user) {
    router.push("/login");
    return;
  }
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("fname, lname, country")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return;
  }
  userProfile.value = profile;
};

// --- TASKS ---
const fetchTasks = async () => {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching tasks:", error);
    return;
  }
  tasks.value = data || [];
};

const addTask = async () => {
  if (!newTask.value.name) {
    alert("Task name required");
    return;
  }
  const user = await getUser();
  if (!user) {
    alert("Not logged in");
    return;
  }
  const { error } = await supabaseClient.from("tasks").insert([
    {
      user_id: user.id,
      name: newTask.value.name,
      description: newTask.value.description,
      due_date: newTask.value.due_date,
    },
  ]);
  if (error) {
    alert(error.message);
    return;
  }
  newTask.value = { name: "", description: "", due_date: "" };
  await fetchTasks();
};

const removeTask = async (taskId, e) => {
  e.stopPropagation(); // prevent navigation
  const { error } = await supabaseClient.from("tasks").delete().eq("id", taskId);
  if (error) {
    alert(error.message);
    return;
  }
  await fetchTasks();
};

const editingTask = ref(null);
const isEditDialogOpen = ref(false);

const startEdit = (task, e) => {
  e.stopPropagation(); // prevent navigation
  editingTask.value = { ...task };
  isEditDialogOpen.value = true;
};

const saveEdit = async () => {
  const { error } = await supabaseClient
    .from("tasks")
    .update({
      name: editingTask.value.name,
      description: editingTask.value.description,
      due_date: editingTask.value.due_date,
    })
    .eq("id", editingTask.value.id);

  if (error) {
    alert(error.message);
    return;
  }

  isEditDialogOpen.value = false;
  editingTask.value = null;
  await fetchTasks();
};

const logout = async () => {
  await supabaseClient.auth.signOut();
  router.push("/login");
};

const goToDetails = (taskId) => {
  router.push(`/task/${taskId}`);
};

onMounted(async () => {
  await fetchUserProfile();
  await fetchTasks();
});
</script>

<template>
  <q-page padding class="column items-center q-pa-md">
    <q-card class="q-pa-md" style="max-width: 600px; width: 100%">
      <!-- USER HEADER -->
      <q-card-section>
        <div class="text-h5 q-mb-md">
          Welcome, {{ userProfile?.fname }} {{ userProfile?.lname }}
        </div>
        <q-btn color="negative" label="Log out" @click="logout" class="q-mb-lg" />

        <!-- ADD TASK FORM -->
        <q-form @submit.prevent="addTask" class="q-gutter-md">
          <q-input v-model="newTask.name" label="Task Name" outlined dense required />
          <q-input v-model="newTask.description" label="Description" outlined dense />
          <q-input v-model="newTask.due_date" label="Due Date" type="date" outlined dense />
          <q-btn type="submit" label="Add Task" color="primary" />
        </q-form>
      </q-card-section>

      <q-separator />

      <!-- TASKS LIST -->
      <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 400px; max-width: 600px;">
        <q-list bordered padding class="q-mt-lg">
          <q-item
            v-for="task in tasks"
            :key="task.id"
            clickable
            @click="goToDetails(task.id)"
          >
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ task.name }}</q-item-label>
              <q-item-label caption>{{ task.description }}</q-item-label>
              <q-item-label caption>Due: {{ task.due_date }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn dense color="secondary" icon="edit" flat round @click="(e) => startEdit(task, e)" />
              <q-btn dense color="negative" icon="delete" flat round @click="(e) => removeTask(task.id, e)" />
            </q-item-section>
          </q-item>

          <q-item v-if="tasks.length === 0" class="justify-center">
            No tasks found.
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- EDIT DIALOG -->
      <q-dialog v-model="isEditDialogOpen">
        <q-card>
          <q-card-section>
            <div class="text-h6">Edit Task</div>
          </q-card-section>
          <q-card-section class="q-gutter-md" style="height: 200px; width: 350px">
            <q-input v-model="editingTask.name" label="Task Name" outlined dense />
            <q-input v-model="editingTask.description" label="Description" outlined dense />
            <q-input v-model="editingTask.due_date" type="date" label="Due Date" outlined dense />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn label="Save" color="primary" @click="saveEdit" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>
