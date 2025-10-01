import React from 'react';
import Usermenu from '../components/Usermenu';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const user = useSelector((store)=>store.user);
    console.log(user);
    
    return (
        <section className='bg-white select-none '>
                <div className='container mx-auto p-3 grid lg:grid-cols-[260px_minmax(0,1fr)]'>
                    
                        {/* left Side part */}
                        <div className='sticky top-24 p-4 overflow-y-auto max-h-[calc(100vh-160px)] hidden lg:block'>
                            <Usermenu/>
                        </div>
                        
                    {/* right side part */} 
                           <div className='bg-white  border-l p-4 min-h-[78vh]'>
                            <Outlet/>
                            </div>  
                    
                </div>
        </section>
    );
};

export default Dashboard;