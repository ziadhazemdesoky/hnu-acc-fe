import React from "react";
import { motion } from "framer-motion";

const ApprovalList = ({ records, onApprove }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-right">الموافقات</h2>
      {records.length === 0 ? (
        <p className="text-gray-600 text-right">لا توجد قيود بحاجة للموافقة.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {records.map((record) => (
            <motion.div
              key={record._id}
              className="p-4 border rounded shadow hover:shadow-lg flex flex-col"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-bold mb-2">{record.description}</h3>
              <p>كود العملية: {record.operationCode}</p>
              <p>مركز التكلفة: {record.operationMaker}</p>
              <p>المبلغ الدائن: {record.creditorBalance}</p>
              <p>المبلغ المدين: {record.debitorBalance}</p>
              <button
                className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                onClick={() => onApprove(record._id)}
              >
                موافقة
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalList;
