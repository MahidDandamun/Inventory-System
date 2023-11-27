"use client"
import Link from 'next/link';
import { TextInputField, SelectProductField,SelectDeliveryStatField, QuantityInputField, DateInputField, FormSubmitButton } from "../../../ui/dashboard/inputFields/inputField";

 
function EditOrdersPage() {
 
  return (
   <>
    <div className="p-4 sm:ml-64 bg-white dark:bg-gray-900">     
      <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">     
        <form className="max-w-full sm:max-w-xl mt-26 mx-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-center text-md mt-3 mb-8 sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Edit Order</h1>
            <div className="grid md:grid-cols-2 md:gap-6">  
              <TextInputField name={"customer_fname"} TextLabel={"First Name"} type={"text"} />
              <TextInputField name={"customer_lname"} TextLabel={"Last Name"} type={"text"} />
            </div>
            <SelectProductField name={"ordered_product"} TextLabel={"Product"}/>
 
            <div className="grid md:grid-cols-2 md:gap-6">
              <QuantityInputField name={"ordered_quantity"} Label={"Quantity"}/>
              <DateInputField name={"order_date"}/>
            </div>
            <SelectDeliveryStatField name={"order_status"}/>                           
            <FormSubmitButton action={"Edit"} path={"orders"} />
        </form>
      </div>
    </div >
  </>
  )
}

export default EditOrdersPage;