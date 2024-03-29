import { useState, useCallback } from "react";
import { DevInfo } from "../../[projectId]/page";

export const useContributors = (creator: DevInfo, devs: DevInfo[]) => {
  const [contributors, setContributors] = useState<DevInfo[]>([
    creator,
    ...devs,
  ]);

  const removeContributor = useCallback((id: string) => {
    setContributors((currentContributors) =>
      currentContributors.filter((contributor) => contributor.id !== id),
    );
  }, []);

  return { contributors, removeContributor };
};
