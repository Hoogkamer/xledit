<template lang="pug">
     v-app-bar(color="deep-purple accent-4" dense dark elevate-on-scroll absolute)
        NuxtLink(to="/") 
          .logo
            .brandname0.b1 )
            .brandname0.b2 (
            .brandname1 L
            .brandname2 edit
            .bspace2

          //v-btn.bt(v-if='!workbook.length' text @click='openExcel()') Open excel
        v-btn.bt(v-if='workbook.length' text @click='newWorkbook()') Clear all

        template(v-if='workbook.length')
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
      createNewWorkbook: 'api/createNewWorkbook',
    }),
    openExcel: function () {
      this.getExcel()
    },
    newWorkbook: async function () {
      const res = await this.$dialog.confirm({
        text: 'Wipe the data and create something new',
        title: 'Clear all',
      })
      if (res) this.createNewWorkbook()
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
.logo {
  display: inline-block;
}
.brandname0,
.brandname1,
.brandname2 {
  color: white;
  font-size: 30px;
  display: inline-block;
}
.b1 {
  font-size: 48px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0;
  font-family: 'Courier New', Courier, monospace;
}
.b2 {
  font-size: 48px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0;
  font-family: 'Courier New', Courier, monospace;
  margin-left: -15px;
}
.b3 {
}
.brandname1 {
  margin-left: -10px;
}
.brandname2 {
  font-style: italic;
}
.bspace {
  width: 5px;
  display: inline-block;
}
.bspace2 {
  width: 30px;
  display: inline-block;
}
</style>
