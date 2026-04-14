'use client'
import { CommonLogger } from '@/lib/logger/commonLogger';
import NotFoundCard from '@/components/common/NotFoundCard';
import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns, User } from "./columns"
import Loader from '@/components/common/Loader';
import { UserDrawer } from './UserDrawer';
import { EditUserDrawer } from './EditUserDrawer';
import { Button } from '@/components/ui/button';
import { CreateUserDrawer } from './CreateUserDrawer';
import { DeleteUserDrawer } from './DeleteUserDrawer';

function ListUsers () {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  
  const fetchUsers = async () => {
    try {
      setLoading(true)

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };
      // fetch users
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

  useEffect(() => {
      fetchUsers()
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
      <div className="flex items-start gap-2 my-2">
        <Button variant="outline" size="lg" onClick={() => setCreateOpen(true)}>
          Add User
        </Button>
      </div>
      <DataTable
        columns={columns({
          onView: (user) => {
            setSelectedUser(user)
            setViewOpen(true)
          },
          onEdit: (user) => {
            setSelectedUser(user)
            setEditOpen(true)
          },
          onDelete: (user) => {
            setSelectedUser(user)
            setDeleteOpen(true)
          },
        })}
        data={users}
      />

      <CreateUserDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchUsers}
      />

      <UserDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        user={selectedUser}
      />

      <EditUserDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      <DeleteUserDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={fetchUsers}
        user={selectedUser}
      />
    </div>
  )
}

export default ListUsers
