<template>
  <div id="app">
      <base-spinner />
      <layout-notification />
      <!--<h1>Oi</h1>
      <button @click="mostrarSpinner()">
        Mostrar Spinner
      </button>-->

      <div class="container-fluid" v-if="isLogged">
        <div class="row">
          <div class="col-2 navigation-sidebar">
            <h1 class="app-title">Expenses</h1>
            <layout-navigation />
          </div>
          <div class="col">
            <router-view />
          </div>
        </div>
      </div>

      <router-view v-else />
  </div>
</template>

<script>
import BaseSpinner from './components/global/BaseSpinner'
import LayoutNavigation from './components/layout/LayoutNavigation'
import LayoutNotification from './components/layout/LayoutNotification'

export default {
  components: {
    BaseSpinner,
    LayoutNavigation,
    LayoutNotification
  },

  data: () => ({
    isLogged: false
  }),

  mounted () {
    this.$firebase.auth().onAuthStateChanged( user => {
      //operacao ternaria. se user for verdadeiro recebe valor, se nao vira nullo
      window.uid = user ? user.uid : null

      //DEPOIS ESTUDAR ISTO AQUI!!!!!
      this.isLogged = !!user

      if (window.uid) {
        this.$router.push({name: 'home'})
      } else {
        this.$router.push({name: 'login'})
      }

      //VERIFICAR PQ O SETTIMEOUT NAO FUNCIONOU
      //setTimeout(() => {
        //this.$root.$emit('Spiner::hide')
      //})
      this.$root.$emit('Spinner::hide')

    })
  },

  methods: {
    mostrarSpinner() {
      this.$root.$emit('Spinner::show')
    }
  }

  //mounted () {
  //  console.log(this.$firebase)
  //}

}
</script>

<style lang="scss">
#app {
  height: 100vh;
  color: var(--light);
  background-color: var(--darker);
}

.navigation-sidebar {
  background-color: var(--dark-medium);
}

.app-title {
  font-size: 20pt;
  margin-top: 10px;
  text-align: center;
}
</style>
