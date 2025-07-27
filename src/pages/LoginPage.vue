<template>
    <q-page padding>
      <h3>Sign In</h3>
      <q-form @submit.prevent="login">
        <q-input v-model="email" type="email" label="Email" required />
        <q-input v-model="password" type="password" label="Password" required />
        <q-btn label="Login" type="submit" color="primary" />
      </q-form>
      <p>
        Don't have an account?
        <q-btn flat @click="$router.push('/register')" label="Register here" />
      </p>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import supabaseClient from '../supabase';

  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  
  async function login() {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      alert(error.message);
      return;
    }
    router.push('/todo');
  }
  </script>
  