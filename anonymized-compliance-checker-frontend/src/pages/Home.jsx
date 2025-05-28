import Task1Component from "../components/Task1Component";
import Task2Component from "../components/Task2Component";
import CreateInventoryComponent from "../components/Task3/CreateInventoryComponent";
import UpdateDisbursementDateComponent from "../components/Task3/UpdateDisbursementDateComponent";
import VerifyComponent from "../components/Task3/VerifyComponent";

const Home = () => {
  return (
    <>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Task 1 */}
          <Task1Component />
          {/* Task 2 */}
          <Task2Component />
        </div>
      </div>
      {/* Task 3 */}
      <hr className="my-2 border-gray-300" />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Task 3</h1>
        <CreateInventoryComponent />
        <UpdateDisbursementDateComponent />
        <VerifyComponent/>
      </div>
    </>
  );
};

export default Home;
