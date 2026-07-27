import React, { useState } from 'react';
import { ReportModalData } from '../types';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  data: ReportModalData | null;
  onClose: () => void;
  onSubmitReport: (data: ReportModalData, reason: string, comment: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  data,
  onClose,
  onSubmitReport
}) => {
  const [selectedReason, setSelectedReason] = useState('Spam or Unsolicited Promotion');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!data) return null;

  const reasons = [
    'Spam or Unsolicited Promotion',
    'Harassment or Bullying',
    'Inappropriate / Illegal Content',
    'Impersonation of Focus Empire Official',
    'Scam or Fraudulent Activity'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(data, selectedReason, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-neutral-900 border border-yellow-500/40 rounded-2xl w-full max-w-md p-5 shadow-2xl shadow-yellow-500/10">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span>Report {data.targetType.toUpperCase()}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Report Submitted</h3>
            <p className="text-xs text-neutral-400">
              Focus Empire Security Moderation team has received your report. Thank you for keeping the network safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-neutral-300">
              Reporting: <strong className="text-yellow-400">{data.targetName}</strong>
            </p>

            <div>
              <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1.5">
                Select Reason
              </label>
              <div className="space-y-1.5">
                {reasons.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      selectedReason === r
                        ? 'bg-yellow-500/15 border-yellow-500 text-yellow-300 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                      className="accent-yellow-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Describe any specifics..."
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 outline-none resize-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
