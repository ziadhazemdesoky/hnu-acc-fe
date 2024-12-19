// src/components/OperationRecordForm.js
import React, { useState } from "react";
import { createOperationRecord } from "../utils/api";
import { toast } from "react-toastify";
import Select from "react-select";

const OperationRecordForm = ({ onAddRecord, operationCodes, operationMakers }) => {
  const [recordData, setRecordData] = useState({
    operationCode: null,
    operationMaker: null,
    description: "",
    creditorBalance: "",
    debitorBalance: "",
  });
  const [loading, setLoading] = useState(false);

  // Prepare options for react-select
  const operationCodeOptions = operationCodes.map((code) => ({
    value: code._id,
    label: `${code.code} - ${code.description}`, // Display both code and name
    code: code.code,
    description: code.description,
  }));

  const operationMakerOptions = operationMakers.map((maker) => ({
    value: maker._id,
    label: `${maker.makerId} - ${maker.name}`, // Display both code and name
    code: maker.makerId,
    name: maker.name,
  }));

  const handleChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setRecordData({ ...recordData, [name]: selectedOption });
  };

  const handleInputChange = (e) => {
    setRecordData({ ...recordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare data to send
      const payload = {
        operationCode: recordData.operationCode ? recordData.operationCode.value : "",
        operationMaker: recordData.operationMaker ? recordData.operationMaker.value : "",
        description: recordData.description,
        creditorBalance: recordData.creditorBalance ? parseFloat(recordData.creditorBalance) : 0,
        debitorBalance: recordData.debitorBalance ? parseFloat(recordData.debitorBalance) : 0,
      };
      console.log(payload)
      const newRecord = await createOperationRecord(payload);
      onAddRecord(newRecord);
      setRecordData({
        operationCode: null,
        operationMaker: null,
        description: "",
        creditorBalance: "",
        debitorBalance: "",
      });
      toast.success("تم إضافة القيد بنجاح!");
    } catch (err) {
      toast.error("فشل في إضافة القيد. حاول مرة أخرى.");
      console.error("Error adding operation record:", err);
    } finally {
      setLoading(false);
    }
  };

  // Custom filter function to search by code or name
  const customFilterOption = (option, inputValue) => {
    if (!inputValue) return true;
    const input = inputValue.toLowerCase();
    return (
      option.data.code.toLowerCase().includes(input) ||
      option.data.name.toLowerCase().includes(input)
    );
  };

  // Custom styles for react-select to support RTL
  const customStyles = {
    control: (provided) => ({
      ...provided,
      direction: "rtl",
      textAlign: "right",
    }),
    menu: (provided) => ({
      ...provided,
      direction: "rtl",
      textAlign: "right",
    }),
    singleValue: (provided) => ({
      ...provided,
      direction: "rtl",
      textAlign: "right",
    }),
    input: (provided) => ({
      ...provided,
      direction: "rtl",
      textAlign: "right",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      direction: "rtl",
      textAlign: "right",
    }),
    placeholder: (provided) => ({
      ...provided,
      direction: "rtl",
      textAlign: "right",
    }),
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-right">إضافة قيد</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-right mb-2">كود العملية</label>
          <Select
            name="operationCode"
            value={recordData.operationCode}
            onChange={handleChange}
            options={operationCodeOptions}
            placeholder="اختر كود العملية..."
            isClearable
            className="text-right"
            styles={customStyles}
            filterOption={customFilterOption}
          />
        </div>
        <div className="mb-4">
          <label className="block text-right mb-2">مركز التكلفة</label>
          <Select
            name="operationMaker"
            value={recordData.operationMaker}
            onChange={handleChange}
            options={operationMakerOptions}
            placeholder="اختر مركز التكلفة..."
            isClearable
            className="text-right"
            styles={customStyles}
            filterOption={customFilterOption}
          />
        </div>
        <div className="mb-4">
          <label className="block text-right mb-2">بيان</label>
          <textarea
            name="description"
            value={recordData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-right mb-2">المبلغ الدائن</label>
          <input
            type="number"
            name="creditorBalance"
            value={recordData.creditorBalance}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="block text-right mb-2">المبلغ المدين</label>
          <input
            type="number"
            name="debitorBalance"
            value={recordData.debitorBalance}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            min="0"
            step="0.01"
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

export default OperationRecordForm;
