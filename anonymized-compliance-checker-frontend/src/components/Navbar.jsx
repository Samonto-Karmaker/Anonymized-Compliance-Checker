import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex items-center">
      <div className="text-xl font-bold">
        Anonymized Compliance Checker
      </div>
      {/* <div className="space-x-4 ml-6">
        <Link
          to="/task1"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Task 1
        </Link>
        <Link
          to="/task2"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Task 2
        </Link>
      </div> */}
    </nav>
  );
};

export default Navbar;
