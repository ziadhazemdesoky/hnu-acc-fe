import React, { useState, useEffect, useCallback } from "react";
import OperationRecordForm from "../components/OperationRecordForm";
import OperationRecordPanel from "../components/OperationRecordPanel";
import { fetchOperationRecords, fetchOperationCodes, fetchOperationMakers } from "../utils/api";
import { toast } from "react-toastify";

const OperationRecordPage = () => {
  const [records, setRecords] = useState([]);
  const [operationCodes, setOperationCodes] = useState([]);
  const [operationMakers, setOperationMakers] = useState([]);

  const getRecords = useCallback(async () => {
    try {
      const data = await fetchOperationRecords();
      setRecords(data.records);
    } catch (error) {
      toast.error("فشل في جلب القيود.");
      console.error("Error fetching operation records:", error);
    }
  }, []);

  const getOperationCodes = useCallback(async () => {
    try {
      const data = await fetchOperationCodes();
      setOperationCodes(data);
    } catch (error) {
      toast.error("فشل في جلب كود العملية.");
      console.error("Error fetching operation codes:", error);
    }
  }, []);

  const getOperationMakers = useCallback(async () => {
    try {
      const data = await fetchOperationMakers();
      setOperationMakers(data);
    } catch (error) {
      toast.error("فشل في جلب مراكز التكلفة.");
      console.error("Error fetching operation makers:", error);
    }
  }, []);

  useEffect(() => {
    getRecords();
    getOperationCodes();
    getOperationMakers();
  }, [getRecords, getOperationCodes, getOperationMakers]);

  const handleAddRecord = (newRecord) => {
    setRecords([...records, newRecord]);
    toast.success("تم إضافة القيد بنجاح!");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-right mb-4">إدارة القيود</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <OperationRecordForm
            onAddRecord={handleAddRecord}
            operationCodes={operationCodes}
            operationMakers={operationMakers}
          />
        </div>
      </div>
    </div>
  );
};

export default OperationRecordPage;
