"use client"
 
import { TextInputField,SelectOptionField, DateInputField, NumberInputField, FormSubmitButton } from "../../../ui/dashboard/inputFields/inputField";

 
function UpdateOrdersPage() {
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
  const additionalServices = [
    { name: "Gift Wrapping", value: 100 },
    { name: "Extra Packaging", value: 50 },
  ]
  return (
   <>
    <div className="p-4 sm:ml-64 bg-white dark:bg-gray-900">     
      <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">     
        <form className="max-w-full sm:max-w-xl mt-26 mx-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-center text-md mt-3 mb-8 sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Add Order</h1>
            <div className="grid md:grid-cols-2 md:gap-6">  
              <TextInputField name={"customer_fname"} TextLabel={"First Name"} type={"text"} />
              <TextInputField name={"customer_lname"} TextLabel={"Last Name"} type={"text"} />
            </div>
            <TextInputField name={"customer_address"} TextLabel={"Address"} type={"text"} />
            <SelectOptionField name={"ordered_product"} label={"Product"} options={productOptions} />
            <div className="grid md:grid-cols-2 md:gap-6">              
              <NumberInputField name={"product_discount"} placeholder={"Discount in percent e.g 20"} Label={"Discount per product"}/>         
              <SelectOptionField name={"additional_services"} label={"Additional Services"} options={additionalServices} />                                   
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <NumberInputField name={"ordered_quantity"} placeholder={"Ordered Quantity"} Label={"Quantity"}/>         
              <SelectOptionField name={"order_status"} label={"Order Status"} options={orderStatus} />                                   
            </div>
            <div className="grid md:grid-cols-3 md:gap-6">                       
              <SelectOptionField name={"payment_status"} label={"Payment Status"} options={paymentStatus} />                                   
              <SelectOptionField name={"payment_method"} label={"Payment Method"} options={paymentMethod} />
              <DateInputField name={"order_date"}/>
            </div>
            <FormSubmitButton action={"Add"} path={"orders"} />
        </form>
      </div>
    </div >
  </>
  )
}

export default UpdateOrdersPage;