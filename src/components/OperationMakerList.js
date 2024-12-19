// src/components/OperationMakerList.js
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import PaginationControls from "./PaginationControls";
import ConfirmationModal from "./ConfirmationModal";
import EditMakerModal from "./EditMakerModal"; // Ensure this import is correct
import { deleteOperationMaker } from "../utils/api";
import { toast } from "react-toastify";

const OperationMakerList = ({ makers, refreshMakers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [makerToDelete, setMakerToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Define isEditModalOpen
  const [makerToEdit, setMakerToEdit] = useState(null); // Define makerToEdit
  const itemsPerPage = 10; // Adjust as needed

  // Handle sorting
  const sortedMakers = useMemo(() => {
    let sortableMakers = [...makers];
    if (sortConfig !== null) {
      sortableMakers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // For sorting by makerId or other fields if necessary
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
    return sortableMakers;
  }, [makers, sortConfig]);

  // Filter makers based on search query (searching by name or makerId)
  const filteredMakers = useMemo(() => {
    return sortedMakers.filter(
      (maker) =>
        maker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        maker.makerId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedMakers, searchQuery]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredMakers.length / itemsPerPage);

  // Get current page items
  const currentMakers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMakers.slice(start, start + itemsPerPage);
  }, [filteredMakers, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle sort request
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

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (!sortConfig) return;
    return sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? "▲"
        : "▼"
      : null;
  };

  // Handle delete button click
  const handleDeleteClick = (maker) => {
    setMakerToDelete(maker);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!makerToDelete) return;
    try {
      await deleteOperationMaker(makerToDelete._id);
      toast.success("تم حذف مركز التكلفة بنجاح!");
      setIsDeleteModalOpen(false);
      setMakerToDelete(null);
      refreshMakers(); // Function to refresh the makers list from parent
    } catch (error) {
      toast.error("فشل في حذف مركز التكلفة. حاول مرة أخرى.");
      console.error("Error deleting operation maker:", error);
      setIsDeleteModalOpen(false);
      setMakerToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMakerToDelete(null);
  };

  // Handle edit button click
  const handleEditClick = (maker) => {
    setMakerToEdit(maker);
    setIsEditModalOpen(true);
  };

  // Handle updating maker after edit
  const handleUpdateMaker = (updatedMaker) => {
    // Option 1: Refresh the entire list
    refreshMakers();

    // Option 2: Update the local state if you prefer
    // setMakers((prevMakers) =>
    //   prevMakers.map((maker) =>
    //     maker._id === updatedMaker._id ? updatedMaker : maker
    //   )
    // );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-right mb-4">مراكز التكلفة</h1>
      <SearchBar
        placeholder="بحث بالاسم أو الكود..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <motion.div
        className="mt-4 overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {currentMakers.length === 0 ? (
          <p className="text-gray-600 text-right">لا توجد مراكز تكلفة مطابقة.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  الاسم {getSortIndicator("name")}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => requestSort("makerId")}
                >
                  الكود {getSortIndicator("makerId")}
                </th>
                <th className="px-4 py-2 border w-24">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentMakers.map((maker) => (
                <tr key={maker._id}>
                  <td className="px-4 py-2 border">{maker.name}</td>
                  <td className="px-4 py-2 border">{maker.makerId}</td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(maker)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteClick(maker)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="تأكيد الحذف"
        message="هل أنت متأكد أنك تريد حذف هذا مركز التكلفة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      {/* Edit Maker Modal */}
      <EditMakerModal
        isOpen={isEditModalOpen}
        maker={makerToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateMaker}
      />
    </div>
  );
};

export default OperationMakerList;
