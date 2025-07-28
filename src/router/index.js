import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/pages/LoginView.vue'
import DashboardView from '@/pages/DashboardView.vue'
import SubmissionDetail from '@/pages/SubmissionDetail.vue'
import SubmissionEntryView from '@/pages/SubmissionEntryView.vue'
import FeatureRequestView from '@/pages/FeatureRequestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/entry/:id?',
      name: 'entry',
      component: SubmissionEntryView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/submissions/:id?',
      name: 'submission',
      component: SubmissionDetail,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/feature-request',
      name: 'feature-request',
      component: FeatureRequestView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Not logged in and trying to access protected route
    return next({ name: 'login' });
  }

  if (to.name === 'login' && isAuthenticated) {
    // Already logged in and trying to go to login page
    return next({ name: 'dashboard' });
  }

  return next();
});

export default router
