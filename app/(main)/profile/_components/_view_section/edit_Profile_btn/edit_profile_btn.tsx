"use client";
import { AppRouter } from "@/utils/router/app_router";
import { Button} from "@nextui-org/react";
import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";

export const EditProfileBtn = () => {

  return (
    <div className="fixed top-20 right-5 z-40">
        <Button size="lg" color="danger" variant="shadow" as={Link} href={AppRouter.editProfile} startContent={<FaPencilAlt />
}>Edit Profile</Button>
    </div>
  );
};


