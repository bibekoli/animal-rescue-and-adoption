import Footer from "./Footer";
import Header from "./Header";

export default function ResponsiveDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="max-w-screen-xl mx-auto">
        <div className="fixed top-0 left-0 w-full z-50 mb-40">
          <Header />
        </div>
        <div className="mt-16 p-4">
          {children}
        </div>
      </div>
      <div className="bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </>
  );
}
