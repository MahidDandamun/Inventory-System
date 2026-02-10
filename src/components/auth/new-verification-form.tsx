"use client";

import {useCallback, useEffect, useState} from "react";  
import {PuffLoader } from "react-spinners";
import { CardWrapper } from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

import { NewVerification } from './../../actions/new-verification';





export const NewVerificationForm = () => {
  const [error, setError] =  useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }


    NewVerification(token).then((data) => {
        setSuccess(data.success);
        setError(data.error)
    
    }).catch(() => {
      setError("Something went wrong!");
    })
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();

  }, [onSubmit]);

  return (
    <div>
      <CardWrapper
        headerLabel="Confirming your verification"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
      >
        <div className="flex items-center w-full justify-center">
          {!success && !error && (<PuffLoader />)}
          
          <FormSuccess message={success} />
          {!success && (<FormError message={error} />)}

        </div>
      </CardWrapper>
    </div>
  )
}