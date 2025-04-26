// // splitNpay/app/app/components/NavBar.tsx
// "use client";

// import { useEffect, useState } from "react";
// // import { CivicLoginButton } from "./CivicLoginButton"; // Ensure this path is correct
// import { getUser } from "@civic/auth/nextjs"; // Adjust the import based on your setup
// import { UserButton } from "@civic/auth/react";

// const LoginButton = () => {
//   const [user, setUser] = useState<any>(null); 

//   useEffect(() => {
//     const fetchUser = async () => {
//       // Fetch user data only if not already provided
//       if (!user) {
//         const userData = await getUser(); // This may still need to be adjusted
//         setUser(userData);
//         console.log("userData", userData);
//       }
//     };

//     fetchUser();
//   }, [user]);

//   return (
  
     
//       <div className="flex items-center gap-4">
//         {user ? (
//           <span>Welcome, {user.name}</span> // Display user name or other info
//         ) : (
//           <UserButton />
//         )}
//       </div>

//   );
// };

// export default LoginButton;
