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
                td {{col.name}}
                td  
                  v-select(:items="types" label="Type" dense v-model="col.type")
                td  
                  v-select(:items="widths" label="Width" dense v-model="col.width")
                td  
                  v-switch(label="Filter" dense v-model="col.filter")
                td  
                  v-select(:items="cardFields" label="CardField" dense v-model="col.cardField")
                td
                  v-select(:items="allColumns" label="Parent" dense v-model='col.parent')

      


   
</template>

<script>
import CardsView from '@/components/CardsView'
import draggable from 'vuedraggable'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: { draggable },

  data() {
    return {
      show: true,
      showSheet: '',
      editMetadata: false,
      activeFilters: {},
      searchInDescription: false,
      search: '',
      hasParent: null,
      panel: [0],
      types: ['string', 'textarea', 'integer', 'date'],
      widths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      filter: [true, false],
      cardFields: ['none', 'name', 'description', 'info'],
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
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
    }),
    showParent: function (e) {
      console.log(e)
      this.hasParent = e
      if (e) this.showSheet = e.sheet
    },

    openExcel: function () {
      this.getExcel()
    },
  },
}
</script>
<style scoped></style>
