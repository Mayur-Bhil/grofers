import React, { useEffect, useState } from 'react'

const useMobile = (breackPoints = 768) => {

    const [isMobile,setisMobile] = useState(window.innerWidth < breackPoints);
    const handelResize = () =>{
        const check = window.innerWidth < breackPoints;
        setisMobile(check)
    }

    useEffect(()=>{
        handelResize();

        window.removeEventListener('resize',handelResize);
        
        return ()=>{
            window.removeEventListener('resize',handelResize);
        }
    },[])


  return [isMobile]
    
  
}

export default useMobile
