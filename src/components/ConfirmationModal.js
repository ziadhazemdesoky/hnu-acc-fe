// src/components/ConfirmationModal.js
import React from "react";
import { motion } from "framer-motion";

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-80"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        id="modal-title"
      >
        <h2 className="text-xl font-bold mb-4 text-right">{title}</h2>
        <p className="mb-6 text-right">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            تأكيد
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
