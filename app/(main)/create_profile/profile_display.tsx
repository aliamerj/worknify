"use client";
import { useProfileData } from "./profile_context";

export const ProfileDisplay = () => {
  const { profileData } = useProfileData();
  return (
    <div className="bg-blue-200">
      <p>Username: {profileData.username}</p>
      <p>Job Title: {profileData.jobTitle}</p>
      <p>Full Name: {profileData.name}</p>
      <p>phone: {profileData.phone}</p>
      <p>address: {profileData.address}</p>
      <p>Email: {profileData.email}</p>
      <p>gitHub: {profileData.gitHub}</p>
      <p>Linkedin: {profileData.linkedin}</p>
      <p>
        {profileData.sections.map((section, index) => (
          <div key={index}>
            <h1>{section.title}</h1>
            <p>{section.description}</p>
          </div>
        ))}
      </p>
    </div>
  );
};
