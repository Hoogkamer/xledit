<template lang="pug">
    .cont
      v-form
        v-jsf(v-model="milestone" :schema='schema' :options="options")
      v-btn.primary(@click='backToList') OK
</template>

<script>
import VJsf from '@koumoul/vjsf'
import '@koumoul/vjsf/dist/main.css'
import '@koumoul/vjsf/lib/deps/third-party.js'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: { VJsf },

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
    ...mapState('api', [
      'milestones',
      'editMilestone',
      'deliverables',
      'milestoneSchema',
      'deliverSchema',
      'workbook',
    ]),

    milestone: {
      get() {
        return this.editMilestone
      },
      set(value) {
        this.setMilestone(value)
      },
    },

    schema: function () {
      return this.milestoneSchema
    },
  },
  watch: {},
  mounted() {},
  methods: {
    ...mapMutations({
      setMilestone: 'api/setMilestone',
      setEditMilestone: 'api/setEditMilestone',
    }),
    backToList: function () {
      this.setEditMilestone(null)
    },
  },
}
</script>
<style scoped>
.cont {
  background-color: white;
  padding: 20px;
}
</style>
