'use client'
// app/profile/u/[publicKey]/page.tsx
import { useParams } from "next/navigation";

const ProfilePage = () => {
  const { publicKey } = useParams(); // This will give you the publicKey from the URL

  // Optionally, you can add logic here to fetch data related to the publicKey, for example:
  // useEffect(() => {
  //   if (publicKey) {
  //     // Fetch user data for the publicKey
  //   }
  // }, [publicKey]);

  return (
    <div>
      <h1>Profile for Public Key: {publicKey}</h1>
      {/* Render the user's profile data here */}
    </div>
  );
};

export default ProfilePage;
