export default function DebugPage() {
  return (
    <html>
      <head>
        <title>Debug Page</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: 'red' }}>
        <div style={{ 
          width: '100vw', 
          height: '100vh', 
          backgroundColor: 'yellow',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <h1 style={{ color: 'black', fontSize: '48px' }}>DEBUG PAGE</h1>
          <p style={{ color: 'black', fontSize: '24px' }}>If you see this, the issue is with the main page</p>
          <p style={{ color: 'black', fontSize: '16px' }}>Background should be YELLOW, not black</p>
        </div>
      </body>
    </html>
  );
} 