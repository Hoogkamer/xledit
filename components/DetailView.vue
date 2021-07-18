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
          let type = [
            'string',
            'number',
            'integer',
            'boolean',
          ].includes(c.type)
            ? c.type
            : 'string'

          let cprop = {
            type: type,
            'x-cols': c.width,
            'x-display': c.type,
            description: c.description,
            format: c.type === 'date' ? 'date' : null,
            enum: c.lookup && c.lookup.length ? c.lookup : null,
          }
          if (c.type === 'multi select list') {
            cprop.type = 'array'
            cprop.items = { type: 'string', enum: cprop.enum }

            delete cprop.enum
          }
          schema.properties[c.name] = cprop
        })
        console.log('schema', schema)
        return schema
      },
    },
  },
  watch: {},
  mounted() {
    this.editable = this.editItem.data
  },
  methods: {
    ...mapMutations({
      setEditItem: 'api/setEditItem',
      deleteItem: 'api/deleteItem',
      addItem: 'api/addItem',
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
      Object.keys(this.editable).forEach((key) => {
        this.$set(this.editItem.data, key, this.editable[key])
      })
      console.log('99', this.editItem.data)
      if (
        !this.editItem.data.__id &&
        !(this.editItem.data.__id === 0)
      )
        this.addItem({
          item: this.editItem.data,
          sheet: this.editItem.name,
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
