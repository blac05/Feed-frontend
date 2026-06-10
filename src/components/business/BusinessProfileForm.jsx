import { useState } from "react";

export default function BusinessProfileForm() {

  const [form,setForm] =
    useState({
      companyName:"",
      website:"",
      description:""
    });

  const handleChange =
    e =>
      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      });

  return (
    <div className="bg-white rounded-2xl p-6 shadow">

      <input
        name="companyName"
        placeholder="Company Name"
        onChange={handleChange}
        className="border p-3 w-full rounded-lg mb-4"
      />

      <input
        name="website"
        placeholder="Website"
        onChange={handleChange}
        className="border p-3 w-full rounded-lg mb-4"
      />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        className="border p-3 w-full rounded-lg"
      />

    </div>
  );
}