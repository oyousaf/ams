"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^(?:0|\+44)(?:\d\s?){9,10}$/, "Invalid UK phone number"),
  message: z.string().min(1, "Message is required"),
});

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const EnquiryForm = () => {
  const [status, setStatus] = useState({ type: "", message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!PUBLIC_KEY) return;

    emailjs.init({
      publicKey: PUBLIC_KEY,
      blockHeadless: true,
      limitRate: {
        id: "enquiry-form",
        throttle: 10000,
      },
    });
  }, []);

  const onSubmit = async (formData) => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus({
        type: "error",
        message: "Email service configuration missing.",
      });
      return;
    }

    setStatus({ type: "", message: "" });

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData);

      setStatus({
        type: "success",
        message: "Message sent successfully!",
      });

      reset();
    } catch (error) {
      console.error("EmailJS Error:", error);

      setStatus({
        type: "error",
        message: "Failed to send. Please try again.",
      });
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/35 transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300/60";
  const labelClass = "mb-1.5 block text-sm font-medium text-white/70";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-black/20 p-6 shadow-lg backdrop-blur-sm sm:p-8"
      autoComplete="off"
      aria-describedby="form-status"
    >
      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Your full name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          className={fieldClass}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-300" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={fieldClass}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-300" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone
        </label>
        <input
          id="phone"
          {...register("phone")}
          type="tel"
          placeholder="07xxx xxxxxx"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          className={fieldClass}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-300" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Tell us what you're looking for..."
          aria-invalid={!!errors.message}
          className={`h-32 resize-none ${fieldClass}`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-300" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {status.message && (
        <p
          id="form-status"
          aria-live="polite"
          className={`text-sm mt-2 ${
            status.type === "success" ? "text-green-300" : "text-red-300"
          }`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-600 to-rose-500 py-3.5 font-semibold text-white shadow-lg shadow-black/30 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
          isSubmitting
            ? "cursor-not-allowed opacity-70"
            : "hover:shadow-[0_0_25px_rgba(244,63,94,0.55)]"
        }`}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
