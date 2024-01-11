export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
