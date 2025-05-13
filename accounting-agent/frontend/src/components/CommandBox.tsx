import React, { useState } from 'react';
import axios from 'axios';

interface CommandBoxProps {
  onCommandExecuted?: (result: any) => void;
}

const CommandBox: React.FC<CommandBoxProps> = ({ onCommandExecuted }) => {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/agent', { command });
      setResult(response.data);
      setCommand('');
      onCommandExecuted?.(response.data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="command-box">
      <form onSubmit={handleSubmit} className="command-form">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="הקלד פקודה..."
          className="command-input"
          dir="rtl"
        />
        <button type="submit" disabled={isLoading} className="command-button">
          {isLoading ? 'מעבד...' : 'בצע'}
        </button>
      </form>
      {result && (
        <div className="command-result">
          {result.error ? (
            <div className="error">{result.error}</div>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CommandBox;
