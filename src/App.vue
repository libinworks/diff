<template>
  <div id="app">
    <diff
      :newContent="oldContent"
      :oldContent="newContent"
      :diffBoxStyle="{ height: '800px' }"
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
      oldContent: `sadmfklj111
bb
aa
fff
sg
dfh
fh
dfg`
    }
  },
  mounted () {
    // console.log(this.$diffJson(this.oldContent, this.newContent))
  },
  methods: {
    diffJson (r) {
      // console.log(r)
    }
  },
}
</script>

<style>

</style>
