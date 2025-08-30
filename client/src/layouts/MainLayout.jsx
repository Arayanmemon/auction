import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="pt-16"> {/* Padding to avoid navbar overlap */}
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
