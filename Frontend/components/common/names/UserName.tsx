'use client'
import { useUserStore } from '@/state/store'
import React from 'react'

const UserName = () => {
  const { name } = useUserStore()

  // capitalize every word, even if the user typed lower-case
  const formatName = (raw: string) => {
    if (!raw) return 'Guest'
    return raw
      .trim()
      .split(/\s+/)                 // split by one or more spaces
      .map(
        (part) =>
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join(' ')
  }

  return <span>{formatName(name)}</span>
}

export default UserName








// 'use client'
// import { useUserStore } from '@/state/store'
// import { useUsername } from '@/state/usernameStore'
// import React from 'react'



// const UserName = () => {
//     //const user = useUsername((state) => (state.name))
//       const {name, setName} = useUserStore()


//     const getName = (name: string) => {
//         if(!name) return "Guest"
//       return   name
//     }
//   return (
//     <span>{getName(name)}</span>
//   )
// }

// export default UserName