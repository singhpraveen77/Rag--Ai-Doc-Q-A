import { useEffect, useRef } from 'react';
import Message from './Message';
import Loader from './Loader';

function ChatSection({
  messages,
  question,
  setQuestion,
  handleAsk,
  isAsking,
  uploadStatus
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section className="chat-section">
      <h2>💬 Query Document</h2>

      <div className="chat-box">
        <div className="messages">
          {messages.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20%' }}>
              Upload a document to start.
            </p>
          ) : (
            messages.map((m, i) => (
              <Message key={i} role={m.role} text={m.text} />
            ))
          )}

          {isAsking && <Loader text="Thinking..." />}

          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleAsk}>
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={uploadStatus !== 'success'}
          />

          <button
            type="submit"
            disabled={!question.trim() || isAsking || uploadStatus !== 'success'}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

export default ChatSection;