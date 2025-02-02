import React from "react";

export const metadata = {
  title: "Quiz Project",
  description: "A Next.js app for quizzes",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
