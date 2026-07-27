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
const FROM   = `"${process.env.FROM_NAME || 'ANIMAL CONCEPT SRL'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`;

function getPublicSiteUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  return 'https://animalconceptsrl.com';
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
<td><span style="font-size:17px;font-weight:800;color:#2C1810;">ANIMAL CONCEPT SRL</span><br><span style="font-size:9px;letter-spacing:0.25em;color:#C9762E;text-transform:uppercase;">Oupeye · Belgique</span></td>
<td align="right"><span style="display:inline-block;width:36px;height:36px;background:#C9762E;border-radius:6px;line-height:36px;text-align:center;font-size:16px;">🐶</span></td>
</tr></table>
</td></tr>
<tr><td style="padding:6px 28px 0;"><div style="height:1px;background:rgba(44,24,16,0.07);"></div></td></tr>
<tr><td style="padding:14px 28px 10px;font-size:14px;color:#2C1810;line-height:1.5;">${content}</td></tr>
<tr><td style="padding:12px 28px 18px;background:#faf7f2;border-top:1px solid rgba(44,24,16,0.07);"><span style="font-size:11px;color:#6B5B4F;line-height:1.5;">
<strong style="color:#2C1810;">ANIMAL CONCEPT SRL</strong><br>TVA BE0871.492.738<br>
<a href="${getPublicSiteUrl()}" style="color:#C9762E;text-decoration:none;">animalconceptsrl.com</a></span></td></tr>
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
      'X-Mailer': 'ANIMAL CONCEPT SRL Mailer v1',
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
  if (val === true || val === 'true') return 'Oui';
  if (val === false || val === 'false') return 'Non';
  return '—';
}

async function sendReservationConfirmation({ email, name, reservation, puppy }) {
  const pn = puppy.name + ' · ' + puppy.breed;
  const url = getPublicSiteUrl() + '/track/' + reservation.reservationNumber;

  const html = wrapHtml('Confirmation de réservation',
    '<div style="font-size:18px;font-weight:800;color:#C9762E;margin-bottom:4px;">Votre réservation est enregistrée</div>' +
    '<div style="margin-bottom:12px;color:#444448;">Nous avons bien reçu votre demande. Voici le récapitulatif de votre réservation.</div>' +
    SEP() +
    L('N° de réservation', reservation.reservationNumber) +
    L('Chiot', pn) +
    L('Prix de vente', formatEuro(puppy.price)) +
    SEP() +
    L('Coordonnées', (reservation.guestPhone || '—')) +
    L('Situation familiale', 'Animal à la maison : ' + formatBool(reservation.hasPet) + ' · Déjà perdu un animal : ' + formatBool(reservation.hasLostPet)) +
    SEP() +
    L('Acompte à régler', formatEuro(reservation.depositAmount || 0)) +
    (reservation.balanceAmount > 0 ? L('Solde à régler', formatEuro(reservation.balanceAmount)) : '') +
    L('Montant total', formatEuro(reservation.totalPrice || puppy.price)) +
    (reservation.notes ? SEP() + L('Votre message', esc(reservation.notes)) : '') +
    '<div style="text-align:center;margin:18px 0 8px;"><a href="' + esc(url) + '" style="display:inline-block;background:#C9762E;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:11px 26px;border-radius:5px;">Suivre ma réservation</a></div>' +
    '<div style="font-size:12px;color:#8A8A90;text-align:center;margin-top:6px;">En cas de question, répondez directement à cet email.</div>'
  );

  await sendMail({
    to: email,
    subject: `Confirmation de réservation ${reservation.reservationNumber} — ANIMAL CONCEPT SRL`,
    html,
    text: [
      `CONFIRMATION DE RÉSERVATION — ANIMAL CONCEPT SRL`,
      ``,
      `Bonjour ${name},`,
      ``,
      `Nous avons bien reçu votre demande de réservation. Voici le récapitulatif :`,
      ``,
      `N° de réservation : ${reservation.reservationNumber}`,
      `Chiot : ${puppy.name} (${puppy.breed})`,
      `Prix de vente : ${formatEuro(puppy.price)}`,
      ``,
      `Acompte à régler : ${formatEuro(reservation.depositAmount || 0)}`,
      `${reservation.balanceAmount > 0 ? 'Solde à régler : ' + formatEuro(reservation.balanceAmount) : ''}`,
      `Montant total : ${formatEuro(reservation.totalPrice || puppy.price)}`,
      ``,
      `Suivre votre réservation : ${url}`,
      ``,
      `En cas de question, répondez directement à cet email.`,
      ``,
      `Cordialement,`,
      `ANIMAL CONCEPT SRL`,
      `TVA BE0871.492.738`,
    ].join('\n'),
  });
}

