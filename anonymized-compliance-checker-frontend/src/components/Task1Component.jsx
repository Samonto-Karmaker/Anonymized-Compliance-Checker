import { useState } from "react";
import { useCheckTask1Mutation } from "../services/contract_api";

const Task1Component = () => {
  const [result1, setResult1] = useState("");
  const [result1Status, setResult1Status] = useState("idle");
  const [checkTask1, { isLoading: loading1 }] = useCheckTask1Mutation();
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
  return (
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
  );
};

export default Task1Component;
