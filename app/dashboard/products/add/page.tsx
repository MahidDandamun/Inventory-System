"use client";

import Link from 'next/link';
import { FileInputField, FormSubmitButton, QuantityInputField, SelectWarehouseField, TextInputField } from '../../../ui/dashboard/inputFields/inputField';

function AddProduct() {
 
  return (
   <>
   
    <div className="p-4 sm:ml-64">     
      <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">     
        <form className="max-w-full sm:max-w-xl mt-26 mx-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-center text-md mt-3 mb-8 sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Add product</h1>
          <div className="grid md:grid-cols-2 md:gap-6">  
              <TextInputField name={"productName"} TextLabel={"Product name"}  type={"text"}/>
              <TextInputField name={"sku"} TextLabel={"Sku (123-124-122)"}  type={"text"}/>
          </div>
          <div className="relative z-0 w-full mb-5 group">
              <SelectWarehouseField name={"warehouse"} />
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
              <QuantityInputField name={"qty"} Label={"Quantity"}/>
          </div>   
                                   
            <FileInputField name={""} />
          <FormSubmitButton path={"products"} />
        </form>
      </div>
    </div >
  </>
  )
}

export default AddProduct;