async function sendAdminNotification({ reservation, puppy }) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  const s = (v) => v || '—';
  const dm = reservation.deliveryMethod === 'delivery' ? 'Livraison' : 'Retrait sur place';
  const payLabel = reservation.paymentLabel || (reservation.paymentMethod === 'full' ? 'Intégral (-15%)' : 'Acompte 50%');

  const html = wrapHtml('Nouvelle réservation',
    '<div style="font-size:18px;font-weight:800;color:#C9762E;margin-bottom:4px;">Nouvelle réservation reçue</div>' +
    '<div style="margin-bottom:12px;color:#444448;">Un client vient de soumettre une demande de réservation.</div>' +
    SEP() +
    L('N° de réservation', reservation.reservationNumber) +
    L('Client', esc(s(reservation.guestName))) +
    L('Email', esc(s(reservation.guestEmail))) +
    L('Téléphone', esc(s(reservation.guestPhone))) +
    (reservation.guestProfession ? L('Profession', esc(s(reservation.guestProfession))) : '') +
    L('Situation familiale', 'Animal à la maison : ' + formatBool(reservation.hasPet) + ' · Déjà perdu un animal : ' + formatBool(reservation.hasLostPet)) +
    L('Mode de retrait', dm) +
    SEP() +
    L('Chiot', puppy.name + ' (' + puppy.breed + ')') +
    L('Prix de vente', formatEuro(puppy.price)) +
    L('Mode de paiement', payLabel) +
    (reservation.discountAmount ? L('Remise appliquée', '−' + formatEuro(reservation.discountAmount)) : '') +
    L('Montant total', formatEuro(reservation.totalPrice || puppy.price)) +
    L('Acompte à régler', formatEuro(reservation.depositAmount || 0)) +
    (reservation.balanceAmount > 0 ? L('Solde à régler', formatEuro(reservation.balanceAmount)) : '') +
    (reservation.notes ? SEP() + L('Message du client', esc(reservation.notes)) : '') +
    '<div style="text-align:center;margin:18px 0 8px;"><a href="' + esc(getPublicSiteUrl() + '/admin/reservations/' + reservation.id) + '" style="display:inline-block;background:#C9762E;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:11px 26px;border-radius:5px;">Consulter la réservation</a></div>'
  );

  await sendMail({
    to: adminEmail,
    subject: `Nouvelle réservation ${reservation.reservationNumber} — ${s(reservation.guestName)}`,
    html,
    text: [
      `NOUVELLE RÉSERVATION — ANIMAL CONCEPT SRL`,
      ``,
      `Un client vient de soumettre une demande de réservation.`,
      ``,
      `N° de réservation : ${reservation.reservationNumber}`,
      `Client : ${s(reservation.guestName)}`,
      `Email : ${s(reservation.guestEmail)}`,
      `Téléphone : ${s(reservation.guestPhone)}`,
      `${reservation.guestProfession ? 'Profession : ' + s(reservation.guestProfession) : ''}`,
      `Mode de retrait : ${dm}`,
      ``,
      `Chiot : ${puppy.name} (${puppy.breed})`,
      `Prix de vente : ${formatEuro(puppy.price)}`,
      `Mode de paiement : ${payLabel}`,
      `${reservation.discountAmount ? 'Remise appliquée : −' + formatEuro(reservation.discountAmount) : ''}`,
      `Montant total : ${formatEuro(reservation.totalPrice || puppy.price)}`,
      `Acompte à régler : ${formatEuro(reservation.depositAmount || 0)}`,
      `${reservation.balanceAmount > 0 ? 'Solde à régler : ' + formatEuro(reservation.balanceAmount) : ''}`,
      `${reservation.notes ? 'Message du client : ' + reservation.notes : ''}`,
      ``,
      `Consulter : ${getPublicSiteUrl()}/admin/reservations/${reservation.id}`,
    ].join('\n'),
  });
}

