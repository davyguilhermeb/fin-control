<template>

  <nav class="nav flex-column justify-content-between">
    <div>
      <router-link exact-active-class="active" class="nav-link" :to="{ name: router.name }" :key="i" v-for="(router, i) in routerLinks">
        <!-- TENTAR DEPOIS <i class="fa" :class='fa-${router.meta.icon}''></i>-->
        {{router.meta.title}}
      </router-link>

      <hr />

      <layout-new-expense />
    </div>


    <!--<a class="nav-link active" href="#">Active</a>
    <a class="nav-link" href="#">Link</a>
    <a class="nav-link" href="#">Link</a>
    <a class="nav-link disabled" href="#" tabindex="1" aria-disabled="true">Disabled</a>-->

    <layout-logout />
  </nav>
</template>

<script>
import LayoutLogout from './LayoutLogout.vue'
import LayoutNewExpense from './LayoutNewExpense.vue'

export default {
  components: {
    LayoutLogout,
    LayoutNewExpense
  },

  computed: {
    routerLinks () {
      return this.$router.options.routes.filter( r => r.name != 'login')
    }
  }
}
</script>

<style scoped lang="scss">
.nav {
  margin-left: -15px;
  width: calc(100% + 30px);
  height: calc(100vh - 49px);
}
.nav-link {
  color: var(--white);
  transition: 0.4s;
  &.active {
    color: var(--featured);
    background-color: transparent;
  }
  &:hover {
    color: var(--dark);
    background-color: var(--featured);
  }
}

</style>
