import { UpdateButtons } from "../_components/update_buttons";
import { ProfileDisplay } from "../_components/profile_display";
import { ProfileForm } from "../_components/profile_form";
import EditProfileGate from "./edit_profile_gate";

export default function Page() {
  return (
    <EditProfileGate>
      <section className="mt-5 flex flex-col gap-2 lg:flex-row lg:justify-evenly lg:py-5">
        <div className="w-full lg:w-5/12">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground lg:pt-9">
            Edit your profile
          </h2>
          <ProfileForm />
        </div>
        <div className="mt-4 w-full px-4 py-4 lg:mt-0 lg:w-6/12">
          <ProfileDisplay />
        </div>
        <UpdateButtons />
      </section>
    </EditProfileGate>
  );
}
