"use client"
import { signOut } from 'next-auth/react';
import React from 'react'


export default function SignoutNav() {
  return (
    <button className="flex text-white items-center cursor-pointer" onClick={() => signOut()}>
       SignOut
      </button>
  )
}
