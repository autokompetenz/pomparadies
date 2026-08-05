import { Link } from 'react-router-dom';
import { useLangStore } from '../store';
import { useBreakpoint } from '../hooks';
import { t } from '../utils/i18n';

const SECTIONS = {
  fr: [
    {
      id: 'identite',
      title: 'Identité de l\u2019entreprise',
      content: `PomParadies GmbH
TVA / USt-IdNr : DER3201.HRB29907
Registre du commerce : Amtsgericht Bonn, HRB 29907

Gérante : Suzan Tolchikava
Forme juridique : GmbH (Gesellschaft mit beschränkter Haftung)
Siège social : Sebastianstraße 4, 53115 Bonn, Allemagne
Activité déclarée : commerce d'articles pour animaux (Handel mit Tierbedarf)

Contact : kontakt@pomparadiesgmbh.com
Hébergeur : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA`,
    },
    {
      id: 'privacy',
      title: 'Politique de confidentialité (RGPD)',
      sections: [
        {
          sub: '1. Responsable du traitement',
          text: 'Le responsable du traitement des données est PomParadies GmbH. Pour toute question concernant vos données, contactez-nous par email.',
        },
        {
          sub: '2. Données collectées',
          text: 'Nous collectons uniquement les données nécessaires à la gestion des réservations : nom, prénom, adresse email, numéro de téléphone et éventuellement les notes que vous nous communiquez volontairement. Nous ne collectons aucune donnée sensible (origine, santé, etc.).',
        },
        {
          sub: '3. Finalités du traitement',
          text: 'Vos données sont utilisées pour : (a) la gestion et le suivi de votre réservation ; (b) la communication relative à votre futur compagnon ; (c) le respect de nos obligations légales (registre d\'élevage, facturation).',
        },
        {
          sub: '4. Base légale',
          text: 'Le traitement repose sur l\'exécution d\'un contrat (réservation) et le respect d\'obligations légales. Le consentement est recueilli pour les cookies non essentiels via notre bannière.',
        },
        {
          sub: '5. Durée de conservation',
          text: 'Vos données sont conservées pendant toute la durée de la relation contractuelle, puis archivées 5 ans pour les obligations fiscales et légales (registre d\'élevage allemand).',
        },
        {
          sub: '6. Destinataires des données',
          text: 'Vos données ne sont jamais cédées à des tiers. Elles sont accessibles uniquement à l\'équipe de PomParadies GmbH. Les données de paiement sont traitées via notre prestataire bancaire sécurisé.',
        },
        {
          sub: '7. Transferts hors UE',
          text: 'Nos serveurs sont hébergés en Europe (UE). Aucun transfert de données hors de l\'Espace Économique Européen n\'est effectué.',
        },
        {
          sub: '8. Vos droits',
          text: 'Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, limitation, portabilité et opposition. Pour les exercer, contactez-nous par email. Nous répondons sous 30 jours maximum.',
        },
        {
          sub: '9. Cookies',
          text: 'Notre site utilise uniquement des cookies techniques nécessaires au fonctionnement du site (session, authentification admin). Aucun cookie de tracking ou publicitaire n\'est utilisé. Une bannière vous informe lors de votre première visite.',
        },
        {
          sub: '10. Réclamation',
          text: 'Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de l\'autorité de protection des données compétente pour la Rhénanie-du-Nord-Westphalie (LDI NRW) : Kavalleriestraße 2-4, 40213 Düsseldorf, Allemagne — poststelle@ldi.nrw.de.',
        },
      ],
    },
    {
      id: 'terms',
      title: 'Conditions Générales de Vente',
      sections: [
        {
          sub: '1. Objet',
          text: 'Les présentes CGV régissent la réservation et l\'achat de chiots auprès de PomParadies GmbH. Elles s\'appliquent à toute réservation effectuée via le site pomparadiesgmbh.com.',
        },
        {
          sub: '2. Réservation',
          text: 'La réservation est effectuée via le formulaire en ligne. Elle est confirmée après validation par PomParadies GmbH et paiement d\'un acompte de 30% du prix du chiot. Le numéro de réservation unique est communiqué par email et permet le suivi en ligne.',
        },
        {
          sub: '3. Prix et modalités de paiement',
          text: 'Les prix sont indiqués en euros (€), TVA en vigueur incluse. L\'acompte de 30% est à verser à la confirmation. Le solde de 70% est dû au moment de la remise du chiot, en espèces ou par virement bancaire.',
        },
        {
          sub: '4. Délai de rétractation',
          text: 'Conformément au droit allemand, le droit de rétractation de 14 jours prévu pour les contrats à distance ne s\'applique pas aux contrats portant sur la livraison d\'animaux vivants (§ 312g alinéa 2 du BGB). La réservation est donc ferme dès confirmation.',
        },
        {
          sub: '5. Annulation par le client',
          text: 'Tout acompte versé reste acquis à PomParadies GmbH en cas d\'annulation par le client, à quelque stade que ce soit. Cette clause couvre les frais de gestion, de vaccination, de vermifugation et de soins déjà engagés.',
        },
        {
          sub: '6. Annulation par l\'élevage',
          text: 'PomParadies GmbH se réserve le droit d\'annuler une réservation en cas de : problème de santé vétérinaire du chiot, décès du chiot, ou non-conformité avant le départ. Dans ces seuls cas, l\'acompte est intégralement remboursé.',
        },
        {
          sub: '7. Remise du chiot',
          text: 'Le chiot est remis à partir de l\'âge de 8 semaines révolues, conformément à la législation allemande sur la protection animale (Tierschutzgesetz, Tierschutz-Hundeverordnung). Un carnet de santé, les vaccins à jour, la puce électronique et le certificat de bonne santé vétérinaire sont fournis.',
        },
        {
          sub: '8. Santé et garantie',
          text: 'PomParadies GmbH garantit que le chiot est en bonne santé au moment de la remise, vacciné, vermifugé et identifié par puce électronique. Un certificat vétérinaire est remis. Aucune garantie n\'est donnée quant aux maladies non décelables au moment de la vente (période d\'incubation). L\'acquéreur s\'engage à faire examiner le chiot par un vétérinaire dans les 7 jours suivant la remise.',
        },
        {
          sub: '9. Transport',
          text: 'Le transport du chiot est sous l\'entière responsabilité de l\'acquéreur. PomParadies GmbH peut recommander un transporteur agréé mais décline toute responsabilité en cas de problème pendant le transport.',
        },
        {
          sub: '10. Litiges',
          text: 'Tout litige relève du droit allemand et de la compétence exclusive des tribunaux de Bonn. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.',
        },
        {
          sub: '11. Données personnelles',
          text: 'Voir notre Politique de confidentialité ci-dessus pour le traitement de vos données personnelles.',
        },
      ],
    },
  ],
  nl: [
    {
      id: 'identite',
      title: 'Identiteit van het bedrijf',
      content: `PomParadies GmbH
BTW / USt-IdNr : DER3201.HRB29907
Handelsregister : Amtsgericht Bonn, HRB 29907

Bestuurder : Suzan Tolchikava
Rechtsvorm : GmbH (Gesellschaft mit beschränkter Haftung)
Maatschappelijke zetel : Sebastianstraße 4, 53115 Bonn, Duitsland
Geregistreerde activiteit : handel in dierbenodigdheden (Handel mit Tierbedarf)

Contact : kontakt@pomparadiesgmbh.com
Hosting : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, VS`,
    },
    {
      id: 'privacy',
      title: 'Privacybeleid (AVG)',
      sections: [
        { sub: '1. Verwerkingsverantwoordelijke', text: 'De verwerkingsverantwoordelijke is PomParadies GmbH. Neem per e-mail contact met ons op voor vragen over uw gegevens.' },
        { sub: '2. Verzamelde gegevens', text: 'We verzamelen alleen de gegevens die nodig zijn voor reserveringen: naam, e-mailadres, telefoonnummer en eventuele notities die u vrijwillig verstrekt. We verzamelen geen gevoelige gegevens.' },
        { sub: '3. Doeleinden van verwerking', text: 'Uw gegevens worden gebruikt voor: (a) het beheer en de opvolging van uw reservering; (b) communicatie over uw toekomstige metgezel; (c) naleving van wettelijke verplichtingen (fokregister, facturatie).' },
        { sub: '4. Rechtsgrond', text: 'De verwerking is gebaseerd op de uitvoering van een overeenkomst (reservering) en wettelijke verplichtingen. Toestemming wordt gevraagd voor niet-essentiële cookies via onze banner.' },
        { sub: '5. Bewaartermijn', text: 'Uw gegevens worden bewaard tijdens de contractuele relatie en vervolgens 5 jaar gearchiveerd voor fiscale en wettelijke verplichtingen (Duits fokregister).' },
        { sub: '6. Ontvangers van gegevens', text: 'Uw gegevens worden nooit aan derden verstrekt. Ze zijn alleen toegankelijk voor het PomParadies GmbH-team. Betalingsgegevens worden verwerkt via onze beveiligde bankpartner.' },
        { sub: '7. Doorgifte buiten EU', text: 'Onze servers worden gehost in Europa (EU). Er vindt geen doorgifte van gegevens buiten de Europese Economische Ruimte plaats.' },
        { sub: '8. Uw rechten', text: 'Overeenkomstig de AVG heeft u recht op toegang, rectificatie, wissen, beperking, overdraagbaarheid en bezwaar. Neem per e-mail contact met ons op om deze rechten uit te oefenen. We reageren binnen maximaal 30 dagen.' },
        { sub: '9. Cookies', text: 'Onze site gebruikt alleen technische cookies die nodig zijn voor de werking (sessie, admin-authenticatie). Er worden geen tracking- of advertentiecookies gebruikt. Een banner informeert u bij uw eerste bezoek.' },
        { sub: '10. Klacht', text: 'Als u van mening bent dat uw rechten niet worden gerespecteerd, kunt u een klacht indienen bij de bevoegde gegevensbeschermingsautoriteit voor Noordrijn-Westfalen (LDI NRW): Kavalleriestraße 2-4, 40213 Düsseldorf, Duitsland — poststelle@ldi.nrw.de.' },
      ],
    },
    {
      id: 'terms',
      title: 'Algemene Verkoopvoorwaarden',
      sections: [
        { sub: '1. Toepasselijkheid', text: 'Deze voorwaarden regelen de reservering en aankoop van puppy\'s bij PomParadies GmbH. Ze zijn van toepassing op elke reservering via pomparadiesgmbh.com.' },
        { sub: '2. Reservering', text: 'De reservering wordt gemaakt via het online formulier. Ze wordt bevestigd na goedkeuring door PomParadies GmbH en betaling van een aanbetaling van 30% van de prijs van de puppy. Het unieke reserveringsnummer wordt per e-mail verstrekt voor online opvolging.' },
        { sub: '3. Prijs en betaling', text: 'Prijzen zijn in euro (€), inclusief geldende BTW. De aanbetaling van 30% is verschuldigd bij bevestiging. Het saldo van 70% is verschuldigd bij levering van de puppy, contant of per overschrijving.' },
        { sub: '4. Herroepingsrecht', text: 'Overeenkomstig het Duitse recht is het herroepingsrecht van 14 dagen voor afstandsverkopen niet van toepassing op levende dieren (§ 312g lid 2 BGB). De reservering is daarom definitief vanaf bevestiging.' },
        { sub: '5. Annulering door klant', text: 'Eventuele aanbetalingen blijven eigendom van PomParadies GmbH bij annulering door de klant, in elk stadium. Deze clausule dekt de kosten van beheer, vaccinatie, ontworming en reeds gemaakte zorgkosten.' },
        { sub: '6. Annulering door fokker', text: 'PomParadies GmbH behoudt zich het recht voor een reservering te annuleren bij: veterinair gezondheidsprobleem van de puppy, overlijden van de puppy, of non-conformiteit voor vertrek. In deze gevallen wordt de aanbetaling volledig terugbetaald.' },
        { sub: '7. Levering van de puppy', text: 'De puppy wordt geleverd vanaf de leeftijd van 8 weken, overeenkomstig de Duitse dierenwelzijnswetgeving (Tierschutzgesetz, Tierschutz-Hundeverordnung). Een gezondheidsboekje, up-to-date vaccinaties, microchip en veterinair gezondheidscertificaat worden meegegeven.' },
        { sub: '8. Gezondheid en garantie', text: 'PomParadies GmbH garandeert dat de puppy bij levering in goede gezondheid verkeert, gevaccineerd, ontwormd en geïdentificeerd is met een microchip. Een veterinair certificaat wordt overhandigd. Er wordt geen garantie gegeven voor niet-detecteerbare ziekten op het moment van verkoop (incubatieperiode). De koper moet de puppy binnen 7 dagen na levering door een dierenarts laten onderzoeken.' },
        { sub: '9. Vervoer', text: 'Het vervoer van de puppy is volledig de verantwoordelijkheid van de koper. PomParadies GmbH kan een erkende vervoerder aanbevelen maar is niet aansprakelijk voor problemen tijdens het vervoer.' },
        { sub: '10. Geschillen', text: 'Geschillen vallen onder het Duitse recht en de exclusieve bevoegdheid van de rechtbanken van Bonn. Bij een geschil wordt eerst een minnelijke schikking gezocht.' },
        { sub: '11. Privacy', text: 'Zie ons Privacybeleid hierboven voor de verwerking van uw persoonsgegevens.' },
      ],
    },
  ],
  en: [
    {
      id: 'identite',
      title: 'Company Identity',
      content: `PomParadies GmbH
VAT / USt-IdNr : DER3201.HRB29907
Commercial register : Amtsgericht Bonn, HRB 29907

Managing director : Suzan Tolchikava
Legal form : GmbH (Gesellschaft mit beschränkter Haftung)
Registered office : Sebastianstraße 4, 53115 Bonn, Germany
Declared activity : trade in pet supplies (Handel mit Tierbedarf)

Contact : kontakt@pomparadiesgmbh.com
Hosting : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA`,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy (GDPR)',
      sections: [
        { sub: '1. Data Controller', text: 'The data controller is PomParadies GmbH. For any questions regarding your data, contact us by email.' },
        { sub: '2. Data Collected', text: 'We only collect data necessary for reservation management: name, email address, phone number, and any notes you voluntarily provide. We do not collect any sensitive data.' },
        { sub: '3. Purposes of Processing', text: 'Your data is used for: (a) managing and tracking your reservation; (b) communication regarding your future companion; (c) compliance with our legal obligations (breeding register, invoicing).' },
        { sub: '4. Legal Basis', text: 'Processing is based on contract execution (reservation) and legal obligations. Consent is obtained for non-essential cookies via our banner.' },
        { sub: '5. Retention Period', text: 'Your data is kept for the duration of the contractual relationship, then archived for 5 years for tax and legal obligations (German breeding register).' },
        { sub: '6. Data Recipients', text: 'Your data is never shared with third parties. It is only accessible to the PomParadies GmbH team. Payment data is processed through our secure banking partner.' },
        { sub: '7. International Transfers', text: 'Our servers are hosted in Europe (EU). No data transfer outside the European Economic Area occurs.' },
        { sub: '8. Your Rights', text: 'Under GDPR, you have the right to access, rectify, erase, restrict, port, and object. To exercise these rights, email us. We respond within 30 days maximum.' },
        { sub: '9. Cookies', text: 'Our site only uses technical cookies necessary for operation (session, admin authentication). No tracking or advertising cookies are used. A banner informs you on your first visit.' },
        { sub: '10. Complaint', text: 'If you believe your rights are not respected, you can file a complaint with the competent data protection authority for North Rhine-Westphalia (LDI NRW): Kavalleriestraße 2-4, 40213 Düsseldorf, Germany — poststelle@ldi.nrw.de.' },
      ],
    },
    {
      id: 'terms',
      title: 'Terms and Conditions of Sale',
      sections: [
        { sub: '1. Scope', text: 'These terms govern the reservation and purchase of puppies from PomParadies GmbH. They apply to any reservation made via pomparadiesgmbh.com.' },
        { sub: '2. Reservation', text: 'Reservations are made via the online form. They are confirmed after validation by PomParadies GmbH and payment of a 30% deposit of the puppy price. A unique reservation number is provided by email for online tracking.' },
        { sub: '3. Price and Payment', text: 'Prices are in euros (€), applicable VAT included. The 30% deposit is due upon confirmation. The 70% balance is due upon puppy handover, in cash or by bank transfer.' },
        { sub: '4. Withdrawal Right', text: 'Under German law, the 14-day withdrawal right for distance contracts does not apply to contracts for the delivery of live animals (§ 312g para. 2 BGB). The reservation is therefore firm upon confirmation.' },
        { sub: '5. Cancellation by Client', text: 'Any deposit paid is retained by PomParadies GmbH in case of cancellation by the client, at any stage. This clause covers management, vaccination, deworming, and care costs already incurred.' },
        { sub: '6. Cancellation by Kennel', text: 'PomParadies GmbH reserves the right to cancel a reservation in case of: veterinary health issue of the puppy, death of the puppy, or non-compliance before departure. In these cases only, the deposit is fully refunded.' },
        { sub: '7. Puppy Handover', text: 'The puppy is handed over at a minimum of 8 weeks of age, in accordance with German animal welfare legislation (Tierschutzgesetz, Tierschutz-Hundeverordnung). A health record, up-to-date vaccinations, microchip, and veterinary health certificate are provided.' },
        { sub: '8. Health and Warranty', text: 'PomParadies GmbH guarantees the puppy is in good health at handover, vaccinated, dewormed, and identified by microchip. A veterinary certificate is provided. No warranty is given for diseases undetectable at the time of sale (incubation period). The buyer must have the puppy examined by a veterinarian within 7 days of handover.' },
        { sub: '9. Transport', text: 'Puppy transport is entirely the buyer\'s responsibility. PomParadies GmbH may recommend an approved transporter but declines any liability for issues during transport.' },
        { sub: '10. Disputes', text: 'Any dispute falls under German law and the exclusive jurisdiction of the courts of Bonn. An amicable solution will be sought before any legal action.' },
        { sub: '11. Privacy', text: 'See our Privacy Policy above regarding the processing of your personal data.' },
      ],
    },
  ],
};

