"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/favicon.ico";
import AuthButton from "@/components/common/button/Button";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import Loader from "@/components/common/loader/Loader";
import { useRouter } from "next/navigation";
import { getCurrentUserFromFirestore } from "@/lib/auth";
import { getFirebaseErrorMessage } from "@/lib/firebaseErrorHandler";
import { useUserStore } from "@/state/store";
import { useOnboardingStore } from "@/state/useOnboardingData";
import { clearNonAuthStorage } from "@/lib/token";

interface Tags {
  id: string;
  name: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
  custom?: boolean;
  createdBy?: string;
}

interface user {
  name: string;
  id: string;
  email: string;
  verified: boolean;
}

function Interest() {
  const [firestoreTags, setFirestoreTags] = useState<Tags[]>([]);
  const [customTags, setCustomTags] = useState<Tags[]>([]);
  // const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { selectedTags, setSelectedTags } = useUserStore();
  const [isClosed, setIsClosed] = useState(true);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const { setInterests, interests, addInterest } = useOnboardingStore();
  const router = useRouter();
  // const [limit, setLimit] = useState(0);

  useEffect(() => {
    console.log(selectedTags);
    setInterests(selectedTags);
    console.log(interests);
  }, [selectedTags, interests]);

  useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUserFromFirestore();
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getDocs(collection(db, "tags"));
        const tagData: Tags[] = res.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          bg: doc.data().bg,
          text: doc.data().text,
          border: doc.data().border,
          icon: doc.data().icon,
          custom: false,
        }));
        setFirestoreTags(tagData);
        setLoading(false);
      } catch (error) {
        const message = getFirebaseErrorMessage(error);
        toast.error(message);
        console.error("Error fetching tags from Firestore", error);
      }
    };
    fetchTags();
  }, []);

  // Load localStorage tags once
  useEffect(() => {
    const local = localStorage.getItem("newTags");
    const localTags: Tags[] = local ? JSON.parse(local) : [];
    setCustomTags(localTags);
  }, []);


  const handleAdd = async () => {
    if (!name) {
      toast.message("Please add a skill");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to add a skill");
      return;
    }

    try {
      const newTag = {
        name,
        bg: "rgb(173, 216, 230)",
        border: "rgb(30, 144, 255)",
        text: "rgb(0, 51, 102)",
        icon: "Writing",
        createdBy: user.uid, 
      };

   
      const docRef = await addDoc(collection(db, "tags"), newTag);


      setFirestoreTags((prev) => [
        ...prev,
        { id: docRef.id, ...newTag, custom: false },
      ]);

    
      setSelectedTags((prev) => [...prev, newTag.name]);
      addInterest(newTag.name);

      setName("");
      setIsClosed(true);
      toast.success("Skill added!");
    } catch (err) {
      console.error("Error adding tag:", err);
      toast.error(getFirebaseErrorMessage(err));
    }
  };

  const handleDelete = async (id: string, custom?: boolean) => {
    try {
      if (custom) {
        const updated = customTags.filter((tag) => tag.id !== id);
        setCustomTags(updated);
        localStorage.setItem("newTags", JSON.stringify(updated));

        const deletedTag = customTags.find((tag) => tag.id === id);
        if (deletedTag) {
          setSelectedTags((prev) => prev.filter((t) => t !== deletedTag.name));
        }
      } else {
        await deleteDoc(doc(db, "tags", id));
        setFirestoreTags((prev) => prev.filter((tag) => tag.id !== id));

        
        const deletedTag = firestoreTags.find((tag) => tag.id === id);
        if (deletedTag) {
          setSelectedTags((prev) => prev.filter((t) => t !== deletedTag.name));
        }
      }

      // setLimit((n) => n - 1);
    } catch (error) {
      console.log("Error deleting:", error);
    }
  };

  const handleLimit = async () => {
    if (selectedTags.length > 5) {
      toast.message("The skills selected exceed the limit");
      return;
    }
    if (selectedTags.length < 2) {
      toast.message("The skills selected do not meet the limit.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      console.log('Interest handleLimit - checking token:', token ? 'FOUND' : 'NOT FOUND');
      if (!token) {
        toast("no token");
        console.error('No token found in Interest page!');
        return;
      }
      const res = await fetch("http://34.228.198.154/api/user/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests: selectedTags,
        }),
      });

      if (!res.ok) throw new Error(`Server said ${res.status}`);
    } catch (err) {
      console.log(err);
    }

    // Safe clearing that preserves authentication tokens
    clearNonAuthStorage(['newTags']); // Only clear specific non-auth items
    
    // Verify token is still there before navigation
    const tokenAfterClear = localStorage.getItem("token");
    console.log('After safe clearing, token still exists:', tokenAfterClear ? 'YES' : 'NO');
    console.log('Navigating to skill-level, token preserved');
    
    router.push("./goals");
  };

  // Merge both arrays for rendering
  const tags = [...firestoreTags, ...customTags];

  return (
    <div className="p-4 select-none">
      <Image src={logo} className="m-auto" alt="logo" width={40} height={40} />
      <h1 className="text-xl font-[700] text-[24px] md:text-[40px] text-center mt-2">
        What are you interested in learning?
      </h1>
      <p className="text-gray-600 md:text-[24px] max-w-[500px] m-auto text-center mb-4">
        Pick 2–5 topics to help us personalize your learning path
      </p>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader />
        </div>
      ) : (
        <section className="flex flex-wrap max-w-[800px] m-auto py-4 justify-start  sm:justify-center gap-4 md:gap-8">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="px-4 cursor-pointer py-3 rounded-xl text-sm font-medium border group"
              style={{
                backgroundColor: tag.bg,
                color: tag.text,
                borderColor: selectedTags.includes(tag.name)
                  ? tag.border
                  : "transparent",
              }}
              onClick={() => {
                if (!tag.custom) {
                  setSelectedTags((prev) =>
                    prev.includes(tag.name)
                      ? prev.filter((t) => t !== tag.name)
                      : [...prev, tag.name]
                  );
                }
              }}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={`/${tag.icon}.svg`}
                  alt={tag.name}
                  width={20}
                  height={20}
                />
                <p>{tag.name}</p>
                {tag.custom && (
                  <button
                    className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tag.id, true);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          ))}

        </section>
      )}

      <div className="max-w-[600px] py-4 m-auto" onClick={handleLimit}>
        <AuthButton
          text="Next"
          textWhileActionIsTakingPlace="Hold on..."
          action={false}
          isAuth={false}
        />
      </div>

      {/* Modal */}
      {!isClosed && (
        <section className="w-full min-h-screen bg-black/60 flex justify-center items-center absolute top-0 left-0">
          <div className="p-5 py-10 min-w-[300px] rounded-xl bg-white relative w-[30%]">
            <button
              className="absolute right-5 top-5"
              onClick={() => {
                setName("");
                setIsClosed(true);
              }}
            >
              X
            </button>
            <label className="font-[600] text-base">
              Add your own interest
              <input
                placeholder="e.g Product Manager"
                className="w-full py-2 px-4 border border-gray-300 rounded-xl text-gray-600 mt-2 mb-4"
                onChange={(e) => {
                  const value = e.target.value;
                  const capitalized =
                    value.charAt(0).toUpperCase() + value.slice(1);
                  setName(capitalized);
                }}
                value={name}
              />
            </label>
            <div className="w-full py-4" onClick={handleAdd}>
              <AuthButton
                text="Done"
                textWhileActionIsTakingPlace="Adding..."
                action={isClosed}
                isAuth={false}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Interest;
