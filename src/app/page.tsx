"use client";
import {
  Button,
  Card,
  CardHeader,
  ScrollShadow,
  Tooltip,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import Link from "next/link";
import type { ChangeEventHandler } from "react";
import { globalDataAtom } from "~/atoms/globalData";
import InputFile from "~/components/InputFile";
import {
  MaterialSymbolsDeleteOutline,
  MaterialSymbolsInfo,
  MaterialSymbolsUploadFile,
  MdiGithub,
} from "~/icons";
import { loadSheet } from "~/utils";

export default function Home() {
  const [globalData, setGlobalData] = useAtom(globalDataAtom);

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
      <main className="flex h-screen items-center justify-center">
        <div className="flex w-full flex-col items-center gap-y-4">
          <div className="flex items-center justify-center gap-x-2">
            <InputFile
              onChange={handleInputChange}
              startContent={<MaterialSymbolsUploadFile />}
              endContent={
                <Tooltip
                  offset={20}
                  showArrow
                  onClick={(e) => e.stopPropagation()}
                  content="请导入文件夹中的 第*季第*集***-中英台词.xlsx 文件"
                >
                  <div>
                    <MaterialSymbolsInfo className="cursor-pointer" />
                  </div>
                </Tooltip>
              }
            >
              选择文件
            </InputFile>

            <Link href="https://github.com/Debbl/peppa.aiwan.run/">
              <MdiGithub className="size-6 cursor-pointer" />
            </Link>
          </div>

          <div className="flex w-full flex-1 justify-center">
            <ScrollShadow className="flex h-full w-4/5 flex-wrap justify-start gap-x-2 gap-y-4 p-6">
              {globalData.map(({ title }, index) => (
                <Card
                  as={Link}
                  href={`/course?name=${title.en}`}
                  key={title.en}
                  aria-label="link"
                  isFooterBlurred
                  isBlurred
                  className="px-6 py-4"
                >
                  <CardHeader className="gap-x-6">
                    <div className="flex flex-col gap-1">
                      <div>{title.zh}</div>
                      <div>{title.en}</div>
                    </div>
                    <Button
                      size="sm"
                      isIconOnly
                      variant="flat"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteData(index);
                      }}
                    >
                      <MaterialSymbolsDeleteOutline />
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </ScrollShadow>
          </div>
        </div>
      </main>
    </>
  );
}
