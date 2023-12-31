"use client";
import { StarIcon } from "@/global-components/icon/star_icon";
import { ApiRouter } from "@/utils/router/app_router";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { GoAlertFill } from "react-icons/go";

export const ButtonHeader = ({
  isStared,
  profileId,
}: {
  isStared: boolean;
  profileId: number;
}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [star, setStar] = useState(isStared);
  const handleStar = async () => {
    setLoading(true);
    try {
      if (isStared) await axios.delete(ApiRouter.star + profileId);
      else await axios.post(ApiRouter.star + profileId);
      setLoading(false);
      setStar((current) => !current);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  };
  return (
    <div className="relative flex items-center gap-4">
      <Button
        radius="full"
        size="lg"
        className="bg-gradient-to-tr from-primary to-secondary text-white shadow-lg"
      >
        Contact
      </Button>
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
      {error && (
        <div
          className="fixed bottom-0 left-0 mb-5 ml-5 flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm text-white shadow-lg"
          style={{ animation: "floatError 1.5s ease-in-out" }}
        >
          <GoAlertFill className="text-lg" />
          {error}
        </div>
      )}{" "}
    </div>
  );
};
