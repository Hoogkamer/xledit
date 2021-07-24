<template lang="pug">
  v-app
      app-header
      .vspacerheader
      v-container()
        edit-metadata(v-if='editMetadata' @close='editMetadata=false')
        div(v-else)
          .vspacer
        
          v-tabs(v-model="activeTab" )
            v-tab(v-for="(sheet, i) in workbook" :key="i" :value='sheet') {{sheet.name}}
            v-btn.add(@click='addSheet' title='add sheet' text large) [+]
            
        cards-view(v-if='showSheet1 && !editMetadata' :sheet="showSheet1" @showParent="showParent" :hasParent='hasParent')
        .message(v-if="!workbook.length") Open an excel or add a sheet
   
</template>

<script>
import CardsView from '@/components/CardsView'
import DetailView from '@/components/DetailView'
import EditMetadata from '@/components/EditMetadata'
import Header from '~/components/Header.vue'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    CardsView,
    DetailView,
    EditMetadata,
    'app-header': Header,
  },

  data() {
    return {
      show: true,
      showSheet: 1,
      activeTab: 0,
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
    showSheet1: function () {
      return this.workbook[this.activeTab]
    },
  },
  mounted() {},
  methods: {
    ...mapActions({
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
.vspacerheader {
  height: 35px;
}
.add {
  height: 48px;
}
</style>
