import { useEffect, useState } from "react";
import { Check, Clock, Eye, Wallet, X } from "lucide-react";
import { formatCurrency } from "../../../utils/walletFormatting";

const WithdrawalModal = ({
  isOpen,
  userName,
  availableBalance,
  onClose,
  onGoHome,
}) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [pinDigits, setPinDigits] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setAmount("");
      setPinDigits([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep(1);
    setAmount("");
    setPinDigits([]);
    onClose();
  };

  const enterPinDigit = (digit) => {
    if (pinDigits.length >= 4) return;
    const nextPin = [...pinDigits, digit];
    setPinDigits(nextPin);
    if (nextPin.length === 4) setTimeout(() => setStep(3), 400);
  };

  const withdrawAmount = amount ? Number(amount).toLocaleString() : "50,000";
  const receiveAmount = amount
    ? (Number(amount) - 2000).toLocaleString()
    : "48,000";

  return (
    <div className={`fixed inset-0 z-50 flex ${step === 2 ? "items-end justify-center p-0 md:items-center md:p-4" : "items-center justify-center p-4"} bg-black/45 backdrop-blur-xs animate-fade-in text-gray-800`}>
      <div className={`bg-white ${step === 2 ? "w-full max-w-none rounded-t-[32px] rounded-b-none p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-h-[90dvh] md:max-w-4xl md:rounded-[32px] md:p-8 md:pb-8 md:max-h-[90vh]" : "rounded-[32px] max-w-4xl w-full p-6 sm:p-8 max-h-[90vh]"} relative animate-scale-up overflow-y-auto overscroll-contain`}>
        <button
          onClick={resetAndClose}
          className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-[#016EA6] flex items-center justify-center shrink-0"><Wallet className="w-8 h-8" /></div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">Withdraw Funds</h3>
                <p className="text-xs text-gray-400 font-semibold mt-1">Transfer your available earnings to your verified bank account</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Withdrawal Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₦</span>
                    <input
                      type="text"
                      placeholder="Enter Amount"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-semibold transition-all text-gray-800"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Transfer to</label>
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white text-[10px] font-extrabold shrink-0">GT</div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 leading-tight">GT Bank</h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{userName} • *****37749</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center text-[#016EA6]"><Check className="w-3.5 h-3.5 stroke-[3px]" /></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#013554] to-[#01507B] p-5 rounded-2xl text-white relative overflow-hidden flex items-center justify-between">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200 via-transparent to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-[9px] font-semibold border border-white/5"><span>🇳🇬 NGN</span></div>
                    <div className="pt-1">
                      <span className="text-[10px] text-sky-200/80 font-bold block">Total Balance</span>
                      <h3 className="text-lg font-bold tracking-tight">{formatCurrency(availableBalance)}</h3>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10 relative z-10"><Eye className="w-5 h-5 text-sky-200" /></div>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 flex flex-col justify-between h-full min-h-[300px]">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">WITHDRAW SUMMARY</h4>
                  <div className="divide-y divide-gray-100/60 text-xs">
                    <div className="flex justify-between py-3"><span className="text-gray-400 font-semibold">Amount</span><span className="font-bold text-gray-800">₦{withdrawAmount}</span></div>
                    <div className="flex justify-between py-3"><span className="text-gray-400 font-semibold">Linkprosoft Fee</span><span className="font-bold text-gray-800">₦2,000</span></div>
                    <div className="flex justify-between py-3"><span className="text-gray-505 font-bold">You will Receive</span><span className="font-black text-gray-900 text-sm">₦{receiveAmount}</span></div>
                    <div className="flex justify-between py-3"><span className="text-gray-400 font-semibold">Estimated Arrival</span><span className="font-bold text-green-500 uppercase">INSTANTLY</span></div>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100/30 flex items-start gap-2.5 mt-2">
                    <Clock className="w-4 h-4 text-[#016EA6] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-sky-700 font-semibold leading-relaxed">Funds will be credited to your verified bank account instantly via NIP Transfer.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-6">
                  <button onClick={() => setStep(2)} className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-full text-xs font-bold transition-all cursor-pointer">Continue</button>
                  <button onClick={resetAndClose} className="w-full border border-gray-100 hover:bg-gray-50 text-gray-400 py-3 rounded-full text-xs font-bold transition-all cursor-pointer">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto py-4">
            <div className="flex flex-col items-center gap-6">
              <div className="text-[#016EA6] flex items-center justify-center"><Wallet className="w-10 h-10" /></div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">Verify Identity</h3>
                <p className="text-xs text-gray-400 font-semibold mt-1">Transfer your available earnings to your verified bank account</p>
              </div>
              <div className="text-center mt-2">
                <h4 className="text-sm font-bold text-gray-800">Enter your PIN</h4>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Please enter your 4-digit security PIN to authorize this transaction</p>
              </div>
              <div className="flex gap-4 justify-center py-2">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className={`w-4 h-4 rounded-full border-2 transition-all ${pinDigits.length > index ? "bg-[#016EA6] border-[#016EA6]" : "border-[#016EA6]/30 bg-white"}`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-y-4 gap-x-8 w-full max-w-[280px] pt-4 justify-items-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                  <button key={number} onClick={() => enterPinDigit(number)} className="w-12 h-12 rounded-full hover:bg-gray-50 flex items-center justify-center font-bold text-base text-gray-700 cursor-pointer active:scale-95 transition-transform">{number}</button>
                ))}
                <div />
                <button onClick={() => enterPinDigit(0)} className="w-12 h-12 rounded-full hover:bg-gray-50 flex items-center justify-center font-bold text-base text-gray-700 cursor-pointer active:scale-95 transition-transform">0</button>
                <button onClick={() => setPinDigits((digits) => digits.slice(0, -1))} className="w-12 h-12 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer active:scale-95 transition-transform"><X className="w-5 h-5 stroke-[2.5px]" /></button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center py-6 space-y-6">
            <div className="text-emerald-500 flex items-center justify-center mx-auto"><Check className="w-12 h-12 stroke-[3px]" /></div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-gray-900 leading-tight">₦{withdrawAmount} Has Been Deposited To Your Account</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">Your transaction is successfully processed.</p>
            </div>
            <div className="flex flex-col gap-2 pt-4 w-full max-w-[240px] mx-auto">
              <button onClick={resetAndClose} className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-full text-xs font-bold transition-all cursor-pointer">Go to wallet</button>
              <button
                onClick={() => {
                  resetAndClose();
                  onGoHome();
                }}
                className="w-full border border-gray-100 hover:bg-gray-50 text-gray-400 py-3 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Go back home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalModal;
