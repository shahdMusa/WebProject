'use client'

import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Sign In</h1>
      <button onClick={() => signIn("google")} className="mt-4 p-2 bg-blue-500 text-white">Sign in with Google</button>
      <button onClick={() => signIn("credentials", { username: "admin", password: "admin" })} className="mt-2 p-2 bg-gray-500 text-white">Sign in as Admin</button>
    </div>
  )
}
