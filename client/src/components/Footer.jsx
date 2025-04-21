import React from 'react'
import payment from '../assets/payment-method.png'
import { Link } from 'react-router'

const Footer = () => {

  return (
    <footer className='flex flex-col items-center w-full'>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 items-start w-9/10 pt-10">
        <div className="mb-5">
          <h3 className='mb-4'>Registered Office Address</h3>
          <ul className='capitalize'>
            <li className='uppercase'>site at canara bank jn,</li>
            <li>Vengara, Malappuram, </li>
            <li>Kerala, 676304</li>
            <li>
              <p>Email: <span className="lower">hijazicosmetics@gmail.com</span></p>
            </li>
            <li>
              <p>Hours: <span>10:00 - 16:00, Mon - Sat</span></p>
            </li>
          </ul>
        </div>
        <div className="mb-5">
          <h3 className='mb-4'>About</h3>
          <ul className="capitalize flex flex-col">
            <li className='py-1 cursor-pointer transition ease-in duration-200 hover:translate-x-1 hover:text-primary-300'>
              about us
              </li>
            <li className='py-1 cursor-pointer transition ease-in duration-200 hover:translate-x-1 hover:text-primary-300'>
              delivery information
              </li>
            <li className='py-1 cursor-pointer transition ease-in duration-200 hover:translate-x-1 hover:text-primary-300'>
              privacy policy
              </li>
            <li className='py-1 cursor-pointer transition ease-in duration-200 hover:translate-x-1 hover:text-primary-300'>
              terms & conditions
              </li>
            <li className='py-1 cursor-pointer transition ease-in duration-200 hover:translate-x-1 hover:text-primary-300'>
              contact us
              </li>
          </ul>
        </div>
        <div className="mb-5">
          <h3 className='mb-4'>My Account</h3>
          <ul>
            <li className='py-1 cursor-pointer transition ease-in duration-200 hover:translate-x-1 hover:text-primary-300'>Sign in</li>
          </ul>
        </div>
        <div className="mb-5">
          <h3 className='mb-4'>Payments</h3>
          <ul>
            <li>
              <span>Secured payment Gateways</span>
              <div className="mt-3">
                <img src={payment} alt="" />
              </div>
            </li>
            
          </ul>
        </div>  
      </div>
      <div className="w-9/10 flex flex-col md:flex-row items-center justify-between md:px-9 py-5 text-sm text-neutral-400">
        <span>In case of any concern, <Link to={"#"}>Contact Us</Link></span>
        <span>© 2025 www.hijazi.in. All rights reserved.</span>
      </div>     
    </footer>
  )
}

export default Footer