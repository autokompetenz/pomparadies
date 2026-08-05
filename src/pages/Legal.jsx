import { Link } from 'react-router-dom';
import { useBreakpoint } from '../hooks';

const SECTIONS = [
  {
    id: 'identite',
    title: 'Identität des Unternehmens',
    content: `PomParadies GmbH
USt-IdNr : DER3201.HRB29907
Handelsregister : Amtsgericht Bonn, HRB 29907

Geschäftsführerin : Suzan Tolchikava
Rechtsform : GmbH (Gesellschaft mit beschränkter Haftung)
Sitz : Sebastianstraße 4, 53115 Bonn, Deutschland
Erklärte Tätigkeit : Handel mit Tierbedarf

Kontakt : kontakt@pomparadiesgmbh.com
Hosting : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA`,
  },
  {
    id: 'privacy',
    title: 'Datenschutzerklärung (DSGVO)',
    sections: [
      {
        sub: '1. Verantwortlicher',
        text: 'Verantwortlicher für die Datenverarbeitung ist die PomParadies GmbH. Bei Fragen zu Ihren Daten kontaktieren Sie uns bitte per E-Mail.',
      },
      {
        sub: '2. Erhobene Daten',
        text: 'Wir erheben nur die für die Verwaltung von Reservierungen notwendigen Daten: Name, E-Mail-Adresse, Telefonnummer sowie gegebenenfalls die Notizen, die Sie uns freiwillig mitteilen. Wir erheben keine sensiblen Daten.',
      },
      {
        sub: '3. Zwecke der Verarbeitung',
        text: 'Ihre Daten werden verwendet für: (a) die Verwaltung und Verfolgung Ihrer Reservierung; (b) die Kommunikation bezüglich Ihres zukünftigen Begleiters; (c) die Erfüllung unserer gesetzlichen Pflichten (Zuchtregister, Rechnungsstellung).',
      },
      {
        sub: '4. Rechtsgrundlage',
        text: 'Die Verarbeitung beruht auf der Erfüllung eines Vertrags (Reservierung) und der Einhaltung gesetzlicher Pflichten. Für nicht notwendige Cookies wird über unser Banner eine Einwilligung eingeholt.',
      },
      {
        sub: '5. Speicherdauer',
        text: 'Ihre Daten werden für die Dauer der Vertragsbeziehung gespeichert und anschließend 5 Jahre für steuerliche und gesetzliche Pflichten (deutsches Zuchtregister) archiviert.',
      },
      {
        sub: '6. Empfänger der Daten',
        text: 'Ihre Daten werden niemals an Dritte weitergegeben. Sie sind nur für das Team der PomParadies GmbH zugänglich. Zahlungsdaten werden über unseren sicheren Zahlungsdienstleister verarbeitet.',
      },
      {
        sub: '7. Übermittlung außerhalb der EU',
        text: 'Unsere Server werden in Europa (EU) gehostet. Es findet keine Übermittlung von Daten außerhalb des Europäischen Wirtschaftsraums statt.',
      },
      {
        sub: '8. Ihre Rechte',
        text: 'Gemäß DSGVO haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Zur Ausübung dieser Rechte kontaktieren Sie uns per E-Mail. Wir antworten innerhalb von maximal 30 Tagen.',
      },
      {
        sub: '9. Cookies',
        text: 'Unsere Website verwendet nur technisch notwendige Cookies (Session, Admin-Authentifizierung). Es werden keine Tracking- oder Werbe-Cookies verwendet. Ein Banner informiert Sie bei Ihrem ersten Besuch.',
      },
      {
        sub: '10. Beschwerde',
        text: 'Wenn Sie der Ansicht sind, dass Ihre Rechte nicht respektiert werden, können Sie eine Beschwerde bei der zuständigen Datenschutzaufsichtsbehörde für Nordrhein-Westfalen (LDI NRW) einreichen: Kavalleriestraße 2-4, 40213 Düsseldorf, Deutschland — poststelle@ldi.nrw.de.',
      },
    ],
  },
  {
    id: 'terms',
    title: 'Allgemeine Geschäftsbedingungen',
    sections: [
      {
        sub: '1. Geltungsbereich',
        text: 'Diese AGB regeln die Reservierung und den Kauf von Welpen bei der PomParadies GmbH. Sie gelten für jede Reservierung über pomparadiesgmbh.com.',
      },
      {
        sub: '2. Reservierung',
        text: 'Die Reservierung erfolgt über das Online-Formular. Sie wird nach Bestätigung durch die PomParadies GmbH und Zahlung einer Anzahlung von 30% des Welpenpreises verbindlich. Eine eindeutige Reservierungsnummer wird per E-Mail mitgeteilt und ermöglicht die Online-Verfolgung.',
      },
      {
        sub: '3. Preis und Zahlungsbedingungen',
        text: 'Die Preise sind in Euro (€) angegeben und enthalten die geltende Mehrwertsteuer. Die Anzahlung von 30% ist bei Bestätigung fällig. Der Restbetrag von 70% ist bei der Übergabe des Welpen fällig, in bar oder per Überweisung.',
      },
      {
        sub: '4. Widerrufsrecht',
        text: 'Nach deutschem Recht gilt das 14-tägige Widerrufsrecht für Fernabsatzverträge nicht für Verträge zur Lieferung von lebenden Tieren (§ 312g Abs. 2 BGB). Die Reservierung ist daher ab Bestätigung verbindlich.',
      },
      {
        sub: '5. Stornierung durch den Kunden',
        text: 'Bei Stornierung durch den Kunden, in welchem Stadium auch immer, verbleibt die geleistete Anzahlung bei der PomParadies GmbH. Diese Klausel deckt die bereits angefallenen Kosten für Verwaltung, Impfung, Entwurmung und Pflege ab.',
      },
      {
        sub: '6. Stornierung durch den Zuchtbetrieb',
        text: 'Die PomParadies GmbH behält sich das Recht vor, eine Reservierung zu stornieren bei: tierärztlichem Gesundheitsproblem des Welpen, Tod des Welpen oder Nichteinhaltung vor dem Abtransport. Nur in diesen Fällen wird die Anzahlung vollständig erstattet.',
      },
      {
        sub: '7. Übergabe des Welpen',
        text: 'Der Welpe wird ab einem Alter von 8 Wochen übergeben, gemäß der deutschen Tierschutzgesetzgebung (Tierschutzgesetz, Tierschutz-Hundeverordnung). Ein Gesundheitspass, aktuelle Impfungen, der Mikrochip und das tierärztliche Gesundheitszeugnis werden mitgegeben.',
      },
      {
        sub: '8. Gesundheit und Garantie',
        text: 'Die PomParadies GmbH garantiert, dass der Welpe bei der Übergabe gesund, geimpft, entwurmt und per Mikrochip gekennzeichnet ist. Ein tierärztliches Zeugnis wird übergeben. Für zum Zeitpunkt des Verkaufs nicht erkennbare Krankheiten (Inkubationszeit) wird keine Garantie übernommen. Der Käufer verpflichtet sich, den Welpen innerhalb von 7 Tagen nach der Übergabe von einem Tierarzt untersuchen zu lassen.',
      },
      {
        sub: '9. Transport',
        text: 'Der Transport des Welpen liegt in der alleinigen Verantwortung des Käufers. Die PomParadies GmbH kann einen zugelassenen Transporteur empfehlen, übernimmt jedoch keine Haftung bei Problemen während des Transports.',
      },
      {
        sub: '10. Streitigkeiten',
        text: 'Für alle Streitigkeiten gilt deutsches Recht und der ausschließliche Gerichtsstand der Gerichte in Bonn. Vor einer gerichtlichen Klage wird eine gütliche Einigung angestrebt.',
      },
      {
        sub: '11. Personendaten',
        text: 'Für die Verarbeitung Ihrer personenbezogenen Daten siehe unsere Datenschutzerklärung oben.',
      },
    ],
  },
];

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
  const { isMobile } = useBreakpoint();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 76 }}>
      <div style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)', padding: isMobile ? '36px 4% 28px' : '56px 6% 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="section-eyebrow">Rechtliche Informationen</div>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(32px,5vw,64px)', color:'var(--text)', letterSpacing:'-0.02em', marginBottom:12, lineHeight:1.05 }}>
            Impressum
          </h1>
          <p style={{ fontSize:16, color:'var(--text-3)', maxWidth:520, lineHeight:1.65 }}>
            Rechtliche Konformität, Schutz Ihrer Daten und Reservierungsbedingungen.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '24px 4% 60px' : '40px 6% 80px', display:'flex', flexDirection:'column', gap:20 }}>
        {SECTIONS.map(section => (
          <Section key={section.id} title={section.title} content={section.content} subs={section.sections} />
        ))}
      </div>
    </div>
  );
}
