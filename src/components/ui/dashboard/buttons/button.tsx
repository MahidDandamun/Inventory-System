import { IoMdAdd } from 'react-icons/io'

export function AddButton() {
  return (
    <>
      <button className='flex w-14 h-14 rounded-full 
         sm:w-24 sm:h-8 fixed right-6 bottom-20 
         sm:static justify-center items-center
       bg-violet-500 sm:rounded-md  text-sm
      text-white hover:bg-violet-400'>
        <p className="hidden sm:block">Add new</p>
        <IoMdAdd className="block sm:hidden" size={36} />
      </button>
    </>
  )
}
