import Task3Component from "../components/Task3Component";
import Task1Component from "../components/Task1Component";
import Task2Component from "../components/Task2Component";

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
      <Task3Component />
    </>
  );
};

export default Home;