async function sendStatusNotification({ email, name, reservationNumber, status, puppy }) {
  const statusLabels = {
    pending: 'Demande reçue',
    deposit_confirmed: 'Acompte confirmé',
    preparing: 'En préparation',
    ready: 'Prêt à partir',
    delivered: 'Remis à la famille',
    cancelled: 'Annulée',
  };
  const label = statusLabels[status] || status;

  const html = wrapHtml('Mise à jour de réservation',
    '<div style="font-size:18px;font-weight:800;color:#C9762E;margin-bottom:4px;">Suivi de votre réservation</div>' +
    '<div style="margin-bottom:12px;color:#444448;">Bonjour ' + esc(name) + ', le statut de votre réservation a évolué.</div>' +
    SEP() +
    L('N° de réservation', reservationNumber) +
    L('Nouveau statut', '<span style="display:inline-block;background:rgba(201,118,46,0.1);color:#C9762E;padding:3px 10px;border-radius:4px;font-weight:700;font-size:13px;">' + esc(label) + '</span>') +
    (puppy ? L('Chiot', esc(puppy.name) + ' · ' + esc(puppy.breed)) : '') +
    '<div style="font-size:12px;color:#8A8A90;margin-top:12px;">Pour plus de détails, consultez votre espace de suivi.</div>'
  );

  await sendMail({
    to: email,
    subject: `Réservation ${reservationNumber} — ${label}`,
    html,
    text: [
      `SUIVI DE RÉSERVATION — ANIMAL CONCEPT SRL`,
      ``,
      `Bonjour ${name},`,
      ``,
      `Le statut de votre réservation ${reservationNumber} a évolué : ${label}`,
      ...(puppy ? [`Chiot : ${puppy.name} (${puppy.breed})`] : []),
      ``,
      `Cordialement,`,
      `ANIMAL CONCEPT SRL`,
      `TVA BE0871.492.738`,
    ].join('\n'),
  });
}

async function sendReplyToCustomer({ email, name, subject, message }) {
  const html = wrapHtml('Message de votre éleveur',
    '<div style="font-size:18px;font-weight:800;color:#C9762E;margin-bottom:4px;">Un message pour vous</div>' +
    '<div style="margin-bottom:12px;color:#444448;">Bonjour ' + esc(name) + ', votre éleveur vous a envoyé le message ci-dessous.</div>' +
    '<div style="background:rgba(201,118,46,0.06);border:1px solid rgba(201,118,46,0.15);border-radius:6px;padding:14px 16px;margin:10px 0;font-size:14px;color:#2C1810;line-height:1.6;white-space:pre-wrap;">' + esc(message) + '</div>' +
    '<div style="font-size:12px;color:#8A8A90;margin-top:12px;">Vous pouvez répondre directement à cet email pour poursuivre l\'échange.</div>'
  );

  await sendMail({
    to: email,
    subject: subject || 'ANIMAL CONCEPT SRL — Message de votre éleveur',
    html,
    text: [
      `MESSAGE — ANIMAL CONCEPT SRL`,
      ``,
      `Bonjour ${name},`,
      ``,
      `Votre éleveur vous a envoyé le message suivant :`,
      ``,
      message,
      ``,
      `---`,
      `Vous pouvez répondre directement à cet email.`,
      ``,
      `Cordialement,`,
      `ANIMAL CONCEPT SRL`,
      `TVA BE0871.492.738`,
    ].join('\n'),
  });
}

module.exports = { sendReservationConfirmation, sendAdminNotification, sendStatusNotification, sendReplyToCustomer };
