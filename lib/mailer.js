const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 1,
  maxMessages: Infinity,
  tls: { rejectUnauthorized: false },
  connectionTimeout: 30000,
  greetingTimeout: 15000,
  socketTimeout: 60000,
});

const DOMAIN = (process.env.SMTP_USER || '').split('@')[1] || 'gmail.com';
const FROM   = `"${process.env.FROM_NAME || 'PomParadies GmbH'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`;

function getPublicSiteUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  return 'https://pomparadiesgmbh.com';
}

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapHtml(title, content) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px;">
<table width="520" cellpadding="0" cellspacing="0" style="width:100%;max-width:520px;background:#fff;border-radius:8px;overflow:hidden;">
<tr><td style="padding:24px 28px 0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td><span style="font-size:17px;font-weight:800;color:#2C1810;">PomParadies GmbH</span><br><span style="font-size:9px;letter-spacing:0.25em;color:#C9762E;text-transform:uppercase;">Bonn · Deutschland</span></td>
<td align="right"><span style="display:inline-block;width:36px;height:36px;background:#C9762E;border-radius:6px;line-height:36px;text-align:center;font-size:16px;">🐶</span></td>
</tr></table>
</td></tr>
<tr><td style="padding:6px 28px 0;"><div style="height:1px;background:rgba(44,24,16,0.07);"></div></td></tr>
<tr><td style="padding:14px 28px 10px;font-size:14px;color:#2C1810;line-height:1.5;">${content}</td></tr>
<tr><td style="padding:12px 28px 18px;background:#faf7f2;border-top:1px solid rgba(44,24,16,0.07);"><span style="font-size:11px;color:#6B5B4F;line-height:1.5;">
<strong style="color:#2C1810;">PomParadies GmbH</strong><br>USt-IdNr DER3201.HRB29907<br>
<a href="${getPublicSiteUrl()}" style="color:#C9762E;text-decoration:none;">pomparadiesgmbh.com</a></span></td></tr>
</table>
</td></tr></table>
</body>
</html>`;
}

const L = (k, v) => `<div style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#8B7D70;margin:6px 0 1px;">${esc(k)}</div><div style="font-size:14px;color:#2C1810;margin:0 0 2px;">${esc(v)}</div>`;
const SEP = () => '<div style="height:1px;background:rgba(44,24,16,0.06);margin:8px 0;"></div>';

