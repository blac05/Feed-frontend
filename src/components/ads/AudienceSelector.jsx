export default function AudienceSelector() {
  return (
    <div className="bg-white rounded-xl p-4 shadow">

      <h3 className="font-bold mb-4">
        Audience
      </h3>

      <select className="border p-3 rounded-lg w-full">
        <option>
          Worldwide
        </option>

        <option>
          Africa
        </option>

        <option>
          Europe
        </option>
      </select>

    </div>
  );
}