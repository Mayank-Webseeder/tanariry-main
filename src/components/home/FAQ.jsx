"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  "What are the shipping options?",
  "What is your return policy?",
  "How do I care for my crockery?",
  "Do you offer warranties?",
  "Can I track my order?",
  "Are your products lead-free?",
  "Do you ship internationally?",
  "Is gift wrapping available?",
  "Can I buy individual pieces?",
  "How are items packaged?",
].map((q) => ({
  question: q,
  answer:
    "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free standard shipping is available on orders over $50. International shipping is also available with delivery times varying by location.",
}));

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-8 lg:py-12 bg-background text-black">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">

          {/* Left: Heading – Perfectly Vertically Centered */}
          <div className="flex items-center">
            <h2
              className="leading-tight text-[#172554]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                fontSize: "48px",
                lineHeight: "1.1",
              }}
            >
              Frequently
              <br />
              Asked
              <br />
              <span className="italic">Questions</span>
            </h2>
          </div>

          {/* Right: 2 Columns of FAQs */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Clean & Smooth FAQ Item
const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHeight(`${contentRef.current?.scrollHeight || 0}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left group focus:outline-none"
      >
        <span className="text-base font-medium text-[#172554] group-hover:text-pink-600 transition-colors duration-200 pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-pink-600 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="pt-4">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};