<template>
  <form @submit.prevent="doLogin()" class="form-login">
    <div class="card">
      <div class="card-header text-center">
        <h1 class="mb-0">Expenses</h1>
      </div>
      <div class="card-body">
        <div class="form-group">
          <input required type="email" v-model="email" class="form-control" placeholder="E-mail" />
        </div>
        <div class="form-group">
          <input required type="password" v-model="password" class="form-control" placeholder="Senha" />
        </div>
        <button class="btn btn-primary w-100" :disabled="loading">
          <template v-if="loading">
            Entrando... <i class="fa fa-spinner fa-spin"></i>
          </template>
          <template v-else>
            Entrar <i class="fa fa-sign-in-alt"></i>
          </template>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'Login',

  data: () => {
    return {
      loading: false,
      email: '',
      password: ''
    }
  },

  methods: {
    //async torna a funcao assincrona, ou seja, ela espera um aresposta. precisa de uma promisse
    async doLogin () {
      //console.log('formulario enviado')
      this.loading = true

      const { email, password } = this

      try {
        const res =  await this.$firebase.auth().signInWithEmailAndPassword(email, password)

        window.uid = res.user.uid

        //Redirecionamento para a pagina home caso o usuario logue ou ja esteja logado
        //this.$router.push({name: 'Home'})

        //console.log(res)
      } catch (err) {
        console.log(err)
        let message = ''
        switch (err.code) {
          case 'auth/user-not-found':

            message = 'Não foi possivel localizar o usuário.'
            break;
          case 'auth/wrong-password':
            message = 'Senha invalida'
            break;
          default:
            message = 'Nao foi possivel fazer login, tente novamente'
        }

        this.$root.$emit('Notification::show', {
          type: 'danger',
          message
        })
      }

      this.loading = false

    }
  },
  //antes da rota ser 'entrada' sera verificado
  //se o usuario ja esta logado. se ja estiver, ele nao vai poder ver a pagina com formulario de login
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (window.uid) {
        vm.$router.push({ name: 'Home'})
      }
    })
  }

};
</script>

<style lang="scss" scoped>
.form-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

h1 {
  font-size: 18pt;
}

.card {
  width: 30%;
  color: var(--darker);
}
</style>
