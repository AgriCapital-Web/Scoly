import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SITE_URL = 'https://scoly.ci';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || '').toLowerCase().trim();
    const first_name = body.first_name ? String(body.first_name).slice(0, 80) : null;
    const source = body.source ? String(body.source).slice(0, 40) : 'website';
    const honeypot = body.website; // bot trap

    // Anti-spam basics
    if (honeypot) return ok({ success: true }); // silently swallow bots
    if (!email || !/^\S+@\S+\.\S+$/.test(email) || email.length > 255) {
      return bad('Email invalide');
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Rate limit: per IP (3 per hour) and per email (3 per day)
    const { data: ipRl } = await admin.rpc('check_rate_limit', {
      _identifier: `nl_ip_${ip}`, _action_type: 'newsletter_subscribe',
      _max_attempts: 3, _window_seconds: 3600, _block_seconds: 3600,
    });
    if (ipRl && ipRl[0] && !ipRl[0].allowed) return bad('Trop de tentatives. Réessayez plus tard.', 429);

    const { data: emailRl } = await admin.rpc('check_rate_limit', {
      _identifier: `nl_em_${email}`, _action_type: 'newsletter_subscribe',
      _max_attempts: 3, _window_seconds: 86400, _block_seconds: 86400,
    });
    if (emailRl && emailRl[0] && !emailRl[0].allowed) return bad('Cet email a déjà été utilisé récemment.', 429);

    // Look for existing
    const { data: existing } = await admin.from('newsletter_subscribers')
      .select('id, confirmed, confirmation_token, is_active').eq('email', email).maybeSingle();

    let token: string;
    if (existing) {
      if (existing.confirmed && existing.is_active) {
        return ok({ success: true, already: true, message: 'Vous êtes déjà abonné.' });
      }
      token = existing.confirmation_token;
      await admin.from('newsletter_subscribers').update({
        first_name, source, confirmation_sent_at: new Date().toISOString(),
      }).eq('id', existing.id);
    } else {
      const { data: inserted, error } = await admin.from('newsletter_subscribers').insert({
        email, first_name, source, is_active: false, confirmed: false,
      }).select('confirmation_token').single();
      if (error) throw error;
      token = inserted.confirmation_token;
    }

    // Send confirmation email
    const confirmUrl = `${SITE_URL}/unsubscribe?confirm=${token}`;
    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Scoly <newsletter@scoly.ci>',
          to: [email],
          subject: '✉️ Confirmez votre abonnement à la newsletter Scoly',
          html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff">
            <div style="background:#1a3a6e;padding:32px;text-align:center"><h1 style="color:#fff;margin:0;font-size:28px">Scoly</h1></div>
            <div style="padding:32px">
              <h2 style="color:#1a3a6e;margin-top:0">Bonjour ${first_name || ''} 👋</h2>
              <p style="color:#374151;line-height:1.6;font-size:16px">Merci pour votre intérêt ! Confirmez votre abonnement pour recevoir nos meilleures offres sur les fournitures scolaires et bureautiques.</p>
              <div style="text-align:center;margin:32px 0">
                <a href="${confirmUrl}" style="display:inline-block;background:#f59e0b;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">✓ Confirmer mon abonnement</a>
              </div>
              <p style="color:#6b7280;font-size:13px;line-height:1.6">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
              <p style="color:#9ca3af;font-size:11px;margin-top:24px;word-break:break-all">${confirmUrl}</p>
            </div>
            <div style="background:#f9fafb;padding:20px;text-align:center;color:#6b7280;font-size:12px">© Scoly — Côte d'Ivoire</div>
          </div>`,
        }),
      }).catch(() => {});
    }

    return ok({ success: true, message: 'Email de confirmation envoyé. Vérifiez votre boîte de réception.' });
  } catch (e) {
    return bad(String((e as Error).message || e), 400);
  }
});

function ok(d: unknown) {
  return new Response(JSON.stringify(d), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
