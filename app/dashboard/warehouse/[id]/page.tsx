"use client";

import Link from "next/link";
import { FormSubmitButton, SelectStorageStatusField, SelectWarehouseField, TextInputField } from "../../../ui/dashboard/inputFields/inputField";

 
function AddWarehouse() {
  return (
   <>
   
    <div className="p-4 sm:ml-64">  
 
      <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">     
        <form className="max-w-full sm:max-w-xl mt-26 mx-auto shadow-md sm:rounded-lg p-5" action="">
          <h1 className="text-center text-md mt-3 mb-8 sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Edit warehouse</h1>                 
            <TextInputField name={"warehouse_name"}type="text" TextLabel={"Warehouse Location"} />
            <SelectStorageStatusField name={"warehouse_status"} />            
          <FormSubmitButton action={"Edit"} path={"warehouse"}/>                       
        </form>
      </div>
    </div >
  </>
  )
}


export default AddWarehouse;