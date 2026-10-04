"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";

const formSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^(?:0|\+44)(?:\d\s?){9,10}$/,
      "Enter a valid UK phone number, e.g. 07123 456789",
    ),
  message: z.string().trim().min(1, "Tell us what you're looking for"),
});

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const fields = [
  {
    id: "name",
    label: "Name",
    placeholder: "Your full name",
    autoComplete: "name",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "07xxx xxxxxx",
    autoComplete: "tel",
  },
];

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
        message: "Message sent - we'll be in touch shortly.",
      });

      reset();
    } catch (error) {
      console.error("EmailJS Error:", error);

      setStatus({
        type: "error",
        message: "Failed to send. Please try again, or give us a call.",
      });
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/55 transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300/60 aria-invalid:border-red-300";
  const labelClass = "mb-1.5 block text-sm font-medium text-white/85";

  // Wires a field to its error text so screen readers read the message with
  // the field. react-hook-form already focuses the first invalid field.
  const a11yProps = (id) => ({
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
    required: true,
  });

  const errorText = (id) =>
    errors[id] && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-300">
        {errors[id].message}
      </p>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="enquiry-heading"
      className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-black/20 p-6 shadow-lg backdrop-blur-sm sm:p-8"
    >
      <div>
        <h3 id="enquiry-heading" className="text-xl font-semibold text-white">
          Send us an enquiry
        </h3>
        <p className="mt-1 text-sm text-white/75">All fields are required.</p>
      </div>

      {fields.map(({ id, label, ...inputProps }) => (
        <div key={id}>
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
          <input
            id={id}
            {...register(id)}
            {...inputProps}
            {...a11yProps(id)}
            className={fieldClass}
          />
          {errorText(id)}
        </div>
      ))}

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Tell us what you're looking for..."
          {...a11yProps("message")}
          className={`h-32 resize-none ${fieldClass}`}
        />
        {errorText("message")}
      </div>

      {/* Always rendered so screen readers reliably announce updates */}
      <p
        id="form-status"
        role="status"
        className={`text-sm empty:hidden ${
          status.type === "success" ? "text-green-300" : "text-red-300"
        }`}
      >
        {status.message}
      </p>

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
            <span
              aria-hidden="true"
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            />
            Sending...
          </>
        ) : (
          "Submit Enquiry"
        )}
      </button>

      <p className="text-xs leading-relaxed text-white/75">
        We only use your details to reply to this enquiry. See our{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-white"
        >
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
};

export default EnquiryForm;
