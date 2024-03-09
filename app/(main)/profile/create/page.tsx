import React from "react";
import { ProfileDisplay } from "../_components/_create_section/_displayer/profile_display";
import { ProfileForm } from "../_components/_create_section/_form/profile_form";
import { CreateButtons } from "../_components/_create_section/create_buttons/create_buttons";
import CreateProfileGate from "./create_profile_gate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Create Your Professional Profile - Worknify: Visualize Your CV in Real-Time",
  description:
    "Build your professional identity on Worknify with our intuitive profile creation form. Watch your CV come to life as you input your details, providing a real-time preview of your professional persona. Craft a compelling CV on a visually appealing page and kickstart your journey to career success with Worknify.",
};
export default function CreateProfile() {
  return (
    <CreateProfileGate>
      <section className="mt-5 flex flex-col gap-2 lg:flex-row lg:justify-evenly lg:py-5">
        <div className="w-full lg:w-5/12">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground lg:pt-9">
            Create your profile
          </h2>
          <ProfileForm />
        </div>
        <div className="mt-4 w-full px-4 py-4 lg:mt-0 lg:w-6/12">
          <ProfileDisplay />
        </div>
        <CreateButtons />
      </section>
    </CreateProfileGate>
  );
}
