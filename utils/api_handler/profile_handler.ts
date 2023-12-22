import { databaseDrizzle } from "@/db/database";
import {
  EducationSelection,
  ExperienceSelection,
  ProfileSelection,
  SectionSelection,
} from "@/db/schemes/profileSchema";

export type AllProfileData = {
  profile: ProfileSelection;
  experiences: ExperienceSelection[];
  educations: EducationSelection[];
  sections: SectionSelection[];
};

export default async function getProfileData(
  userId: string,
): Promise<AllProfileData | null> {
  const profile = await databaseDrizzle.query.profile.findFirst({
    where: (p, o) => o.eq(p.userId, userId),
  });
  if (!profile) return null;

  const experiences = await databaseDrizzle.query.experience.findMany({
    where: (e, o) => o.eq(e.profileId, profile.id),
  });
  const educations = await databaseDrizzle.query.education.findMany({
    where: (e, o) => o.eq(e.profileId, profile.id),
  });
  const sections = await databaseDrizzle.query.section.findMany({
    where: (s, o) => o.eq(s.profileId, profile.id),
  });
  return { profile, experiences, educations, sections };
}
