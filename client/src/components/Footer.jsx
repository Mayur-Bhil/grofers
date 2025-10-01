import React from 'react'
import { FaFacebookSquare, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='border-t mt-auto bg-white'>
        <div className='container mx-auto p-4 text-center flex flex-col gap-4 lg:flex-row lg:justify-between'>
            <p>©️All rights reserved 2025</p>
            <p>made with ❤️ by Mayur</p>
            <div className='items-center flex gap-4 justify-center text-2xl'>
                <a href="" className='hover:text-[#847e7e]'>
                    <FaFacebookSquare/>
                </a>
                <a href="" className='hover:text-[#847e7e]'>
                    <FaInstagram />
                </a>
                <a href="" className='hover:text-[#847e7e]'>
                    <FaLinkedin />
                </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer