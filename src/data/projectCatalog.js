import churchAffectedImage from '../assets/church-affected1.jpeg'
import secondStormImage from '../assets/2nd-storm-wornout-building.png'
import firstStormVideo from '../assets/first-storm.mp4'
import highDutyMetalImage from '../assets/high duty metal.jpg'
import clinicDreamImage from '../assets/Clinic6 dream church (2).png'
import dreamChurchOneImage from '../assets/dream-church1.png'
import clinicDreamVideo from '../assets/Clinic6 dream church.mp4'
import childrenChurchOneImage from "../assets/children's church (1).jpg"
import childrenChurchVideoOne from "../assets/children's church video (1).mp4"
import childrenChurchThreeImage from "../assets/children's church (3).jpg"
import childrenChurchVideoTwo from "../assets/children's church video (2).mp4"
import sabbathGroupFiveImage from '../assets/Sabbath school lesson groups (5).jpg'
import sabbathGroupEightImage from '../assets/Sabbath school lesson groups (8).jpg'
import donateTogetherImage from '../assets/donate-together.png'
import childrenChurchTwoImage from "../assets/children's church (2).jpg"
import sabbathGroupElevenImage from '../assets/Sabbath school lesson groups (11).jpg'
import dreamChurchImage from '../assets/dream-church.png'
import jordanBaptismTwoImage from '../assets/jordan-baptism-2.jpg'
import jordanBaptismThreeImage from '../assets/jordan-baptism-3.jpg'
import jordanBaptismFourImage from '../assets/jordan-baptism-4.jpg'
import baptismClinicSixImage from '../assets/baptism at clinic6(6).jpg'
import baptismClinicSevenImage from '../assets/baptism at clinic6(7).jpg'
import baptismClinicDefaultImage from '../assets/baptism at clinic6.jpg'
import baptismPoolSceneImage from '../assets/IMG_20240824_164748_249.jpg'
import jordanPoolImage from '../assets/current baptism pool at structre.jpg'
import wornoutFenceImage from '../assets/wornout face2.jpg'
import wornoutFenceVideo from '../assets/wornout face3.mp4'
import durableFenceImage from '../assets/durable webed wire face.jpg'
import durableFenceTwoImage from '../assets/durable webed wire face2.jpg'

const assetMap = {
  'church-affected1.jpeg': churchAffectedImage,
  '2nd-storm-wornout-building.png': secondStormImage,
  'first-storm.mp4': firstStormVideo,
  'high duty metal.jpg': highDutyMetalImage,
  'Clinic6 dream church (2).png': clinicDreamImage,
  'dream-church1.png': dreamChurchOneImage,
  'Clinic6 dream church.mp4': clinicDreamVideo,
  "children's church (1).jpg": childrenChurchOneImage,
  "children's church video (1).mp4": childrenChurchVideoOne,
  "children's church (3).jpg": childrenChurchThreeImage,
  "children's church video (2).mp4": childrenChurchVideoTwo,
  'Sabbath school lesson groups (5).jpg': sabbathGroupFiveImage,
  'Sabbath school lesson groups (8).jpg': sabbathGroupEightImage,
  'donate-together.png': donateTogetherImage,
  "children's church (2).jpg": childrenChurchTwoImage,
  'Sabbath school lesson groups (11).jpg': sabbathGroupElevenImage,
  'dream-church.png': dreamChurchImage,
  'Camera Roll/baptism at clic6 (2).jpg': jordanBaptismTwoImage,
  'Camera Roll/baptism at clic6 (3).jpg': jordanBaptismThreeImage,
  'Camera Roll/baptism at clic6 (4).jpg': jordanBaptismFourImage,
  'baptism at clinic6(7).jpg': baptismClinicSevenImage,
  'current baptism pool at structre.jpg': jordanPoolImage,
  'wornout face2.jpg': wornoutFenceImage,
  'wornout face3.mp4': wornoutFenceVideo,
  'durable webed wire face.jpg': durableFenceImage,
  'durable webed wire face2.jpg': durableFenceTwoImage,
}

function resolveAssetPath(src, type) {
  if (!src || !src.startsWith('/src/assets/')) {
    return src
  }

  const fileName = src.replace('/src/assets/', '')
  const resolved = assetMap[fileName]

  if (resolved) {
    return resolved
  }

  if (type === 'video') {
    return firstStormVideo
  }

  return baptismClinicDefaultImage
}

