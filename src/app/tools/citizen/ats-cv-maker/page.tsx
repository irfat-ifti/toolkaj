"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  FileCheck2,
  Eye,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Landmark,
  Zap,
  Phone,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ToolSeoSection from "@/components/ToolSeoSection";
import { TOOLS_DATA } from "@/lib/tools-data";

const tool = TOOLS_DATA.find((t) => t.slug === "citizen/ats-cv-maker")!;

export default function AtsCvMakerPage() {
  const [personal, setPersonal] = useState({
    name: "Mohammad Irfat Hossain",
    title: "Full Stack Software Engineer",
    email: "irfat@example.com",
    phone: "+880 1700 000000",
    address: "Dhaka, Bangladesh",
    linkedin: "linkedin.com/in/irfat",
    summary:
      "Passionate and detail-oriented Full Stack Developer with 4+ years of hands-on experience building modern, responsive, and scalable web applications using Next.js, React, Node.js, and cloud platforms.",
  });

  const [experiences, setExperiences] = useState([
    {
      company: "Tech Solutions Ltd",
      role: "Senior Frontend Engineer",
      duration: "2023 - Present",
      description:
        "Developed enterprise SaaS products with Next.js and Tailwind CSS. Improved SEO scores from 65 to 98 and reduced bundle size by 35%.",
    },
    {
      company: "Digital Agency BD",
      role: "Web Developer",
      duration: "2021 - 2023",
      description:
        "Built 20+ responsive web platforms and online tools. Collaborated with UI/UX designers and backend teams.",
    },
  ]);

  const [educations, setEducations] = useState([
    {
      degree: "B.Sc. in Computer Science & Engineering",
      institute: "University of Dhaka",
      year: "2017 - 2021",
      result: "CGPA: 3.85 / 4.00",
    },
  ]);

  const [skills, setSkills] = useState([
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Firebase",
    "REST APIs",
    "Git & GitHub",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [cvTemplate, setCvTemplate] = useState<"executive" | "harvard" | "minimal">("executive");
  const [isExporting, setIsExporting] = useState(false);

  const cvPreviewRef = useRef<HTMLDivElement>(null);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: "Company Name", role: "Job Title", duration: "Year - Year", description: "Responsibilities..." },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      { degree: "Degree / Exam", institute: "Institute / College", year: "Year", result: "GPA / CGPA" },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleDownloadPdf = async () => {
    if (!cvPreviewRef.current) return;
    setIsExporting(true);

    try {
      const element = cvPreviewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${personal.name.toLowerCase().replace(/\s+/g, "_")}_resume.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> হোম
          </Link>
          <span>/</span>
          <Link href="/category/citizen" className="hover:text-indigo-600">
            নাগরিক ও ফর্ম
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            ATS সিভি ও রিজিউম মেকার
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> ATS-বান্ধব আন্তর্জাতিক ফর্ম্যাট
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              ATS সিভি ও রিজিউম মেকার (ATS CV Maker)
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              যেকোনো চাকরির জন্য আন্তর্জাতিক মানের প্রফেশনাল রেজ্যুম তৈরি করুন ও PDF ডাউনলোড করুন।
            </p>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "PDF তৈরি হচ্ছে..." : "PDF ডাউনলোড করুন"}</span>
          </button>
        </div>

        {/* Split Builder & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Builder Form Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Personal Info Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                <span>ব্যক্তিগত ও যোগাযোগের তথ্য</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    পূর্ণ নাম (Full Name)
                  </label>
                  <input
                    type="text"
                    value={personal.name}
                    onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    পদবী / পেশা (Job Title)
                  </label>
                  <input
                    type="text"
                    value={personal.title}
                    onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    ইমেইল (Email)
                  </label>
                  <input
                    type="email"
                    value={personal.email}
                    onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    ফোন নম্বর (Phone)
                  </label>
                  <input
                    type="text"
                    value={personal.phone}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    ঠিকানা (Location)
                  </label>
                  <input
                    type="text"
                    value={personal.address}
                    onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    লিংকডইন / পোর্টফোলিও
                  </label>
                  <input
                    type="text"
                    value={personal.linkedin}
                    onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  প্রফেশনাল বিবরণ (Summary / Objective)
                </label>
                <textarea
                  value={personal.summary}
                  onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>
            </div>

            {/* Experience Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span>কর্ম অভিজ্ঞতা (Work Experience)</span>
                </h2>
                <button
                  onClick={addExperience}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> যোগ করুন
                </button>
              </div>

              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">অভিজ্ঞতা #{idx + 1}</span>
                    <button
                      onClick={() => removeExperience(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> মুছুন
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="প্রতিষ্ঠানের নাম"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx].company = e.target.value;
                        setExperiences(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="পদবী"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx].role = e.target.value;
                        setExperiences(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="সময়কাল (যেমন: 2022 - Present)"
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].duration = e.target.value;
                      setExperiences(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <textarea
                    rows={2}
                    placeholder="দায়িত্ব ও অর্জনসমূহ..."
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].description = e.target.value;
                      setExperiences(updated);
                    }}
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Education Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>শিক্ষাগত যোগ্যতা (Education)</span>
                </h2>
                <button
                  onClick={addEducation}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> যোগ করুন
                </button>
              </div>

              {educations.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">ডিগ্রী #{idx + 1}</span>
                    <button
                      onClick={() => removeEducation(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> মুছুন
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="ডিগ্রী / পরীক্ষা"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...educations];
                        updated[idx].degree = e.target.value;
                        setEducations(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="প্রতিষ্ঠান"
                      value={edu.institute}
                      onChange={(e) => {
                        const updated = [...educations];
                        updated[idx].institute = e.target.value;
                        setEducations(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="পাসের সাল"
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...educations];
                        updated[idx].year = e.target.value;
                        setEducations(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="ফলাফল (GPA/CGPA)"
                      value={edu.result}
                      onChange={(e) => {
                        const updated = [...educations];
                        updated[idx].result = e.target.value;
                        setEducations(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-500" />
                <span>দক্ষতা (Skills)</span>
              </h2>

              <form onSubmit={addSkill} className="flex gap-2">
                <input
                  type="text"
                  placeholder="নতুন স্কিল লিখুন ও Enter চাপুন"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  যোগ করুন
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Paper Column */}
          <div className="lg:col-span-6 sticky top-24 space-y-3">
            {/* Template Format Selector Tabs */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                সিভি ফরম্যাট / প্রিসেট:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setCvTemplate("executive")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    cvTemplate === "executive"
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> Modern Executive
                </button>
                <button
                  type="button"
                  onClick={() => setCvTemplate("harvard")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    cvTemplate === "harvard"
                      ? "bg-slate-900 text-white shadow ring-2 ring-slate-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" /> Harvard Classic (ATS 100%)
                </button>
                <button
                  type="button"
                  onClick={() => setCvTemplate("minimal")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    cvTemplate === "minimal"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> Tech Minimalist
                </button>
              </div>
            </div>

            {/* Actual CV Canvas Container with mobile scroll safety */}
            <div className="w-full overflow-x-auto pb-4 no-scrollbar">
              <div
                ref={cvPreviewRef}
                className={`min-w-[580px] lg:min-w-0 w-full bg-white text-slate-900 shadow-2xl rounded-2xl border p-8 sm:p-10 select-none ${
                  cvTemplate === "harvard"
                    ? "font-serif text-xs border-slate-300"
                    : cvTemplate === "minimal"
                    ? "font-sans text-xs border-emerald-200"
                    : "font-sans text-xs border-indigo-200"
                }`}
                style={{ minHeight: "842px" }}
              >
              {/* Header */}
              {cvTemplate === "executive" && (
                <div className="border-b-2 border-indigo-600 pb-4 mb-5 text-center">
                  <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase mb-1">
                    {personal.name}
                  </h1>
                  <p className="text-sm font-bold text-indigo-600 mb-2">{personal.title}</p>
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-medium">
                    {personal.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-indigo-600 inline" /> {personal.phone}
                      </span>
                    )}
                    {personal.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3 text-indigo-600 inline" /> {personal.email}
                      </span>
                    )}
                    {personal.address && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-600 inline" /> {personal.address}
                      </span>
                    )}
                    {personal.linkedin && (
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3 h-3 text-indigo-600 inline" /> {personal.linkedin}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {cvTemplate === "harvard" && (
                <div className="border-b border-black pb-3 mb-4 text-center">
                  <h1 className="text-2xl font-bold tracking-wider text-black uppercase mb-1 font-serif">
                    {personal.name}
                  </h1>
                  <p className="text-xs italic text-slate-800 mb-1">{personal.title}</p>
                  <div className="flex flex-wrap items-center justify-center gap-x-3 text-[10.5px] text-slate-800">
                    {personal.address && <span>{personal.address}</span>}
                    {personal.phone && <span>• {personal.phone}</span>}
                    {personal.email && <span>• {personal.email}</span>}
                    {personal.linkedin && <span>• {personal.linkedin}</span>}
                  </div>
                </div>
              )}

              {cvTemplate === "minimal" && (
                <div className="border-l-4 border-emerald-600 pl-4 py-1 mb-5">
                  <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                    {personal.name}
                  </h1>
                  <p className="text-sm font-semibold text-emerald-700 mb-2">{personal.title}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-slate-600 font-mono">
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.email && <span>{personal.email}</span>}
                    {personal.address && <span>{personal.address}</span>}
                    {personal.linkedin && <span>{personal.linkedin}</span>}
                  </div>
                </div>
              )}

              {/* Summary */}
              {personal.summary && (
                <div className="mb-4">
                  <h2
                    className={`text-xs uppercase tracking-wider pb-1 mb-2 ${
                      cvTemplate === "harvard"
                        ? "font-serif font-bold border-b border-black text-black"
                        : cvTemplate === "minimal"
                        ? "font-bold text-emerald-800 border-b border-emerald-300"
                        : "font-extrabold text-indigo-950 border-b-2 border-indigo-100"
                    }`}
                  >
                    Professional Summary
                  </h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed">{personal.summary}</p>
                </div>
              )}

              {/* Work Experience */}
              {experiences.length > 0 && (
                <div className="mb-4">
                  <h2
                    className={`text-xs uppercase tracking-wider pb-1 mb-2 ${
                      cvTemplate === "harvard"
                        ? "font-serif font-bold border-b border-black text-black"
                        : cvTemplate === "minimal"
                        ? "font-bold text-emerald-800 border-b border-emerald-300"
                        : "font-extrabold text-indigo-950 border-b-2 border-indigo-100"
                    }`}
                  >
                    Experience
                  </h2>
                  <div className="space-y-3">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className={cvTemplate === "minimal" ? "border-l-2 border-slate-200 pl-3" : ""}>
                        <div className="flex justify-between items-baseline font-bold text-[11px]">
                          <span className="text-slate-950">{exp.role}</span>
                          <span className="text-slate-500 font-normal">{exp.duration}</span>
                        </div>
                        <div
                          className={`text-[11px] font-semibold mb-1 ${
                            cvTemplate === "executive" ? "text-indigo-600" : "text-slate-700"
                          }`}
                        >
                          {exp.company}
                        </div>
                        <p className="text-[10.5px] text-slate-600 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {educations.length > 0 && (
                <div className="mb-4">
                  <h2
                    className={`text-xs uppercase tracking-wider pb-1 mb-2 ${
                      cvTemplate === "harvard"
                        ? "font-serif font-bold border-b border-black text-black"
                        : cvTemplate === "minimal"
                        ? "font-bold text-emerald-800 border-b border-emerald-300"
                        : "font-extrabold text-indigo-950 border-b-2 border-indigo-100"
                    }`}
                  >
                    Education
                  </h2>
                  <div className="space-y-2">
                    {educations.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-baseline text-[11px]">
                        <div>
                          <span className="font-bold text-slate-950">{edu.degree}</span>
                          <span className="text-slate-600"> — {edu.institute}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-slate-500 mr-2">{edu.year}</span>
                          <span className="font-semibold text-slate-800">{edu.result}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h2
                    className={`text-xs uppercase tracking-wider pb-1 mb-2 ${
                      cvTemplate === "harvard"
                        ? "font-serif font-bold border-b border-black text-black"
                        : cvTemplate === "minimal"
                        ? "font-bold text-emerald-800 border-b border-emerald-300"
                        : "font-extrabold text-indigo-950 border-b-2 border-indigo-100"
                    }`}
                  >
                    Skills & Competencies
                  </h2>

                  {cvTemplate === "harvard" ? (
                    <p className="text-[11px] text-slate-800 leading-relaxed">
                      {skills.join(" • ")}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className={`px-2 py-0.5 rounded text-[10.5px] font-medium ${
                            cvTemplate === "minimal"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-indigo-50 text-indigo-800 border border-indigo-100"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Rich SEO Content, Step-by-Step Guide, Specifications & FAQs */}
        <ToolSeoSection tool={tool} />
      </div>
    </div>
  );
}
