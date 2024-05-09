export interface Quote {
  zh: string;
  en: string;
  done?: boolean;
}

export type Quotes = Quote[];

export interface SheetItem {
  title: Quote;
  quotes: Quotes;
}

export type GlobalData = SheetItem[];