const rawProjectCatalog = [
  {
    slug: 'church-construction',
    title: 'Church Construction (Urgent Priority)',
    shortSummary:
      'Build a permanent 30m × 15m sanctuary (5m wall plate, 4m roof ridge) — heavy-duty poles, structural bars, and full iron-sheet cladding — replacing the storm-damaged shelter.',
    urgency: 'Urgent',
    objective:
      'Erect a permanent sanctuary measuring 30 m (length) × 15 m (width), with 5 m walls to wall plate and a 4 m roof pitch at the highest ridge, using heavy-duty metal poles, structural steel bars, and corrugated iron-sheet roofing and wall cladding allover — built to endure the harsh Kakuma climate for decades.',
    donationUse: [
      'Heavy-duty metal poles (main uprights and perimeter columns)',
      'Structural steel bars and wind-bracing angle iron',
      'Corrugated iron sheets — full roof and wall cladding allover',
      'Welding consumables, bolts, ridge caps, and weatherproofing',
      'Skilled welding labour and on-site logistics',
      'Interior seating base, floor leveling, and basic electrical',
    ],
    expectedImpact:
      'A permanent 30 m × 15 m metal-frame sanctuary (5 m wall plate + 4 m roof ridge) providing dignified worship for 868 members — storm-resistant, long-lasting, and fully covered with iron sheets from roof to walls.',
    budgetCurrency: 'USD',
    budgetItems: [
      {
        id: 'metal-poles',
        item: 'Heavy-duty metal poles — uprights and perimeter columns',
        cost: 8500,
        detail: 'Primary vertical frame: full-length structural poles at required spacing for 30 m × 15 m footprint.',
      },
      {
        id: 'steel-bars-bracing',
        item: 'Structural steel bars, purlins, and wind-bracing angle iron',
        cost: 6200,
        detail: 'Horizontal purlins, cross-bracing bars, and angle-iron ties securing the entire metal skeleton.',
      },
      {
        id: 'iron-sheets-roof',
        item: 'Corrugated iron sheets — full roof cladding',
        cost: 9800,
        detail: 'Heavy-gauge corrugated iron sheets covering the 30 m × 15 m roof span, ridge caps, and lap sealant.',
      },
      {
        id: 'iron-sheets-walls',
        item: 'Corrugated iron sheets — full wall cladding allover',
        cost: 7400,
        detail: 'Perimeter wall cladding on all sides (30 m front/back + 15 m sides × 5 m wall-plate height) with bolt-fixed iron sheets.',
      },
      {
        id: 'welding-consumables',
        item: 'Welding rods, bolts, nuts, ridge caps, and weatherproofing',
        cost: 2800,
        detail: 'All joining, fastening, and sealing consumables for the full metal structure.',
      },
      {
        id: 'labor-logistics',
        item: 'Skilled welding labour and on-site logistics',
        cost: 6500,
        detail: 'Certified welding team, equipment hire, material transport within Kakuma, and site coordination.',
      },
      {
        id: 'seating-electrical',
        item: 'Interior seating base, floor leveling, and basic electrical',
        cost: 4800,
        detail: 'Compacted floor base, worship seating layout, essential wiring, and interior lighting.',
      },
    ],
    currentMedia: [
      {
        type: 'image',
        src: '/src/assets/church-affected1.jpeg',
        alt: 'Current storm-affected church condition',
        illustration:
          'Current structure showing storm wear, exposed sections, and temporary safety limitations.',
      },
      {
        type: 'image',
        src: '/src/assets/2nd-storm-wornout-building.png',
        alt: 'Worn-out building after repeated storms',
        illustration:
          'Second-stage deterioration where repeated storms compromised structural reliability.',
      },
      {
        type: 'video',
        src: '/src/assets/first-storm.mp4',
        alt: 'Video footage of storm impact on the worship structure',
        illustration:
          'Field footage documenting wind and weather damage affecting the current worship shelter.',
      },
      {
        type: 'image',
        src: '/src/assets/high duty metal.jpg',
        alt: 'High-duty metal currently prepared for church structural reinforcement',
        illustration:
          'Current-stage material reference showing high-duty steel intended for reinforced frame joins and improved sanctuary durability.',
      },
    ],
    dreamMedia: [
      {
        type: 'image',
        src: '/src/assets/Clinic6 dream church (2).png',
        alt: 'Dream sanctuary rendering for Clinic 6 church construction',
        illustration:
          'Conceptual front elevation showing the intended permanent sanctuary profile and worship entry flow.',
      },
      {
        type: 'image',
        src: '/src/assets/dream-church1.png',
        alt: 'Dream church architectural concept view',
        illustration:
          'Secondary concept perspective illustrating scale, roof lines, and community-facing orientation.',
      },
      {
        type: 'image',
        src: '/src/assets/high duty metal.jpg',
        alt: 'High-duty metal quality and bolt-joining strategy for church construction durability',
        illustration:
          'High-duty metal reference showing the durability standard for the sanctuary frame: thicker steel sections, anti-rust protection, and bolt-joined connections designed to handle heavy load, wind stress, and long-term structural use.',
      },
      {
        type: 'video',
        src: '/src/assets/Clinic6 dream church.mp4',
        alt: 'Dream church concept walkthrough',
        illustration:
          'Vision walkthrough to help donors understand layout progression from entrance to worship hall.',
      },
    ],
  },
  {
    slug: 'evangelism-support',
    title: 'Evangelism Support',
    shortSummary:
      'Strengthen gospel outreach tools: PA system, choir support, mobile platform/podium, tents, and Jordan-related outreach logistics.',
    urgency: 'High',
    objective:
      'Equip outreach teams to preach, worship, and serve effectively in open and mobile environments across the community.',
    donationUse: [
      'Public address system upgrades and portable audio kits',
      'Choir ministry resources and rehearsal support',
      'Mobile platform/podium and temporary mission tents',
      'Field logistics for Jordan-related evangelism activities',
    ],
    expectedImpact:
      'Expands reach, improves clarity of ministry events, and supports consistent evangelistic engagement in dispersed communities.',
  },
  {
    slug: 'childrens-church',
    title: "Children's Church",
    shortSummary:
      'Create safe, age-appropriate discipleship spaces where children can learn, worship, and grow in faith.',
    urgency: 'High',
    objective:
      'Develop structured children ministry spaces with protective setup, learning materials, and child-centered worship support.',
    donationUse: [
      'Children ministry seating, shade, and room setup',
      'Bible learning resources and faith-formation materials',
      'Child-safe storage and ministry equipment',
      'Volunteer training aids for children ministry teams',
    ],
    expectedImpact:
      'Improves child safety, engagement, and spiritual formation while supporting families attending worship services.',
    budgetCurrency: 'USD',
    budgetItems: [
      {
        id: 'child-seating',
        item: 'Children seating and floor mats package',
        cost: 650,
        detail: 'Child-friendly seating, mats, and flexible worship-circle layout support.',
      },
      {
        id: 'child-shade',
        item: 'Shade, partitions, and weather cover support',
        cost: 900,
        detail: 'Safe protective cover and simple partitions for children ministry sessions.',
      },
      {
        id: 'child-learning',
        item: 'Bible learning and activity materials',
        cost: 420,
        detail: 'Visual teaching tools, lesson cards, stationery, and age-specific discipleship kits.',
      },
      {
        id: 'child-storage',
        item: 'Child-safe storage and teaching equipment',
        cost: 380,
        detail: 'Cabinets, safe bins, and ministry equipment organization support.',
      },
    ],
    currentMedia: [
      {
        type: 'image',
        src: '/src/assets/children\'s church (1).jpg',
        alt: 'Children gathered in current church learning environment',
        illustration:
          'Current children ministry setting showing the need for a safer, better-equipped worship and learning space.',
      },
      {
        type: 'video',
        src: '/src/assets/children\'s church video (1).mp4',
        alt: 'Children church activity video',
        illustration:
          'Activity footage showing how children currently gather and participate with limited ministry infrastructure.',
      },
    ],
    dreamMedia: [
      {
        type: 'image',
        src: '/src/assets/children\'s church (3).jpg',
        alt: 'Illustrative children ministry vision image',
        illustration:
          'Illustrative reference for a structured, joyful, and protected children worship environment.',
      },
      {
        type: 'video',
        src: '/src/assets/children\'s church video (2).mp4',
        alt: 'Illustrative children church vision video',
        illustration:
          'Illustrative motion reference showing the type of active and organized children ministry environment being pursued.',
      },
    ],
  },
  {
    slug: 'good-samaritan',
    title: 'Good Samaritan Program',
    shortSummary:
      'Provide practical support for vulnerable families and members with urgent welfare needs.',
    urgency: 'High',
    objective:
      'Deliver relief support through a structured church-led care program focused on dignity and compassion.',
    donationUse: [
      'Essential food and emergency welfare assistance',
      'Priority care kits for vulnerable households',
      'Local response transport and follow-up support',
      'Community care coordination resources',
    ],
    expectedImpact:
      'Protects vulnerable members from crisis shocks and keeps families connected to the church community.',
    budgetCurrency: 'USD',
    budgetItems: [
      {
        id: 'food-relief',
        item: 'Emergency food relief package',
        cost: 700,
        detail: 'Staple food support for vulnerable households facing immediate need.',
      },
      {
        id: 'care-kits',
        item: 'Priority family care kits',
        cost: 520,
        detail: 'Basic household, sanitation, and dignity-support materials.',
      },
      {
        id: 'response-transport',
        item: 'Response transport and field follow-up',
        cost: 340,
        detail: 'Transport and community follow-up logistics for urgent support visits.',
      },
      {
        id: 'coordination-support',
        item: 'Community coordination and case support',
        cost: 260,
        detail: 'Structured welfare follow-up and church-led relief coordination support.',
      },
    ],
    currentMedia: [
      {
        type: 'image',
        src: '/src/assets/Sabbath school lesson groups (5).jpg',
        alt: 'Community gathering illustrating current welfare context',
        illustration:
          'Representative current community setting reflecting the scale of practical welfare needs among members and families.',
      },
      {
        type: 'image',
        src: '/src/assets/Sabbath school lesson groups (8).jpg',
        alt: 'Community fellowship setting connected to support needs',
        illustration:
          'Illustrates the church community that Good Samaritan support is designed to protect in times of hardship.',
      },
    ],
    dreamMedia: [
      {
        type: 'image',
        src: '/src/assets/donate-together.png',
        alt: 'Illustrative vision for coordinated community support',
        illustration:
          'Illustrative donor-facing image representing coordinated, dignified support pathways for vulnerable households.',
      },
    ],
  },
  {
    slug: 'agape-home',
    title: 'Agape Home',
    shortSummary:
      'Support a safe and nurturing environment for children separated from family support structures.',
    urgency: 'High',
    objective:
      'Build and sustain a Christ-centered care environment for separated or at-risk children.',
    donationUse: [
      'Shelter setup essentials and protective infrastructure',
      'Daily care and safeguarding support resources',
      'Pastoral mentorship and psycho-social support tools',
      'Basic education and life-skills materials',
    ],
    expectedImpact:
      'Provides protection, belonging, and long-term restoration pathways for children in vulnerable conditions.',
    budgetCurrency: 'USD',
    budgetItems: [
      {
        id: 'agape-shelter',
        item: 'Shelter setup and sleeping essentials',
        cost: 1400,
        detail: 'Beds, bedding, protective room setup, and shelter-readiness needs.',
      },
      {
        id: 'agape-care',
        item: 'Daily care and safeguarding resources',
        cost: 760,
        detail: 'Child care supplies, hygiene support, and protection-centered care materials.',
      },
      {
        id: 'agape-mentorship',
        item: 'Pastoral mentorship and psycho-social support',
        cost: 480,
        detail: 'Pastoral care tools and structured support for restoration and belonging.',
      },
      {
        id: 'agape-learning',
        item: 'Education and life-skills starter pack',
        cost: 520,
        detail: 'Basic learning support and life-skills development materials.',
      },
    ],
    currentMedia: [
      {
        type: 'image',
        src: '/src/assets/children\'s church (2).jpg',
        alt: 'Representative child care ministry context',
        illustration:
          'Representative current ministry context showing the need for a structured and protected child-centered care environment.',
      },
      {
        type: 'image',
        src: '/src/assets/Sabbath school lesson groups (11).jpg',
        alt: 'Representative community image for child support ministry',
        illustration:
          'Illustrates the wider faith community that would surround and sustain Agape Home care efforts.',
      },
    ],
    dreamMedia: [
      {
        type: 'image',
        src: '/src/assets/dream-church.png',
        alt: 'Illustrative protected-care environment concept',
        illustration:
          'Illustrative concept image representing a safe, structured, and dignified long-term care environment.',
      },
    ],
  },
  {
    slug: 'jordan-construction',
    title: 'Jordan Construction for Baptism',
    shortSummary:
      'Develop safe, dignified baptism infrastructure and supporting water-storage construction for Jordan ministry needs.',
    urgency: 'High',
    objective:
      'Construct a durable baptism support system with protected water handling, safer access, and repeatable ministry use.',
    donationUse: [
      'Baptism water-storage and lined pit construction support',
      'Safe access steps, edging, and protective finishing',
      'Water transport and site preparation logistics',
      'Protective coverings and ministry-use support equipment',
    ],
    expectedImpact:
      'Makes baptisms safer, more dignified, and more sustainable while reducing repeated emergency preparation labor.',
    budgetCurrency: 'USD',
    budgetItems: [
      {
        id: 'jordan-lining',
        item: 'Lined baptism pit and containment works',
        cost: 1100,
        detail: 'Pit lining, reinforcement, and safe water containment materials.',
      },
      {
        id: 'jordan-access',
        item: 'Safe access steps and edge protection',
        cost: 540,
        detail: 'Safer entry and exit features for baptism events.',
      },
      {
        id: 'jordan-water',
        item: 'Water transport and storage support',
        cost: 760,
        detail: 'Storage containers, handling tools, and transport support for repeated ministry use.',
      },
      {
        id: 'jordan-cover',
        item: 'Protective cover and event setup package',
        cost: 390,
        detail: 'Temporary protection, setup support, and orderly ministry presentation.',
      },
    ],
    currentMedia: [
      {
        type: 'image',
        src: '/src/assets/Camera Roll/baptism at clic6 (2).jpg',
        alt: 'Baptism photo from Camera Roll 2',
        illustration:
          'Community members prepare and serve with devotion despite limited infrastructure. Donor support reduces this repeated emergency labor and protects volunteers during each baptism event.',
      },
      {
        type: 'image',
        src: '/src/assets/Camera Roll/baptism at clic6 (3).jpg',
        alt: 'Baptism photo from Camera Roll 3',
        illustration:
          'This field scene shows both faith and vulnerability in the current environment. Your donation funds safer access, cleaner water handling, and a more honorable baptism experience.',
      },
      {
        type: 'image',
        src: '/src/assets/Camera Roll/baptism at clic6 (4).jpg',
        alt: 'Baptism photo from Camera Roll 4',
        illustration:
          'Strong attendance and committed ministry teams reveal a growing need. Giving now helps expand capacity so baptisms remain safe, organized, and spiritually focused for all participants.',
      },
      {
        type: 'image',
        src: '/src/assets/baptism at clinic6(7).jpg',
        alt: 'Baptism at clinic6 photo 7',
        illustration:
          'This additional baptism moment reflects the consistency of ministry demand. Your contribution directly supports durable improvements that serve current and future ceremonies with dignity.',
      },
    ],
    dreamMedia: [
      {
        type: 'image',
        src: 'https://i.pinimg.com/736x/55/e5/96/55e5968bf992a715ac4a1c5b0e74bff7.jpg',
        alt: 'Dream Jordan pool for safe baptism',
        illustration:
          'This is the vision: a secure, well-designed baptism pool that protects worshippers and honors sacred commitment. Your donation moves this dream from concept to construction.',
      },
      {
        type: 'image',
        src: '/src/assets/current baptism pool at structre.jpg',
        alt: 'Dream Jordan pool local fallback reference',
        illustration:
          'Local reference kept for reliability, ensuring donors can always view the project direction and continue supporting this life-changing baptism infrastructure mission.',
      },
    ],
  },
  {
    slug: 'nursery-primary-school',
    title: 'Nursery and Primary School',
    shortSummary:
      'Expand access to foundational education rooted in values, care, and community transformation.',
    urgency: 'Medium',
    objective:
      'Develop school infrastructure and learning support systems for early and primary learners.',
    donationUse: [
      'Classroom setup and basic school furniture',
      'Learning materials and curriculum support items',
      'Teacher facilitation resources and school operations aids',
      'Child protection and safe-school environment improvements',
    ],
    expectedImpact:
      'Improves literacy, retention, and holistic child development for refugee and host-community learners.',
  },
  {
    slug: 'vocational-training-centre',
    title: 'Vocational School and Training Centre',
    shortSummary:
      'Equip youth and adults with practical skills for dignity, income generation, and resilience.',
    urgency: 'Medium',
    objective:
      'Establish trade-training pathways linked to local opportunities and self-reliance goals.',
    donationUse: [
      'Training tools and starter workshop equipment',
      'Skill-track materials and practical instruction kits',
      'Mentorship and entrepreneurship facilitation support',
      'Certification-readiness and transition support resources',
    ],
    expectedImpact:
      'Increases employability, household resilience, and youth empowerment through practical market-linked skills.',
  },
  {
    slug: 'nursing-health-unit',
    title: 'Nursing Home and Health Unit',
    shortSummary:
      'Build accessible community health support with preventive care and first-response capacity.',
    urgency: 'Medium',
    objective:
      'Set up a foundational nursing and health unit to serve urgent and routine care needs.',
    donationUse: [
      'Basic clinical setup and first-response equipment',
      'Preventive care and community health materials',
      'Patient flow and referral support resources',
      'Hygiene, sanitation, and safe-care infrastructure needs',
    ],
    expectedImpact:
      'Improves early treatment, preventive health outcomes, and dignified care access for the wider community.',
  },
  {
    slug: 'security-fencing',
    title: 'Compound Security Fencing',
    shortSummary:
      'Replace the collapsed perimeter fence with a durable woven-wire security boundary to protect church property, resources, and worshippers from outside threats.',
    urgency: 'High',
    objective:
      'Construct a strong, permanent woven-wire perimeter fence around the entire church compound to end the cycle of theft, vandalism, and outside intrusions that have gone unchecked since the old fence completely failed.',
    donationUse: [
      'Durable woven-wire fencing materials and full perimeter roll stock',
      'Steel posts, anchoring concrete, and tensioning hardware',
      'Secure gate installation with lockable entry and exit points',
      'Labour for fence erection, post setting, and site clearance',
    ],
    expectedImpact:
      'A completed security fence will protect all church assets, create a safe worship environment, deter theft and intrusion, and give 868 members and their families confidence to gather, store equipment, and serve freely.',
    budgetCurrency: 'USD',
    budgetItems: [
      {
        id: 'fence-wire',
        item: 'Durable woven-wire fencing rolls (full perimeter)',
        cost: 1800,
        detail: 'Heavy-gauge woven-wire rolls sufficient to secure the full compound boundary.',
      },
      {
        id: 'fence-posts',
        item: 'Steel posts, anchor concrete, and tensioning hardware',
        cost: 920,
        detail: 'Galvanised steel posts with concrete anchoring and tensioning fittings for lasting rigidity.',
      },
      {
        id: 'fence-gate',
        item: 'Secure lockable gate installation',
        cost: 540,
        detail: 'Heavy-duty entry/exit gate with padlock system and controlled access hardware.',
      },
      {
        id: 'fence-labour',
        item: 'Labour for erection, post setting, and site clearance',
        cost: 640,
        detail: 'Skilled fencing labour, site preparation, and waste clearance on completion.',
      },
    ],
    currentMedia: [
      {
        type: 'image',
        src: '/src/assets/wornout face2.jpg',
        alt: 'Current collapsed church perimeter fence',
        illustration:
          'This is what remains of the church perimeter fence today — completely collapsed and offering zero protection. Theft and outside intrusions are now a regular reality for this congregation.',
      },
      {
        type: 'video',
        src: '/src/assets/wornout face3.mp4',
        alt: 'Video showing the current state of the failed church boundary fence',
        illustration:
          'Field footage capturing the full extent of the collapsed boundary. Every member, every instrument, and every resource inside is now exposed and vulnerable without donor support.',
      },
    ],
    dreamMedia: [
      {
        type: 'image',
        src: '/src/assets/durable webed wire face.jpg',
        alt: 'Durable woven-wire security fence dream reference',
        illustration:
          'This is the target: a solid, durable woven-wire perimeter that ends outside threats permanently. Your donation funds this transformation from complete vulnerability to full compound protection.',
      },
      {
        type: 'image',
        src: '/src/assets/durable webed wire face2.jpg',
        alt: 'Second durable woven-wire fence reference view',
        illustration:
          'A second reference angle showing the structural quality of the target fencing solution. This is the protection standard our congregation deserves — and your gift makes it possible.',
      },
    ],
  },
]

export const projectCatalog = rawProjectCatalog.map((project) => ({
  ...project,
  currentMedia: (project.currentMedia || []).map((media) => ({
    ...media,
    src: resolveAssetPath(media.src, media.type),
  })),
  dreamMedia: (project.dreamMedia || []).map((media) => ({
    ...media,
    src: resolveAssetPath(media.src, media.type),
  })),
}))

export function getProjectBySlug(projectSlug) {
  return projectCatalog.find((project) => project.slug === projectSlug)
}
