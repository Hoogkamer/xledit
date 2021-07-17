<template lang="pug">
  v-app
    v-main
      v-btn.bt(@click='openExcel()') Open excel
      template(v-if='workbook.length')
        v-btn.bt( @click='editMetadata=true') Define columns
        v-btn.bt(@click = 'saveExcel()') Save excel
      hr
      edit-metadata(v-if='editMetadata' @close='editMetadata=false')
      div(v-else)
        .vspacer
        span SHEET: 
        v-btn-toggle(v-model="showSheet" )
          v-btn.primary(x-small v-for='sheet in workbook' :value='sheet' @click='hasParent=null') {{sheet.name}}
        v-btn(x-small @click='addSheet' ) Add sheet
      cards-view(v-if='showSheet' :sheet="showSheet" @showParent="showParent" :hasParent='hasParent')

   
</template>

<script>
import CardsView from '@/components/CardsView'
import DetailView from '@/components/DetailView'
import EditMetadata from '@/components/EditMetadata'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: { CardsView, DetailView, EditMetadata },

  data() {
    return {
      show: true,
      showSheet: '',
      editMetadata: false,
      activeFilters: {},
      searchInDescription: false,
      search: '',
      hasParent: null,
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', ['sheets']),
    ...mapGetters('api', ['workbook']),
  },
  mounted() {},
  methods: {
    ...mapActions({
      getExcel: 'api/getExcel',
      putExcel: 'api/putExcel',
      addSheetToWorkbook: 'api/addSheetToWorkbook',
    }),
    showParent: function (e) {
      console.log(e)
      if (e.parentId) this.hasParent = e
      else this.hasParent = null
      if (e) this.showSheet = e.childSheet
    },
    addSheet: function () {
      let sheetName = window.prompt('give sheet name')
      if (!sheetName) return
      this.addSheetToWorkbook(sheetName)
    },
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
.vspacer {
  height: 15px;
}
</style>
