<template lang="pug">
     v-app-bar(color="deep-purple accent-4" dense dark elevate-on-scroll absolute)
          .brandname0.b1 /
          .brandname0.b2 /
          .brandname0.b3 / 
          .bspace
          .brandname1 XL
          .brandname2 edit
          .bspace2
          v-btn.bt(text @click='openExcel()') Open excel
          template(v-if='workbook.length')
               v-btn.bt(text @click='setEditMetadata(0)') Define columns
               v-btn.bt(text @click = 'saveExcel()') Save excel
    
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', ['sheets']),
    ...mapGetters('api', ['workbook']),
  },
  methods: {
    ...mapActions({
      getExcel: 'api/getExcel',
      putExcel: 'api/putExcel',
      addSheetToWorkbook: 'api/addSheetToWorkbook',
      setEditMetadata: 'api/setEditMetadata',
    }),
    openExcel: function () {
      this.getExcel()
    },
    saveExcel: function () {
      console.log(this.workbook)
      this.putExcel()
    },
  },
}
</script>
<style scoped>
.bt {
  margin: 5px;
}
.brandname0,
.brandname1,
.brandname2 {
  color: white;
  font-size: 24px;
  display: inline-block;
}
.b1 {
  font-weight: 100;
}
.b2 {
  font-weight: 300;
}
.b3 {
  font-weight: 600;
}
.brandname2 {
  font-style: italic;
}
.bspace {
  width: 5px;
}
.bspace2 {
  width: 30px;
}
</style>
