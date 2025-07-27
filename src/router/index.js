import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router';  // add createWebHistory
import routes from './routes';

export default route(function (/* { stores, ssrContext } */) {
  const createHistory = process.env.SERVER ? createMemoryHistory : createWebHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  return Router;
});
