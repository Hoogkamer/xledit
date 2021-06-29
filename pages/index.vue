<template lang="pug">
  v-app
    v-main
      v-btn(@click='openExcel()') Open excel
      div
        v-btn-toggle(v-model="showSheet" )
          v-btn(v-for='sheet in sheets' :value='sheet' @click='hasParent=null') {{sheet}}
      cards-view(v-if='showSheet' :sheet="showSheet" @showParent="showParent" :hasParent='hasParent')

   
</template>

<script>
import CardsView from '@/components/CardsView'
import DetailView from '@/components/DetailView'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: { CardsView, DetailView },

  data() {
    return {
      show: true,
      showSheet: '',

      activeFilters: {},
      searchInDescription: false,
      search: '',
      hasParent: null,
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', ['sheets']),
  },
  mounted() {},
  methods: {
    ...mapActions({
      getExcel: 'api/getExcel',
    }),
    showParent: function (e) {
      console.log(e)
      this.hasParent = e
      if (e) this.showSheet = e.sheet
    },

    openExcel: function () {
      this.getExcel()
    },
  },
}
</script>
<style scoped></style>
