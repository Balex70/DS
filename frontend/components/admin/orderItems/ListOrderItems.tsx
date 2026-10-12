'use client'

import { useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import { OrderItem } from '@/types/order';
import { OrderItemsDrawer } from './OrderItemsDrawer';

function ListOrderItems ({ items }: {items: OrderItem[]}) {
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      {items && (
        <DataTable
          columns={columns()}
          data={items}
          onRowClick={(item) => {
            setSelectedItem(item)
            setViewOpen(true)
          }}
        />
      )}

      <OrderItemsDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        productItem={selectedItem}
      />
    </div>
  )
}

export default ListOrderItems
