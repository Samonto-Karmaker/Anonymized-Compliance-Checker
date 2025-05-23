import { useState } from "react";
import {
  useCheckTask1Mutation,
  useCheckTask2Mutation,
} from "../services/contract_api";

const Home = () => {
  const [batchSize, setBatchSize] = useState("5");
  const [result1, setResult1] = useState("");
  const [result2, setResult2] = useState("");
  const [result1Status, setResult1Status] = useState("idle");
  const [result2Status, setResult2Status] = useState("idle");

  const [checkTask1, { isLoading: loading1 }] = useCheckTask1Mutation();
  const [checkTask2, { isLoading: loading2 }] = useCheckTask2Mutation();

  const handleCheckTask1 = async () => {
    setResult1("");
    setResult1Status("idle");
    try {
      const response = await checkTask1().unwrap();
      setResult1(response.message || "Task 1 Completed Successfully.");
      setResult1Status("success");
    } catch (error) {
      // console.log("error ",error);
      setResult1("Error: " + (error?.data?.message || "Something went wrong."));
      setResult1Status("error");
    }
  };

  const handleCheckTask2 = async () => {
    setResult2("");
    setResult2Status("idle");
    try {
      const response = await checkTask2({ batchSize }).unwrap();
      setResult2(response.message || "Task 2 Completed Successfully.");
      setResult2Status("success");
    } catch (error) {
      setResult2("Error: " + (error?.data?.message || "Something went wrong."));
      setResult2Status("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Task 1 */}
        <div className="mb-6">
          <h6 className="text-sm font-semibold text-gray-700 mb-2">Task 1</h6>
          <button
            type="button"
            onClick={handleCheckTask1}
            disabled={loading1}
            className={`px-3 py-1 text-sm text-white rounded ${
              loading1
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading1 ? "Checking..." : "Check"}
          </button>
          <div
            className={`mt-2 text-sm ${
              result1Status === "success"
                ? "text-green-600"
                : result1Status === "error"
                ? "text-red-600"
                : "text-gray-600"
            }`}
            id="result-1"
          >
            {result1}
          </div>
        </div>

        {/* Task 2 */}
        <div className="mb-4">
          <h6 className="text-sm font-semibold text-gray-700 mb-2">Task 2</h6>
          <div className="flex w-full max-w-md space-x-2">
            <input
              type="text"
              id="batch-size"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              placeholder="Enter batch size"
              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleCheckTask2}
              disabled={loading2}
              className={`px-3 py-1 text-sm text-white rounded ${
                loading2
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading2 ? "Checking..." : "Check"}
            </button>
          </div>
          <div
            className={`mt-2 text-sm ${
              result2Status === "success"
                ? "text-green-600"
                : result2Status === "error"
                ? "text-red-600"
                : "text-gray-600"
            }`}
            id="result-2"
          >
            {result2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
