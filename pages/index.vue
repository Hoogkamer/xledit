<template lang="pug">
  v-app
    v-main
      v-form
        v-jsf(v-model="model" :schema='schema')

      v-btn(@click='openExcel()') Open
</template>

<script>
import { importExcel } from '~/assets/io_functions'
import VJsf from '@koumoul/vjsf'
import '@koumoul/vjsf/dist/main.css'
import '@koumoul/vjsf/lib/deps/third-party.js'

// import CytoGraph from '@/components/cytoscape/CytoGraph'
// import AppBar from '@/components/appbar/AppBar'
// import exportPdf from '@/components/appbar/ExportPdf'
// import CytoTerminal from '@/components/cytoscape/CytoTerminal'
// import CollectionList from '@/components/appbar/CollectionList'
// import SaveDialog from '@/components/appbar/SaveDialog'

// import { mapState, mapGetters } from 'vuex'
export default {
  components: { VJsf },
  // components: {
  //   CytoGraph,
  //   AppBar,
  //   CytoTerminal,
  //   exportPdf,
  //   CollectionList,
  //   SaveDialog
  // },
  data() {
    return {
      show: true,
      model: {},
      schema: {
        type: 'object',

        properties: {
          stringProp: { type: 'string' },
          dateProp: { type: 'string', format: 'date' },
          colorProp: { type: 'string', 'x-display': 'color-picker' },
        },
      },
    }
  },
  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    // ...mapGetters('cyto', ['pdfMenu', 'collectionsMenu', 'showSaveDialog']),
  },
  methods: {
    // ...mapMutations({
    //   setDefaultTermMakeUp: 'term/setDefaultTermMakeUp',
    //   setDefaultTermType: 'term/setDefaultTermType'
    // }),
    openExcel: function () {
      importExcel(null).then((workbook) => {
        let obj = {}
        workbook.miletypes.forEach((prop) => {
          obj[prop.name] = {
            ...prop,
          }
        })

        this.schema.properties = obj
        this.model = workbook.Milestones[3]
      })
    },
  },

  mounted() {},
}
</script>
<style scoped></style>
