// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { toast } from "sonner";
// interface Tags {
//   id: string;
//   name: string;
//   bg: string;
//   text: string;
//   border: string;
//   icon: string;
//   custom?: boolean;
// }

// export const fetchTags = async (setFirestoreTags: (Tags[]) => void) => {
//       try {
//         const res = await getDocs(collection(db, "tags"));
//         const tagData: Tags[] = res.docs.map((doc) => ({
//           id: doc.id,
//           name: doc.data().name,
//           bg: doc.data().bg,
//           text: doc.data().text,
//           border: doc.data().border,
//           icon: doc.data().icon,
//           custom: false,
//         }));
//         setFirestoreTags(tagData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching tags from Firestore", error);
//       }
