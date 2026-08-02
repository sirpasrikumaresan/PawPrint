import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/identify")({
  head: () => ({
    meta: [
      { title: "Identify Animal — PawPrint" },
      {
        name: "description",
        content:
          "Scan a dog's muzzle and body angles to retrieve its existing digital identity and passport in seconds.",
      },
      { property: "og:title", content: "Identify Animal — PawPrint" },
      {
        property: "og:description",
        content: "Biometric identification for dogs — match against registered animal passports.",
      },
    ],
  }),
  component: () => <Outlet />,
});