function Section({ title, content, subs }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(20px,3vw,32px)', boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(18px,2.5vw,26px)', color:'var(--text)', letterSpacing:'-0.02em', marginBottom:18 }}>
        {title}
      </h2>
      {content && <pre style={{ fontFamily:'Nunito,Outfit,sans-serif', fontSize:14, color:'var(--text-2)', lineHeight:1.75, whiteSpace:'pre-wrap', wordBreak:'break-word', margin:0 }}>{content}</pre>}
      {subs && (
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {subs.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:15, color:'var(--text)', marginBottom:6, lineHeight:1.3 }}>{s.sub}</h3>
              <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.75 }}>{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Legal() {
  const { lang } = useLangStore();
  const { isMobile } = useBreakpoint();
  const l = lang || 'fr';
  const sections = SECTIONS[l] || SECTIONS.fr;

  const title = l === 'fr' ? 'Mentions légales' : l === 'nl' ? 'Wettelijke vermeldingen' : 'Legal Notices';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 76 }}>
      <div style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)', padding: isMobile ? '36px 4% 28px' : '56px 6% 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="section-eyebrow">{l === 'fr' ? 'Informations légales' : l === 'nl' ? 'Juridische informatie' : 'Legal information'}</div>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(32px,5vw,64px)', color:'var(--text)', letterSpacing:'-0.02em', marginBottom:12, lineHeight:1.05 }}>
            {title}
          </h1>
          <p style={{ fontSize:16, color:'var(--text-3)', maxWidth:520, lineHeight:1.65 }}>
            {l === 'fr' ? 'Conformité légale, protection de vos données et conditions de réservation.' :
             l === 'nl' ? 'Wettelijke conformiteit, gegevensbescherming en reserveringsvoorwaarden.' :
             'Legal compliance, data protection and reservation terms.'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '24px 4% 60px' : '40px 6% 80px', display:'flex', flexDirection:'column', gap:20 }}>
        {sections.map(section => (
          <Section key={section.id} title={section.title} content={section.content} subs={section.sections} />
        ))}
      </div>
    </div>
  );
}
