'use client'

import { useSession } from "next-auth/react"

export default function UserInfo() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="text-sm text-gray-600 mb-4">
      Signed in as: <strong>{session.user?.email}</strong>
    </div>
  )
}
