import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const AnimatedSidebar = () => {
  const { isLoggedIn, logout } = useAuth();

  const links = [
    { path: "/", label: "الصفحة الرئيسية", show: true },
    { path: "/operation-makers", label: "إدارة مراكز التكلفة", show: isLoggedIn },
    { path: "/operation-records", label: "إضافة القيود", show: isLoggedIn },
    { path: "/approval", label: "القيود", show: isLoggedIn },
  ];

  return (
    <motion.nav
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-blue-900 text-white h-screen fixed p-6 flex flex-col gap-6 w-64 right-0"
    >
      <img
        src="/assets/logo.png"
        alt="Helwan University Logo"
        className="h-20 mb-4 self-center"
      />
      {links
        .filter((link) => link.show)
        .map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="text-lg hover:text-gray-300 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      {isLoggedIn && (
        <button
          onClick={logout}
          className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded transition-colors"
        >
          تسجيل الخروج
        </button>
      )}
    </motion.nav>
  );
};

export default AnimatedSidebar;
