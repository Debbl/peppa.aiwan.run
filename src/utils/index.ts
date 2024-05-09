import { read, utils } from "xlsx";
import type { SheetItem } from "~/types";

async function loadSheet(file: File): Promise<SheetItem | null> {
  try {
    const buf = await file.arrayBuffer();
    const xlsxFileRaw = read(buf);
    const json: Record<string, string>[] = utils.sheet_to_json(
      xlsxFileRaw.Sheets.Sheet1,
    );

    const header = Object.keys(json[0]);

    const title = {
      en: header[0],
      zh: header[1],
    };
    const quotes = json.map((i) => {
      const q = Object.values(i);
      return {
        en: q[0],
        zh: q[1],
      };
    });

    return {
      title,
      quotes,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);

    return null;
  }
}

export { loadSheet };
