<template lang="pug">
  v-app
    v-main
      .card(v-for="milestoneCard in allMilestones") 
        .name {{milestoneCard['Milestone Name']}}
        .desc {{milestoneCard['Milestone Description']}}
        .infor 
          .item1(title='Owner') {{milestoneCard['Owner']}}
          .item1(title='Owner') {{milestoneCard['Initiative']}}
        .rest
          .item1(title='Deadline') {{milestoneCard['Deadline']}} 
          .item1(title='Planning Status') {{milestoneCard['Planning Status']}}
          .item1(title='Execution Status') {{milestoneCard['Execution Status']}}

      v-form
        v-jsf(v-model="milestone" :schema='schema' :options="options")

      v-btn(@click='openExcel()') Open
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
    }
  },
  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', [
      'milestones',
      'deliverables',
      'milestoneSchema',
      'deliverSchema',
    ]),
    milestone: {
      get() {
        return this.milestones[1]
      },
      set(value) {
        this.setMilestone({ index: 1, value })
      },
    },
    allMilestones: function () {
      return this.milestones
    },
    schema: function () {
      return this.milestoneSchema
    },
  },
  methods: {
    ...mapActions({
      getExcel: 'api/getExcel',
    }),
    ...mapMutations({
      setMilestone: 'api/setMilestone',
    }),
    openExcel: function () {
      this.getExcel()
    },
  },

  mounted() {},
}
</script>
<style scoped>
.card {
  width: 500px;
  height: 150px;
  border: 1px solid grey;
  padding: 10px;
  margin: 5px;
  display: inline-block;
}
.name {
  font-weight: 600;
  height: 40px;
  font-size: 14px;
}
.desc {
  height: 50px;
  font-size: 12px;
}
.item1 {
  padding: 0px 10px;
  display: inline-block;
}
.infor {
  font-size: 14px;
}
.rest {
  font-size: 14px;
}
</style>
