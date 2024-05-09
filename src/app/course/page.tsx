"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { KeyboardEventHandler } from "react";
import { useMemo, useState } from "react";
import { cn } from "twl";
import { useGlobalData } from "~/atoms/hooks/useGlobalData";
import {
  MaterialSymbolsChevronLeft,
  MaterialSymbolsChevronRightRounded,
  MaterialSymbolsHome,
  PhEyeBold,
  PhEyeClosed,
} from "~/icons";

// ignore ‘ ’ “ ” , ，' " .
function formatInputText(word: string) {
  return word.toLocaleLowerCase().replace(/‘|’|“|”|，|,|'|"|\./g, "");
}

function isEqualWord(a: string, b: string) {
  return formatInputText(a) === formatInputText(b);
}

export default function Course() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const { globalData, doneQuoteTask } = useGlobalData();

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState({
    index: 0,
    correctIndex: 0,
  });
  const [isShowTip, setIsShowTip] = useState(false);

  const currentCourse = useMemo(() => {
    return globalData.find((item) => item.title.en === name);
  }, [globalData, name]);

  const currentQuote = useMemo(() => {
    return (
      currentCourse?.quotes[currentQuoteIndex.index] ?? {
        en: "not found",
        zh: "not found",
      }
    );
  }, [currentCourse, currentQuoteIndex]);

  const [inputValue, setInputValue] = useState(() => {
    if (currentCourse?.quotes[currentQuoteIndex.index].done) {
      return currentCourse?.quotes[currentQuoteIndex.index].en ?? "";
    }
    return "";
  });

  const submit = () => {
    const inputValueArr = inputValue.split(" ");
    const currentQuoteArr = currentQuote.en.split(" ");

    if (inputValueArr.length !== currentQuoteArr.length) return;

    const isCorrect = inputValueArr.every((word, index) =>
      isEqualWord(word, currentQuoteArr[index]),
    );

    if (isCorrect) {
      doneQuoteTask(name!, currentQuoteIndex.index);

      setCurrentQuoteIndex((prev) => ({
        index: prev.index + 1,
        correctIndex: prev.correctIndex + 1,
      }));
      setInputValue("");
      setIsShowTip(false);
    }
  };

  const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Enter") return;
    submit();
  };

  const handleMoveLeft = () => {
    const nextIndex = currentQuoteIndex.index - 1;
    if (nextIndex < 0) return;

    if (currentCourse?.quotes[nextIndex].done) {
      setInputValue(currentCourse?.quotes[nextIndex].en ?? "");
    } else {
      setInputValue("");
    }

    setCurrentQuoteIndex((prev) => ({
      index: nextIndex,
      correctIndex: prev.correctIndex,
    }));
  };

  const handleMoveRight = () => {
    const nextIndex = currentQuoteIndex.index + 1;
    if (nextIndex >= currentCourse!.quotes.length) return;

    if (currentCourse?.quotes[nextIndex].done) {
      setInputValue(currentCourse?.quotes[nextIndex].en ?? "");
    } else {
      setInputValue("");
    }

    setCurrentQuoteIndex((prev) => ({
      index: nextIndex,
      correctIndex: prev.correctIndex,
    }));
  };

  if (!currentCourse) {
    return (
      <div className="flex size-full items-center justify-center">
        not found
      </div>
    );
  }

  const { title } = currentCourse;

  return (
    <div className="flex h-full flex-col gap-y-2">
      <nav className="flex justify-end px-4 py-2">
        <Link href="/">
          <MaterialSymbolsHome className="text-pink-400" />
        </Link>
      </nav>
      <header className="mt-12 text-center text-pink-400">
        <div>{title.zh}</div>
        <div>{title.en}</div>
      </header>
      <main className="mx-20 flex flex-1 items-center justify-center text-center">
        <div className="flex flex-col gap-y-12">
          <div>
            <div className="flex items-center justify-center gap-x-2 text-2xl font-medium text-pink-800">
              <span>{currentQuote.zh}</span>
              {isShowTip ? (
                <PhEyeBold
                  className="cursor-pointer"
                  onClick={() => setIsShowTip(false)}
                />
              ) : (
                <PhEyeClosed
                  className="cursor-pointer"
                  onClick={() => setIsShowTip(true)}
                />
              )}
            </div>
            <div className="flex items-center justify-center gap-x-2 px-4 text-3xl font-medium text-pink-800">
              <span className={cn(isShowTip ? "opacity-100" : "opacity-0")}>
                {currentQuote.en}
              </span>
            </div>
          </div>
          <input
            type="text"
            className="border-b-2 text-center text-3xl font-medium outline-none"
            value={inputValue}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={handleInputKeyDown}
          />
          <div className="flex items-center justify-center gap-x-12">
            <MaterialSymbolsChevronLeft
              onClick={() => handleMoveLeft()}
              className="size-8 cursor-pointer"
            />
            <MaterialSymbolsChevronRightRounded
              onClick={() => handleMoveRight()}
              className="size-8 cursor-pointer"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
