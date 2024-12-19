import React, { useState } from "react";
import { createOperationMaker } from "../utils/api";
import { toast } from "react-toastify";

const OperationMakerPanel = ({ onAddMaker }) => {
  const [makerData, setMakerData] = useState({ name: "", makerId: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMakerData({ ...makerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newMaker = await createOperationMaker(makerData);
      onAddMaker(newMaker);
      setMakerData({ name: "", makerId: "" });
      toast.success("تم إضافة مركز التكلفة بنجاح!");
    } catch (err) {
      toast.error("فشل في إضافة مركز التكلفة. حاول مرة أخرى.");
      console.error("Error adding operation maker:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-right">إضافة مركز تكلفة</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-right">اسم المركز</label>
          <input
            type="text"
            name="name"
            value={makerData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded text-right"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-right">الكود</label>
          <input
            type="text"
            name="makerId"
            value={makerData.makerId}
            onChange={handleChange}
            className="w-full p-2 border rounded text-right"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "جارٍ الإضافة..." : "إضافة"}
        </button>
      </form>
    </div>
  );
};

export default OperationMakerPanel;
