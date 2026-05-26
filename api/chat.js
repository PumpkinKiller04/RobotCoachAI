const API_BASE = 'https://api.siliconflow.cn/v1';
const DEFAULT_MODEL = 'Pro/moonshotai/Kimi-K2.6';
const SYSTEM_PROMPT = '你是简洁助手。回答控制在150字以内，直接给核心信息，不要铺垫、不要展开、不要总结。';

function resolveImageUrl(url, host) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleaned = url.replace(/^(\.\.?\/)+/g, '').replace(/^\/+/, '');
  return `https://${host}/${cleaned}`;
}

function resolveMessages(messages, host) {
  return messages.map((msg) => {
    if (!Array.isArray(msg.content)) return msg;
    return {
      ...msg,
      content: msg.content.map((part) => {
        if (part.type === 'image_url' && part.image_url) {
          return {
            ...part,
            image_url: {
              ...part.image_url,
              url: resolveImageUrl(part.image_url.url, host),
            },
          };
        }
        return part;
      }),
    };
  });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  if (!process.env.SILICONFLOW_API_KEY) {
    return res.status(500).json({ error: { message: 'API Key 未配置，请在 Vercel 环境变量中设置 SILICONFLOW_API_KEY' } });
  }

  try {
    const { messages, model } = req.body;
    const host = req.headers.host || 'localhost:3000';
    const resolvedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...resolveMessages(messages, host),
    ];

    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SILICONFLOW_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        messages: resolvedMessages,
        stream: true,
        temperature: 0.1,
        max_tokens: 200,
        top_p: 0.7,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      let msg = `SiliconFlow ${response.status}`;
      try {
        const err = JSON.parse(body);
        msg = err.error?.message || err.message || msg;
      } catch (_) {
        if (body) msg = body.slice(0, 200);
      }
      return res.status(response.status).json({ error: { message: msg } });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }
    res.end();
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
}
