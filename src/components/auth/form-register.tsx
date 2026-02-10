"use client";

import * as z from 'zod'; // schema validation

import { useForm } from 'react-hook-form'; // form state management
import {zodResolver} from '@hookform/resolvers/zod'; // zod resolver for react-hook-form
import { CardWrapper } from './card-wrapper'; // card wrapper component
import { useState, useTransition } from 'react'; // transition hook
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';// form components
import { Button } from '../ui/button'; // button component
import { RegisterSchema } from '../../schemas/index'; // login schema
import {Input} from '../ui/input'; // input component
import { FormError } from '../form-error'; // form error component
import { FormSuccess } from '../form-success'; // form success component
import { register } from '../../actions/register';



export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState< string| undefined>("");
  const [success, setSuccess] = useState< string | undefined>("");
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name:"",
    },
  });
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
    });
  };
    return (
      <CardWrapper
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'>
            <div className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Juan Dela Cruz"
                     
                      />
                     
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className='w-full
            bg-violet-500 hover:bg-violet-600/95 text-white'
            >
              Create an account
            </Button>
          </form>
        </Form>
      </CardWrapper>
    )
  }
