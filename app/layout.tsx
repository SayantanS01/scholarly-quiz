import "./globals.css";

export const metadata = {
  title: "Scholarly Quiz",
  description: "A quiz application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
