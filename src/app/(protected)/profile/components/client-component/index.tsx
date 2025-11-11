import React from "react";
import ProfileHeader from "../header";
import { FarmerProfileCard } from "../profile-card";
import FarmeInfo from "../farm-info";

function ProfileClientComponent() {
  return (
    <div className='space-y-6'>
      <ProfileHeader />
      <FarmerProfileCard />
      <FarmeInfo />
    </div>
  );
}

export default ProfileClientComponent;
