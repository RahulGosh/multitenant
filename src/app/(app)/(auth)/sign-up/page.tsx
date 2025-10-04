import { SignUpView } from '@/modules/auth/ui/views/sign-up-view'
import { getSession } from '@/lib/api'
import { redirect } from 'next/navigation'
import React from 'react'

const SignUp = async() => {
  const session = await getSession()

  if(session?.user) {
    redirect("/")
  }
  return (
      <SignUpView />
  )
}

export default SignUp
