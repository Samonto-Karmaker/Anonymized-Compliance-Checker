import { useEffect, useState } from "react";
import { useCheckTask2Mutation } from "../services/contract_api";

const Task2Component = () => {
  const [batchSize, setBatchSize] = useState("5");

  const [result2, setResult2] = useState("");

  const [result2Status, setResult2Status] = useState("idle");

  const [checkTask2, { isLoading: loading2,isSuccess:isSuccessCheckTask2 }] = useCheckTask2Mutation();

  // useEffect(()=>{
  //   if(isSuccessCheckTask2){
  //     setResult2("Task 2 Completed Successfully.");
  //     setResult2Status("success");

  //   }else{
  //     setResult2("Error: " + ( "Something went wrong."));
  //     setResult2Status("error");
  //   }
  // },[isSuccessCheckTask2])

  const handleCheckTask2 = async () => {
    setResult2("");
    setResult2Status("idle");
    try {
      console.log("re ",batchSize)
      const response = await checkTask2( batchSize ).unwrap();
      if(response.code!=400){
        setResult2("Task 2 Completed Successfully.");
        setResult2Status("success");
      }else{
        setResult2("Error: " + ( "Validaton failed."));
        setResult2Status("error");
      }
    } catch (error) {
        setResult2("Error: " + ( "Something went wrong."));
        setResult2Status("error");
    }
  };
  return (
    <div className="mb-4">
      <h6 className="text-sm font-semibold text-gray-700 mb-2">Task 2</h6>
      <div className="flex w-full max-w-md space-x-2 items-end justify-center">
        <div className="flex-1 flex flex-col">
          <label htmlFor="batch-size" className="text-sm text-gray-700 mb-1">
            Enter Batch Size
          </label>
          <input
            type="text"
            id="batch-size"
            value={batchSize}
            onChange={(e) => setBatchSize(e.target.value)}
            placeholder="Enter batch size"
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleCheckTask2}
          disabled={loading2}
          className={`h-[32px] self-end px-3 py-1 text-sm text-white rounded ${
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
  );
};

export default Task2Component;
