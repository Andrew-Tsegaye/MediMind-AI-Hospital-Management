"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import CustomFormField, { FieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

import "react-phone-number-input/style.css";

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    try {
      const user = await createUser(values);
      if (user && "$id" in user) {
        router.push(`/patients/${user.$id}/register`);
      } else {
        alert(
          "User creation failed. Please check your input or try a different email."
        );
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-light-100">Howdy 👋</h1>
          <p className="text-sm text-dark-600">
            Start booking your appointment below.
          </p>
        </header>

        {/* Full Name */}
        <CustomFormField
          fieldType={FieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Andrew Defar"
          iconSrc="/assets/icons/user.svg"
          iconAlt="User Icon"
        />

        {/* Email */}
        <CustomFormField
          fieldType={FieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="andrew@example.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="Email Icon"
        />

        {/* Phone Number */}
        <CustomFormField
          fieldType={FieldType.PHONE}
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="+251 912 345 678"
        />

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
