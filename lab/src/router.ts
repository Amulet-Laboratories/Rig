import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'overview',
    component: () => import('./views/OverviewDashboard.vue'),
    meta: { title: 'Overview' },
  },
  {
    path: '/components',
    name: 'grid',
    component: () => import('./views/ComponentGrid.vue'),
    meta: { title: 'Component Grid' },
  },
  {
    path: '/component/:name',
    name: 'detail',
    component: () => import('./views/ComponentDetail.vue'),
    meta: { title: 'Component Detail' },
  },
  {
    path: '/intelligence',
    name: 'intelligence',
    component: () => import('./views/IntelligenceView.vue'),
    meta: { title: 'Competitive Intelligence' },
  },
  {
    path: '/showcases',
    name: 'showcases',
    component: () => import('./views/ShowcaseTable.vue'),
    meta: { title: 'Showcases' },
  },
  {
    path: '/showcase/:id',
    name: 'showcase-detail',
    component: () => import('./views/ShowcaseDetail.vue'),
    meta: { title: 'Showcase Detail' },
  },
  {
    path: '/pipeline',
    name: 'pipeline',
    component: () => import('./views/PipelineStatus.vue'),
    meta: { title: 'Pipeline Status' },
  },
  {
    path: '/gaps',
    name: 'gaps',
    component: () => import('./views/GapAnalysis.vue'),
    meta: { title: 'Gap Analysis' },
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('./views/HistoryView.vue'),
    meta: { title: 'History' },
  },
  {
    path: '/competitors',
    name: 'competitors',
    component: () => import('./views/CompetitorView.vue'),
    meta: { title: 'Feature Matrix' },
  },
  {
    path: '/comparison',
    name: 'comparison',
    component: () => import('./views/ComparisonDashboard.vue'),
    meta: { title: 'Benchmark Data' },
  },
]
