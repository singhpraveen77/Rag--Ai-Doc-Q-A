import { useRef } from 'react';
import Loader from './Loader';

function UploadSection({
  file,
  setFile,
  handleUpload,
  isUploading,
  uploadStatus
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file.');
    }
  };

  return (
    <section className="upload-section">
      <h2>📄 Upload PDF</h2>

      <div
        className={`file-drop-area ${file ? 'active' : ''}`}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
          accept=".pdf"
        />

        {file ? (
          <div>
            <span>✅</span>
            <p>{file.name}</p>
          </div>
        ) : (
          <p>Click to upload PDF</p>
        )}
      </div>

      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? <Loader text="Processing..." /> : 'Process Document'}
      </button>

      {uploadStatus === 'success' && (
        <div className="status-badge success">✓ Ready to Query</div>
      )}
    </section>
  );
}

export default UploadSection;