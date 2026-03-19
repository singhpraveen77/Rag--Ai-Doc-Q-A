import { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ChatSection from './components/ChatSection';
import { uploadPDF, askQuestion } from './api';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      await uploadPDF(formData);

      setUploadStatus('success');
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: 'Document uploaded! Ask questions now.' }
      ]);
    } catch {
      setUploadStatus('error');
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
      const res = await askQuestion(q);

      setMessages(prev => [
        ...prev,
        { role: 'ai', text: res.data.answer }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: 'Error occurred.' }
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