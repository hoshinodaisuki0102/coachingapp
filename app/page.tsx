"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 text-gray-900"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          코칭 앱에 오신 것을 환영합니다 🎯
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          로그인 후 다양한 문제를 풀며 성장해보세요!
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* 실제 로그인 페이지로 연결 */}
          <Link
            href="/login"
            className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-2xl shadow-lg hover:bg-indigo-700 transition-all"
          >
            로그인하기
          </Link>
        </motion.div>
      </section>

      {/* Example Problems Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-8">예시 문제</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[1, 2, 3].map((num) => (
            <motion.div
              key={num}
              className="p-6 rounded-2xl bg-gray-50 shadow hover:shadow-lg transition-all"
              whileHover={{ scale: 1.03 }}
            >
              <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                문제 이미지 {num}
              </div>
              <p className="text-gray-700">문제 {num}의 간단한 설명이 들어갑니다.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 text-center bg-gray-50">
        <h2 className="text-3xl font-semibold mb-6">코칭앱 소개</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          코칭앱은 사용자의 학습 성향을 분석하여 맞춤형 문제를 추천해주는 플랫폼입니다.
          <br />
          매일 새로운 문제로 실력을 꾸준히 향상시켜보세요.
        </p>
      </section>
    </main>
  );
}
