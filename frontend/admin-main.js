import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'
import 'vue-material/dist/vue-material.css'
import AdminApp from './AdminApp.vue'
import AdminLogin from './AdminLogin.vue'
import CalendarView from './CalendarView.vue'
import LinksView from './LinksView.vue'
import SettingsView from './SettingsView.vue'

Vue.use(VueMaterial)
Vue.use(VueRouter)

const routes = [
  {path: '/admin', redirect: '/admin/login'},
  {path: '/admin/calendar', component: CalendarView},
  {path: '/admin/links', component: LinksView},
  {path: '/admin/login', component: AdminLogin},
  {path: '/admin/settings', component: SettingsView}
]
const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  el: '#admin-app',
  components: {AdminApp},
  router
})
