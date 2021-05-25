<template lang="pug">
  v-app
    v-main(v-if='allMilestones.length')
      .filters
        .filter(v-for = 'filter in milestoneFilters')
          v-select( :items="filter.values" :menu-props="{ maxHeight: '400' }" :label="filter.name" @change="updateFilterValue(filter.name, $event)"  multiple)

      .card(v-for="milestoneCard in allMilestones") 
        .name {{milestoneCard.cardInfo.name}}
        .desc {{milestoneCard.cardInfo.description}}
        .infor(v-for="infoItem in milestoneCard.cardInfo.infos")
          .item1(:title='infoItem.title') {{infoItem.val}}
        

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
      activeFilters: {},
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', [
      'milestones',
      'deliverables',
      'milestoneSchema',
      'deliverSchema',
      'workbook',
    ]),
    milestoneFilters: function () {
      let filters = []

      this.workbook.miletypes
        .filter((mt) => mt['y-filter'])
        .forEach((filter) => {
          filters.push({
            name: filter['name'],
            values: [
              ...new Set(
                this.milestones.map((item) => item[filter['name']])
              ),
            ],
          })
        })

      return filters
    },
    milestone: {
      get() {
        return this.milestones[1]
      },
      set(value) {
        this.setMilestone({ index: 1, value })
      },
    },
    allMilestones: function () {
      console.log('..........', this.milestones, this.activeFilters)

      Object.keys(this.activeFilters).forEach((key) => {
        console.log(key, this.activeFilters[key])
        // Do something
      })
      return this.milestones
    },
    schema: function () {
      return this.milestoneSchema
    },
  },
  watch: {
    activeFilters: function (val) {
      console.log('af', val)
    },
    workbook: function (val) {
      // var objct = {}
      // console.log('ppp', val, this.activeFilters)
      // if (!this.activeFilters) {
      //   this.activeFilters = {}
      //   this.workbook.miletypes
      //     .filter((mt) => mt['y-filter'])
      //     .forEach((filter) => {
      //       objct[filter['name']] = []
      //     })
      // }
      // this.activeFilters = objct
      // console.log('//', this.activeFilters)
    },
  },
  mounted() {},
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
    updateFilterValue: function (name, value) {
      delete this.activeFilters[name]
      this.$set(this.activeFilters, name, value)
    },
  },
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
  font-size: 12px;
  display: inline-block;
  width: 230px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rest {
  font-size: 14px;
}
.filter {
  width: 200px;
  display: inline-block;
  margin: 0px 10px;
}
</style>
