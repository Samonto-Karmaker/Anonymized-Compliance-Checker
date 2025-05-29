import React, { useState } from "react";
import {
  useGetHashByCreationIdQuery,
  useGetHashByUpdateIdQuery,
  useVerifyAllBatchesQuery,
} from "../../services/contract_api";

const VerifyComponent = () => {
  const [creationId, setCreationId] = useState("");
  const [loadingCreationIdVerification, setLoadingCreationIdVerification] =
    useState(false);
  const [creationIdMessage, setCreationIdMessage] = useState("");
  const [creationIdStatus, setCreationIdStatus] = useState("");

  const [updatedId, setUpdatedId] = useState("");
  const [loadingUpdatedIdVerification, setLoadingUpdatedIdVerification] =
    useState(false);
  const [updatedIdMessage, setUpdatedIdMessage] = useState("");
  const [updatedIdStatus, setUpdatedIdStatus] = useState("");

  const [loadingVerifyAll, setLoadingVerifyAll] = useState(false);
  const [verifyAllMessage, setVerifyAllMessage] = useState();
  const [verifyAllStatus, setVerifyAllStatus] = useState("");

  const {
    data: creationData,
    error: creationError,
    isLoading: creationLoading,
    refetch: refetchCreation,
  } = useGetHashByCreationIdQuery(creationId, { skip: !creationId });

  const {
    data: updateData,
    error: updateError,
    isLoading: updateLoading,
    refetch: refetchUpdate,
  } = useGetHashByUpdateIdQuery(updatedId, { skip: !updatedId });

  const {
    data: allData,
    error: allError,
    isFetching: allLoading,
    refetch: refetchAll,
  } = useVerifyAllBatchesQuery(undefined, { skip: true });

  const handleCreationIdVerification = async () => {
    setLoadingCreationIdVerification(true);
    try {
      const res = await refetchCreation();
      if (res.data) {
        setCreationIdMessage("Creation ID hash verified.");
        setCreationIdStatus("success");
      } else {
        setCreationIdMessage("Verification failed.");
        setCreationIdStatus("error");
      }
    } catch (err) {
      let errorMessage = "Something went wrong.";
      if (err?.response?.data?.message) {
        errorMessage = `Error: ${err.response.data.message}`;
      } else if (err?.message) {
        errorMessage = `Error: ${err.message}`;
      }

      setCreationIdMessage(errorMessage);
      setCreationIdStatus("error");
    }
    setLoadingCreationIdVerification(false);
  };

  const handleUpdatedIdVerification = async () => {
    setLoadingUpdatedIdVerification(true);
    try {
      const res = await refetchUpdate();
      console.log("refetchAll result:", res);
      if (res.data) {
        setUpdatedIdMessage("Update ID hash verified.");
        setUpdatedIdStatus("success");
      } else {
        setUpdatedIdMessage("Verification failed.");
        setUpdatedIdStatus("error");
      }
    } catch (err) {
      let errorMessage = "Something went wrong.";

      if (err?.response?.data?.message) {
        errorMessage = `Error: ${err.response.data.message}`;
      } else if (err?.message) {
        errorMessage = `Error: ${err.message}`;
      }
      setUpdatedIdMessage(errorMessage);
      setUpdatedIdStatus("error");
    }
    setLoadingUpdatedIdVerification(false);
  };

  const handleVerifyAll = async () => {
    setLoadingVerifyAll(true);
    try {
      const response = await fetch("http://localhost:3000/task3/batch/verify/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed.");
      }
      const data = await response.json();

      if (data) {
        setVerifyAllMessage(data);
        setVerifyAllStatus("success");
      } else {
        setVerifyAllMessage({ error: "Verification failed." });
        setVerifyAllStatus("error");
      }
    } catch (err) {
      let errorMessage = "Something went wrong.";
      if (err?.message) {
        errorMessage = `Error: ${err.message}`;
      }
      setVerifyAllMessage({ error: errorMessage });
      setVerifyAllStatus("error");
    }
    setLoadingVerifyAll(false);
  };

  return (
    <div>
      <p className="font-semibold text-gray-700 mb-2">Verify</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full space-x-2 items-end justify-center">
              <div className="flex-1 flex flex-col">
                <label htmlFor="id" className="text-sm text-gray-700 mb-1">
                  Enter Creation Inventory ID
                </label>
                <input
                  id="id"
                  type="text"
                  value={creationId}
                  onChange={(e) => setCreationId(e.target.value)}
                  placeholder="Enter ID"
                  className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {creationIdMessage && (
                  <div
                    className={`text-sm mt-2 ${
                      creationIdStatus === "success"
                        ? "text-green-600"
                        : creationIdStatus === "error"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {creationIdMessage}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleCreationIdVerification}
                disabled={loadingCreationIdVerification}
                className={`h-[32px] self-end px-3 py-1 text-sm text-white rounded ${
                  loadingCreationIdVerification
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loadingCreationIdVerification
                  ? "Verifying..."
                  : "Verify Creation Hash"}
              </button>
            </div>

            <div className="flex w-full space-x-2 items-end justify-center">
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="updated-id"
                  className="text-sm text-gray-700 mb-1"
                >
                  Enter Updated Inventory ID
                </label>
                <input
                  id="updated-id"
                  type="text"
                  value={updatedId}
                  onChange={(e) => setUpdatedId(e.target.value)}
                  placeholder="Enter ID"
                  className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {updatedIdMessage && (
                  <div
                    className={`text-sm mt-2 ${
                      updatedIdStatus === "success"
                        ? "text-green-600"
                        : updatedIdStatus === "error"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {updatedIdMessage}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleUpdatedIdVerification}
                disabled={loadingUpdatedIdVerification}
                className={`h-[32px] self-end px-3 py-1 text-sm text-white rounded ${
                  loadingUpdatedIdVerification
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loadingUpdatedIdVerification
                  ? "Verifying..."
                  : "Verify Updated Hash"}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Click Here to Verify All:
                </span>
                {verifyAllMessage && (
                  <>
                    <span className="text-sm font-bold">Result:</span>
                  <div
                  className={`text-sm my-2 rounded p-4 ${
                    verifyAllStatus === "success"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : verifyAllStatus === "error"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                      {"error" in verifyAllMessage ? (
                        <p>{verifyAllMessage.error}</p>
                      ) : (
                        <ul className="list-disc list-inside space-y-2">
                          <li>
                            <strong>Untracked Creations:</strong>{" "}
                            {verifyAllMessage.untrackedCreation}
                          </li>
                          <li>
                            <strong>Untracked Updates:</strong>{" "}
                            {verifyAllMessage.untrackedUpdate}
                          </li>
                          <li>
                            <strong>Creation Hash Verified:</strong>{" "}
                            {verifyAllMessage.creationHashVerified ? "Yes" : "No"}
                          </li>
                          <li>
                            <strong>Update Hash Verified:</strong>{" "}
                            {verifyAllMessage.updateHashVerified ? "Yes" : "No"}
                          </li>
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleVerifyAll}
                disabled={loadingVerifyAll}
                className={`h-[32px] self-start px-3 py-1 text-sm text-white rounded ${
                  loadingVerifyAll
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loadingVerifyAll ? "Verifying..." : "Verify All"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyComponent;
