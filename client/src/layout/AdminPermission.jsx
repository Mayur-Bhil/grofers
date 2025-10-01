import React from 'react';
import { useSelector } from 'react-redux';
import isAdmin from '../utils/isAdmin';

const AdminPermission = ({children}) => {
    const user = useSelector((store)=>store.user)
    return (
        <>
            {
                isAdmin(user.role) ? children : <p className="text-rose-500 bg-red-100 p-4 ">You do not have permission to go ahed</p>
            }
            </>
    );
};

export default AdminPermission;