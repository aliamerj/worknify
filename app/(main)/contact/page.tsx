"use client";
import React, { useRef, useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEmail, MdPerson, MdMessage } from "react-icons/md";

export default function ContactUs() {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setLoading(true);

    emailjs
      .sendForm(
        "service_o7dmsmk",
        "template_44i8ptx",
        form.current,
        "M3PNytkF0RPjKCPL5",
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          form.current?.reset();
        },
        (_) => {
          toast.error("Failed to send message. Please try again!");
        },
      );
    setLoading(false);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold">Let's Get in Touch!</h2>
        <p className="text-md mt-2">
          We're excited to hear from you. Fill out the form below, and we'll get
          back to you as soon as possible.
        </p>
      </div>
      <div className="w-full max-w-lg">
        <ToastContainer />
        <form
          ref={form}
          onSubmit={sendEmail}
          className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow"
        >
          <div className="relative">
            <MdPerson
              className="absolute left-0 top-0 ml-2 mt-3 text-gray-400"
              size="24"
            />
            <input
              type="text"
              name="user_name"
              placeholder="Name"
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative">
            <MdEmail
              className="absolute left-0 top-0 ml-2 mt-3 text-gray-400"
              size="24"
            />
            <input
              type="email"
              name="user_email"
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative">
            <MdMessage
              className="absolute left-0 top-0 ml-2 mt-3 text-gray-400"
              size="24"
            />
            <textarea
              name="message"
              placeholder="Message"
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className={`mt-4 rounded-md bg-primary px-4 py-2 font-semibold text-white shadow ${loading ? "bg-primary-300" : "hover:bg-primary-700"}`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
