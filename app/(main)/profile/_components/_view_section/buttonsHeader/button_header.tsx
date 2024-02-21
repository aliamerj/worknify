"use client";
import { StarIcon } from "@/global-components/icon/star_icon";
import { ApiRouter } from "@/utils/router/app_router";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { EmailModal } from "../email_modal/email_modal";
import { SideErrorMessage } from "@/global-components/side_error_message/side_error_message";

/**
 * Renders a header with two buttons: a "Contact" button and a "Star" button.
 * Handles the logic for starring/unstarring a profile and displaying error messages.
 *
 * @param isStared - Indicates whether the profile is starred or not.
 * @param profileId - The ID of the profile.
 * @param emailUser - The email address of the user.
 * @param fullName - The full name of the user.
 * @returns The rendered header with two buttons.
 */
export const ButtonHeader = ({
  isStared,
  profileId,
  emailUser,
  fullName,
}: {
  isStared: boolean;
  profileId: number;
  emailUser: string;
  fullName: string;
}) => {
  const [error, setError] = useState<null>(null);
  const [loading, setLoading] = useState(false);
  const [star, setStar] = useState(isStared);

  /**
   * Handles the logic for starring/unstarring a profile.
   */
  const handleStar = async () => {
    setLoading(true);
    try {
      if (star) {
        await axios.delete(ApiRouter.profileStar + profileId);
      } else {
        await axios.post(ApiRouter.profileStar + profileId);
      }
      setLoading(false);
      setStar((current) => !current);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="relative flex items-center gap-4">
      <Button
        onPress={onOpen}
        radius="full"
        size="lg"
        className="bg-gradient-to-tr from-primary to-secondary text-white shadow-lg"
      >
        Contact
      </Button>
      <EmailModal
        isOpen={isOpen}
        onClose={onClose}
        emailUser={emailUser}
        fullName={fullName}
      />
      <Button
        isLoading={loading}
        size="md"
        color="success"
        variant="bordered"
        startContent={<StarIcon isFilled={star} />}
        onClick={handleStar}
      >
        Star
      </Button>
      {error && <SideErrorMessage errorMessage={error} isError={error} />}
    </div>
  );
};
