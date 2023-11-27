"use client";
import Link from "next/link"
import { SelectAccessLevelField, TextInputField,FileInputField, FormSubmitButton } from "../../../ui/dashboard/inputFields/inputField";


export default function addUser() {
     return (
      <>
      
    <div className="p-4 sm:ml-64 bg-white dark:bg-gray-900">     
      <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">     
        <form className="max-w-full sm:max-w-xl mt-26 mx-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-center text-md mt-3 mb-8 sm:text-lg md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Add User</h1>
          <div className="grid md:grid-cols-2 md:gap-6">  
            <TextInputField name={"user_fname"} TextLabel={"First Name"}  type={"text"}/>
            <TextInputField name={"user_lname"} TextLabel={"Last Name"}  type={"text"}/>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <TextInputField name={"user_email"} TextLabel={"Email"}  type={"email"}/>
          </div>
          
          <div className="grid md:grid-cols-2 md:gap-6">
            <TextInputField name={"user_password"} TextLabel={"Password"}  type={"password"}/>
            <TextInputField name={"user_password"} TextLabel={"Confirm Password"}  type={"password"}/>
          </div>
          
          <SelectAccessLevelField name={"user_accessLevel"} TextLabel={"Access Level"}/>                                             
          <FileInputField name={"user_image"}/>
          <FormSubmitButton action={"Submit"} path={"manage-users"} />
         
        </form>
      </div>
    </div >
    </>
  )
}
