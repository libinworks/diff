<template>
  <div id="app">
    <diff :newContent="newContent" :oldContent="oldContent" :diffBoxStyle="{ height: '100px' }"></diff>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      newContent: `sadfklj
sg
sdf`,
      oldContent: `sadfklj111
sg
dfh
fh
dfg`
    }
  },
  mounted () {
    console.log(this.$diffJson(this.oldContent, this.newContent))
  }
}
</script>

<style>

</style>
