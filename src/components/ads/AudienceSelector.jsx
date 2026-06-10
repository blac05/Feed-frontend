import { useState } from 'react';

export default function AudienceSelector() {
  const [audience, setAudience] = useState('Worldwide');

  const handleChange = (e) => {
    setAudience(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h3 className="font-bold mb-4">Audience</h3>
      <select
        className="border p-3 rounded-lg w-full"
        value={audience}
        onChange={handleChange}
      >
        <option value="Worldwide">Worldwide</option>
        <option value="Africa">Africa</option>
        <option value="Europe">Europe</option>
      </select>
    </div>
  );
}