<template>
  <q-page padding>
    <!-- LOGIN VIEW -->
    <div v-if="view === 'login'">
      <h3>Sign in</h3>
      <q-form @submit.prevent="login" class="q-gutter-md">
        <q-input v-model="loginForm.email" label="Your email" type="email" required />
        <q-input v-model="loginForm.password" label="Password" type="password" required />
        <q-btn label="Login" type="submit" color="primary" />
      </q-form>
      <p>
        Don't have an account? 
        <a href="#" @click.prevent="view = 'register'">Create an account</a>
      </p>
    </div>

    <!-- REGISTER VIEW -->
    <div v-if="view === 'register'">
      <h3>Sign up</h3>
      <q-form @submit.prevent="register" class="q-gutter-md">
        <q-input v-model="registerForm.fname" label="Your name" type="text" required />
        <q-input v-model="registerForm.lname" label="Your last name" type="text" required />
        <q-input v-model="registerForm.email" label="Your email" type="email" required />
        <q-input v-model="registerForm.password" label="Password" type="password" required />
        <q-select
          v-model="registerForm.country"
          :options="countryOptions"
          label="Select Country"
          required
          emit-value
          map-options
        />
        <q-btn label="Register" type="submit" color="primary" />
      </q-form>
      <p>
        Already have an account? 
        <a href="#" @click.prevent="view = 'login'">Login</a>
      </p>
    </div>

    <!-- TO DO LIST VIEW -->
    <div v-if="view === 'todo'">
      <h1>Welcome, {{ currentUser.fname }} {{ currentUser.lname }} from {{ currentUser.country }}</h1>
      <q-btn label="Logout" color="negative" @click="logout" class="q-mb-md" />
      
      <q-form @submit.prevent="addTask" class="q-gutter-md">
        <q-input v-model="newTask.name" label="To do" required />
        <q-input v-model="newTask.desc" label="Description" />
        <q-input v-model="newTask.date" label="Due date" type="date" />
        <q-btn label="Submit" type="submit" color="primary" />
      </q-form>

      <div v-if="tasks.length > 0" class="q-mt-md q-gutter-md row">
        <q-card v-for="(task, index) in tasks" :key="task.id" class="my-card col-12 col-md-4">
          <q-card-section>
            <div class="text-h6">{{ task.name }}</div>
            <div>{{ task.description }}</div>
            <div><strong>Due:</strong> {{ task.due_date }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="negative" flat label="Remove" @click="removeTask(index)" />
          </q-card-actions>
        </q-card>
      </div>

      <p v-else>No tasks yet. Add one above!</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { createClient } from '@supabase/supabase-js'

const $q = useQuasar()

// Supabase setup (move your keys here)
const supabaseUrl = "https://wrdgfwttajpeuqjnqjdh.supabase.co"
const supabaseKey = "YOUR_SUPABASE_KEY"
const supabaseClient = createClient(supabaseUrl, supabaseKey)

const view = ref('login')
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ fname: '', lname: '', email: '', password: '', country: '' })
const currentUser = ref(null)
const newTask = ref({ name: '', desc: '', date: '' })
const tasks = ref([])

const countryOptions = [
  { label: 'Australia', value: 'australia' },
  { label: 'Canada', value: 'canada' },
  { label: 'USA', value: 'usa' },
]

async function login() {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: loginForm.value.email,
    password: loginForm.value.password
  })
  if (error) {
    $q.notify({ type: 'negative', message: error.message })
    return
  }
  currentUser.value = data.user

  // Fetch profile info
  let { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('fname, lname, country')
    .eq('id', currentUser.value.id)
    .single()

  if (profileError) {
    console.error(profileError)
    profile = { fname: '', lname: '', country: '' }
  }

  currentUser.value.fname = profile.fname
  currentUser.value.lname = profile.lname
  currentUser.value.country = profile.country

  await fetchTasks()
  view.value = 'todo'
}

async function register() {
  const { error } = await supabaseClient.auth.signUp({
    email: registerForm.value.email,
    password: registerForm.value.password,
    options: {
      data: {
        fname: registerForm.value.fname,
        lname: registerForm.value.lname,
        country: registerForm.value.country
      }
    }
  })
  if (error) {
    $q.notify({ type: 'negative', message: error.message })
    return
  }
  $q.notify({ type: 'positive', message: 'Registration successful! Please verify your email.' })
  view.value = 'login'
}

async function addTask() {
  if (!newTask.value.name) {
    $q.notify({ type: 'warning', message: 'Task name required' })
    return
  }
  const { error } = await supabaseClient.from('tasks').insert([{
    user_id: currentUser.value.id,
    name: newTask.value.name,
    description: newTask.value.desc,
    due_date: newTask.value.date
  }])
  if (error) {
    $q.notify({ type: 'negative', message: error.message })
    return
  }
  await fetchTasks()
  newTask.value = { name: '', desc: '', date: '' }
}

async function removeTask(index) {
  const task = tasks.value[index]
  const { error } = await supabaseClient.from('tasks').delete().eq('id', task.id)
  if (error) {
    $q.notify({ type: 'negative', message: error.message })
    return
  }
  await fetchTasks()
}

async function fetchTasks() {
  const { data, error } = await supabaseClient
    .from('tasks')
    .select('*')
    .eq('user_id', currentUser.value.id)
  if (!error) tasks.value = data
}

async function logout() {
  await supabaseClient.auth.signOut()
  currentUser.value = null
  tasks.value = []
  view.value = 'login'
}
</script>

<style scoped>
.my-card {
  max-width: 350px;
}
</style>
