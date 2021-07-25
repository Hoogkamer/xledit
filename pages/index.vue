<template lang="pug">
  v-app
      app-header
      .vspacerheader
      .datacontainer(v-if='workbook.length')
 
          edit-metadata(v-if='editMetadata || editMetadata===0' @close='setEditMetadata(null)' :openTab="editMetadata")
          div(v-else)
            .vspacer
          
            v-tabs(v-model="activeTab" )
              v-tab(v-for="(sheet, i) in workbook" :key="i" :value='sheet' @click='resetParentFilter(null)') {{sheet.name}}
              v-btn.add(@click='addSheet' title='add sheet' text large) [+]
              
            cards-view(v-if='showSheet1 && !editMetadata' :sheet="showSheet1" :sheetnr="activeTab" @showParent="showParent" :hasParent='hasParent')
      .nodatacontainer(v-else)
          .nodata
            img.nodataimage(src="@/assets/images/nodata.svg")
            .text Open an excel document or create a new one to get started
            .buttons
              v-btn.primary.bt(@click='openExcel()') Open excel
              v-btn.primary.bt(@click='addSheet') Create new
   
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
      activeFilters: {},
      searchInDescription: false,
      search: '',
      hasParent: null,
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', ['sheets', 'editMetadata']),
    ...mapGetters('api', ['workbook']),
    showSheet1: function () {
      return this.workbook[this.activeTab]
    },
  },
  mounted() {},
  methods: {
    ...mapActions({
      addSheetToWorkbook: 'api/addSheetToWorkbook',
      setEditMetadata: 'api/setEditMetadata',
      getExcel: 'api/getExcel',
    }),
    resetParentFilter: function () {
      this.hasParent = null
    },
    openExcel: function () {
      this.getExcel()
    },
    showParent: function (e) {
      console.log(e)
      if (e.parentId) this.hasParent = e
      else this.hasParent = null
      if (e) {
        this.showSheet = e.childSheet
        this.activeTab = this.workbook.findIndex(
          (sheet) => sheet === e.childSheet
        )
      }
    },
    addSheet: async function () {
      let sheetName = await this.$dialog.prompt({
        text: 'Name',
        title: 'Enter a name for the sheet',
      })

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
.vspacerheader {
  height: 35px;
}
.add {
  height: 48px;
}
.nodata {
  margin: auto;
  display: inline-block;
}
.nodataimage {
  width: 400px;

  padding: 30px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}
.nodatacontainer {
  margin-top: 100px;
  width: 100%;
  text-align: center;
}
.datacontainer {
  padding: 20px;
}
.text {
  font-size: 24px;
  color: grey;
  margin: 20px;
}
.buttons {
  margin: 20px;
}
</style>
