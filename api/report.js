const API_BASE = 'https://api.siliconflow.cn/v1';

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

  if (!process.env.SILICONFLOW_REPORT_KEY) {
    return res.status(500).json({ error: { message: 'API Key 未配置，请在 Vercel 环境变量中设置 SILICONFLOW_REPORT_KEY' } });
  }

  try {
    const { model, messages, max_tokens } = req.body;

    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SILICONFLOW_REPORT_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-ai/DeepSeek-V4-Flash',
        messages,
        stream: false,
        max_tokens: max_tokens || 300,
        temperature: 0.1,
        top_p: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: { message: data.error?.message || `API error ${response.status}` },
      });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
}
