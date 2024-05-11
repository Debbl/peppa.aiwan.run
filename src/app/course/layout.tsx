import { Suspense } from "react";
import { Spinner } from "@nextui-org/spinner";

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
