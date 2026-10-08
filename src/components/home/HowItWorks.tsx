import React from "react";
import { FilePlus2, Sparkles, Handshake } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "แจ้งประกาศสิ่งของ",
      desc: "ระบุประเภท ของหาย หรือ ของเจอ พร้อมรายละเอียด สถานที่ และแนบรูปภาพ",
      icon: <FilePlus2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      step: "02",
      title: "ระบบจับคู่แนะนำอัตโนมัติ",
      desc: "ระบบตรวจจับหมวดหมู่ สถานที่ และเวลาใกล้เคียงกัน เพื่อแนะนำรายการที่ตรงกันทันที",
      icon: <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      step: "03",
      title: "ยืนยันและส่งคืนสำเร็จ",
      desc: "ส่งคำขอ Claim เพื่อแลกเปลี่ยนข้อมูลติดต่ออย่างปลอดภัยและนัดรับของคืน",
      icon: <Handshake className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
  ];

  return (
    <section className="py-8 sm:py-14 lg:py-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
        <h2 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
          ขั้นตอนการทำงาน
        </h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.3] [text-wrap:balance]">
          3 ขั้นตอนง่าย ๆ ในการส่งคืนของ
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {steps.map((st, idx) => (
          <div
            key={idx}
            className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 lg:p-8 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${st.bg} flex items-center justify-center`}
              >
                {st.icon}
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-200 dark:text-slate-800">
                {st.step}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
              {st.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed [text-wrap:balance]">
              {st.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
