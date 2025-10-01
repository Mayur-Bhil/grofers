import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const DisplayTable = ({data,column}) => {
    const table = useReactTable({
        data,
        columns:column,
        getCoreRowModel:getCoreRowModel(),   
    })
    return (
        <div className="lg:p-2">
      <table className='lg:w-full py-0 px-0 border-collapse'>
        <thead className='bg-black text-white'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                <th>Sr. No</th>
              {headerGroup.headers.map(header => (
                <th className='border whitespace-nowrap' key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className=''>
          {table.getRowModel().rows.map((row,index) => (
            <tr className='' key={row.id}>
                <td className='border px-2 py-1'>{index+1}</td>
              {row.getVisibleCells().map(cell => (
                <td className='border px-2 py-1 whitespace-nowrap' key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
     
    </div>
    );
};

export default DisplayTable;