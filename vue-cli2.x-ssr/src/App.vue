<template>
  <div id="app">
    <router-link to="/">Goto Bar</router-link>
    <router-link to="/item">Goto Foo</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeCreate () {
    console.log('App.vue beforeCreate')
  },
  created () {
    console.log('App.vue created')
  },
  beforeMount () {
    console.log('App.vue beforeMount')
  },
  mounted () {
    console.log('App.vue mounted')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
