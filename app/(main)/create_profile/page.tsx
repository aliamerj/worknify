import React from "react";
import { ProfileDisplay } from "./profile_display";
import { ProfileForm } from "./profile_form";

export default function CreateProfile() {
  return (
    <main className="mt-28 flex flex-col justify-evenly md:flex-row  ">
      <div className="w-full px-4 py-4 md:w-4/12 md:px-5 ">
        <h2 className="mb-4 text-center text-2xl font-bold text-foreground">
          Create your profile
        </h2>
        <ProfileForm />
      </div>
      <div className="mt-4 w-full px-4 py-4 md:mt-0 md:w-7/12 md:bg-red-200 md:px-5">
        <ProfileDisplay />
      </div>
    </main>
  );
}
