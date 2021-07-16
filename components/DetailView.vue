<template lang="pug">
    .cont
      v-form
        h3 {{editItem.name}}
        v-jsf(v-model="editable" :schema='schema' :options="options" v-if="schema")
      v-btn.primary.bt(@click='backToList') OK
      v-btn.secondary.bt(@click='cancel') Cancel
      v-btn.red.right(@click='delItem') Delete
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
  data() {
    return {
      show: true,
      editable: {},
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
    schema: {
      get() {
        let schema = { type: 'object', properties: {} }
        this.editItem.metaData.forEach((c) => {
          schema.properties[c.name] = {
            type: 'string',
            'x-cols': c.width,
            'x-display': c.type,
            format: c.type === 'date' ? 'date' : null,
            enum: c.lookup.length ? c.lookup : null,
          }
        })
        console.log('schema', schema)
        return schema
      },
    },
    itemModel: {
      get() {
        console.log('++++', this.editItem.data)
        return this.editItem.data
      },
      set(value) {
        //this.setItem({ value: value, sheet: this.sheet })
        console.log('----', value)
        this.setEditItemData(value)
      },
    },
  },
  watch: {},
  mounted() {
    this.editable = this.editItem.data
  },
  methods: {
    ...mapMutations({
      setItem: 'api/setItem',
      setEditItem: 'api/setEditItem',
      setEditItemData: 'api/setEditItemData',
      deleteItem: 'api/deleteItem',
    }),
    cancel: function () {
      this.setEditItem(null)
    },
    delItem: function () {
      this.deleteItem({
        id: this.editItem.data.__id,
        sheet: this.editItem.name,
      })
      this.setEditItem(null)
    },
    backToList: function () {
      this.setItem({
        value: this.editable,
        sheet: this.editItem.name,
        id: this.editItem.data.__id,
      })
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
.bt {
  margin-right: 10px;
}
.right {
  float: right;
}
</style>
