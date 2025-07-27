<template>
    <q-layout view="hHh lpR fFf">
      <!-- Header -->
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>
            Todo App
          </q-toolbar-title>
          <q-btn flat icon="home" @click="$router.push('/')" />
          <q-btn flat icon="person_add" @click="$router.push('/register')" />
          <q-btn flat icon="login" @click="$router.push('/login')" />
        </q-toolbar>
      </q-header>
  
      <!-- Main Page Content -->
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  // No additional script required for now
  </script>
  
  <style>
  /* Optional styling */
  </style>
  