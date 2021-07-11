<template lang="pug">
  div
    h1 edit metadata
    div(v-for="sheet in workbook")
      span(v-for='col in sheet.metaData') {{col.name}}
    v-expansion-panels(v-model='panel' multiple)
      v-expansion-panel(v-for="(sheet, i) in workbook" :key="i" )
        v-expansion-panel-header {{sheet.name}}
        v-expansion-panel-content
          table
            draggable(v-model="sheet.metaData" tag='tbody')
              tr(v-for="(col, a) in sheet.metaData" :key="a")
                td
                  .colname
                    table
                      tr
                        td
                          v-icon.dragicon mdi-drag
                        td
                          .colnm {{col.name}}
                td  
                  v-select(:items="types" label="Type" dense v-model="col.type")
                td
                  v-icon.icon(v-if="col.type === 'dropdown'" title='edit dropdown list' @click='lookupEditColumn = col') mdi-playlist-edit
                td  
                  v-select(:items="widths" label="Width" dense v-model="col.width")
                td  
                  v-switch(label="Filter" dense v-model="col.filter")
                td  
                  v-select(:items="cardFields" label="CardField" dense v-model="col.cardField")
                td
                  v-select(:items="allColumns" label="Parent" dense v-model='col.parent')
    v-dialog(v-if='lookupEditColumn'  v-model="lookupEditColumn" max-width="800px" persistent)
      v-card
        
        .card-content

          v-icon.close(@click="lookupEditColumn=null;newValue=null") mdi-close
          h2 {{lookupEditColumn.name}}
          table
            draggable(v-model="lookupEditColumn.lookup" tag='tbody')
              tr(v-for='(dropdownValue,i) in lookupEditColumn.lookup' :key='i')
                td
                  v-icon.dragicon1 mdi-drag
                td 
                  input.inp(v-model = "lookupEditColumn.lookup[i]")
                td
                  v-btn(@click='lookupEditColumn.lookup.splice(i, 1)' x-small) Remove
            tr
              td
              td
                input.inp(v-model='newValue' placeholder='enter new value....')
              td
                v-btn(@click='lookupEditColumn.lookup.push(newValue);newValue=""' x-small) Add
          v-btn(@click="lookupEditColumn=null;newValue=null") close
          v-btn(@click='lookupEditColumn.lookup.sort()') Sort list

    
</template>

<script>
import CardsView from '@/components/CardsView'
import draggable from 'vuedraggable'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: { draggable },

  data() {
    return {
      lookupEditColumn: null,
      newValue: '',
      panel: [0],
      types: ['string', 'textarea', 'integer', 'date', 'dropdown'],
      widths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      filter: [true, false],
      cardFields: ['none', 'name', 'description', 'info'],
    }
  },

  computed: {
    ...mapState('api', ['sheets']),
    ...mapGetters('api', ['workbook']),
    allColumns: function () {
      let cols = []
      this.workbook.forEach((sheet) => {
        console.log(sheet)
        sheet.metaData.forEach((col) => {
          cols.push(sheet.name + '/' + col.name)
        })
      })
      return ['none', ...cols.sort()]
    },
  },

  mounted() {
    console.log(this.workbook)
  },
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
<style scoped>
.icon {
  cursor: pointer;
  color: blue;
}
.dragicon {
  color: white;
}
.dragicon1 {
  color: black;
}
.colnm {
  display: inline-block;
}
.colname {
  color: white;
  background-color: grey;
  padding: 5px;
  height: 100%;
}
.close {
  float: right;
  padding: 5px;
}
.inp {
  border: 1px solid grey;
  padding: 0px 5px;
}
h2 {
  padding: 10px 0px;
}
.card-content {
  color: grey;
  padding: 10px;
}
</style>
