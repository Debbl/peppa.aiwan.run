"use client";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { KeyboardEventHandler } from "react";
import { useMemo, useState } from "react";
import { cn } from "twl";
import { Spinner } from "@nextui-org/spinner";
import { useGlobalData } from "~/atoms/hooks/useGlobalData";
import Confetti from "~/components/Confetti";
import { useOnceDoneEffect } from "~/hooks/useOnceDoneEffect";
import {
  MaterialSymbolsChevronLeft,
  MaterialSymbolsChevronRightRounded,
  MaterialSymbolsHome,
  PhEyeBold,
  PhEyeClosed,
} from "~/icons";

// ignore ‘ ’ “ ” , ，' " . ? ？
function formatInputText(word?: string) {
  if (!word) return "";
  return word.toLocaleLowerCase().replace(/‘|’|“|”|，|,|'|"|\.|\?|？\./g, "");
}

function isEqualWord(a: string, b: string) {
  return formatInputText(a) === formatInputText(b);
}

export default function Course() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const { globalData, doneQuoteTask } = useGlobalData();

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isShowTip, setIsShowTip] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [passed, setPassed] = useState(false);

  const currentCourse = useMemo(() => {
    return globalData.find((item) => item.title.en === name);
  }, [globalData, name]);

  const currentQuote = useMemo(() => {
    return (
      currentCourse?.quotes[currentQuoteIndex] ?? {
        en: "not found",
        zh: "not found",
      }
    );
  }, [currentCourse, currentQuoteIndex]);

  useOnceDoneEffect(() => {
    const lastDoneIndex =
      currentCourse?.quotes.findLastIndex((item) => item.done) ?? -1;
    if (lastDoneIndex === -1) return;

    setInputValue(currentCourse?.quotes[lastDoneIndex].en ?? "");
    setCurrentQuoteIndex(lastDoneIndex);
  }, [currentCourse]);

  const inputValueArr = useMemo(() => inputValue.split(" "), [inputValue]);

  const submit = () => {
    const inputValueArr = inputValue.split(" ");
    const currentQuoteArr = currentQuote.en.split(" ");

    if (inputValueArr.length !== currentQuoteArr.length) return;

    const isCorrect = inputValueArr.every((word, index) =>
      isEqualWord(word, currentQuoteArr[index]),
    );

    if (isCorrect) {
      doneQuoteTask(name!, currentQuoteIndex);
      if (currentCourse?.quotes.length === currentQuoteIndex + 1) {
        setPassed(true);
      } else {
        setCurrentQuoteIndex((prev) => prev + 1);
        setInputValue("");
        setIsShowTip(false);
      }
    }
  };

  const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Enter") return;
    submit();
  };

  const handleMoveLeft = () => {
    const nextIndex = currentQuoteIndex - 1;
    if (nextIndex < 0) return;

    if (currentCourse?.quotes[nextIndex].done) {
      setInputValue(currentCourse?.quotes[nextIndex].en ?? "");
    } else {
      setInputValue("");
    }

    setCurrentQuoteIndex(nextIndex);
  };

  const handleMoveRight = () => {
    const nextIndex = currentQuoteIndex + 1;
    if (nextIndex >= currentCourse!.quotes.length) return;

    if (currentCourse?.quotes[nextIndex].done) {
      setInputValue(currentCourse?.quotes[nextIndex].en ?? "");
    } else {
      setInputValue("");
    }

    setCurrentQuoteIndex(nextIndex);
  };

  if (!currentCourse) {
    return (
      <Spinner
        classNames={{
          base: "w-screen h-screen",
        }}
        label="Loading..."
      />
    );
  }

  const { title } = currentCourse;

  return (
    <>
      <Confetti passed={passed} />
      <div className="flex h-full flex-col gap-y-2">
        <nav className="flex justify-end px-4 py-2">
          <Link href="/">
            <MaterialSymbolsHome className="text-pink-400" />
          </Link>
        </nav>
        <header className="mt-12 text-center text-pink-400">
          <div>{title.zh}</div>
          <div>{title.en}</div>
          <div>
            {currentQuoteIndex + 1}/{currentCourse.quotes.length}
          </div>
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
              <div className="flex items-center justify-center gap-x-2 px-16 text-3xl font-medium text-pink-800">
                <span
                  className={cn(
                    "inline-flex items-center gap-x-1",
                    isShowTip ? "opacity-100" : "opacity-0",
                  )}
                >
                  {currentQuote.en.split(" ").map((word, index) => (
                    <span
                      key={index}
                      className={cn(
                        isEqualWord(word, inputValueArr[index])
                          ? "text-pink-400"
                          : "text-gray-400",
                      )}
                    >
                      {word}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <Input
              variant="underlined"
              type="text"
              classNames={{
                inputWrapper: "h-12",
                innerWrapper: "pb-1.5",
                input: "text-center text-3xl font-medium outline-none",
              }}
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
    </>
  );
}
