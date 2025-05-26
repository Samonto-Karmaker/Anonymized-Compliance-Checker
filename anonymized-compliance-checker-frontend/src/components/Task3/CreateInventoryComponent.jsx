import { useState } from "react";

const CreateInventoryComponent = () => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState("");
  const [dateOfExpiry, setDateOfExpiry] = useState("");
  const [dateOfProcurement, setDateOfProcurement] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setMessage("");
    setStatus("idle");

    try {
      const data = {
        productId,
        productName,
        quantity,
        price,
        dateOfExpiry,
        dateOfProcurement,
        vendorName,
      };

      console.log("Inventory Data:", data);

      // Simulated success
      setStatus("success");
      setMessage("Inventory data updated successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Failed to update.");
    }

    setLoading(false);
  };

  return (
    <div className="mb-7">
      <p className="font-semibold text-gray-700 mb-2">
        Create Inventory
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 w-full">

          {/* Product ID */}
          <div className="flex flex-col w-full">
            <label htmlFor="productId" className="text-sm text-gray-700 mb-1">
              Product ID
            </label>
            <input
              id="productId"
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Product ID"
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Product Name */}
          <div className="flex flex-col w-full">
            <label htmlFor="productName" className="text-sm text-gray-700 mb-1">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter Product Name"
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col w-full">
            <label htmlFor="quantity" className="text-sm text-gray-700 mb-1">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter Quantity"
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col w-full">
            <label htmlFor="price" className="text-sm text-gray-700 mb-1">
              Price
            </label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price"
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date of Expiry */}
          <div className="flex flex-col w-full">
            <label htmlFor="dateOfExpiry" className="text-sm text-gray-700 mb-1">
              Date of Expiry
            </label>
            <input
              id="dateOfExpiry"
              type="date"
              value={dateOfExpiry}
              onChange={(e) => setDateOfExpiry(e.target.value)}
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date of Procurement */}
          <div className="flex flex-col w-full">
            <label htmlFor="dateOfProcurement" className="text-sm text-gray-700 mb-1">
              Date of Procurement
            </label>
            <input
              id="dateOfProcurement"
              type="date"
              value={dateOfProcurement}
              onChange={(e) => setDateOfProcurement(e.target.value)}
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Vendor Name */}
          <div className="flex flex-col w-full">
            <label htmlFor="vendorName" className="text-sm text-gray-700 mb-1">
              Vendor Name
            </label>
            <input
              id="vendorName"
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="Enter Vendor Name"
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className={`w-full px-3 py-2 text-sm text-white rounded ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create New."}
          </button>

          {/* Message Display */}
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
  );
};

export default CreateInventoryComponent;
