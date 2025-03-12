import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { User } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl w-10',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const { fullName } = row.original
      return <LongText className='max-w-[120px]'>{fullName}</LongText>
    },
    meta: { className: 'w-[120px]' },
    enableSorting: true,
  },
  {
    accessorKey: 'enabled',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Enabled' />
    ),
    cell: ({ row }) => {
      const { enabled } = row.original
      return (
        <div className='flex w-[100px]'>
          <Badge
            variant='outline'
            className={cn(
              'capitalize',
              enabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            )}
          >
            {enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
      )
    },
    meta: { className: 'w-[100px]' },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as boolean
      const stringValue = cellValue.toString()
      return value.includes(stringValue)
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'alias',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Alias' />
    ),
    cell: ({ row }) => {
      const { alias } = row.original
      return <LongText className='max-w-[100px]'>{alias}</LongText>
    },
    meta: { className: 'w-[100px]' },
  },
  {
    accessorKey: 'emailAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email Address' />
    ),
    cell: ({ row }) => (
      <div className='w-[180px] truncate'>{row.getValue('emailAddress')}</div>
    ),
    meta: { className: 'w-[180px]' },
  },
  {
    accessorKey: 'mobileNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mobile Number' />
    ),
    cell: ({ row }) => (
      <div className='w-[140px]'>{row.getValue('mobileNumber')}</div>
    ),
    meta: { className: 'w-[140px]' },
    enableSorting: false,
  },

  {
    id: 'actions',
    cell: DataTableRowActions,
    meta: { className: 'w-[80px]' },
  },
]
