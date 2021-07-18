<template lang="pug">
  div
    h1 edit metadata
    v-btn(@click='fixDates();$emit("close")') Close
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
                  v-icon.delicon(title="Edit field name or description" @click="editColumnDetails=col") mdi-pencil
                td  
                  v-select(:items="types" label="Type" dense v-model="col.type")
                td
                  v-icon.icon(v-if="col.type.indexOf('select') >=0 " title='edit dropdown list' @click='showLookupDialog(col)') mdi-playlist-edit
                td  
                  v-select(:items="widths" label="Width" dense v-model="col.width")
                td  
                  v-switch(label="Filter" dense v-model="col.filter")
                td  
                  v-select(:items="cardFields" label="CardField" dense v-model="col.cardField")
                td
                  v-select(:items="allColumns" label="Parent" dense v-model='col.parent')
                td
                  v-icon.delicon(title="Delete column" @click="deleteColumn(sheet, a)") mdi-delete
                  
                  
          v-btn.primary(x-small @click='addColumn(sheet)') add column
    v-dialog(v-if='lookupEditColumn'  v-model="lookupEditColumn" max-width="800px" persistent)
      v-card   
        .card-content
          v-icon.close(@click="lookupEditColumn=null;newValue=null") mdi-close
          h2 {{lookupEditColumn.name}}
          textarea.tarea(rows='8' cols='50' v-model='lookupValuesInput')
          br
          v-btn(@click="closeDialog()") close
          v-btn(@click='lookupValuesInputSort') Sort list
    v-dialog(v-if="editColumnDetails" v-model="editColumnDetails" width = '400px' persistent)
     v-card   
        .card-content
          v-icon.close(@click="editColumnDetails=null") mdi-close
          v-text-field(v-model='editColumnDetails.name' label="Field name")
          v-textarea(v-model="editColumnDetails.description" label="Field description")
          v-btn(@click="editColumnDetails=null") close


    
</template>

<script>
import CardsView from '@/components/CardsView'
import draggable from 'vuedraggable'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getDefaultMetadata } from '@/assets/io_functions'
export default {
  components: { draggable },

  data() {
    return {
      lookupEditColumn: null,
      lookupValuesInput: '',
      editColumnDetails: null,
      newValue: '',
      panel: [0],
      types: [
        'string',
        'textarea',
        'integer',
        'date',
        'select list',
        'multi select list',
        'boolean',
      ],
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
      fixDates: 'api/fixDates',
    }),
    lookupValuesInputSort: function () {
      this.lookupValuesInput = this.lookupValuesInput
        .split('\n')
        .filter((n) => n)
        .sort()
        .join('\n')
    },
    showLookupDialog: function (col) {
      this.lookupEditColumn = col
      this.lookupValuesInput = col.lookup.join('\n')
    },
    closeDialog: function (col) {
      this.lookupEditColumn.lookup = this.lookupValuesInput
        .split('\n')
        .filter((n) => n)
      this.lookupEditColumn = null
      this.newValue = null
    },
    addColumn: function (sheet) {
      //todo: check double name
      let name = window.prompt('Column name')
      if (!name) return
      let item = getDefaultMetadata(name)
      sheet.metaData.push(item)
    },
    deleteColumn: function (sheet, colnr) {
      if (confirm('delete column: ' + sheet.metaData[colnr].name))
        sheet.metaData.splice(colnr, 1)
    },
    renameColumn: function (sheet, colnr) {
      //todo: check double name
      let newName = window.prompt(
        'New column name for: ' + sheet.metaData[colnr].name
      )
      if (!newName) return
      let oldName = sheet.metaData[colnr].name
      sheet.metaData[colnr].name = newName

      sheet.data.forEach((row) => {
        row[newName] = row[oldName]
        delete row[oldName]
      })
    },
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
.delicon {
  color: grey;
  cursor: pointer;
}
.delicon:hover {
  color: red;
}
.tarea {
  border: 1px solid black;
  padding: 5px;
}
</style>
