"use client";

import { useState } from "react";
import { useTransition } from "react";
import emailjs from "emailjs-com";

const EnquiryForm = () => {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const validators = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^(?:0|\+44)(?:\d\s?){9,10}$/.test(value),
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (validators[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validators[name](value) ? "" : `Please enter a valid ${name}.`,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some(Boolean)) return;

    startTransition(() => {
      emailjs
        .send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          formData,
          process.env.NEXT_PUBLIC_EMAILJS_USER_ID
        )
        .then(
          () => {
            setStatus("Message sent successfully!");
            setFormData({ name: "", email: "", phone: "", message: "" });
          },
          (error) => {
            setStatus("Failed to send message. Please try again.");
            console.error("EmailJS Error:", error);
          }
        );
    });
  };

  const renderInput = (id, type, placeholder, autoComplete = "on") => (
    <>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        className="w-full mt-1 p-3 text-black border border-gray-300 rounded-md focus:ring-rose-600 focus:border-rose-600"
        placeholder={placeholder}
        required
        autoComplete={autoComplete}
      />
      {errors[id] && <p className="text-red-200 text-sm mt-1">{errors[id]}</p>}
    </>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-md space-y-4 bg-rose-800 p-6 rounded-lg shadow-md"
    >
      {renderInput("name", "text", "Name", "name")}
      {renderInput("email", "email", "Email", "email")}
      {renderInput("phone", "tel", "Contact number", "tel")}

      <label htmlFor="message" className="sr-only">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows="4"
        className="w-full mt-1 p-3 text-black border border-gray-300 rounded-md focus:ring-rose-600 focus:border-rose-600"
        placeholder="Message..."
        required
      />

      {status && <p className="text-green-200 text-sm">{status}</p>}

      <button
        type="submit"
        className={`w-full py-3 mt-4 bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-opacity-50 ${
          isPending && "opacity-70 cursor-not-allowed"
        }`}
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Submit Enquiry"}
      </button>
    </form>
  );
};

export default EnquiryForm;
