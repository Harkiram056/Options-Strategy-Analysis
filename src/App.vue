<template>
  <div id="app">
    <OptionsStrategyAnalyzer />
  </div>
</template>

<script>
import OptionsStrategyAnalyzer from './components/OptionsStrategyAnalyzer.vue';

export default {
  name: 'App',
  components: {
    OptionsStrategyAnalyzer
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(to right, #335b7e, #127176);
  min-height: 50vh;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
