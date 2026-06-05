import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

/* ============================================================ */
/*  i18n.jsx — minimal language context for Clinic 6              */
/*  EN (English) · FR (Français) · SW (Swahili)                  */
/* ============================================================ */

const STORAGE_KEY = 'clinic6.lang'

export const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'sw', label: 'SW', name: 'Kiswahili' },
]

/* ---------- Translation dictionary ---------- */
const DICT = {
  en: {
    'brand.location': 'Kakuma · Turkana County',
    'nav.home':        'Home',
    'nav.story':       'Our Story',
    'nav.mission':     'Mission',
    'nav.seating':     'Seating',
    'nav.media':       'Media',
    'nav.donate':      'Donate',
    'nav.giveNow':     'Give Now',

    'hero.eyebrow':    'Kakuma · Turkana County · Kenya',
    'hero.headline':   'From the Shade of a Tree to a Sanctuary of Hope.',
    'hero.sub':
      'Founded by 4 families in 2013, Clinic6 SDA Church has grown into a mosaic of 868 souls. Help us replace our storm-destroyed shelter with a permanent house of God.',
    'hero.cta.give':   'Partner with Our Mission',
    'hero.cta.story':  'Read Our Story',

    'footer.hierarchy.title':   'Administrative Hierarchy',
    'footer.tier.localLabel':   'Local Oversight',
    'footer.tier.stationLabel': 'Field Station',
    'footer.tier.fieldLabel':   'Conference / Audit',
    'footer.payment.title':     'Payment Quick-Links',
    'footer.payment.paybill':   'M-Pesa Paybill',
    'footer.payment.account':   'Account Number',
    'footer.tithe.label':       'Tithe Disclosure:',
    'footer.tithe.text':
      'Freewill offerings only. Tithes are returned through official Field channels.',
    'footer.copyright':         '© 2026 SDA Church Clinic 6 — All Rights Reserved',

    // LandingPage new keys
    'stats.members': 'Members',
    'stats.founded': 'Founded',
    'stats.daughterChurches': 'Daughter Churches',
    'stats.approved': 'Approved',
    'stats.riftValleyField': 'Rift Valley Field',

    'story.imageAlt': 'Clinic6 church current state — storm damaged structure',
    'story.currentState': 'Current State · 2026',
    'story.urgentNeed': 'History & Urgent Need',
    'story.headline': 'A Faith Refined by Fire and Rain.',
    'story.body1': 'In 2013, four refugee families from Burundi and DRC began worshipping under a single tree in Kakuma 3. From mud seats',
    'story.body2': 'and branch walls',
    'story.body3': 'we grew. Last month, dangerous desert rains destroyed our temporary structure. We are now rising to build with heavy-duty metal poles and high-gauge iron—a durable sanctuary designed for the Turkana sun.',
    'story.foundedUnderTree': 'Founded under a tree',
    'story.foundingFamilies': 'Founding families',
    'story.stormDestroyed': 'Storm destroyed',

    'vision.beyondSanctuary': 'Beyond the Sanctuary',
    'vision.fivePillars': 'Five pillars that extend the gospel into daily life.',
    'vision.school.title': 'Primary / Nursery School',
    'vision.school.copy': 'Foundational, faith-anchored education for refugee and host-community children from earliest years upward.',
    'vision.health.title': 'Health Facility',
    'vision.health.copy': 'An on-site clinic delivering compassionate, dignified care to a community currently underserved by medical infrastructure.',
    'vision.home.title': 'Agape Home for Separated Children',
    'vision.home.copy': 'A safe, Christ-centred refuge providing shelter and family for children separated from their parents during displacement.',
    'vision.vocational.title': 'Vocational Center for Vulnerable Youth',
    'vision.vocational.copy': 'Hands-on training in trades and life-skills, equipping at-risk youth to rebuild their futures with dignity and self-reliance.',
    'vision.pa.title': 'Global Proclamation PA System',
    'vision.pa.copy': 'A reliable audio infrastructure to broadcast services, evangelism, and emergency information across the camp and beyond.',

    'give.partnerWith': 'Partner With Clinic6',
    'give.giftTurnsPrayer': 'Your gift turns prayer into permanence.',
    'give.everyContribution': 'Every contribution is received through verified Clinic6 SDA Church accounts and audited by the general treasury.',
    'give.viewChannels': 'View Giving Channels',
    'give.sponsorSeat': 'Sponsor a Seat',
  },

  fr: {
    'brand.location': 'Kakuma · Comté de Turkana',
    'nav.home':       'Accueil',
    'nav.story':      'Notre Histoire',
    'nav.mission':    'Mission',
    'nav.seating':    'Sièges',
    'nav.media':      'Média',
    'nav.donate':     'Faire un Don',
    'nav.giveNow':    'Donner',

    'hero.eyebrow':   'Kakuma · Comté de Turkana · Kenya',
    'hero.headline':  "De l'Ombre d'un Arbre à un Sanctuaire d'Espérance.",
    'hero.sub':
      "Fondée par 4 familles en 2013, l'église adventiste Clinic 6 réunit aujourd'hui 868 âmes. Aidez-nous à remplacer notre abri détruit par la tempête par une véritable maison de Dieu.",
    'hero.cta.give':  'Soutenir Notre Mission',
    'hero.cta.story': 'Lire Notre Histoire',

    'footer.hierarchy.title':   'Hiérarchie Administrative',
    'footer.tier.localLabel':   'Supervision Locale',
    'footer.tier.stationLabel': 'Station de Terrain',
    'footer.tier.fieldLabel':   'Conférence / Audit',
    'footer.payment.title':     'Liens de Paiement',
    'footer.payment.paybill':   'Paybill M-Pesa',
    'footer.payment.account':   'Numéro de Compte',
    'footer.tithe.label':       'Avis de Dîme :',
    'footer.tithe.text':
      "Offrandes volontaires uniquement. Les dîmes sont remises par les canaux officiels du Champ.",
    'footer.copyright':         '© 2026 SDA Church Clinic 6 — Tous droits réservés',

    // LandingPage new keys (French placeholders)
    'stats.members': 'Membres',
    'stats.founded': 'Fondé',
    'stats.daughterChurches': 'Églises filles',
    'stats.approved': 'Approuvé',
    'stats.riftValleyField': 'Rift Valley Field',

    'story.imageAlt': 'État actuel de l’église Clinic6 — structure endommagée',
    'story.currentState': 'État actuel · 2026',
    'story.urgentNeed': 'Histoire & Besoin urgent',
    'story.headline': 'Une foi affinée par le feu et la pluie.',
    'story.body1': 'En 2013, quatre familles de réfugiés du Burundi et de la RDC ont commencé à adorer sous un arbre à Kakuma 3. Des sièges en boue',
    'story.body2': 'et des murs de branches',
    'story.body3': 'nous avons grandi. Le mois dernier, de dangereuses pluies désertiques ont détruit notre structure temporaire. Nous nous relevons maintenant pour construire avec des poteaux métalliques robustes et du fer épais — un sanctuaire durable conçu pour le soleil du Turkana.',
    'story.foundedUnderTree': 'Fondé sous un arbre',
    'story.foundingFamilies': 'Familles fondatrices',
    'story.stormDestroyed': 'Détruit par la tempête',

    'vision.beyondSanctuary': 'Au-delà du sanctuaire',
    'vision.fivePillars': 'Cinq piliers qui étendent l’évangile dans la vie quotidienne.',
    'vision.school.title': 'École primaire / maternelle',
    'vision.school.copy': 'Éducation fondamentale, ancrée dans la foi, pour les enfants réfugiés et de la communauté hôte dès le plus jeune âge.',
    'vision.health.title': 'Centre de santé',
    'vision.health.copy': 'Une clinique sur place offrant des soins compatissants et dignes à une communauté actuellement mal desservie par les infrastructures médicales.',
    'vision.home.title': 'Maison Agape pour enfants séparés',
    'vision.home.copy': 'Un refuge sûr, centré sur le Christ, offrant abri et famille aux enfants séparés de leurs parents lors du déplacement.',
    'vision.vocational.title': 'Centre de formation professionnelle pour jeunes vulnérables',
    'vision.vocational.copy': 'Formation pratique aux métiers et compétences de vie, permettant aux jeunes à risque de reconstruire leur avenir avec dignité et autonomie.',
    'vision.pa.title': 'Système de sonorisation de proclamation mondiale',
    'vision.pa.copy': 'Une infrastructure audio fiable pour diffuser les services, l’évangélisation et les informations d’urgence dans le camp et au-delà.',

    'give.partnerWith': 'Soutenir Clinic6',
    'give.giftTurnsPrayer': 'Votre don transforme la prière en permanence.',
    'give.everyContribution': 'Chaque contribution est reçue via les comptes vérifiés de l’église Clinic6 SDA et auditée par le trésorier général.',
    'give.viewChannels': 'Voir les canaux de don',
    'give.sponsorSeat': 'Parrainer un siège',
  },

  sw: {
    'brand.location': 'Kakuma · Kaunti ya Turkana',
    'nav.home':       'Nyumbani',
    'nav.story':      'Hadithi Yetu',
    'nav.mission':    'Misheni',
    'nav.seating':    'Viti',
    'nav.media':      'Vyombo',
    'nav.donate':     'Changia',
    'nav.giveNow':    'Toa Sasa',

    'hero.eyebrow':   'Kakuma · Kaunti ya Turkana · Kenya',
    'hero.headline':  'Kutoka Kivuli cha Mti hadi Hekalu la Tumaini.',
    'hero.sub':
      'Ilianzishwa na familia 4 mwaka 2013, Kanisa la SDA Clinic 6 sasa lina kundi la roho 868. Tusaidie kujenga nyumba ya kudumu ya Mungu badala ya hema iliyoharibika na dhoruba.',
    'hero.cta.give':  'Shirikiana Nasi',
    'hero.cta.story': 'Soma Hadithi Yetu',

    'footer.hierarchy.title':   'Mfumo wa Uongozi',
    'footer.tier.localLabel':   'Usimamizi wa Eneo',
    'footer.tier.stationLabel': 'Kituo cha Uwanjani',
    'footer.tier.fieldLabel':   'Kongamano / Ukaguzi',
    'footer.payment.title':     'Njia za Kutoa',
    'footer.payment.paybill':   'Paybill ya M-Pesa',
    'footer.payment.account':   'Nambari ya Akaunti',
    'footer.tithe.label':       'Tangazo la Zaka:',
    'footer.tithe.text':
      'Sadaka za hiari pekee. Zaka hurejeshwa kupitia njia rasmi za Field.',
    'footer.copyright':         '© 2026 SDA Church Clinic 6 — Haki Zote Zimehifadhiwa',

    // LandingPage new keys (Swahili placeholders)
    'stats.members': 'Wanachama',
    'stats.founded': 'Ilianzishwa',
    'stats.daughterChurches': 'Makanisa tanzu',
    'stats.approved': 'Imethibitishwa',
    'stats.riftValleyField': 'Rift Valley Field',

    'story.imageAlt': 'Hali ya sasa ya kanisa la Clinic6 — muundo uliodhurika',
    'story.currentState': 'Hali ya sasa · 2026',
    'story.urgentNeed': 'Historia & Uhitaji wa dharura',
    'story.headline': 'Imani iliyochomwa na moto na mvua.',
    'story.body1': 'Mnamo 2013, familia nne za wakimbizi kutoka Burundi na DRC walianza kuabudu chini ya mti mmoja Kakuma 3. Kutoka kwenye viti vya udongo',
    'story.body2': 'na kuta za matawi',
    'story.body3': 'tulikua. Mwezi uliopita, mvua hatari za jangwa zilibomoa muundo wetu wa muda. Sasa tunainuka kujenga kwa nguzo nzito za chuma na bati nene — patakatifu pa kudumu lililoundwa kwa ajili ya jua la Turkana.',
    'story.foundedUnderTree': 'Ilianzishwa chini ya mti',
    'story.foundingFamilies': 'Familia waanzilishi',
    'story.stormDestroyed': 'Iliharibiwa na dhoruba',

    'vision.beyondSanctuary': 'Zaidi ya Patakatifu',
    'vision.fivePillars': 'Nguzo tano zinazopanua injili katika maisha ya kila siku.',
    'vision.school.title': 'Shule ya Msingi / Chekechea',
    'vision.school.copy': 'Elimu ya msingi iliyo na msingi wa imani kwa watoto wa wakimbizi na jamii wenyeji kuanzia umri mdogo.',
    'vision.health.title': 'Kituo cha Afya',
    'vision.health.copy': 'Kliniki ya ndani inayotoa huduma ya huruma na heshima kwa jamii ambayo kwa sasa haipati huduma bora za matibabu.',
    'vision.home.title': 'Nyumba ya Agape kwa Watoto Waliotenganishwa',
    'vision.home.copy': 'Hifadhi salama, yenye Kristo katikati, inayotoa makazi na familia kwa watoto waliotenganishwa na wazazi wao wakati wa kuhama.',
    'vision.vocational.title': 'Kituo cha Mafunzo ya Ufundi kwa Vijana Walio Hatarini',
    'vision.vocational.copy': 'Mafunzo ya vitendo katika fani na ujuzi wa maisha, kuwawezesha vijana walio hatarini kujenga upya maisha yao kwa heshima na kujitegemea.',
    'vision.pa.title': 'Mfumo wa PA wa Matangazo ya Ulimwengu',
    'vision.pa.copy': 'Miundombinu ya sauti ya kuaminika ya kutangaza ibada, uinjilisti, na taarifa za dharura katika kambi na zaidi.',

    'give.partnerWith': 'Shirikiana na Clinic6',
    'give.giftTurnsPrayer': 'Zawadi yako inageuza maombi kuwa ya kudumu.',
    'give.everyContribution': 'Kila mchango unapokelewa kupitia akaunti zilizothibitishwa za Kanisa la Clinic6 SDA na kukaguliwa na hazina kuu.',
    'give.viewChannels': 'Tazama Njia za Kutoa',
    'give.sponsorSeat': 'Dhamini Kiti',
  },
}

