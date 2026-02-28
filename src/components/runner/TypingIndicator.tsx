export const TypingIndicator = () => {
  return (
    <div className="chat-bubble chat-bubble-bot inline-flex items-center gap-1 py-4">
      <span className="typing-dot h-2 w-2 rounded-full bg-slate-400"></span>
      <span className="typing-dot h-2 w-2 rounded-full bg-slate-400"></span>
      <span className="typing-dot h-2 w-2 rounded-full bg-slate-400"></span>
    </div>
  );
};
