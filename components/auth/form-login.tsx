"use client";

import * as z from 'zod'; // schema validation

import { useForm } from 'react-hook-form'; // form state management
import { zodResolver } from '@hookform/resolvers/zod'; // zod resolver for react-hook-form
import { useSearchParams } from 'next/navigation';
import { CardWrapper } from './card-wrapper'; // card wrapper component
import { useState, useTransition } from 'react'; // transition hook
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';// form components
import { Button } from '../ui/button'; // button component
import { LoginSchema } from '../../schemas/index'; // login schema
import {Input} from '../ui/input'; // input component
import { FormError } from '../form-error'; // form error component
import { FormSuccess } from '../form-success'; // form success component
import { login } from '../../actions/login';
import Link from "next/link";


export const LoginForm = () => {
 
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState< string| undefined>("");
  const [success, setSuccess] = useState< string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data) => {

        if (data?.error) {
          form.reset();
          setError(data.error);
        }
        
        if (data?.success) {
          form.reset();
          setError(data.success);
        }
        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      }).catch(() =>setError("Something went wrong!"));
    });
  };

  return (
    <>
        <CardWrapper
          headerLabel="Welcome back!"
          backButtonLabel="Don't have an account?"
          backButtonHref="/auth/register"
          showSocial
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'>
              <div className="space-y-4">
                {showTwoFactor && (
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Two Factor Code</FormLabel>
                        <FormControl>                     
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="123456"
                          />
                        
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />                
                )}
                {!showTwoFactor && (
                  <>
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
                          <Button size="sm" variant="link" className="px-0 py-1 font-normal text-violet-600 " asChild>
                            <Link href="/auth/reset">Forgot password?</Link>
                          </Button>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <FormError message={error|| urlError} />
              <FormSuccess message={success} />
              <Button
                disabled={isPending}
                type="submit"
                className='w-full
               text-white
               bg-violet-500
               transition:all
               ease-in-out
                duration-100
                hover:bg-violet-600/95'
              >
                {showTwoFactor? "Confirm" : "Login"}
              </Button>
            </form>
          </Form>

  
        </CardWrapper>


      </>
    )
  }
