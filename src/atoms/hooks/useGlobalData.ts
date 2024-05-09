import { useAtom } from "jotai";
import { globalDataAtom } from "../globalData";

function useGlobalData() {
  const [globalData, setGlobalData] = useAtom(globalDataAtom);

  const doneQuoteTask = (title: string, index: number) => {
    const newGlobalData = globalData.map((item) => {
      if (item.title.en === title) {
        item.quotes[index].done = true;
      }
      return item;
    });
    setGlobalData(newGlobalData);
  };

  return {
    globalData,
    setGlobalData,
    doneQuoteTask,
  };
}

export { useGlobalData };
