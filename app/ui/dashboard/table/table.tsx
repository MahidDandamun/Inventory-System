import Image from 'next/image';
import Link from 'next/link';

export default function DataTable({ datas, headers, hasImage = false, path }: { datas: any[], path:string, headers:string[], hasImage: boolean }) {
  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((value, index) => (            
              <th scope="col" className="px-3 py-1 sm:px-4 sm:py-3 md:px-5 md:py-3" key={index}>
                {value}
              </th>
              ))
            }
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data, key) => (
            <tr className="bg-white border-b 
            dark:bg-gray-800 dark:border-gray-600
             hover:bg-gray-50 dark:hover:bg-gray-600" key={key}>
              {hasImage? 
                <>
                <td scope="row" className="flex items-center justify-center text-gray-500 whitespace-nowrap dark:text-white">
                  <Image className="w-10 h-10 rounded" src={data.Image} alt="Jese image" width={40} height={40} />
                </td>
                {headers.slice(1).map((value, key) => (
                  <td className="px-3 py-3 md:px-5 md:py-3 text-gray-500 " key={key}>
                    {data[headers[key + 1]]}
                  </td>))}
                </>
                :
                <>
                {headers.map((value,key) => (
                  <td className="px-3 py-3 md:px-5 md:py-3" key={key}>
                    {data[headers[key]]}
                  </td>))}
                </>
              } 
              <td className="">
                <Link href={`/dashboard/${path}/test`}><button className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">Edit</button></Link> 
                <button className="font-medium p-1 text-white bg-red-500 dark:bg-red-500 rounded-md w-16 dark:text-white hover:bg-red-600 mr-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
   
 
                
                   