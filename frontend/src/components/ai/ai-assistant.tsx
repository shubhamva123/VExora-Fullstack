import { useState } from 'react';
import { Loader2, Send, Bot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import aiService from '@/services/ai.service';

export function AIAssistant() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    try {
      setLoading(true);

      const result = await aiService.chat(text);

      setResponse(result.message);
      setMessage('');
    } catch (error) {
      console.error('AI request failed:', error);
      setResponse('Unable to connect to VExora AI.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />

        <div>
          <h3 className="font-semibold">
            VExora AI
          </h3>

          <p className="text-xs text-muted-foreground">
            Your productivity assistant
          </p>
        </div>
      </div>

      {response && (
        <div className="mb-4 rounded-lg bg-muted p-3 text-sm whitespace-pre-line">
          {response}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessage();
            }
          }}
          placeholder="Ask VExora..."
          disabled={loading}
        />

        <Button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}