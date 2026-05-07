import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FROM = 'Scoly <newsletter@scoly.ci>';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleCheck } = await admin.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
    if (!roleCheck) return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403, headers: corsHeaders });

    const { campaign_id, test_email } = await req.json();
    if (!campaign_id) throw new Error('campaign_id required');

    const { data: campaign, error: cErr } = await admin.from('email_campaigns').select('*').eq('id', campaign_id).single();
    if (cErr || !campaign) throw new Error('Campaign not found');

    let recipients: { email: string; first_name?: string; unsubscribe_token?: string }[];
    if (test_email) {
      recipients = [{ email: test_email, first_name: 'Test' }];
    } else {
      const { data: subs } = await admin.from('newsletter_subscribers')
        .select('email,first_name,unsubscribe_token')
        .eq('is_active', true).eq('confirmed', true);
      recipients = subs || [];
    }

    let sent = 0, failed = 0;
    for (const r of recipients) {
      try {
        const html = campaign.html_content
          .replace(/\{\{first_name\}\}/g, r.first_name || 'cher client')
          .replace(/\{\{unsubscribe_url\}\}/g, `https://scoly.ci/unsubscribe?token=${r.unsubscribe_token || ''}`);

        const resp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: FROM, to: [r.email], subject: campaign.subject, html }),
        });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json.message || 'Send failed');

        sent++;
        await admin.from('email_campaign_logs').insert({ campaign_id, recipient_email: r.email, status: 'sent', resend_id: json.id });
      } catch (e) {
        failed++;
        await admin.from('email_campaign_logs').insert({ campaign_id, recipient_email: r.email, status: 'failed', error_message: String(e) });
      }
    }

    if (!test_email) {
      await admin.from('email_campaigns').update({
        status: 'sent', sent_count: sent, failed_count: failed, recipients_count: recipients.length, sent_at: new Date().toISOString(),
      }).eq('id', campaign_id);
    }

    return new Response(JSON.stringify({ success: true, sent, failed, total: recipients.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
