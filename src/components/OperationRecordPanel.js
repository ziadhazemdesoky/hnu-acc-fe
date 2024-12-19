// src/components/OperationRecordPanel.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import PaginationControls from "./PaginationControls";
import ConfirmationModal from "./ConfirmationModal";
import { fetchOperationRecordsWithStatus, approveOperationRecord, refuseOperationRecord } from "../utils/api";
import { toast } from "react-toastify";

const OperationRecordPanel = () => {
  // State Variables
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'approved', 'pending', 'rejected'
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "recordNumber", direction: "ascending" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve' or 'refuse'
  const [recordToActOn, setRecordToActOn] = useState(null);
  const itemsPerPage = 10;

  // Fetch Records Based on Status Filter
  const getRecords = useCallback(async () => {
    try {
      const data = await fetchOperationRecordsWithStatus(statusFilter);
      setRecords(data);
    } catch (error) {
      toast.error("فشل في جلب القيود.");
      console.error("Error fetching operation records:", error);
    }
  }, [statusFilter]);

  useEffect(() => {
    getRecords();
  }, [getRecords]);

  // Handle Search and Sort
  useEffect(() => {
    let tempRecords = [...records];

    // Search Filtering
    if (searchQuery) {
      tempRecords = tempRecords.filter(
        (record) =>
          record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.recordNumber.toString().includes(searchQuery) ||
          (record.operationCode &&
            record.operationCode.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (record.operationMaker &&
            record.operationMaker.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sorting
    if (sortConfig !== null) {
      tempRecords.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // For operationCode and operationMaker, sort based on their names
        if (sortConfig.key === "operationCode") {
          aValue = a.operationCode ? a.operationCode.name : "";
          bValue = b.operationCode ? b.operationCode.name : "";
        } else if (sortConfig.key === "operationMaker") {
          aValue = a.operationMaker ? a.operationMaker.name : "";
          bValue = b.operationMaker ? b.operationMaker.name : "";
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredRecords(tempRecords);
    setCurrentPage(1); // Reset to first page on new search or sort
  }, [records, searchQuery, sortConfig]);

  // Calculate Total Pages
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Get Current Page Records
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle Sort Request
  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get Sort Indicator
  const getSortIndicator = (key) => {
    if (!sortConfig) return;
    return sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? "▲"
        : "▼"
      : null;
  };

  // Handle Action Button Click (Approve/Refuse)
  const handleActionClick = (record, type) => {
    setRecordToActOn(record);
    setActionType(type);
    setIsModalOpen(true);
  };

  // Confirm Action
  const confirmAction = async () => {
    if (!recordToActOn) return;
    try {
      if (actionType === "approve") {
        await approveOperationRecord(recordToActOn._id);
        toast.success("تمت الموافقة على القيد بنجاح!");
      } else if (actionType === "refuse") {
        await refuseOperationRecord(recordToActOn._id);
        toast.success("تم رفض القيد بنجاح!");
      }
      setIsModalOpen(false);
      setRecordToActOn(null);
      setActionType("");
      getRecords(); // Refresh records
    } catch (error) {
      toast.error("فشل في تنفيذ الإجراء. حاول مرة أخرى.");
      console.error(`Error during ${actionType}:`, error);
      setIsModalOpen(false);
      setRecordToActOn(null);
      setActionType("");
    }
  };

  // Cancel Action
  const cancelAction = () => {
    setIsModalOpen(false);
    setRecordToActOn(null);
    setActionType("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-right mb-4">صفحة الموافقة على القيود</h1>

      {/* Filter Buttons */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded ${
            statusFilter === "all"
              ? "bg-blue-700 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-4 py-2 rounded ${
            statusFilter === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
        >
          قيد الانتظار
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={`px-4 py-2 rounded ${
            statusFilter === "approved"
              ? "bg-green-700 text-white"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          تمت الموافقة
        </button>
        <button
          onClick={() => setStatusFilter("rejected")}
          className={`px-4 py-2 rounded ${
            statusFilter === "rejected"
              ? "bg-red-700 text-white"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          مرفوض
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="بحث بالبيان، رقم القيد، كود العملية أو مركز التكلفة..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Operation Records Table */}
      <motion.div
        className="mt-4 overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {currentRecords.length === 0 ? (
          <p className="text-gray-600 text-right">لا توجد قيود مطابقة.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => requestSort("description")}
                >
                  البيان {getSortIndicator("description")}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => requestSort("recordNumber")}
                >
                  رقم القيد {getSortIndicator("recordNumber")}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => requestSort("operationCode")}
                >
                  كود العملية {getSortIndicator("operationCode")}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => requestSort("operationMaker")}
                >
                  مركز التكلفة {getSortIndicator("operationMaker")}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => requestSort("creditorBalance")}
                >
                  المبلغ الدائن {getSortIndicator("creditorBalance")}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => requestSort("debitorBalance")}
                >
                  المبلغ المدين {getSortIndicator("debitorBalance")}
                </th>
                <th className="px-4 py-2 border">الحالة</th>
                <th className="px-4 py-2 border">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record._id}>
                  <td className="px-4 py-2 border">{record.description}</td>
                  <td className="px-4 py-2 border">{record.recordNumber}</td>
                  <td className="px-4 py-2 border">
                    {record.operationCode
                      ? `${record.operationCode.code} - ${record.operationCode.name}`
                      : "غير معروف"}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.operationMaker
                      ? `${record.operationMaker.makerId} - ${record.operationMaker.name}`
                      : "غير معروف"}
                  </td>
                  <td className="px-4 py-2 border">{record.creditorBalance}</td>
                  <td className="px-4 py-2 border">{record.debitorBalance}</td>
                  <td className="px-4 py-2 border">
                    {record.status === "approved" && (
                      <span className="text-green-600 font-bold">موافق</span>
                    )}
                    {record.status === "pending" && (
                      <span className="text-yellow-600 font-bold">قيد الانتظار</span>
                    )}
                    {record.status === "rejected" && (
                      <span className="text-red-600 font-bold">مرفوض</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleActionClick(record, "approve")}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          موافقة
                        </button>
                        <button
                          onClick={() => handleActionClick(record, "refuse")}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          رفض
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">لا يوجد إجراءات</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title={actionType === "approve" ? "تأكيد الموافقة" : "تأكيد الرفض"}
        message={
          actionType === "approve"
            ? "هل أنت متأكد أنك تريد الموافقة على هذا القيد؟"
            : "هل أنت متأكد أنك تريد رفض هذا القيد؟"
        }
        onConfirm={confirmAction}
        onCancel={cancelAction}
      />
    </div>
  );
};

export default OperationRecordPanel;
