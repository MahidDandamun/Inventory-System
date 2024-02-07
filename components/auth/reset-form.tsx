"use client";

import * as z from 'zod'; // schema validation

import { useForm } from 'react-hook-form'; // form state management
import { zodResolver } from '@hookform/resolvers/zod'; // zod resolver for react-hook-form
 
import { CardWrapper } from './card-wrapper'; // card wrapper component
import { useState, useTransition } from 'react'; // transition hook
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';// form components
import { Button } from '../ui/button'; // button component
 
import {Input} from '../ui/input'; // input component
import { FormError } from '../form-error'; // form error component
import { FormSuccess } from '../form-success'; // form success component
import { reset } from '../../actions/reset';


import { ResetSchema } from '../../schemas/index';


export const ResetForm = () => {
 
 
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState< string| undefined>("");
  const [success, setSuccess] = useState< string | undefined>("");
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
  
    },
  });
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    
    console.log(values);
    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
    });
  };
    return (
      <CardWrapper
        headerLabel="Forgot your password?"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
 
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="JuanDela@example.com"
                        type="email"
                      />
                     
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               
            </div>
            <FormError message={error } />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className='w-full
            bg-violet-500 text-white'
            >
              Send reset email
            </Button>
          </form>
        </Form>
      </CardWrapper>
    )
  }
