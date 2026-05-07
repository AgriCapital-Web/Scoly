const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const { prompt, type = 'newsletter' } = await req.json();
    if (!prompt) throw new Error('prompt required');

    const systemPrompt = `Tu es un expert en email marketing pour Scoly (scoly.ci), une plateforme ivoirienne de fournitures scolaires et bureautiques. Couleurs de marque : Bleu Marine (#1a3a6e) et Orange (#f59e0b). Génère un email HTML moderne, responsive, professionnel, en français. Utilise des inline styles uniquement (compatible tous clients mail). Structure: <div container 600px max>, header avec logo texte "Scoly", titre h1, contenu, CTA orange, footer avec lien désinscription {{unsubscribe_url}}. Type demandé: ${type}.

Réponds en JSON strict: { "subject": "...", "preheader": "...", "html_content": "<!DOCTYPE html>..." }`;

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`AI gateway: ${resp.status} ${t}`);
    }
    const data = await resp.json();
    const content = JSON.parse(data.choices[0].message.content);
    return new Response(JSON.stringify(content), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
