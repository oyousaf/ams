"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "emailjs-com";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^(?:0|\+44)(?:\d\s?){9,10}$/, "Invalid UK phone number"),
  message: z.string().min(1, "Message is required"),
});

const EnquiryForm = () => {
  const [status, setStatus] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      );
      setStatus("Message sent successfully!");
    } catch (error) {
      setStatus("Failed to send message. Please try again.");
      console.error("EmailJS Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full h-full max-w-md space-y-4 bg-rose-800 p-6 rounded-lg shadow-md"
      name="enquiry-form"
      id="enquiry-form"
      autoComplete="off"
    >
      <label htmlFor="name" className="sr-only">
        Name
      </label>
      <input
        {...register("name")}
        id="name"
        name="name"
        placeholder="Name"
        className="w-full mt-1 p-3 text-black border border-gray-300 rounded-md focus:ring-rose-600 focus:border-rose-600"
        autoComplete="name"
      />
      {errors.name && (
        <p className="text-red-200 text-sm mt-1">{errors.name.message}</p>
      )}

      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        {...register("email")}
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        className="w-full mt-1 p-3 text-black border border-gray-300 rounded-md focus:ring-rose-600 focus:border-rose-600"
        autoComplete="email"
      />
      {errors.email && (
        <p className="text-red-200 text-sm mt-1">{errors.email.message}</p>
      )}

      <label htmlFor="phone" className="sr-only">
        Contact number
      </label>
      <input
        {...register("phone")}
        id="phone"
        name="phone"
        type="tel"
        placeholder="Contact number"
        className="w-full mt-1 p-3 text-black border border-gray-300 rounded-md focus:ring-rose-600 focus:border-rose-600"
        autoComplete="tel"
      />
      {errors.phone && (
        <p className="text-red-200 text-sm mt-1">{errors.phone.message}</p>
      )}

      <label htmlFor="message" className="sr-only">
        Message
      </label>
      <textarea
        {...register("message")}
        id="message"
        name="message"
        placeholder="Message..."
        className="w-full h-32 mt-1 p-3 text-black border border-gray-300 rounded-md focus:ring-rose-600 focus:border-rose-600"
        autoComplete="off"
      />
      {errors.message && (
        <p className="text-red-200 text-sm mt-1">{errors.message.message}</p>
      )}

      {status && <p className="text-green-200 text-sm">{status}</p>}

      <button
        type="submit"
        className={`w-full py-3 mt-4 bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-opacity-50 ${
          isSubmitting && "opacity-70 cursor-not-allowed"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Submit Enquiry"}
      </button>
    </form>
  );
};

export default EnquiryForm;
