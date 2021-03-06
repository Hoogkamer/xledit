<template lang="pug">
    div
      
      .sheetname 
        span {{sheet.name}}

        .bt
          v-btn.primary(primary @click="doEditItem({data:{}, metaData:sheet.metaData, name:sheet.name})" small) create new
          v-icon.ic(title='Edit columns' @click='setEditMetadata(sheetnr)') mdi-pencil

      .parentInfo(v-if='hasParent')
        h5 Items of:
        .parentname {{hasParent.parentName}}
        .parentdescr {{hasParent.parentDescription}}
        v-btn(@click='gotoSheet(null)' small) Remove Filter
      
      .search
        table
          tr
            td(v-if='itemFilters.length')
              v-icon.filtericon(@click="toggleShowFiltersOfSheet(sheet)" title='Toggle show filters') mdi-filter-menu
            td
              v-text-field.searchinput(v-model='search' label='Search' clearable) 
            td
              v-switch(v-model='searchInDescription' label='In description')
      .filters(v-if='sheet.showFilters')
        .filter(v-for = 'filter in itemFilters')
          v-select( :items="filter.values" :menu-props="{ maxHeight: '400' }" :label="filter.name" @change="updateFilterValue(filter.name, $event)"  multiple)
      div(v-if='!sheet.metaData.length')
        .warn Define the columns by pressing the pencil on the right
      div(v-if='!sheet.data.length')
        .warn Create an item by pressing 'CREATE NEW' button

      .card(v-for="itemCard in allItems" @click='doEditItem({data:itemCard, metaData:sheet.metaData, name:sheet.name})') 
        .name(v-for="namecol in sheet.metaData.filter(a => a.cardField === 'name')" :title="getTitle(namecol)") {{itemCard[namecol.name]}}
        .desc(v-for="descriptioncol in sheet.metaData.filter(a => a.cardField === 'description')" :title="getTitle(descriptioncol)") {{itemCard[descriptioncol.name]}}
        hr.hrgrey(v-if="sheet.metaData.filter(a => a.cardField==='info').length")
        .infor(v-for="infoItem in sheet.metaData.filter(a => a.cardField==='info')")
          .item1(:title='getTitle(infoItem)') {{itemCard[infoItem.name]}}
        .child(v-if='isParent')
          v-icon.children(x-small @click.stop='gotoSheet(itemCard)' title="View children") mdi-file-tree-outline
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
    sheetnr: { type: Number, required: true },
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
    ...mapState('api', ['editItem', 'workbook']),
    itemFilters: function () {
      let filterColumns = []

      this.sheet.metaData
        .filter((c) => c.filter)
        .forEach((filterColumn) => {
          filterColumns.push({
            name: filterColumn['name'],
            values: getValuesFromColumn(
              this.sheet.data,
              filterColumn.name
            ),
          })
        })
      return filterColumns
      function getValuesFromColumn(data, column) {
        let datas = []
        data.forEach((row) => {
          console.log(row)
          let value = row[column]
          if (Array.isArray(value)) {
            value.forEach((v) => {
              datas.push(v)
            })
          } else datas.push(value)
        })
        return [...new Set(datas)]
      }
    },
    isParent: function () {
      let found = false
      this.workbook.forEach((sheet) => {
        // todo: if multiple sheets or columns have this parent, they are overwritten: it can be only a parent of 1 thing, this should be more
        let f = sheet.metaData.find(
          (col) =>
            col.parent && col.parent.indexOf(this.sheet.name) > -1
        )
        if (f) {
          found = true
        }
      })

      return found
    },
    allItems: function () {
      let list = this.sheet.data

      if (this.hasParent) {
        list = list.filter(
          (l) =>
            l[this.hasParent.childColumn] === this.hasParent.parentId
        )
      }

      Object.keys(this.activeFilters).forEach((key) => {
        if (this.activeFilters[key].length) {
          list = list.filter((l) => {
            if (Array.isArray(l[key])) {
              let r = false
              l[key].forEach((lk) => {
                if (this.activeFilters[key].includes(lk)) {
                  r = true
                }
              })
              return r
            } else {
              return this.activeFilters[key].includes(l[key])
            }
          })
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

      return list
    },
  },
  watch: {},
  mounted() {},
  methods: {
    ...mapMutations({
      setEditItem: 'api/setEditItem',
      toggleShowFiltersOfSheet: 'api/toggleShowFiltersOfSheet',
    }),
    ...mapActions({ setEditMetadata: 'api/setEditMetadata' }),
    updateFilterValue: function (name, value) {
      delete this.activeFilters[name]
      this.$set(this.activeFilters, name, value)
    },
    clearFiltersSearch: function () {
      this.activeFilters = {}
      this.search = ''
    },
    doEditItem: function (val) {
      if (this.hasParent) {
        val.data[this.hasParent.childColumn] = this.hasParent.parentId
      }

      this.setEditItem(val)
    },
    getTitle(namecol) {
      return (
        namecol.name + (namecol.title ? ' - ' + namecol.title : '')
      )
    },
    gotoSheet(val) {
      //todo: find child sheet, column and filtervalue
      let result = {}
      this.workbook.forEach((sheet) => {
        // todo: if multiple sheets or columns have this parent, they are overwritten: it can be only a parent of 1 thing, this should be more
        let f = sheet.metaData.find(
          (col) =>
            col.parent && col.parent.indexOf(this.sheet.name) > -1
        )
        if (f && val) {
          result.parentColumn = f.parent.split('/')[1]
          result.childColumn = f.name
          result.childSheet = sheet
          result.parentName = this.sheet.metaData.find(
            (a) => a.cardField === 'name'
          )
            ? val[
                this.sheet.metaData.find(
                  (a) => a.cardField === 'name'
                ).name
              ]
            : '--no name--'

          result.parentDescription = this.sheet.metaData.find(
            (a) => a.cardField === 'description'
          )
            ? val[
                this.sheet.metaData.find(
                  (a) => a.cardField === 'description'
                ).name
              ]
            : ''
          result.parentId = val[result.parentColumn]
        }
      })
      if (!result.childSheet) {
        result.childSheet = this.sheet
      }
      this.$emit('showParent', result)
    },
  },
}
</script>
<style scoped>
.card {
  width: 500px;

  border: 1px solid lightgrey;
  padding: 10px;
  margin: 5px;
  display: inline-block;
  cursor: pointer;
  position: relative;
  vertical-align: top;
  border-radius: 5px;
}
.card:hover {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.name {
  font-weight: 600;
  height: 40px;
  font-size: 14px;
}
.desc {
  height: 55px;
  font-size: 12px;
  overflow: hidden;
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
}
.searchinput {
  width: 300px;
}
.child {
  position: absolute;
  bottom: 0px;
  right: 0px;
  background-color: white;
  padding: 3px;
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
  max-width: 1000px;
}
.hrgrey {
  border-top: 1px solid lightgrey;
}
.sheetname {
  width: 100%;
  font-size: 22px;

  color: black;
  padding: 1px 10px;
  margin: 10px 0px;
  border-bottom: 3px solid grey;
}
.bt {
  float: right;
  display: block;
}
.ic {
  margin: 0px 10px;
  cursor: pointer;
}
.ic:hover {
  color: black;
}
.filtericon {
  padding: 10px;
  cursor: pointer;
}
.filtericon:hover {
  color: blue;
}
.warn {
  background-color: red;
  color: white;
  display: inline-block;
  padding: 5px 20px;
  margin: 10px;
}
</style>
