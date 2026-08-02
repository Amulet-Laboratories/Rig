import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 0 }
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'gallery',
      component: () => import('@/pages/demos/DemoIndex.vue'),
    },
    {
      path: '/tidemark',
      name: 'tidemark',
      component: () => import('@/pages/demos/tidemark/index.vue'),
    },
    {
      path: '/briarcove',
      name: 'briarcove',
      component: () => import('@/pages/demos/briar-cove/index.vue'),
    },
    {
      path: '/duskline',
      name: 'duskline',
      component: () => import('@/pages/demos/duskline/index.vue'),
    },
    {
      path: '/saltsignal',
      name: 'saltsignal',
      component: () => import('@/pages/demos/salt-signal/index.vue'),
    },
    {
      path: '/marenlys',
      name: 'marenlys',
      component: () => import('@/pages/demos/maren-lys/index.vue'),
    },
    {
      path: '/lanternhouse',
      name: 'lanternhouse',
      component: () => import('@/pages/demos/lantern-house/index.vue'),
    },
    {
      path: '/aldricpace',
      name: 'aldricpace',
      component: () => import('@/pages/demos/aldric-pace/index.vue'),
    },
    {
      path: '/undertow',
      name: 'undertow',
      component: () => import('@/pages/demos/undertow/index.vue'),
    },
    {
      path: '/kbcv',
      name: 'kbcv',
      component: () => import('@/pages/demos/kbcv/index.vue'),
    },
    {
      path: '/compass',
      name: 'compass',
      component: () => import('@/pages/demos/compass/index.vue'),
    },
    {
      path: '/briarcovelib',
      name: 'briarcovelib',
      component: () => import('@/pages/demos/briar-cove-lib/index.vue'),
    },
    {
      path: '/fogline',
      name: 'fogline',
      component: () => import('@/pages/demos/fogline/index.vue'),
    },
    {
      path: '/rootremedy',
      name: 'rootremedy',
      component: () => import('@/pages/demos/root-remedy/index.vue'),
    },
    {
      // Not a demo site — the Museum of User Interfaces is the argument *for*
      // the design system rather than an example of it. See
      // ../../../docs/MUSEUM-ROADMAP.md.
      path: '/museum',
      name: 'museum',
      component: () => import('@/pages/museum/index.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

// Handle lazy-loaded chunk failures (e.g. after deployment)
router.onError((error, to) => {
  if (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed')
  ) {
    window.location.href = to.fullPath
  }
})

export default router
