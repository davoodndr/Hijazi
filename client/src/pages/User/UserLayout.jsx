import React from 'react'
import Navbar from '../../components/user/Navbar'
import { Outlet } from 'react-router'
import Footer from '../../components/user/Footer'
import { Toaster } from 'react-hot-toast'
import AnimateAppear from '../../components/user/AnimateAppear'

const UserLayout = () => {
  return (
    <>
      <Navbar />
        <main className='w-full min-h-[calc(100vh-100px)] flex flex-col items-center bg-white'>
          <Outlet />
        </main>
      <Footer />
      
      <Toaster
        position='top-right'
        toastOptions={{
          error: {
            style: {
              border: '1px solid var(--color-error-border)',
              backgroundColor: 'var(--color-error-border)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(255, 0, 0, 1)'
            }
          },
          success: {
            style: {
              /* border: '1px solid var(--color-primary-50)', */
              backgroundColor: 'var(--color-green-500)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0, 64, 0, 1)'
            },
            iconTheme: {
              primary: '#fff',
              secondary: 'var(--color-green-600)'
            },
            duration: 2500
          }
        }}

       />
    </>
  )
}

export default UserLayout