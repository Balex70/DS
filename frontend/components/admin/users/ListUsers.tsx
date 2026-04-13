'use client'
import { CommonLogger } from '@/lib/logger/commonLogger';
import NotFoundCard from '@/components/common/NotFoundCard';
import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns, User } from "./columns"
import Loader from '@/components/common/Loader';

function ListUsers () {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        // fetch swap item
        const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/users`, {
            method: 'GET',
            credentials: 'include',
            headers: headers,
            cache: 'no-cache', // 'no-cache' if you want it fresh each time
        })
        
        const usersRes = await res.json()
        
        setUsers(usersRes.data ?? [])
        
      } catch (_err) {
        // do nothing
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) {
    return <Loader />
  }

  if (!users || users.length === 0) {
    return (
      <NotFoundCard
        title="No users found"
        description="There are no users to display"
      />
    )
  }

  return (
    <div className="w-[800px] main-bg flex flex-col border-b-0 rounded-none">
      <DataTable columns={columns} data={users} />
    </div>
  )
}

export default ListUsers
