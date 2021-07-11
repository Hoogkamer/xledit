<template lang="pug">
  v-app
    v-main
      v-btn(@click='openExcel()') Open excel
      template(v-if='workbook.length')
        v-btn( @click='editMetadata=true') Define columns
        v-btn(@click = 'saveExcel()') Save excel
      edit-metadata(v-if='editMetadata')
      div
        v-btn-toggle(v-model="showSheet" )
          v-btn(v-for='sheet in sheets' :value='sheet' @click='hasParent=null') {{sheet}}
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
    }),
    showParent: function (e) {
      console.log(e)
      this.hasParent = e
      if (e) this.showSheet = e.sheet
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
<style scoped></style>
