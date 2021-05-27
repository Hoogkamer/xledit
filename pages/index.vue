<template lang="pug">
  v-app
    v-main
      v-btn(@click='openExcel()') Open excel
      div
        v-btn-toggle(v-model="showSheet")
          v-btn(v-for='sheet in sheets' :value='sheet') {{sheet}}
      cards-view(v-if='showSheet' :sheet="showSheet")

   
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
      options: { locale: 'en-NL' },
      activeFilters: {},
      searchInDescription: false,
      search: '',
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

    openExcel: function () {
      this.getExcel()
    },
  },
}
</script>
<style scoped></style>
