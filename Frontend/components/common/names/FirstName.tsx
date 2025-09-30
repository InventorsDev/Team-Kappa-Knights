'use client'
import React from 'react'
import { useUserProfileStore } from '@/state/user'

const UserName = () => {
  const { profile } = useUserProfileStore()

  // grab first token only, then capitalize it
  const formatFirstName = (raw?: string) => {
    if (!raw) return 'Guest'
    const first = raw.trim().split(/\s+/)[0]
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
  }

  return <span>{formatFirstName(profile?.full_name)}</span>
}

export default UserName















// 'use client';
// import { auth } from '@/lib/firebase';
// import { useUserStore } from '@/state/store';
// import { useUsername } from '@/state/usernameStore';
// import React, { useEffect, useState } from 'react';

// const FirstName = () => {
//   const [loading, setLoading] = useState(true);
//   //const setName = useUsername.getState().setName;
//   //const user = useUsername((state) => state.name);
//   const {name, setName} = useUserStore()

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = await auth.currentUser?.getIdToken();
//         if (!token) {
//           setLoading(false);
//           return;
//         }

//         const res = await fetch('http://34.228.198.154/api/user/me', {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

//         const data = await res.json();

//         setName(data.full_name || '');
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [setName]);

//   const getFirstName = (full: string) => {
//     if (!full) return 'Guest';
//     return full.trim().split(' ')[0];
//   };

//   return <span>{loading ? 'Guest' : getFirstName(name)}</span>;
// };

// export default FirstName;






// 'use client'
// import { auth } from '@/lib/firebase'
// import { useUsername } from '@/state/usernameStore'
// import React, { useEffect, useState } from 'react'



// const FirstName = () => {
//   const [fullname, setFullName] = useState('')
//   const setName = useUsername.getState().setName






//   useEffect(() => {
//     const handleFetch = async () => {
//       const token = await auth.currentUser?.getIdToken();
//       await fetch("http://34.228.198.154/api/user/me", {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           full_name: fullname
//         }),
//       })
      
//   setName(fullname)
//     }
//     handleFetch()
//   }, [])

  
//   const user = useUsername((state) => (state.name))

//   const getFirstName = (firstName: string) => {
//     if (!firstName) return "Guest"
//     return firstName.trim().split(" ")[0]
//   }

//   return (
//     <span>{getFirstName(user)}</span>
//   )
// }

// export default FirstName