async function sendMail({ to, subject, html, text }) {
  const messageId = `<${crypto.randomUUID()}@${DOMAIN}>`;
  return transporter.sendMail({
    from: FROM, to, subject, html, text,
    headers: {
      'Message-ID': messageId,
      'X-Mailer': 'PomParadies GmbH Mailer v1',
      'X-Entity-Ref-ID': crypto.randomUUID(),
      'Precedence': 'bulk',
      'List-Unsubscribe': `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
}

function formatEuro(amount) {
  if (!amount && amount !== 0) return '—';
  return '€' + new Intl.NumberFormat('en-US').format(Math.round(amount));
}

function formatBool(val) {
  if (val === true || val === 'true') return 'Ja';
  if (val === false || val === 'false') return 'Nein';
  return '—';
}

async function sendReservationConfirmation({ email, name, reservation, puppy }) {
  const pn = puppy.name + ' · ' + puppy.breed;
  const url = getPublicSiteUrl() + '/track/' + reservation.reservationNumber;

  const html = wrapHtml('Reservierungsbestätigung',
    '<div style="font-size:18px;font-weight:800;color:#C9762E;margin-bottom:4px;">Ihre Reservierung ist eingetragen</div>' +
    '<div style="margin-bottom:12px;color:#444448;">Wir haben Ihre Anfrage erhalten. Hier ist die Zusammenfassung Ihrer Reservierung.</div>' +
    SEP() +
    L('Reservierungsnr.', reservation.reservationNumber) +
    L('Welpe', pn) +
    L('Verkaufspreis', formatEuro(puppy.price)) +
    SEP() +
    L('Kontaktdaten', (reservation.guestPhone || '—')) +
    L('Haushalt', 'Haustier zu Hause: ' + formatBool(reservation.hasPet) + ' · Schon ein Tier verloren: ' + formatBool(reservation.hasLostPet)) +
    SEP() +
    L('Zu zahlende Anzahlung', formatEuro(reservation.depositAmount || 0)) +
    (reservation.balanceAmount > 0 ? L('Offener Restbetrag', formatEuro(reservation.balanceAmount)) : '') +
    L('Gesamtbetrag', formatEuro(reservation.totalPrice || puppy.price)) +
    (reservation.notes ? SEP() + L('Ihre Nachricht', esc(reservation.notes)) : '') +
    '<div style="text-align:center;margin:18px 0 8px;"><a href="' + esc(url) + '" style="display:inline-block;background:#C9762E;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:11px 26px;border-radius:5px;">Meine Reservierung verfolgen</a></div>' +
    '<div style="font-size:12px;color:#8A8A90;text-align:center;margin-top:6px;">Bei Fragen antworten Sie einfach direkt auf diese E-Mail.</div>'
  );

  await sendMail({
    to: email,
    subject: `Reservierungsbestätigung ${reservation.reservationNumber} — PomParadies GmbH`,
    html,
    text: [
      `RESERVIERUNGSBESTÄTIGUNG — PomParadies GmbH`,
      ``,
      `Hallo ${name},`,
      ``,
      `Wir haben Ihre Reservierungsanfrage erhalten. Hier ist die Zusammenfassung:`,
      ``,
      `Reservierungsnr. : ${reservation.reservationNumber}`,
      `Welpe : ${puppy.name} (${puppy.breed})`,
      `Verkaufspreis : ${formatEuro(puppy.price)}`,
      ``,
      `Zu zahlende Anzahlung : ${formatEuro(reservation.depositAmount || 0)}`,
      `${reservation.balanceAmount > 0 ? 'Offener Restbetrag : ' + formatEuro(reservation.balanceAmount) : ''}`,
      `Gesamtbetrag : ${formatEuro(reservation.totalPrice || puppy.price)}`,
      ``,
      `Ihre Reservierung verfolgen : ${url}`,
      ``,
      `Bei Fragen antworten Sie einfach direkt auf diese E-Mail.`,
      ``,
      `Mit freundlichen Grüßen,`,
      `PomParadies GmbH`,
      `USt-IdNr DER3201.HRB29907`,
    ].join('\n'),
  });
}

async function sendAdminNotification({ reservation, puppy }) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  const s = (v) => v || '—';
  const dm = reservation.deliveryMethod === 'delivery' ? 'Lieferung' : 'Abholung vor Ort';
  const payLabel = reservation.paymentLabel || (reservation.paymentMethod === 'full' ? 'Vollständig (-15%)' : 'Anzahlung 50%');

  const html = wrapHtml('Neue Reservierung',
    '<div style="font-size:18px;font-weight:800;color:#C9762E;margin-bottom:4px;">Neue Reservierung erhalten</div>' +
    '<div style="margin-bottom:12px;color:#444448;">Ein Kunde hat gerade eine Reservierungsanfrage eingereicht.</div>' +
    SEP() +
    L('Reservierungsnr.', reservation.reservationNumber) +
    L('Kunde', esc(s(reservation.guestName))) +
    L('E-Mail', esc(s(reservation.guestEmail))) +
    L('Telefon', esc(s(reservation.guestPhone))) +
    (reservation.guestProfession ? L('Beruf', esc(s(reservation.guestProfession))) : '') +
    L('Haushalt', 'Haustier zu Hause: ' + formatBool(reservation.hasPet) + ' · Schon ein Tier verloren: ' + formatBool(reservation.hasLostPet)) +
    L('Abholart', dm) +
    SEP() +
    L('Welpe', puppy.name + ' (' + puppy.breed + ')') +
    L('Verkaufspreis', formatEuro(puppy.price)) +
    L('Zahlungsart', payLabel) +
    (reservation.discountAmount ? L('Gewährter Rabatt', '−' + formatEuro(reservation.discountAmount)) : '') +
    L('Gesamtbetrag', formatEuro(reservation.totalPrice || puppy.price)) +
    L('Zu zahlende Anzahlung', formatEuro(reservation.depositAmount || 0)) +
    (reservation.balanceAmount > 0 ? L('Offener Restbetrag', formatEuro(reservation.balanceAmount)) : '') +
    (reservation.notes ? SEP() + L('Nachricht des Kunden', esc(reservation.notes)) : '') +
    '<div style="text-align:center;margin:18px 0 8px;"><a href="' + esc(getPublicSiteUrl() + '/admin/reservations/' + reservation.id) + '" style="display:inline-block;background:#C9762E;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:11px 26px;border-radius:5px;">Reservierung ansehen</a></div>'
  );

  await sendMail({
    to: adminEmail,
    subject: `Neue Reservierung ${reservation.reservationNumber} — ${s(reservation.guestName)}`,
    html,
    text: [
      `NEUE RESERVIERUNG — PomParadies GmbH`,
      ``,
      `Ein Kunde hat gerade eine Reservierungsanfrage eingereicht.`,
      ``,
      `Reservierungsnr. : ${reservation.reservationNumber}`,
      `Kunde : ${s(reservation.guestName)}`,
      `E-Mail : ${s(reservation.guestEmail)}`,
      `Telefon : ${s(reservation.guestPhone)}`,
      `${reservation.guestProfession ? 'Beruf : ' + s(reservation.guestProfession) : ''}`,
      `Abholart : ${dm}`,
      ``,
      `Welpe : ${puppy.name} (${puppy.breed})`,
      `Verkaufspreis : ${formatEuro(puppy.price)}`,
      `Zahlungsart : ${payLabel}`,
      `${reservation.discountAmount ? 'Gewährter Rabatt : −' + formatEuro(reservation.discountAmount) : ''}`,
      `Gesamtbetrag : ${formatEuro(reservation.totalPrice || puppy.price)}`,
      `Zu zahlende Anzahlung : ${formatEuro(reservation.depositAmount || 0)}`,
      `${reservation.balanceAmount > 0 ? 'Offener Restbetrag : ' + formatEuro(reservation.balanceAmount) : ''}`,
      `${reservation.notes ? 'Nachricht des Kunden : ' + reservation.notes : ''}`,
      ``,
      `Ansehen : ${getPublicSiteUrl()}/admin/reservations/${reservation.id}`,
    ].join('\n'),
  });
}

async function sendStatusNotification({ email, name, reservationNumber, status, puppy }) {
  const statusLabels = {
    pending: 'Anfrage erhalten',
    deposit_confirmed: 'Anzahlung bestätigt',
    preparing: 'In Vorbereitung',
    ready: 'Bereit zum Abtransport',
    delivered: 'An die Familie übergeben',
    cancelled: 'Storniert',
  };
  const label = statusLabels[status] || status;

  const html = wrapHtml('Reservierungsupdate',
    '<div style="font-size:18px;font-weight:800;color:#C9762E;margin-bottom:4px;">Status Ihrer Reservierung</div>' +
    '<div style="margin-bottom:12px;color:#444448;">Hallo ' + esc(name) + ', der Status Ihrer Reservierung wurde aktualisiert.</div>' +
    SEP() +
    L('Reservierungsnr.', reservationNumber) +
    L('Neuer Status', '<span style="display:inline-block;background:rgba(201,118,46,0.1);color:#C9762E;padding:3px 10px;border-radius:4px;font-weight:700;font-size:13px;">' + esc(label) + '</span>') +
    (puppy ? L('Welpe', esc(puppy.name) + ' · ' + esc(puppy.breed)) : '') +
    '<div style="font-size:12px;color:#8A8A90;margin-top:12px;">Weitere Details finden Sie in Ihrem Verfolgungsbereich.</div>'
  );

  await sendMail({
    to: email,
    subject: `Reservierung ${reservationNumber} — ${label}`,
    html,
    text: [
      `RESERVIERUNGSSTATUS — PomParadies GmbH`,
      ``,
      `Hallo ${name},`,
      ``,
      `Der Status Ihrer Reservierung ${reservationNumber} wurde aktualisiert: ${label}`,
      ...(puppy ? [`Welpe : ${puppy.name} (${puppy.breed})`] : []),
      ``,
      `Mit freundlichen Grüßen,`,
      `PomParadies GmbH`,
      `USt-IdNr DER3201.HRB29907`,
    ].join('\n'),
  });
}

async function sendReplyToCustomer({ email, name, subject, message }) {
  const html = wrapHtml('Nachricht von Ihrem Züchter',
    '<div style="font-size:18px;font-weight:800;color:#C9762E;margin-bottom:4px;">Eine Nachricht für Sie</div>' +
    '<div style="margin-bottom:12px;color:#444448;">Hallo ' + esc(name) + ', Ihr Züchter hat Ihnen die folgende Nachricht geschickt.</div>' +
    '<div style="background:rgba(201,118,46,0.06);border:1px solid rgba(201,118,46,0.15);border-radius:6px;padding:14px 16px;margin:10px 0;font-size:14px;color:#2C1810;line-height:1.6;white-space:pre-wrap;">' + esc(message) + '</div>' +
    '<div style="font-size:12px;color:#8A8A90;margin-top:12px;">Sie können direkt auf diese E-Mail antworten, um den Austausch fortzusetzen.</div>'
  );

  await sendMail({
    to: email,
    subject: subject || 'PomParadies GmbH — Nachricht von Ihrem Züchter',
    html,
    text: [
      `NACHRICHT — PomParadies GmbH`,
      ``,
      `Hallo ${name},`,
      ``,
      `Ihr Züchter hat Ihnen die folgende Nachricht geschickt:`,
      ``,
      message,
      ``,
      `---`,
      `Sie können direkt auf diese E-Mail antworten.`,
      ``,
      `Mit freundlichen Grüßen,`,
      `PomParadies GmbH`,
      `USt-IdNr DER3201.HRB29907`,
    ].join('\n'),
  });
}

module.exports = { sendReservationConfirmation, sendAdminNotification, sendStatusNotification, sendReplyToCustomer };
