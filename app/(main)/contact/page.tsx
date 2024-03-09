import React from "react";
import ContactUs from "./contactUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Worknify: Reach Out and Connect",
  description:
    "Have questions or want to get in touch with the Worknify team? Our contact page makes it easy. Fill out the form, and we promise to get back to you promptly. Your feedback and inquiries matter to us.",
};
export default function ContactPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold">Let's Get in Touch!</h2>
        <p className="text-md mt-2">
          We're excited to hear from you. Fill out the form below, and we'll get
          back to you as soon as possible.
        </p>
      </div>
      <ContactUs />
    </div>
  );
}
