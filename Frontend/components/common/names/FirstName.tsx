'use client';
import { auth } from '@/lib/firebase';
import { useUsername } from '@/state/usernameStore';
import React, { useEffect, useState } from 'react';

const FirstName = () => {
  const [loading, setLoading] = useState(true);
  const setName = useUsername.getState().setName;
  const user = useUsername((state) => state.name);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch('http://34.228.198.154/api/user/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

        const data = await res.json();

        setName(data.full_name || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setName]);

  const getFirstName = (full: string) => {
    if (!full) return 'Guest';
    return full.trim().split(' ')[0];
  };

  return <span>{loading ? 'Guest' : getFirstName(user)}</span>;
};

export default FirstName;






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