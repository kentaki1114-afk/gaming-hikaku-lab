"use client";

import { useState } from "react";

export type Faq = {
  question: string;
  answer: string;
};

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-12 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-xl font-bold text-white mb-6">よくある質問</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-slate-700 rounded-xl overflow-hidden">
            <button
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-700/40 transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span className="text-sm font-semibold text-white">Q. {faq.question}</span>
              <span className={`flex-shrink-0 text-slate-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-slate-300 leading-relaxed border-t border-slate-700 pt-4">
                A. {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
