"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "../ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";



interface CardWrapperProps { 
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial    
}: CardWrapperProps) => {
  return (
    <Card className="flex flex-col justify-center sm:rounded-md sm:h-4/6  sm:w-[500px]  rounded-none   w-full h-full   shadow-md   ">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>

      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel } href={backButtonHref}/>
      </CardFooter>
    </Card>
  )
}