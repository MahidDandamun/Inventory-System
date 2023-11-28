import Link from "next/link";

export function TextInputField({ TextLabel, type, name }) {
  return (
    <div className="relative z-0 w-full mb-8 group">
      <input type={type} name={name} id={name} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
      <label htmlFor={name} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{TextLabel}</label>
    </div>
  )
}

export function DateInputField({ name }) {
  return(
    <>
      <div className="relative w-full mb-8 group">
          <label htmlFor={name} className="block mb-2  peer-focus:font-medium text-sm font-medium text-gray-500 dark:text-gray-400">Date of Order</label>
          <div className="absolute inset-y-12 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                </svg>
          </div>
        <input datepicker-format="mm/yy" name={name} id={name} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="12/23" required/>
      </div>
    </>
  )
}

 export function SelectOptionField({ name, label, options }) { 
  return (
    <>
      <div className="mb-8">
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <select id={name} name={name} defaultValue={""} className="bg-gray-50 border border-gray-300 text-gray-500 dark:text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option>Select Option</option>
          {options.map((option, key) => (
            <option key={key} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}



export function FileInputField({name}) {
  return (
    <>
      <div className="flex flex-col items-center w-full mb-8">
          <p className="text-start peer-focus:font-medium text-sm font-medium text-gray-500 dark:text-gray-400">Insert the product image</p>
          <label htmlFor={name} className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id={name} name={name}type="file" className="hidden"/>
          </label>
       </div> 
    </>
  )
}

export function NumberInputField({Label, name,placeholder}:{Label:string, name:string,placeholder:string}) {
  return (
    <>
      <div className="relative z-0 w-full mb-8 group">
        <label htmlFor={name} className="block mb-2  peer-focus:font-medium text-sm font-medium text-gray-500 dark:text-gray-400">{Label}</label>
        <input type="number" name={name} id={name} aria-describedby="helper-text-explanation" data-input-counter data-input-counter-min="1"  defaultValue="" data-input-counter-max="5000" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required/>
      </div>
    </>
  )
}

export function FormSubmitButton({path,action}) {
  return (
    <>
      <div className="flex justify-between">
        <Link href={`/dashboard/${path}`}>
          <button className="text-white bg-gray-500 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-500"> Return
          </button>
        </Link>

        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{action}</button>
      </div>
    </>
  )
}

export function SearchInputField({name, placeholder}:{name:string, placeholder:string}) {
  return (
    <>
      <div className="relative w-full sm:w-6/12">
        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round"
              strokeLinejoin="round" strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input type="text" name={name} id={name} className="block transition-all ease-in-out delay-100 w-full p-2 ps-10 text-sm text-gray-900 border
            border-gray-300 rounded-lg sm:w-80 bg-gray-50 focus:ring-violet-500 
              focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
              dark:text-white dark:focus:ring-violet-400 dark:focus:border-violet-400"
          placeholder={placeholder} />      
      </div>
    </>
  )
}

 