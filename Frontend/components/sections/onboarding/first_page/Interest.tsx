"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/favicon.ico";
import AuthButton from "@/components/common/button/Button";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface Tags {
  id: string,
  name: string
  bg: string
  text: string
  border: string
  icon: string
  custom?: boolean
}

function Interest() {
  const [tags, setTags] = useState<Tags[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isClosed, setIsClosed] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [limit, setLimit] = useState(0);

  const handleAdd = async () => {
    if (!name) {
      toast.message('Please add a skill')
    } 
    try {
      
    await addDoc(collection(db, 'tags'), {
      name: name,
      bg: 'rgb(173, 216, 230)',
      border: 'rgb(30, 144, 255)',
      text: 'rgb(0, 51, 102)',
      icon: 'Writing',
      custom: true
    })
    setIsClosed(true)
    setName('')
    setLimit((n) => n + 1)
    setSelectedTags((prevSelected) => [...prevSelected, name])
    } catch (error) {
      console.log("Error deleting:", error)}
  }

  const handleDelete = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id))
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id))
      
    setLimit((n) => n - 1)
      console.log("Deleted:", id)
    } catch (error) {
      console.log("Error deleting:", error)
    }
  }

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
          custom: doc.data().custom ?? false,
        }));
        setTags(tagData);
      } catch (error) {
        console.error("Error fetching tags from Firestore", error);
      }
    }
    fetchTags();
  }, [handleAdd])

  const handleLimit = () => {
    if (limit > 5 || limit < 2) {
      toast.message("The skills selected exceed or do not meet the limit.");
    }
  }

  console.log(limit)

  // const handleExceeded = () => {

  // }

  return (
    <div className="p-4 select-none">
      <Image src={logo} className="m-auto" alt="logo" width={40} height={40} />
      <h1 className="text-xl font-[700] text-[24px] md:text-[40px] text-center mt-2">
        What are you interested in learning?
      </h1>
      <p className="text-gray-600 text-center mb-4">
        Pick 2–5 topics to help us personalize your learning path
      </p>
      <section className="flex flex-wrap max-w-[800px] m-auto py-4 justify-center gap-4 md:gap-8">

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
                setSelectedTags((prevSelected) => {
                  if (prevSelected.includes(tag.name)) {
                    setLimit((n) => n - 1);
                    return prevSelected.filter((t) => t !== tag.name);
                  } else {
                    setLimit((n) => n + 1);
                    return [...prevSelected, tag.name];
                  }
                })
              }
              ;
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete("tags", tag.id);
                  }}
                >
                  X
                </button>
              )}
            </div>
          </div>
        ))}

        <div
          className="px-4 cursor-pointer py-3 rounded-xl text-sm font-medium border"
          style={{
            backgroundColor: "rgb(237, 233, 254)",
            color: "rgb(91, 33, 182)",
          }}
        >
          <div className={`flex items-center gap-4 `}
            onClick={() => {
              if (tags.length >= 14) {
                toast.message('Remove a skill to add more')
                return
              }
              setIsClosed(false)
            }}>
            <Image
              src={`/plus.svg`}
              alt="Add your own"
              width={20}
              height={20}
            />
            <p>Add Yours</p>
          </div>
        </div>
      </section>
      <div className="max-w-[600px] py-4 m-auto" onClick={handleLimit}>
        <AuthButton
          text="Next"
          textWhileActionIsTakingPlace="Hold on..."
          action={false}
          isAuth={false}
        />
      </div>
      <section className={`w-full min-h-screen bg-black/60 flex justify-center items-center absolute top-0 left-0 ${isClosed ? 'hidden' : 'visible'}`}>
        <div className="p-5 py-10 rounded-xl bg-white relative w-[30%]">
          <button className="absolute right-5 top-5"
            onClick={() => {
              setName('')
              setIsClosed(true)
            }}>X</button>
          <label className="font-[600] text-base">Add your own interest
            <input
              placeholder="e.g Product Manager"
              className="w-full py-2 px-4 border border-gray-300 rounded-xl text-gray-600 mt-2 mb-4"
              onChange={(e) => {
                const value = e.target.value
                const capitalized = value.charAt(0).toUpperCase() + value.slice(1)
                setName(capitalized)
              }}
              value={name} />
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

    </div>
  );
}
export default Interest;
