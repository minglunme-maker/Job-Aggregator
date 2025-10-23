import React, { useState, ChangeEvent } from 'react';

export default function SimpleURLImport() {
  const [file, setFile] = useState<File | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('File selected: ' + selectedFile.name);

      // Read and parse the file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');

        // Skip header row, get URLs
        const urlList = lines.slice(1).map(line => line.trim());
        setUrls(urlList);
        setMessage(`Found ${urlList.length} URLs`);
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        Simple URL Import Test
      </h1>

      <div style={{
        border: '2px solid #ccc',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            padding: '10px',
            fontSize: '16px'
          }}
        />
      </div>

      {message && (
        <div style={{
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {message}
          </p>
        </div>
      )}

      {urls.length > 0 && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h2 style={{ marginTop: 0 }}>URLs Found:</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {urls.map((url, index) => (
              <li key={index} style={{
                padding: '10px',
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                marginBottom: '5px',
                borderRadius: '4px',
                wordBreak: 'break-all'
              }}>
                {index + 1}. {url}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <h3 style={{ marginTop: 0 }}>📝 Your CSV should look like:</h3>
        <pre style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`URL
https://www.linkedin.com/jobs/view/123456
https://www.jobstreet.com.sg/job/789012
https://www.mycareersfuture.gov.sg/job/details/abc123`}
        </pre>
      </div>
    </div>
  );
}
