<template>
    <q-page padding>
      <h3>Register</h3>
      <q-form @submit.prevent="register">
        <q-input v-model="fname" label="First Name" required />
        <q-input v-model="lname" label="Last Name" required />
        <q-input v-model="email" type="email" label="Email" required />
        <q-input v-model="password" type="password" label="Password" required />
        <q-select
          v-model="country"
          :options="countries"
          label="Country"
          emit-value
          map-options
          required
        />
        <q-btn label="Register" type="submit" color="primary" />
      </q-form>
      <p>emit-value
        map-options
        Already have an account?
        <q-btn flat @click="$router.push('/login')" label="Login here" />
      </p>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import supabaseClient from '../supabase';
  
  const router = useRouter();
  const fname = ref('');
  const lname = ref('');
  const email = ref('');
  const password = ref('');
  const country = ref('');
  
  const countries = [
    { label: 'Australia', value: 'Australia' },
    { label: 'Canada', value: 'Canada' },
    { label: 'USA', value: 'USA' },
  ];
  
  async function register() {
  const { error } = await supabaseClient.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { fname: fname.value, lname: lname.value, country: country.value },
    },
  });
  if (error) {
    alert(error.message);
    return;
  }
  alert('Registration successful! Please check your email to verify.');
  router.push('/login');
}

  </script>
  