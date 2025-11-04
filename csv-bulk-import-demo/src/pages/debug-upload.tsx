import { ChangeEvent, useEffect } from 'react';

export default function DebugUpload() {
  useEffect(() => {
    console.log('=== DEBUG UPLOAD PAGE LOADED ===');
    console.log('React version:', require('react').version);
    console.log('Page rendered successfully');

    // Test if JavaScript is working
    const testDiv = document.getElementById('test-div');
    if (testDiv) {
      testDiv.style.backgroundColor = 'lightgreen';
      console.log('✅ JavaScript is working - changed background color');
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('=== FILE INPUT TRIGGERED ===');
    const file = e.target.files?.[0];
    console.log('File object:', file);

    if (!file) {
      console.log('❌ No file selected');
      alert('No file selected');
      return;
    }

    console.log('✅ File selected:', file.name);
    alert('File selected: ' + file.name);
  };

  const handleClick = () => {
    console.log('=== BUTTON CLICKED ===');
    alert('Button clicked!');
  };

  const handleMouseOver = () => {
    console.log('Mouse over file input');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Upload Debugging Page</h1>
      <p>Open your browser console (F12) to see debug messages</p>

      <hr style={{ margin: '20px 0' }} />

      <h2>Test 1: Simple Button (Should show alert)</h2>
      <button
        onClick={handleClick}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Click Me to Test
      </button>

      <hr style={{ margin: '20px 0' }} />

      <h2>Test 2: File Input (Should open file picker)</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        onMouseOver={handleMouseOver}
        style={{
          padding: '15px',
          fontSize: '18px',
          border: '3px solid red',
          background: 'yellow',
          cursor: 'pointer',
          display: 'block',
          width: '300px'
        }}
      />

      <hr style={{ margin: '20px 0' }} />

      <h2>Test 3: JavaScript Test</h2>
      <div
        id="test-div"
        style={{
          padding: '20px',
          background: 'lightblue',
          border: '2px solid black'
        }}
      >
        This should turn light green when page loads (JavaScript test)
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h2>Instructions:</h2>
      <ol>
        <li>Click the blue "Click Me to Test" button - you should see an alert</li>
        <li>Open browser console (F12) - you should see debug messages</li>
        <li>Click the red-bordered file input - file picker should open</li>
        <li>Select a file - you should see alert and console messages</li>
        <li>The blue box above should be light green (JavaScript test)</li>
      </ol>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#fffacd',
        border: '1px solid #ffc107',
        borderRadius: '5px'
      }}>
        <strong>Expected Console Output:</strong>
        <pre style={{ marginTop: '10px', background: 'white', padding: '10px' }}>
{`=== DEBUG UPLOAD PAGE LOADED ===
React version: 18.x.x
Page rendered successfully
✅ JavaScript is working - changed background color`}
        </pre>
      </div>
    </div>
  );
}
