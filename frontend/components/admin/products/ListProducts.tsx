'use client'

import NotFoundCard from '@/components/common/NotFoundCard';
import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { ProductDrawer } from './ProductDrawer';
import { EditProductDrawer } from './EditProductDrawer';
import { DeleteProductDrawer } from './DeleteProductDrawer';
import { Product } from '@/types/product';

function ListProducts () {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  
  const fetchProducts = async () => {
    try {
      setLoading(true)

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };
      // fetch products
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/products`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const productsRes = await res.json()

      setProducts(productsRes.data ?? [])

    } catch (_err) {
      // do nothing
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchProducts()
  }, [])
  
  if (loading) {
    return <Loader />
  }

  if (!products || products.length === 0) {
    return (
      <NotFoundCard
        title="No products found"
        description="There are no products to display"
      />
    )
  }

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <DataTable
        columns={columns({
          onView: (product) => {
            setSelectedProduct(product)
            setViewOpen(true)
          },
          onEdit: (product) => {
            setSelectedProduct(product)
            setEditOpen(true)
          },
          onDelete: (product) => {
            setSelectedProduct(product)
            setDeleteOpen(true)
          },
        })}
        data={products}
        onRowClick={(product) => {
          setSelectedProduct(product)
          setViewOpen(true)
        }}
      />

      <ProductDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        product={selectedProduct}
      />

      <EditProductDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />

      <DeleteProductDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={fetchProducts}
        product={selectedProduct}
      />
    </div>
  )
}

export default ListProducts
