import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSent(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2 pb-6 border-b border-[#1B294B]">
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
          Contact AN.FLIX Team
        </h1>
        <p className="text-xs text-[#7888A7]">
          Questions regarding anime metadata, scene recognition partnerships, or platform inquiries?
        </p>
      </div>

      {sent ? (
        <div className="p-8 rounded-3xl bg-[#10B981]/15 border border-[#10B981]/30 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
          <h3 className="text-base font-bold text-white">Message Dispatched</h3>
          <p className="text-xs text-[#A9B5CE] max-w-sm mx-auto">
            Thank you for reaching out, {name}. Our editorial and engineering desk will review your inquiry shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#0F1932] border border-[#1E2E54] space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Sung Jin-Woo"
              className="w-full h-11 px-3.5 rounded-xl bg-[#0A1224] border border-[#213560] text-xs text-white focus:outline-none focus:border-[#648BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@domain.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[#0A1224] border border-[#213560] text-xs text-white focus:outline-none focus:border-[#648BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Message or Feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="Describe your inquiry or anime metadata correction..."
              className="w-full p-3.5 rounded-xl bg-[#0A1224] border border-[#213560] text-xs text-white focus:outline-none focus:border-[#648BFF]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
};
