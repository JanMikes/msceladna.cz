import { NextResponse } from 'next/server';
import { verifyFormToken } from '@/lib/form-token';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const token = formData.get('_token') as string | null;
    const formName = formData.get('_formName') as string | null;

    if (!token || !formName) {
      return NextResponse.json({ error: 'Neplatny pozadavek.' }, { status: 400 });
    }

    const recipients = verifyFormToken(token);
    if (!recipients || recipients.length === 0) {
      return NextResponse.json({ error: 'Neplatny formular.' }, { status: 400 });
    }

    // Build email HTML from form fields
    const fields: { label: string; value: string }[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('_')) continue;
      if (value instanceof File) continue;
      fields.push({ label: key, value: String(value) });
    }

    const fieldsHtml = fields
      .map((f) => `<tr><td style="padding:8px;font-weight:bold;vertical-align:top;border-bottom:1px solid #eee">${escapeHtml(f.label)}</td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(f.value)}</td></tr>`)
      .join('');

    const html = `
      <h2>Novy formular: ${escapeHtml(formName)}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${fieldsHtml}
      </table>
    `;

    const success = await sendEmail({
      to: recipients,
      subject: `Novy formular: ${formName}`,
      html,
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Odeslani e-mailu se nezdarilo. Zkuste to prosim pozdeji.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Form Submit] Error:', error);
    return NextResponse.json(
      { error: 'Nastala neocekavana chyba.' },
      { status: 500 },
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
