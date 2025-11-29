import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostalCodeWorx | Glove Finder",
  description: "Reunite lost gloves with their owners. A community platform powered by AI for Berlin neighborhoods.",
  keywords: ["lost gloves", "Berlin", "community", "postal code", "found items"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen glove-pattern mesh-gradient">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}



