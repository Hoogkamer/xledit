<template lang="pug">
    div

      .parentInfo(v-if='hasParent')
        h3 Items of parent:
        .parentname {{hasParent.itemCard.cardInfo.name}}
        .parentdescr {{hasParent.itemCard.cardInfo.description}}
        v-btn(@click='gotoSheet(null)' small) Remove Filter
      .filters
        .filter(v-for = 'filter in itemFilters')
          v-select( :items="filter.values" :menu-props="{ maxHeight: '400' }" :label="filter.name" @change="updateFilterValue(filter.name, $event)"  multiple)
      .search
        v-row
          v-col
            v-text-field(v-model='search' label='Search' clearable) 
          v-col
            v-switch(v-model='searchInDescription' label='In description')
      .buttons
        v-btn(@click="doEditItem({data:{}, metaData:sheet.metaData, name:sheet.name})") new
          
      .card(v-for="itemCard in allItems" @click='doEditItem({data:itemCard, metaData:sheet.metaData, name:sheet.name})') 
        .name {{itemCard[sheet.metaData.find(a => a.cardField === 'name').name]}}
        .desc {{itemCard[sheet.metaData.find(a => a.cardField === 'description').name]}}
        hr
        .infor(v-for="infoItem in sheet.metaData.filter(a => a.cardField==='info')")
          .item1(:title='infoItem.name') {{itemCard[infoItem.name]}}
        //- .child(v-if='itemCard.cardInfo.child')
        //-   v-icon.children(x-small @click.stop='gotoSheet({...itemCard.cardInfo.child, itemCard})' title="View children") mdi-file-tree-outline
      v-dialog(v-model='showModel' v-if="editItem")
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
  props: {
    sheet: { type: Object, required: true },
    hasParent: { type: Object, default: null },
  },
  data() {
    return {
      show: true,
      options: {
        locale: 'en-NL',
        formats: {
          date: function (e, t) {
            var n = new Date(e)
            return n.toLocaleDateString(t)
          },
        },
      },
      activeFilters: {},
      searchInDescription: false,
      search: '',
      showModel: true,
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', ['editItem']),
    itemFilters: function () {
      let filters = []

      this.sheet.metaData
        .filter((c) => c.filter)
        .forEach((filter) => {
          filters.push({
            name: filter['name'],
            values: [
              ...new Set(
                this.sheet.data.map((item) =>
                  item[filter['name']] !== 0
                    ? item[filter['name']] || ''
                    : 0
                )
              ),
            ],
          })
        })
      console.log('ffff', filters)
      return filters
    },
    allItems: function () {
      let list = this.sheet.data

      if (this.hasParent) {
        list = list.filter(
          (l) => l[this.hasParent.col] === this.hasParent.val
        )
      }

      Object.keys(this.activeFilters).forEach((key) => {
        if (this.activeFilters[key].length) {
          list = list.filter((l) =>
            this.activeFilters[key].includes(l[key])
          )
        }
      })
      if (this.search) {
        list = list.filter(
          (l) =>
            l[
              this.sheet.metaData.find((a) => a.cardField === 'name')
                .name
            ]
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) >= 0 ||
            (this.searchInDescription &&
              l[
                this.sheet.metaData.find(
                  (a) => a.cardField === 'description'
                ).name
              ]
                .toLowerCase()
                .indexOf(this.search.toLowerCase()) >= 0)
        )
      }
      console.log(list)
      return list
    },
  },
  watch: {},
  mounted() {
    console.log('oooo', this.sheet)
  },
  methods: {
    ...mapMutations({
      setEditItem: 'api/setEditItem',
    }),
    updateFilterValue: function (name, value) {
      delete this.activeFilters[name]
      this.$set(this.activeFilters, name, value)
    },
    clearFiltersSearch: function () {
      this.activeFilters = {}
      this.search = ''
    },
    doEditItem: function (val) {
      this.setEditItem(val)
    },
    gotoSheet(val) {
      this.$emit('showParent', val)
      console.log(val)
    },
  },
}
</script>
<style scoped>
.card {
  width: 500px;
  border: 1px solid grey;
  padding: 10px;
  margin: 5px;
  display: inline-block;
  cursor: pointer;
  position: relative;
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
.child {
  position: absolute;
  bottom: 0px;
  right: 0px;
}
.children {
  font-size: 24px !important;
  color: black;
}
.children:hover {
  color: blue;
}
.parentname {
  font-weight: 500;
}
.parentdescr {
  font-size: 12px;
  padding: 0px 0px 10px 0px;
}
.parentInfo {
  margin: 20px 0px;
  border: 1px solid grey;
  padding: 10px;
}
</style>
