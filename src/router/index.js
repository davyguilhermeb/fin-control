import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      icon: 'home', title: 'Home'
    },
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      icon: 'sobre', title: 'Sobre'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    name: 'lista-gastos',
    path: '/lista-gastos',
    meta: {
      icon: 'lista-ul', title: 'Lista Gastos'
    },
    component: () => import (
      /* webpackChunkName: "about" */
      '../views/lista-gastos/ListaGastos.vue'
    )
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/login/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//teoricamente este trecho de cogido nao pertmite que um usuario deslogado va para alguma pagina que nao seja a de login
router.beforeEach((to, from, next) => {
  //insere meta no title - ESTA DANDO ERRADO
  document.title = to.meta.title

  if (!window.uid && to.name != 'login') {
    next({name: 'login'})
  } else {
    next();
  }
})

export default router
