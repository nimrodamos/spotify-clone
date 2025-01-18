import React from 'react';
import type { User } from '@/Context/UserContext'; // Adjust import path as needed

// Types for the component props
interface ProfileSectionProps {
  user: User;
  profileWidth: string;
}

// Helper function for default profile image (optional)
const DEFAULT_PROFILE_IMAGE = "/profilePic.jpeg";

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user, profileWidth }) => {
  const { displayName, profilePicture } = user;

  return (
    <div className="relative bg-gradient-to-b from-[#B7DE72] to-black h-[572px] w-full">
      <div 
        className="flex pt-[85px] space-x-6 p-6 w-full" 
        style={{ maxWidth: profileWidth }}
      >
        <img
          src={profilePicture || DEFAULT_PROFILE_IMAGE}
          alt={`${displayName}'s profile`}
          className="w-[235px] h-[235px] object-cover rounded-full shadow-lg"
        />
        <div>
          <p className="text-lg">Profile</p>
          <h1 className="text-[6rem] font-bold">{displayName}</h1>
          <p className="text-lg">8 Followers • 46 Following</p>
        </div>
      </div>
    </div>
  );
};

// Default export alternative if preferred
export default ProfileSection;