import { h } from 'vue'
import { RouterLink } from 'vue-router'
import dropdown from './dataTableDropdown.vue'
import { format } from 'date-fns'

export const createColumns = (t) => [
  {
    accessorKey: 'title',
    header: function () {
      return h('div', { class: 'text-center' }, t('globals.terms.name'))
    },
    cell: function ({ row }) {
      return h('div', { class: 'text-center' },
        h(RouterLink,
          {
            to: { name: 'edit-customization', params: { id: row.original.id } },
            class: 'text-primary hover:underline'
          },
          () => row.getValue('title')
        )
      )
    }
  },
  {
    accessorKey: 'type',
    header: function () {
      return h('div', { class: 'text-center' }, t('customizations.form.type'))
    },
    cell: function ({ row }) {
      const typeLabels = {
        page: t('customizations.types.page'),
        component: t('customizations.types.component'),
        extension: t('customizations.types.extension')
      }
      return h('div', { class: 'text-center capitalize' }, typeLabels[row.getValue('type')] || row.getValue('type'))
    }
  },
  {
    accessorKey: 'active',
    enableGlobalFilter: false,
    header: function () {
      return h('div', { class: 'text-center' }, t('customizations.form.active'))
    },
    cell: function ({ row }) {
      const active = row.getValue('active')
      return h('div', { class: 'text-center' },
        active ? h('span', { class: 'text-green-600' }, '✓') : h('span', { class: 'text-muted-foreground' }, '—')
      )
    }
  },
  {
    accessorKey: 'created_at',
    enableGlobalFilter: false,
    header: function () {
      return h('div', { class: 'text-center' }, t('globals.terms.createdAt'))
    },
    cell: function ({ row }) {
      return h('div', { class: 'text-center' }, format(row.getValue('created_at'), 'PPpp'))
    }
  },
  {
    accessorKey: 'updated_at',
    enableGlobalFilter: false,
    header: function () {
      return h('div', { class: 'text-center' }, t('globals.terms.updatedAt'))
    },
    cell: function ({ row }) {
      return h('div', { class: 'text-center' }, format(row.getValue('updated_at'), 'PPpp'))
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const customization = row.original
      return h(
        'div',
        { class: 'relative' },
        h(dropdown, {
          customization
        })
      )
    }
  }
]