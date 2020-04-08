<template>
  <div id="app">
    <diff
      :newContent="oldContent"
      :oldContent="newContent"
      :diffBoxStyle="{ height: '100px' }"
      @diffJson="diffJson"
    ></diff>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      newContent: `sadfklj
bbb      
aaa
sg
sdf`,
      oldContent: `sadfklj111
bb
aa
sg
dfh
fh
dfg`
    }
  },
  mounted () {
    console.log(this.$diffJson(this.oldContent, this.newContent))
  },
  methods: {
    diffJson (r) {
      console.log(r)
    }
  },
}
</script>

<style>

</style>
