"use client"
import Link from 'next/link';
import { TextInputField, SelectProductField,SelectDeliveryStatField, QuantityInputField, DateInputField, FormSubmitButton } from "../../../ui/dashboard/inputFields/inputField";

 
function AddOrdersPage() {
 
  return (
   <>
    <div className="p-4 sm:ml-64">     
      <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">     
        <form className="max-w-full sm:max-w-xl mt-26 mx-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-center text-md mt-3 mb-8 sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Add Order</h1>
            <div className="grid md:grid-cols-2 md:gap-6">  
              <TextInputField TextLabel={"First Name"} type={"text"} />
              <TextInputField TextLabel={"Last Name"} type={"text"} />
            </div>
            <SelectProductField TextLabel={"Product"}/>
 
            <div className="grid md:grid-cols-2 md:gap-6">
              <QuantityInputField Label={"Quantity"}/>
              <DateInputField/>
            </div>
            <SelectDeliveryStatField/>
                             
            <FormSubmitButton path={"orders"} />
        </form>
      </div>
    </div >
  </>
  )
}

export default AddOrdersPage;