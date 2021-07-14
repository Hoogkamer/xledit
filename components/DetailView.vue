<template lang="pug">
    .cont
      v-form
        h3 {{sheet.name}}
        v-jsf(v-model="itemModel" :schema='schema' :options="options" v-if="schema")
      v-btn.primary(@click='backToList') OK
</template>

<script>
import VJsf from '@koumoul/vjsf/lib/VJsf.js'
import '@koumoul/vjsf/lib/VJsf.css'
// load third-party dependencies (markdown-it, vuedraggable)
// you can also load them separately based on your needs
import '@koumoul/vjsf/lib/deps/third-party.js'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: { VJsf },
  props: { sheet: { type: String, required: true } },
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
    }
  },

  computed: {
    // ...mapState('cyto', ['userOptions', 'metaInfo']),
    ...mapState('api', ['editItem', 'workbook']),
    ...mapGetters('api', ['getSheet']),
    schema: {
      get() {
        let schema = { type: 'object', properties: {} }
        this.editItem.metaData.forEach((c) => {
          schema.properties[c.name] = {
            type: 'string',
            'x-cols': c.width,
            'x-display': c.type,
            enum: c.lookup.length ? c.lookup : null,
          }
        })
        console.log('schema', schema)
        return schema
      },
    },
    itemModel: {
      get() {
        return this.editItem.data
      },
      set(value) {
        //this.setItem({ value: value, sheet: this.sheet })
        this.setEditItemData(value)
      },
    },
  },
  watch: {},
  mounted() {},
  methods: {
    ...mapMutations({
      setItem: 'api/setItem',
      setEditItem: 'api/setEditItem',
      setEditItemData: 'api/setEditItemData',
    }),
    backToList: function () {
      this.setItem({ value: this.editItem, sheet: this.sheet })
      this.setEditItem(null)
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
