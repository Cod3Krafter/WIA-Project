import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"

const AuthPage = () => {
  return (
    <>
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <LoginForm/>
        </div>
    </>
  )
}

export default AuthPage