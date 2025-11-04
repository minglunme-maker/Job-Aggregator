import { ChangeEvent } from 'react';

export default function TestBasic() {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    alert('File selected: ' + file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const urls = lines.slice(1);

      alert(`Found ${urls.length} URLs:\n\n${urls.slice(0, 5).join('\n')}`);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Basic File Upload Test</h1>

      <div style={{
        border: '3px dashed green',
        padding: '40px',
        textAlign: 'center',
        marginTop: '30px',
        borderRadius: '10px',
        background: '#f0f0f0'
      }}>
        <h2>Click to select CSV file:</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            padding: '15px',
            fontSize: '18px',
            cursor: 'pointer',
            border: '2px solid green',
            borderRadius: '5px',
            background: 'white'
          }}
        />
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#fffacd',
        borderRadius: '8px'
      }}>
        <h3>Your CSV should be:</h3>
        <pre style={{ background: 'white', padding: '15px', borderRadius: '4px' }}>
{`URL
https://www.linkedin.com/jobs/view/123456
https://www.jobstreet.com.sg/job/789012`}
        </pre>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '5px' }}>
        <p><strong>Test Instructions:</strong></p>
        <ol>
          <li>Click the file input button above</li>
          <li>Select your CSV file</li>
          <li>You should see an alert with the filename</li>
          <li>Then another alert showing your URLs</li>
        </ol>
      </div>
    </div>
  );
}
