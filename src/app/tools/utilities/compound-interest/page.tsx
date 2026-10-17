"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, DollarSign, Calendar, RefreshCw, Sparkles } from "lucide-react";
import ToolSeoSection from "@/components/ToolSeoSection";

export default function CompoundInterestPage() {
  const [initialPrincipal, setInitialPrincipal] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [annualRate, setAnnualRate] = useState(10);
  const [years, setYears] = useState(10);
  const [compoundFreq, setCompoundFreq] = useState(12); // monthly

  // Calculation logic
  const calculateGrowth = () => {
    let balance = initialPrincipal;
    let totalInvested = initialPrincipal;
    const yearlyBreakdown = [];

    const monthlyRate = annualRate / 100 / 12;

    for (let yr = 1; yr <= years; yr++) {
      let yearInterest = 0;
      for (let m = 1; m <= 12; m++) {
        balance += monthlyContribution;
        totalInvested += monthlyContribution;
        const interest = balance * monthlyRate;
        yearInterest += interest;
        balance += interest;
      }

      yearlyBreakdown.push({
        year: yr,
        invested: Math.round(totalInvested),
        balance: Math.round(balance),
        interestEarned: Math.round(balance - totalInvested),
      });
    }

    const finalBalance = Math.round(balance);
    const finalInvested = Math.round(totalInvested);
    const finalInterest = finalBalance - finalInvested;

    return {
      finalBalance,
      finalInvested,
      finalInterest,
      yearlyBreakdown,
    };
  };

  const results = calculateGrowth();

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> হোম
          </Link>
          <span>/</span>
          <Link href="/category/utilities" className="hover:text-indigo-600">
            ক্যালকুলেটর
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            চক্রবৃদ্ধি মুনাফা ক্যালকুলেটর
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> সম্পদ বৃদ্ধি ও বিনিয়োগ সিমুলেটর
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            চক্রবৃদ্ধি মুনাফা ক্যালকুলেটর (Compound Interest)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            মাসিক সঞ্চয় ও সুদের হারে সময়ের সাথে আপনার সম্পদ কীভাবে বৃদ্ধি পায় তা চার্ট ও বাৎসরিক বিবরণী সহ দেখুন।
          </p>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              বিনিয়োগ প্যারামিটার নির্ধারণ করুন
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                প্রাথমিক মূলধন (Initial Deposit)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ৳
                </span>
                <input
                  type="number"
                  value={initialPrincipal}
                  onChange={(e) => setInitialPrincipal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                মাসিক জমা (Monthly Contribution)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ৳
                </span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>বার্ষিক মুনাফার হার (Annual Rate)</span>
                <span className="text-indigo-600 font-bold">{annualRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={annualRate}
                onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>বিনিয়োগের সময়কাল (Years)</span>
                <span className="text-indigo-600 font-bold">{years} বছর</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-slate-400 block mb-1">মোট বিনিয়োগকৃত টাকা</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  ৳{results.finalInvested.toLocaleString("en-US")}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-emerald-500 block mb-1">মোট অর্জিত মুনাফা</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ৳{results.finalInterest.toLocaleString("en-US")}
                </span>
              </div>

              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow-lg">
                <span className="text-xs font-bold text-indigo-100 block mb-1">ভবিষ্যৎ মোট প্রাপ্তি</span>
                <span className="text-xl sm:text-2xl font-black">
                  ৳{results.finalBalance.toLocaleString("en-US")}
                </span>
              </div>
            </div>

            {/* Growth Bar Visualizer */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
                সম্পদ অনুপাত (মূলধন বনাম মুনাফা)
              </h3>
              <div className="h-6 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: `${(results.finalInvested / results.finalBalance) * 100}%` }}
                  className="bg-indigo-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
                >
                  মূলধন {Math.round((results.finalInvested / results.finalBalance) * 100)}%
                </div>
                <div
                  style={{ width: `${(results.finalInterest / results.finalBalance) * 100}%` }}
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
                >
                  মুনাফা {Math.round((results.finalInterest / results.finalBalance) * 100)}%
                </div>
              </div>
            </div>

            {/* Yearly Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
                বাৎসরিক ব্যালেন্স বিবরণী (Yearly Breakdown)
              </h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold sticky top-0">
                    <tr>
                      <th className="p-2.5">বছর</th>
                      <th className="p-2.5">মোট জমা</th>
                      <th className="p-2.5">মোট মুনাফা</th>
                      <th className="p-2.5 text-right">শেষ ব্যালেন্স</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {results.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">
                          বছর {row.year}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400">
                          ৳{row.invested.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-emerald-600 font-semibold">
                          ৳{row.interestEarned.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right font-bold text-indigo-600 dark:text-indigo-400">
                          ৳{row.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SEO On-Page Content, FAQs, and Search Tag Badges */}
        <ToolSeoSection toolSlug="utilities/compound-interest" />
      </div>
    </div>
  );
}
