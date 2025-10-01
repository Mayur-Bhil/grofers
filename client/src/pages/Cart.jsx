import React, { useState } from 'react'
import DisplayCartItems from '../components/DisplayCartItems'

const Cart = () => {
      const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false)
    }

  return ( 
    <>
         {isOpen && <DisplayCartItems close={handleClose} />}
    </> 
  )
}

export default Cart
