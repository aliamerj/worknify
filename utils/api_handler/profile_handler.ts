import { databaseDrizzle } from "@/db/database";
import {
  EducationSelection,
  ExperienceSelection,
  ProfileSelection,
  SectionSelection,
} from "@/db/schemes/profileSchema";

type AllProfileData = {
  profile: ProfileSelection;
  experience: ExperienceSelection;
  education: EducationSelection;
  section: SectionSelection;
};

export default async function getProfile(userId: string) {
  const profileData = await databaseDrizzle.query.profile.findFirst({
    where: (p, o) => o.eq(p.userId, userId),
  });
  if (!profileData) return null;

  const experienceData = await databaseDrizzle.query.experience.findMany({
    where: (e, o) => o.eq(e.profileId, profileData.id),
  });
  const educationData = await databaseDrizzle.query.education.findFirst({
    where: (e, o) => o.eq(e.profileId, profileData.id),
  });
  const sectionData = await databaseDrizzle.query.section.findMany({
    where: (s, o) => o.eq(s.profileId, profileData.id),
  });
}
