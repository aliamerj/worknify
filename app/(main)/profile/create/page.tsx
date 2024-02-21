import React from 'react';
import { ProfileDisplay } from "../_components/_create_section/_displayer/profile_display";
import { ProfileForm } from "../_components/_create_section/_form/profile_form";
import { CreateButtons } from "../_components/_create_section/create_buttons/create_buttons";
import CreateProfileGate from "./create_profile_gate";

/**
 * Renders a form to create a user profile.
 * @returns The rendered JSX elements for the CreateProfile component.
 */
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
