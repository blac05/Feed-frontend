import { useState } from "react";

export default function CampaignForm() {
  const [form, setForm] = useState({
    title: "",
    budget: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add your submission logic here
    console.log("Campaign Created:", form);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Create Campaign</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Campaign Name"
          className="border p-3 rounded-lg w-full mb-4"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="budget"
          placeholder="Budget"
          className="border p-3 rounded-lg w-full mb-4"
          value={form.budget}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
}