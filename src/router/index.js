import { createMemoryHistory, createRouter } from 'vue-router'

import Layout from '@/components/Layout.vue'

const routes = [
  { path: '/', component: Layout },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})


export default router