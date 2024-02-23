"use client";
import { Button } from "@nextui-org/react";

import Link from "next/link";
import { useProfileData } from "../../context/profile_context";

/**
 * Renders a set of buttons.
 * returns JSX element representing a set of buttons.
 */
export const CreateButtons = () => {
  const { isLoading, triggerSubmit } = useProfileData();

  return (
    <div className="fixed inset-x-0 bottom-0 mb-4 flex justify-center">
      <div className="mx-auto flex gap-4 rounded-md bg-content4 px-5 py-4">
        {/* Save Button */}
        <Button
          isLoading={isLoading}
          variant="shadow"
          color="primary"
          size="lg"
          onClick={triggerSubmit}
        >
          Save
        </Button>

        {/* Later Button */}
        <Button as={Link} href="/" variant="ghost" color="secondary" size="lg">
          Later
        </Button>
      </div>
    </div>
  );
};
