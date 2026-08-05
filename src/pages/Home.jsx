import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { puppyAPI } from '../services/api';
import { formatEuro } from '../utils/helpers';
import { useLangStore } from '../store';
import { t } from '../utils/i18n';
import { useBreakpoint } from '../hooks';
import PuppyCard from '../components/PuppyCard';

const SERVICES = [
  { icon:'🐶', title:'Rassewelpen', desc:'LOSH-Stammbaum, ausgewählte Eltern, Gesundheit garantiert.' },
  { icon:'📋', title:'Impfungen & Chip', desc:'Aktuelle Impfungen, Mikrochip, Entwurmung, Gesundheitspass.' },
  { icon:'🐶', title:'Einfache Reservierung', desc:'50% Anzahlung, Rest bei Übergabe. Kein Konto nötig.' },
  { icon:'💉', title:'Online-Verfolgung', desc:'Verfolgen Sie Ihre Reservierung in Echtzeit mit Ihrer einzigartigen Nummer.' },
  { icon:'💶', title:'Gesundheitsgarantie', desc:'Alle unsere Welpen kommen mit einem tierärztlichen Gesundheitszeugnis.' },
  { icon:'📦', title:'Lieferung möglich', desc:'Sichere Lieferung in ganz Deutschland und den Nachbarländern.' },
];

