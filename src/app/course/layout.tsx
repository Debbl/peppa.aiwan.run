import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <Spinner
          classNames={{
            base: "w-screen h-screen",
          }}
          label="Loading..."
        />
      }
    >
      <>{children}</>
    </Suspense>
  );
}
