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
  const [status, setStatus] = useState({ type: "", message: "" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // 👈 added reset from useForm
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
      setStatus({ type: "success", message: "Message sent successfully!" });
      reset(); // 👈 clears the form after success
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to send. Please try again.",
      });
      console.error("EmailJS Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md p-6 space-y-4 rounded-xl neon-tile bg-linear-to-br from-rose-900 via-rose-800 to-rose-950 shadow-lg"
      autoComplete="off"
      aria-describedby="form-status"
    >
      {/* Name */}
      <div>
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          className="w-full p-3 rounded-md border border-rose-900/40 bg-white/95 text-black focus:ring-2 focus:ring-rose-600 focus:border-rose-600"
        />
        {errors.name && (
          <p className="text-red-200 text-sm mt-1" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          type="email"
          placeholder="Email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className="w-full p-3 rounded-md border border-rose-900/40 bg-white/95 text-black focus:ring-2 focus:ring-rose-600 focus:border-rose-600"
        />
        {errors.email && (
          <p className="text-red-200 text-sm mt-1" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="sr-only">
          Phone
        </label>
        <input
          id="phone"
          {...register("phone")}
          type="tel"
          placeholder="Phone"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          className="w-full p-3 rounded-md border border-rose-900/40 bg-white/95 text-black focus:ring-2 focus:ring-rose-600 focus:border-rose-600"
        />
        {errors.phone && (
          <p className="text-red-200 text-sm mt-1" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Message..."
          aria-invalid={!!errors.message}
          className="w-full h-32 p-3 rounded-md border border-rose-900/40 bg-white/95 text-black focus:ring-2 focus:ring-rose-600 focus:border-rose-600"
        />
        {errors.message && (
          <p className="text-red-200 text-sm mt-1" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Status Message */}
      {status.message && (
        <p
          id="form-status"
          aria-live="polite"
          className={`text-sm mt-2 ${
            status.type === "success" ? "text-green-200" : "text-red-200"
          }`}
        >
          {status.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-2 py-3 bg-rose-600 text-white rounded-md font-semibold hover:glow-pulse hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 ${
          isSubmitting && "opacity-70 cursor-not-allowed"
        }`}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Sending...
          </>
        ) : (
          "Submit Enquiry"
        )}
      </button>
    </form>
  );
};

export default EnquiryForm;
