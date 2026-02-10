"use client";

import * as z from 'zod'; // schema validation

import { useForm } from 'react-hook-form'; // form state management
import {  useState, useTransition } from 'react'; // transition hook
import { zodResolver } from '@hookform/resolvers/zod'; // zod resolver for react-hook-form
 
import { CardWrapper } from './card-wrapper'; // card wrapper component

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';// form components
import { Button } from '../ui/button'; // button component
import { Input } from '../ui/input'; // input component



import { FormError } from '../form-error'; // form error component
import { FormSuccess } from '../form-success'; // form success component
import { newPassword } from '../../actions/new-password';


import { NewPasswordSchema } from '../../schemas';
import { useSearchParams } from 'next/navigation';




export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState< string| undefined>("");
  const [success, setSuccess] = useState< string | undefined>("");
  const [isPending, startTransition] = useTransition();


  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password:"",
  
    },
  });

  
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    
 
    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
    });
  };
    return (
      <CardWrapper
        headerLabel="Enter a new password"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
 
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                    
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="*******"
                        type="password"
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
              Reset password
            </Button>
          </form>
        </Form>
      </CardWrapper>
    )
  }
