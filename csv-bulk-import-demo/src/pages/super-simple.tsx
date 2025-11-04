export default function SuperSimple() {
  return (
    <div>
      <h1>Super Simple Test</h1>
      <p>If you can see this text, the page is rendering!</p>

      <button onClick={() => alert('Button works!')}>
        Click Me
      </button>

      <br /><br />

      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          alert(file ? 'File: ' + file.name : 'No file');
        }}
      />
    </div>
  );
}