function CookieBanner() {
  const [visible, setVisible] = useState(!localStorage.getItem('sp_cookies'));
  if (!visible) return null;
  const accept  = () => { localStorage.setItem('sp_cookies', '1'); setVisible(false); };
  const decline = () => { localStorage.setItem('sp_cookies', '0'); setVisible(false); };
  return (
    <div className="cookie-banner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
      <p style={{ fontSize:14, color:'var(--text-2)', flex:1 }}>🐶 Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.</p>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={decline} style={{ padding:'9px 18px', background:'var(--bg-card2)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-3)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>Ablehnen</button>
        <button onClick={accept} className="btn-primary" style={{ fontSize:13, padding:'9px 20px' }}>Akzeptieren</button>
      </div>
    </div>
  );
}

export default function Home() {
  const { lang } = useLangStore();
  const { isMobile } = useBreakpoint();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackNum, setTrackNum] = useState('');
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const l = lang || 'fr';
  const { scrollYProgress } = useScroll({ target:heroRef, offset:['start start','end start'] });
  const heroY = useTransform(scrollYProgress, [0,1], ['0%','25%']);
  const heroO = useTransform(scrollYProgress, [0,0.7], [1,0]);

  useEffect(() => {
    setLoading(true);
    puppyAPI.getAll({ featured:'true', limit:8 })
      .then(r => { setFeatured(r.data.puppies||[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackNum.trim()) navigate(`/track/${trackNum.trim().toUpperCase()}`);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <section ref={heroRef} style={{ position:'relative', height: isMobile ? '100svh' : '100vh', minHeight:580, display:'flex', alignItems:'center', overflow:'hidden' }}>
        <motion.div style={{ position:'absolute', inset:0, y:heroY }}>
          <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1800&q=80&auto=format"
            alt="Hero" style={{ width:'100%', height:'110%', objectFit:'cover', display:'block' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.3) 100%)' }} />
        </motion.div>

        <motion.div style={{ position:'relative', zIndex:2, padding: isMobile ? '0 5%' : '0 7%', maxWidth:780, opacity:heroO }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.1 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(201,118,46,0.15)', border:'1px solid rgba(201,118,46,0.3)', borderRadius:4, padding:'7px 16px', marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#C9762E', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.8)' }}>
                {t('hero_badge', l)}
              </span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.2 }}
            style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize: isMobile ? 'clamp(38px,10vw,56px)' : 'clamp(52px,6vw,88px)', color:'#fff', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:22 }}>
            POMPARADIES<br/><span style={{ color:'#C9762E' }}>GMBH</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.35 }}
            style={{ fontSize: isMobile ? 15 : 18, color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:36, maxWidth:520 }}>
            {t('hero_subtitle', l)}
          </motion.p>

          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.5 }}
            style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <Link to="/catalog" className="btn-primary" style={{ fontSize: isMobile ? 13 : 14 }}>
              {t('hero_cta1', l)} →
            </Link>
            <Link to="/catalog" className="btn-ghost" style={{ fontSize: isMobile ? 13 : 14, borderColor:'rgba(255,255,255,0.3)', color:'rgba(255,255,255,0.85)' }}>
              {t('hero_cta2', l)}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8, duration:0.6 }}
          style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.08)', padding: isMobile ? '16px 5%' : '22px 7%', display:'flex', justifyContent:'space-around', gap:16, flexWrap:'wrap' }}>
          {[
            { value:'8+', label:t('hero_stat1', l) },
            { value:'4.9 ★', label:t('hero_stat2', l) },
            { value:'150+', label:t('hero_stat3', l) },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize: isMobile ? 22 : 30, color:'#C9762E', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize: isMobile ? 10 : 12, color:'rgba(255,255,255,0.45)', marginTop:4, fontWeight:600, letterSpacing:'0.05em' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      <div style={{ background:'var(--bg-card2)', borderBottom:'1px solid var(--border)', padding: isMobile ? '20px 5%' : '24px 7%' }}>
        <form onSubmit={handleTrack} style={{ maxWidth:640, margin:'0 auto', display:'flex', gap:10 }}>
          <input value={trackNum} onChange={e => setTrackNum(e.target.value)}
            placeholder={t('track_ph', l)}
            className="input-luxury"
            style={{ flex:1, fontSize: isMobile ? 14 : 15 }} />
          <button type="submit" className="btn-primary" style={{ padding:'13px 20px', fontSize:13, whiteSpace:'nowrap', flexShrink:0 }}>
            {t('track_order', l)}
          </button>
        </form>
      </div>

      {/* Featured puppies */}
      <section style={{ background:'var(--bg)', borderBottom:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom: isMobile ? 36 : 52 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>
              Unsere verfügbaren Welpen
            </div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,52px)', color:'var(--text)', letterSpacing:'-0.02em', lineHeight:1.05, marginBottom:12 }}>
              Verfügbar
              zur Reservierung
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(270px,1fr))', gap: isMobile ? 14 : 22 }}>
            {featured.map((p, i) => <PuppyCard key={p.id} puppy={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ background:'var(--bg-card2)', borderTop:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>{t('services_label', l)}</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,50px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
              Eine Adoption mit vollem Vertrauen
            </h2>
            <p style={{ fontSize:16, color:'var(--text-3)', marginTop:12, maxWidth:560, margin:'12px auto 0' }}>{t('services_sub', l)}</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 20 }}>
            {SERVICES.map((s, i) => {
              return (
                <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px', boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ fontSize:36, marginBottom:14 }}>{s.icon}</div>
                  <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:18, color:'var(--text)', marginBottom:8 }}>{s.title}</h3>
                  <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.65 }}>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ background:'var(--bg)', borderTop:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>{t('reviews_label', l)}</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,50px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
              Was unsere Familien sagen
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 14 : 22 }}>
            {[
              { stars:5, text:'Ein herzlicher und professioneller Empfang. Unsere kleine Luna ist in Topform!', author:'Sophie M.', city:'Köln' },
              { stars:5, text:'Seriöser Züchter, Welpen in perfekter Gesundheit. Die Ratschläge waren sehr hilfreich. Ich empfehle weiter.', author:'Thomas D.', city:'Bonn' },
              { stars:5, text:'Einfache Reservierung und einwandfreie Lieferung. Unsere Bella kam in Topform an.', author:'Maria L.', city:'Düsseldorf' },
              { stars:5, text:'Alles lief wie vereinbart. Die Betreuung vor der Lieferung war sehr beruhigend. Unser kleiner Max hat sich sofort angepasst.', author:'Peter H.', city:'Berlin' },
              { stars:5, text:'Wir haben ohne Probleme fernreserviert. Die Fotos und Videos gaben uns das Vertrauen, mit Sicherheit zu wählen.', author:'Karin V.', city:'München' },
              { stars:5, text:'Top-Lieferservice! Unser Welpe kam in perfekter Gesundheit mit allen Dokumenten an. Vielen Dank.', author:'Jens R.', city:'Hamburg' },
              { stars:5, text:'Vielen Dank für Ihre Professionalität. Die Online-Reservierung war einfach und die Kommunikation während des gesamten Ablaufs klar.', author:'Annika K.', city:'Frankfurt' },
              { stars:5, text:'Unsere kleine Nala ist ein Schatz. Dank der erhaltenen Ratschläge war alles für ihre Ankunft vorbereitet. Perfekte Lieferung.', author:'Marco D.', city:'Stuttgart' },
              { stars:5, text:'Sehr zufrieden mit unserer Erfahrung. Der Preis war klar, ohne Überraschungen. Unser Welpe war genau wie auf der Website beschrieben.', author:'Laura B.', city:'Leipzig' },
              { stars:5, text:'Die Lieferung wurde schnell nach der Reservierung organisiert. Unser kleiner Begleiter ist kerngesund und schon sehr anhänglich.', author:'Stefan T.', city:'Dortmund' },
              { stars:4, text:'Sehr guter Kontakt zum Züchter. Die Lieferung hatte etwas Verspätung, aber der Welpe war in Topform. Zufrieden.', author:'Nadine F.', city:'Essen' },
              { stars:4, text:'Einfach und schnell reserviert. Ein kleines Kommunikationsproblem beim Lieferdatum, aber alles hat sich gut geregelt.', author:'Jonathan W.', city:'Bremen' },
              { stars:4, text:'Welpe wie auf den Fotos und in der Beschreibung. Ein Stern Abzug, weil der Transport für ihn etwas stressig war.', author:'Sebastian G.', city:'Dresden' },
              { stars:4, text:'Gute Gesamterfahrung. Die Reservierung lief gut und der Welpe ist wunderschön. Ein paar Tage Eingewöhnung nötig.', author:'Valerie M.', city:'Hannover' },
              { stars:4, text:'Angenehmer Kontakt und ein gesunder Welpe. Die Nachbetreuung war begrenzt, aber das Notwendige wurde erledigt.', author:'Damian P.', city:'Nürnberg' },
              { stars:4, text:'Sorgfältige Lieferung und gut sozialisierter Welpe. Wir hätten vor der Reservierung gerne mehr Fotos gesehen.', author:'Kathrin L.', city:'Freiburg' },
              { stars:4, text:'Insgesamt ist alles gut gelaufen. Der Welpe ist gesund und wir sind begeistert. Die Lieferung war etwas spät.', author:'Franz X.', city:'Münster' },
              { stars:3, text:'Welpe wie versprochen, aber die Lieferung war schwer zu organisieren. Mehrere Verschiebungen. Zum Glück endete alles gut.', author:'Isabel R.', city:'Karlsruhe' },
              { stars:3, text:'Mit dem Welpen zufrieden, aber die Kommunikation vor der Lieferung könnte besser sein. Ich musste mehrmals nachfragen.', author:'Lukas B.', city:'Mainz' },
              { stars:3, text:'Der Welpe ist gesund und entspricht der Beschreibung. Der Reservierungsprozess war in Ordnung, aber nichts Besonderes. Lieferung ok.', author:'Patrick S.', city:'Aachen' },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                  {Array.from({length:5}).map((_,j)=><span key={j} style={{ color:j<r.stars?'#FFAA00':'var(--border-2)', fontSize:18 }}>★ </span>)}
                </div>
                <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.7, marginBottom:16 }}>"{r.text}"</p>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{r.author}</p>
                <p style={{ fontSize:11, color:'var(--text-3)' }}>{r.city}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <CookieBanner />
    </div>
  );
}
