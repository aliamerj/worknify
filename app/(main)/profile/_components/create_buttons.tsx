"use client";
import { Button } from "@nextui-org/react";
import { useProfileData } from "./profile_context";
import Link from "next/link";

export const CreateButtons = () => {
  const { isLoading, triggerSubmit } = useProfileData();
  return (
    <div className="fixed inset-x-0 bottom-0 mb-4 flex justify-center">
      <div className="mx-auto flex gap-4 rounded-md bg-content4 px-5 py-4">
        {/* Button 1 */}
        <Button
          isLoading={isLoading}
          variant="shadow"
          color="primary"
          size="lg"
          onClick={triggerSubmit}
        >
          Save
        </Button>

        {/* Button 2 */}
        <Button as={Link} href="/" variant="ghost" color="secondary" size="lg">
          Later
        </Button>
      </div>
    </div>
  );
};