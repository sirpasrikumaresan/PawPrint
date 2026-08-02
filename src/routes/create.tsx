import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Digital Identity — PawPrint" },
      {
        name: "description",
        content:
          "Enrol a dog with AI-guided biometric capture and generate a verified digital animal passport.",
      },
      { property: "og:title", content: "Create Digital Identity — PawPrint" },
      {
        property: "og:description",
        content: "AI-guided biometric enrolment for dogs — muzzle, profiles and body markings.",
      },
    ],
  }),
  component: () => <Outlet />,
});
