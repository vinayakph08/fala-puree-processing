import React from "react";
import ProfileHeader from "../header";
import { UserProfileCard } from "../profile-card";
import FarmeInfo from "../farm-info";

function ProfileClientComponent() {
  return (
    <div className='space-y-6'>
      <ProfileHeader />
      <UserProfileCard />
      <FarmeInfo />
    </div>
  );
}

export default ProfileClientComponent;
