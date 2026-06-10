import { useState } from "react";

export default function CampaignForm() {
  const [formData, setFormData] = useState({
    campaignName: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.campaignName) {
      alert("Please enter a campaign name");
      return false;
    }
    if (!formData.budget || isNaN(formData.budget) || Number(formData.budget) <= 0) {
      alert("Please enter a valid budget");
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      alert("Please select start and end dates");
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert("Start date cannot be after end date");
      return false;
    }
    if (!formData.targetAudience) {
      alert("Please specify target audience");
      return false;
    }
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Replace with your API endpoint
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Campaign created successfully!");
        setFormData({
          campaignName: "",
          budget: "",
          startDate: "",
          endDate: "",
          targetAudience: "",
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to create campaign");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a Campaign</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 rounded">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 rounded">{errorMessage}</div>
      )}

      {/* Campaign Name */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="campaignName">Campaign Name</label>
        <input
          id="campaignName"
          name="campaignName"
          type="text"
          value={formData.campaignName}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      {/* Budget */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="budget">Budget ($)</label>
        <input
          id="budget"
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="startDate">Start Date</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="endDate">End Date</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      {/* Target Audience */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="targetAudience">Target Audience</label>
        <input
          id="targetAudience"
          name="targetAudience"
          type="text"
          value={formData.targetAudience}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="e.g., Age 18-35, Location: US"
          required
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </div>
    </form>
  );
}