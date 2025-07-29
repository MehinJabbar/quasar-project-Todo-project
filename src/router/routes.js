import supabaseClient from '../supabase';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/login'
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue')
      },
      {
        path: '/task/:id',
        name: 'details',
        component: () => import('pages/DetailsPage.vue')
      },
      {
        path: 'todo',
        component: () => import('pages/TodoPage.vue'),
        beforeEnter: (to, from, next) => {
          const user = supabaseClient.auth.getUser();
          if (!user) next('/login');
          else next();
        }
      }
    ]
  },
  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
