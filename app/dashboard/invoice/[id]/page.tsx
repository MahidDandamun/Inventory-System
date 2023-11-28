"use client"
 
import { TextInputField, NumberInputField, DateInputField, FormSubmitButton, SelectOptionField } from "../../../ui/dashboard/inputFields/inputField";

 
function EditInvoicePage() {
  const productOptions = [
    {name: "Passion Flicker",value: "PF"},
    {name: "Passion Flicker",value: "PF"},
    {name: "Passion Flicker",value: "PF"},
    {name: "Passion Flicker",value: "PF"},
    {name: "Passion Flicker",value: "PF"},
    {name: "Passion Flicker",value: "PF"},
  ]
  const orderStatus = [
    {name: "packing",value: "pkg"},
    {name: "shipping",value: "shp"},
    {name: "Delivered",value: "dvd"},
  ]
  const paymentStatus = [
    { name: "Paid", value: "pd" },
    { name: "Pending", value: "pdg" },
    { name: "Cancelled", value:"cnl"}
  ]
  const paymentMethod = [
    { name: "Cash on Delivery", value: "cod" },
    { name: "Paypal", value: "pp" },
    { name: "Gcash", value: "gc" },
    { name: "Credit Card", value: "cc" },
  ]
 
  return (
   <>
    <div className="p-4 sm:ml-64 bg-white dark:bg-gray-900">     
      <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">     
        <form className="max-w-full sm:max-w-xl mt-26 mx-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-center text-md mt-3 mb-8 sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Edit Invoice</h1>
            <div className="grid md:grid-cols-2 md:gap-6">  
              <TextInputField name={"customer_fname"} TextLabel={"First Name"} type={"text"} />
              <TextInputField name={"customer_lname"} TextLabel={"Last Name"} type={"text"} />
            </div> 
            <TextInputField name={"customer_address"} TextLabel={"Address"} type={"text"} />
            
            <div className="grid md:grid-cols-2 md:gap-6">  
              <SelectOptionField name={"ordered_product"} label={"Product"} options={productOptions} />
              <NumberInputField name={"product_price"} placeholder={"Item price"} Label={"Price"}/>            
            </div>           
            <div className="grid md:grid-cols-2 md:gap-6">  
              <SelectOptionField name={"payment_method"} label={"Payment Method"} options={paymentMethod} />
              <SelectOptionField name={"payment_status"} label={"Payment Status"} options={paymentStatus} />
                     
            </div>           
            <div className="grid md:grid-cols-2 md:gap-6">
              <NumberInputField name={"ordered_quantity"} placeholder={"Ordered Quantity"} Label={"Quantity"}/>
              <DateInputField name={"order_date"}/>
            </div>                                
            <SelectOptionField name={"order_status"} label={"Order Status"} options={orderStatus} />
            <FormSubmitButton action={"Edit"} path={"invoice"} />
        </form>
      </div>
    </div >
  </>
  )
}

export default EditInvoicePage;