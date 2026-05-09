import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { sendBrevoEmail, brandedEmail } from '../_shared/brevo.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL = 'https://scoly.ci';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || '').toLowerCase().trim();
    const first_name = body.first_name ? String(body.first_name).slice(0, 80) : null;
    const source = body.source ? String(body.source).slice(0, 40) : 'website';
    const honeypot = body.website;

    if (honeypot) return ok({ success: true });
    if (!email || !/^\S+@\S+\.\S+$/.test(email) || email.length > 255) {
      return bad('Email invalide');
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Rate-limit léger
    const { data: ipRl } = await admin.rpc('check_rate_limit', {
      _identifier: `nl_ip_${ip}`, _action_type: 'newsletter_subscribe',
      _max_attempts: 5, _window_seconds: 3600, _block_seconds: 1800,
    });
    if (ipRl && ipRl[0] && !ipRl[0].allowed) return bad('Trop de tentatives. Réessayez plus tard.', 429);

    // Existant ?
    const { data: existing } = await admin.from('newsletter_subscribers')
      .select('id, confirmed, is_active').eq('email', email).maybeSingle();

    let subscriberId: string;
    let already = false;
    if (existing) {
      subscriberId = existing.id;
      if (existing.confirmed && existing.is_active) already = true;
      await admin.from('newsletter_subscribers').update({
        first_name: first_name ?? undefined,
        source,
        confirmed: true,
        is_active: true,
        confirmed_at: new Date().toISOString(),
        confirmation_sent_at: new Date().toISOString(),
        unsubscribed_at: null,
      }).eq('id', existing.id);
    } else {
      const { data: inserted, error } = await admin.from('newsletter_subscribers').insert({
        email, first_name, source,
        is_active: true, confirmed: true,
        confirmed_at: new Date().toISOString(),
        confirmation_sent_at: new Date().toISOString(),
      }).select('id').single();
      if (error) throw error;
      subscriberId = inserted.id;
    }

    // Email de bienvenue (toujours envoyé, dédupliqué par email + jour)
    const dedupeKey = `welcome:${email}:${new Date().toISOString().slice(0, 10)}`;
    const html = brandedEmail({
      title: `Bienvenue sur Scoly${first_name ? `, ${first_name}` : ''} 👋`,
      bodyHtml: `
        <p>Merci de rejoindre la communauté <strong>Scoly</strong> !</p>
        <p>Vous recevrez désormais en exclusivité :</p>
        <ul>
          <li>🎁 Promotions et ventes flash sur les fournitures scolaires &amp; bureautiques</li>
          <li>📚 Conseils rentrée et sélections d'experts</li>
          <li>🚚 Annonces de livraison gratuite</li>
        </ul>
        <p>Votre abonnement est <strong>actif immédiatement</strong>. Bonne découverte !</p>
      `,
      ctaText: 'Découvrir la boutique',
      ctaUrl: `${SITE_URL}/shop`,
      footerExtra: `<a href="${SITE_URL}/unsubscribe?token=${subscriberId}" style="color:#94a3b8;text-decoration:none;">Se désinscrire</a>`,
    });

    await sendBrevoEmail({
      from: { name: 'Scoly', email: 'newsletter@scoly.ci' },
      to: email,
      subject: '🎉 Bienvenue sur Scoly — votre abonnement est actif',
      html,
      category: 'welcome',
      emailType: 'newsletter_welcome',
      dedupeKey,
      metadata: { subscriber_id: subscriberId, source },
    }).catch((e) => console.error('welcome email error:', e));

    return ok({
      success: true,
      already,
      message: already
        ? 'Vous êtes déjà abonné — un nouvel email de bienvenue vient de partir.'
        : 'Abonnement confirmé. Vérifiez votre boîte pour l\'email de bienvenue.',
    });
  } catch (e) {
    console.error('subscribe-newsletter error:', e);
    return bad(String((e as Error).message || e), 400);
  }
});

function ok(d: unknown) {
  return new Response(JSON.stringify(d), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
