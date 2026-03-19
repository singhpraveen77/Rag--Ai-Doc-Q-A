import { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ChatSection from './components/ChatSection';
import { uploadPDF, askQuestion } from './api';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await uploadPDF(formData);
      setSessionId(res.data.sessionId);
      setUploadStatus('success');
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: 'Document uploaded! Ask questions now.' }
      ]);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Upload failed. Please try again.';
      setUploadStatus('error');
      setMessages(prev => [...prev, { role: 'ai', text: `❌ ${msg}` }]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const q = question;
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setIsAsking(true);

    try {
      const res = await askQuestion(q, sessionId);

      setMessages(prev => [
        ...prev,
        { role: 'ai', text: res.data.answer }
      ]);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Something went wrong. Please try again.';
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: `❌ ${msg}` }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="main-content">
        <UploadSection
          file={file}
          setFile={setFile}
          handleUpload={handleUpload}
          isUploading={isUploading}
          uploadStatus={uploadStatus}
        />

        <ChatSection
          messages={messages}
          question={question}
          setQuestion={setQuestion}
          handleAsk={handleAsk}
          isAsking={isAsking}
          uploadStatus={uploadStatus}
        />
      </div>
    </div>
  );
}

export default App;