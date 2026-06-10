import { useState } from "react";

export default function CampaignForm() {

  const [form,setForm] =
    useState({
      title:"",
      budget:""
    });

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <h2 className="text-2xl font-bold mb-6">
        Create Campaign
      </h2>

      <input
        placeholder="Campaign Name"
        className="border p-3 rounded-lg w-full mb-4"
      />

      <input
        placeholder="Budget"
        className="border p-3 rounded-lg w-full mb-4"
      />

      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
        Create Campaign
      </button>

    </div>
  );
}