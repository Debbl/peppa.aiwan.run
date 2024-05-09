"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { type ChangeEventHandler, useState } from "react";
import { globalDataAtom } from "~/atoms/globalData";
import Tip from "~/components/Tip";
import {
  MaterialSymbolsDeleteOutline,
  MaterialSymbolsInfo,
  MdiGithub,
} from "~/icons";
import { loadSheet } from "~/utils";

export default function Home() {
  const [globalData, setGlobalData] = useAtom(globalDataAtom);
  const [showTip, setShowTip] = useState(false);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files![0];
    const value = await loadSheet(file);
    if (value) {
      e.target.value = "";
      const isExit = !!globalData.find(
        (item) => item.title.en === value.title.en,
      );

      if (isExit) {
        return;
      }

      setGlobalData([...globalData, value]);
    }
  };

  const handleDeleteData = (index: number) => {
    const newGlobalData = [...globalData];
    newGlobalData.splice(index, 1);
    setGlobalData(newGlobalData);
  };

  return (
    <>
      <Tip showTip={showTip} setShowTip={setShowTip} />
      <main className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-y-4">
          <div className="flex items-center justify-center gap-x-2">
            <input type="file" accept=".xlsx" onChange={handleInputChange} />
            <MaterialSymbolsInfo
              className="size-6 cursor-pointer"
              onClick={() => {
                setShowTip((prev) => !prev);
              }}
            />
            <Link href="https://github.com/Debbl/peppa.aiwan.run/">
              <MdiGithub className="size-6 cursor-pointer" />
            </Link>
          </div>

          <div className="flex flex-1 flex-wrap gap-2">
            {globalData.map(({ title }, index) => (
              <Link
                key={title.en}
                href={`/course?name=${title.en}`}
                className="relative inline-block cursor-pointer rounded-md border bg-pink-400 px-6 py-8"
              >
                <MaterialSymbolsDeleteOutline
                  className="absolute right-2 top-2 opacity-0 transition-opacity hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteData(index);
                    return false;
                  }}
                />
                <div>{title.zh}</div>
                <div>{title.en}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
