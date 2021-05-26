<template lang="pug">
    div
      .filters
        .filter(v-for = 'filter in milestoneFilters')
          v-select( :items="filter.values" :menu-props="{ maxHeight: '400' }" :label="filter.name" @change="updateFilterValue(filter.name, $event)"  multiple)
      .search
        v-row
          v-col
            v-text-field(v-model='search' label='Search' clearable) 
          v-col
            v-switch(v-model='searchInDescription' label='In discription')
          
      .card(v-for="milestoneCard in allMilestones" @click='doEditMilestone(milestoneCard)') 
        .name {{milestoneCard.cardInfo.name}}
        .desc {{milestoneCard.cardInfo.description}}
        hr
        .infor(v-for="infoItem in milestoneCard.cardInfo.infos")
          .item1(:title='infoItem.title') {{infoItem.val}}
      v-dialog(v-model='showModel' v-if="editMilestone")
        v-card
          detail-view
</template>

<script>
import VJsf from '@koumoul/vjsf'
import '@koumoul/vjsf/dist/main.css'
import '@koumoul/vjsf/lib/deps/third-party.js'
import DetailView from '@/components/DetailView'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: { VJsf, DetailView },

  data() {
    return {
      show: true,
      options: { locale: 'en-NL' },
      activeFilters: {},
      searchInDescription: false,
      search: '',
      showModel: true,
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', [
      'milestones',
      'deliverables',
      'editMilestone',
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
    allMilestones: function () {
      console.log('..........', this.milestones, this.activeFilters)
      let list = this.milestones

      Object.keys(this.activeFilters).forEach((key) => {
        console.log(key, this.activeFilters[key])
        if (this.activeFilters[key].length) {
          list = list.filter((l) =>
            this.activeFilters[key].includes(l[key])
          )
        }
        // Do something
      })
      if (this.search) {
        list = list.filter(
          (l) =>
            l.cardInfo.name
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) >= 0 ||
            (this.searchInDescription &&
              l.cardInfo.description
                .toLowerCase()
                .indexOf(this.search.toLowerCase()) >= 0)
        )
      }
      return list
    },
    schema: function () {
      return this.milestoneSchema
    },
  },
  watch: {},
  mounted() {},
  methods: {
    ...mapMutations({
      setEditMilestone: 'api/setEditMilestone',
    }),
    updateFilterValue: function (name, value) {
      delete this.activeFilters[name]
      this.$set(this.activeFilters, name, value)
    },
    clearFiltersSearch: function () {
      this.activeFilters = {}
      this.search = ''
    },
    doEditMilestone: function (val) {
      this.setEditMilestone(val)
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
  cursor: pointer;
}
.card:hover {
  background-color: aliceblue;
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
.search {
  max-width: 600px;
}
</style>
