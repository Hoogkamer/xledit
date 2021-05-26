<template lang="pug">
  v-app
    v-main
      v-btn(@click='openExcel()') Open
      cards-view(v-if='milestones.length')

   
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
      options: { locale: 'en-NL' },
      activeFilters: {},
      searchInDescription: false,
      search: '',
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', ['milestones', 'editMilestone']),
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
