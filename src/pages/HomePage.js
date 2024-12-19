import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <img src="/assets/logo.png" alt="Helwan University Logo" className="h-24 mb-6" />
      <h1 className="text-4xl font-bold text-blue-900 mb-4">مرحبا بك في نظام إدارة القيود</h1>
      <p className="text-xl text-gray-700 text-center max-w-xl">
        هذا النظام يساعد في إدارة القيود ومراكز التكلفة بطريقة فعالة وسهلة الاستخدام، مع واجهة أنيقة وتجربة مستخدم سلسة.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} className="mt-6">
        <Link
          to="/operation-makers"
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
        >
          ابدأ الآن
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
