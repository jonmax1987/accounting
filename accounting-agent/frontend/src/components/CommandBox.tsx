import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

interface CommandBoxProps {
  onCommandExecuted?: (result: any) => void;
}

const CommandBox: React.FC<CommandBoxProps> = ({ onCommandExecuted }) => {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useLLM, setUseLLM] = useState(true);
  const queryClient = useQueryClient(); // הוספת queryClient לרענון נתונים

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/agent?llm=${useLLM}`, { input: command });
      setResult(response.data);
      setCommand('');
      onCommandExecuted?.(response.data);
      
      // רענון נתונים לאחר ביצוע פעולה
      if (response.data && !response.data.error) {
        // רענון כל הנתונים הרלוונטיים
        await queryClient.invalidateQueries({ queryKey: ['clients'] });
        await queryClient.invalidateQueries({ queryKey: ['invoices'] });
        await queryClient.invalidateQueries({ queryKey: ['reports'] });
        
        // הוספת השהייה קצרה לפני רענון הדף
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ['clients'] });
          queryClient.refetchQueries({ queryKey: ['invoices'] });
        }, 500);
      }
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'שגיאה לא ידועה' });
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
        <div className="command-options">
          <label className="llm-toggle">
            <input
              type="checkbox"
              checked={useLLM}
              onChange={() => setUseLLM(!useLLM)}
            />
            השתמש ב-LLM
          </label>
          <button type="submit" disabled={isLoading} className="command-button">
            {isLoading ? 'מעבד...' : 'בצע'}
          </button>
        </div>
      </form>
      {result && (
        <div className="command-result" dir="rtl">
          {result.error ? (
            <div className="error">{result.error}</div>
          ) : result.response ? (
            <div className="response-container">
              <div className="response-text">{result.response}</div>
              <div className="response-details">
                {result.invoice_number && <div><strong>מספר חשבונית:</strong> {result.invoice_number}</div>}
                {result.client_name && <div><strong>שם לקוח:</strong> {result.client_name}</div>}
                {result.amount && <div><strong>סכום:</strong> {result.amount} ש"ח</div>}
                {result.type && <div><strong>סוג:</strong> {result.type}</div>}
              </div>
            </div>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CommandBox;
