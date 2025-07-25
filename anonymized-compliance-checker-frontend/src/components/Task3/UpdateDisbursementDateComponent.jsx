import { useState } from "react";
import { useUpdateTask3Mutation } from "../../services/contract_api";

const UpdateDisbursementDateComponent = () => {
  const [id, setId] = useState("");
  const [disbursementDate, setDisbursementDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [updateTask3, { isLoading: loadingUpdate }] = useUpdateTask3Mutation();

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");
    setStatus("idle");

    try {
        console.log(id,disbursementDate);
        const response = await updateTask3({id, data: { date: disbursementDate }}).unwrap();
        setStatus(response.message || "Updated successfully");
        setMessage("Disbursement date updated successfully.");
      } catch (error) {
        console.log(id,disbursementDate);

       setStatus("error");
       if (error?.data?.message) {
       setMessage(error.data.message); 
    } else {
       setMessage("Failed to update. The date might already exist.");
    }
    }
    setLoading(false);
  };

  return (
    <div className="mb-7">
      <p className="font-semibold text-gray-700 mb-2">
        Update disbursement date
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <div className="flex flex-col gap-4 w-full">
            {/* ID Input */}
            <div className="flex flex-col w-full">
              <label htmlFor="id" className="text-sm text-gray-700 mb-1">
                Enter ID
              </label>
              <input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter ID"
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Input */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="disbursement-date"
                className="text-sm text-gray-700 mb-1"
              >
                Enter Disbursement Date
              </label>
              <input
                id="disbursement-date"
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loadingUpdate}
              className={`w-full px-3 py-2 text-sm text-white rounded ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingUpdate ? "Updating..." : "Update"}
            </button>

            {/* Message */}
            {message && (
              <div
                className={`text-sm mt-2 ${
                  status === "success"
                    ? "text-green-600"
                    : status === "error"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDisbursementDateComponent;
