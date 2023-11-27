"use client";
import Link from 'next/link';
import { FileInputField, FormSubmitButton, QuantityInputField, SelectWarehouseField, TextInputField } from '../../../ui/dashboard/inputFields/inputField';

function EditRawMaterials() {
  return (
   <>
   
    <div className="p-4 sm:ml-64">     
      <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">     
        <form className="max-w-full sm:max-w-xl mt-26 mx-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-center text-md mt-3 mb-8 sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Edit raw Material</h1>
          <div className="grid md:grid-cols-2 md:gap-6">  
            <TextInputField name={"rmaterial_name"} TextLabel={"Raw Material Name"}  type={"text"}/>
            <TextInputField name={"rmaterial_supplier"} TextLabel={"Supplier"}  type={"text"}/>
          </div>
            <SelectWarehouseField name={"rmaterial_warehouse"} />
          
          <div className="grid md:grid-cols-2 md:gap-6">
              <QuantityInputField name={"rmaterial_quantity"} Label={"Quantity"}/>
          </div>                            
          <FileInputField name={"rmaterial_image"} />
          <FormSubmitButton action={"Edit"} path={"raw-materials"} />         
        </form>
      </div>
    </div >
  </>
  )
}

export default EditRawMaterials;