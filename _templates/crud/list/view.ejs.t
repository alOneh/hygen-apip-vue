---
to: views/<%= resource.toLowerCase() %>/List.vue
---
<%
   fields  = resourceConfiguration.writableFields
-%>
<template>
  <div class="<%= resource %>List">
    <Toolbar :handle-add="addHandler" />

    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm12>
          <h1><%= resource.name %> List</h1>
        </v-flex>
        <v-flex lg12>
          <br />

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            :items-per-page.sync="options.itemsPerPage"
            :loading="isLoading"
            :loading-text="$t('Loading...')"
            :options.sync="options"
            :server-items-length="totalItems"
            class="elevation-1"
            item-key="@id"
            show-select
            @update:options="onUpdateOptions"
          >
          <% fields.forEach(function(field) { %>
            <% if (field.type == "dateTime") { %>
              <template slot="item.{{{name}}}" slot-scope="{ item }">
                {{ formatDateTime(item['{{{name}}}'], 'long') }}
              </template>
            <% } %>

            <% if (field.type === "date") { %>
                <template slot="item.{{{name}}}" slot-scope="{ item }">
                  {{ formatDateTime(item['{{{name}}}'], 'short') }}
                </template>
            <% } %>

            <% if (field.type === "number") { %>
                <template slot="item.<% field.name %>" slot-scope="{ item }">
                  {{ $n(item['<% field.name %>']) }}
                </template>
            <% } else { %>
              <% if (field.reference && field.maxCardinality) { %>
                <template slot="item.<% field.name %>" slot-scope="{ item }">
                  <ul>
                    <li v-for="_item in item['<%= field.name %>']" :key="_item.id">
                      {{ _item.id }}
                    </li>
                  </ul>
                </template>
              <% } %>
            <% } %>
          <% }) %>

            <ActionCell
              slot="item.action"
              slot-scope="props"
              :handle-show="() => showHandler(props.item)"
              :handle-edit="() => editHandler(props.item)"
              :handle-delete="() => deleteHandler(props.item)"
            ></ActionCell>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import ListMixin from '../../mixins/ListMixin';
import ActionCell from '../../components/ActionCell';
import Toolbar from '../../components/Toolbar';

export default {
  name: '<%= resource %>List',
  servicePrefix: '<%= resource %>',
  mixins: [ListMixin],
  components: {
    Toolbar,
    ActionCell
  },
  data() {
    return {
      headers: [
        <% fields.forEach(function(field) { %>
        { text: '<%= field.name %>', value: '<%= field.name %>' },
        <% }) %>
        {
          text: 'Actions',
          value: 'action',
          sortable: false
        }
      ],
      selected: []
    };
  },
  computed: {
    ...mapGetters('<%= resource %>', {
      items: 'list'
    }),
    ...mapFields('<%= resource %>', {
      deletedItem: 'deleted',
      error: 'error',
      isLoading: 'isLoading',
      resetList: 'resetList',
      totalItems: 'totalItems',
      view: 'view'
    })
  },
  methods: {
    ...mapActions('<%= resource %>', {
      getPage: 'fetchAll',
      deleteItem: 'del'
    })
  }
};
</script>
