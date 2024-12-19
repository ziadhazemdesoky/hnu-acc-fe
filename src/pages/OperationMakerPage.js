import React, { useState, useEffect, useCallback } from "react";
import OperationMakerPanel from "../components/OperationMakerPanel"; // Assuming you have a panel for adding makers
import OperationMakerList from "../components/OperationMakerList";
import { fetchOperationMakers, createOperationMaker } from "../utils/api";
import { toast } from "react-toastify";

const OperationMakerPage = () => {
  const [makers, setMakers] = useState([]);

  const getMakers = useCallback(async () => {
    try {
      const data = await fetchOperationMakers();
      setMakers(data);
    } catch (error) {
      toast.error("فشل في جلب مراكز التكلفة.");
      console.error("Error fetching operation makers:", error);
    }
  }, []);

  useEffect(() => {
    getMakers();
  }, [getMakers]);

  const handleAddMaker = async (newMakerData) => {
    try {
      const newMaker = await createOperationMaker(newMakerData);
      setMakers((prevMakers) => [...prevMakers, newMaker]);
      toast.success("تم إضافة مركز التكلفة بنجاح!");
    } catch (error) {
      toast.error("فشل في إضافة مركز التكلفة. حاول مرة أخرى.");
      console.error("Error adding operation maker:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-right mb-4">إدارة مراكز التكلفة</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <OperationMakerPanel onAddMaker={handleAddMaker} />
        </div>
        <div className="md:w-1/2">
          <OperationMakerList makers={makers} refreshMakers={getMakers} />
        </div>
      </div>
    </div>
  );
};

export default OperationMakerPage;
