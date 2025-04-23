import React from 'react'
import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router'
import Footer from '../../components/Footer'
import { Toaster } from 'react-hot-toast'

const UserLayout = () => {
  return (
    <>
      <Navbar />
        <Outlet />
      <Footer />
      
      <Toaster
        position='top-right'
        toastOptions={{
          error: {
            style: {
              border: '1px solid var(--color-error-border)',
              backgroundColor: 'var(--color-error-border)',
              color: 'white'
            }
          },
          success: {
            style: {
              /* border: '1px solid var(--color-primary-50)', */
              backgroundColor: 'var(--color-green-500)',
              color: 'white'
            },
            iconTheme: {
              primary: '#fff',
              secondary: 'var(--color-green-600)'
            }
          }
        }}

       />
    </>
  )
}

export default UserLayout