/* ---------- Context ---------- */
const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
})

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem(STORAGE_KEY) || 'en'
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* ignore */ }
    if (typeof document !== 'undefined') document.documentElement.lang = lang
  }, [lang])

  const setLang = (code) => {
    if (DICT[code]) setLangState(code)
  }

  const value = useMemo(() => ({
    lang,
    setLang,
    t: (key) => (DICT[lang] && DICT[lang][key]) ?? DICT.en[key] ?? key,
  }), [lang])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useT() {
  return useContext(LanguageContext)
}

/* ============================================================ */
/*  <LanguageSwitcher /> — Gold-accented pill segmented control  */
/* ============================================================ */
export function LanguageSwitcher({ variant = 'dark', className = '' }) {
  const { lang, setLang } = useT()

  const isDark = variant === 'dark'
  const trackBg     = isDark ? 'bg-white/10 border-white/15' : 'bg-[#F7F4EF] border-[#0F2942]/10'
  const inactiveTxt = isDark ? 'text-white/70 hover:text-white' : 'text-[#0F2942]/60 hover:text-[#0F2942]'

  return (
    <div
      role="group"
      aria-label="Language"
      className={
        'relative inline-flex items-center gap-0.5 p-1 rounded-full border backdrop-blur-md ' +
        trackBg + ' ' + className
      }
    >
      {LANGS.map((l) => {
        const isActive = lang === l.code
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={isActive}
            title={l.name}
            className="relative z-10 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 bg-[#D4AF37] rounded-full shadow"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className={'relative ' + (isActive ? 'text-[#0F2942]' : inactiveTxt)}>
              {l.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
