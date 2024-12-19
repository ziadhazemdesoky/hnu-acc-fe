// src/components/EditMakerModal.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateOperationMaker } from "../utils/api";
import { toast } from "react-toastify";

const EditMakerModal = ({ isOpen, maker, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    makerId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (maker) {
      setFormData({
        name: maker.name,
        makerId: maker.makerId,
      });
    }
  }, [maker]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedMaker = await updateOperationMaker(maker._id, formData);
      toast.success("تم تحديث مركز التكلفة بنجاح!");
      onUpdate(updatedMaker);
      onClose();
    } catch (error) {
      toast.error("فشل في تحديث مركز التكلفة. حاول مرة أخرى.");
      console.error("Error updating operation maker:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-lg p-6 w-80"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2 className="text-xl font-bold mb-4 text-right">تحديث مركز التكلفة</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-right mb-2">الاسم</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-right mb-2">الكود</label>
            <input
              type="text"
              name="makerId"
              value={formData.makerId}
              onChange={handleChange}
              className="w-full p-2 border rounded text-right"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "جارٍ التحديث..." : "تحديث"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditMakerModal;
