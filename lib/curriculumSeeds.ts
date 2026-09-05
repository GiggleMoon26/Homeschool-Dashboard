// Curriculum checklist seed data — the real NSW outcome codes for each stage,
// used to populate a child's checklist automatically when their profile's
// "stage" is set. Resource fields (Khan/Twinkl/other ideas) are filled in
// where we've already researched them for George and Louis; the rest are
// left blank for the parent to fill in via the checklist editor as they go —
// genuinely researching all 180+ codes' resources in one pass wasn't
// realistic, so this seeds the real curriculum structure now and grows the
// resource detail over time rather than blocking on it.

export type ChecklistSeed = {
  code: string;
  title: string;
  subject: string;
  isOngoing?: boolean;
  markoffCriteria?: string;
  khanResource?: string;
  twinklResource?: string;
  otherIdeas?: string;
};

function item(code: string, title: string, subject: string, extra: Partial<ChecklistSeed> = {}): ChecklistSeed {
  return { code, title, subject, ...extra };
}

export const STAGE1_CHECKLIST: ChecklistSeed[] = [
  item('EN1-OLC-01', 'Talking & Listening', 'English'),
  item('EN1-VOCAB-01', 'Vocabulary', 'English'),
  item('EN1-PHOKW-01', 'Phonics', 'English'),
  item('EN1-REFLU-01', 'Reading Fluency', 'English'),
  item('EN1-RECOM-01', 'Reading Comprehension', 'English'),
  item('EN1-CWT-01', 'Writing', 'English'),
  item('EN1-SPELL-01', 'Spelling', 'English', { isOngoing: true }),
  item('EN1-HANDW-01', 'Handwriting', 'English'),
  item('EN1-UARL-01', 'Responding to Literature', 'English'),

  item('MA1-RWN-01', 'Place Value (Read/Write)', 'Mathematics',
    { khanResource: '2nd grade math → Numbers and place value unit', twinklResource: 'Search "place value Year 2"' }),
  item('MA1-RWN-02', 'Partitioning', 'Mathematics',
    { khanResource: '2nd grade math → Numbers and place value unit', twinklResource: 'Search "place value partitioning Year 2"' }),
  item('MA1-CSQ-01', 'Number Bonds', 'Mathematics',
    { khanResource: '2nd grade math → Addition and subtraction unit', twinklResource: 'Search "number bonds to 10 Year 2"' }),
  item('MA1-FG-01', 'Groups & Sharing', 'Mathematics',
    { khanResource: '2nd grade math → look for "Equal groups" lessons', twinklResource: 'Search "multiplication division equal groups Year 2"' }),
  item('MA1-GM-01', 'Position & Direction', 'Mathematics'),
  item('MA1-GM-02', 'Measuring Length', 'Mathematics'),
  item('MA1-GM-03', 'Halves & Quarters of Length', 'Mathematics'),
  item('MA1-2DS-01', '2D Shapes', 'Mathematics',
    { khanResource: '2nd grade math → Geometry unit → "Identify shapes", "Classify shapes"', twinklResource: 'Search "2D shapes Year 2"',
      otherIdeas: 'A shape hunt around the house; short "2D shapes for kids" videos.' }),
  item('MA1-2DS-02', 'Area (Informal Units)', 'Mathematics'),
  item('MA1-3DS-01', '3D Objects', 'Mathematics',
    { khanResource: '2nd grade math → Geometry unit → "Identify parts of 3D shapes"', twinklResource: 'Search "3D shapes Year 2"',
      otherIdeas: 'A shape hunt around the house; short "3D shapes for kids" videos on YouTube.' }),
  item('MA1-3DS-02', 'Capacity', 'Mathematics'),
  item('MA1-NSM-01', 'Mass', 'Mathematics'),
  item('MA1-NSM-02', 'Time', 'Mathematics',
    { khanResource: '2nd grade math → Measurement unit → "Telling time" lessons', twinklResource: 'Search "telling time Year 2"',
      otherIdeas: 'A play/toy clock for hands-on practice; the game "What\'s the Time, Mr Wolf?"' }),
  item('MA1-DATA-01', 'Data Collection', 'Mathematics'),
  item('MA1-DATA-02', 'Data Interpretation', 'Mathematics'),
  item('MA1-CHAN-01', 'Chance', 'Mathematics'),

  item('ST1-1WS-S', 'Working Scientifically', 'Science & Technology'),
  item('ST1-2DP-T', 'Design & Production', 'Science & Technology'),
  item('ST1-3DP-T', 'Algorithms', 'Science & Technology'),
  item('ST1-4LW-S', 'Living World', 'Science & Technology'),
  item('ST1-6MW-S', 'Material World (Change)', 'Science & Technology'),
  item('ST1-7MW-T', 'Material World (Properties)', 'Science & Technology'),
  item('ST1-8PW-S', 'Physical World (Energy)', 'Science & Technology'),
  item('ST1-9PW-ST', 'Forces', 'Science & Technology'),
  item('ST1-10ES-S', 'Earth & Space', 'Science & Technology',
    { otherIdeas: 'The Bureau of Meteorology website; growing something small at home.' }),
  item('ST1-11DI-T', 'Digital Systems', 'Science & Technology'),

  item('GE1-1', 'Features of Places', 'HSIE'),
  item('GE1-2', 'Caring for Places', 'HSIE'),
  item('GE1-3', 'Geographical Tools', 'HSIE'),
  item('HT1-1', 'Family Life Change', 'HSIE',
    { otherIdeas: 'Trove (National Library photo archive); ask a grandparent what life was like.' }),
  item('HT1-2', 'Local Significant History', 'HSIE'),
  item('HT1-3', 'Technology Over Time', 'HSIE'),
  item('HT1-4', 'Historical Inquiry', 'HSIE'),

  item('PD1-SM', 'Self-Management', 'PDHPE'),
  item('PD1-IP', 'Interpersonal', 'PDHPE'),
  item('PD1-MOV', 'Movement Skill', 'PDHPE', { isOngoing: true }),
  item('PD1-HS', 'Health & Safety', 'PDHPE'),
  item('PD1-AP', 'Active Participation', 'PDHPE', { isOngoing: true }),

  item('CA1-VA', 'Visual Arts', 'Creative Arts'),
  item('CA1-MU', 'Music', 'Creative Arts'),
  item('CA1-DR', 'Drama', 'Creative Arts'),
  item('CA1-DA', 'Dance', 'Creative Arts'),
];

export const STAGE3_CHECKLIST: ChecklistSeed[] = [
  item('EN3-OLC-01', 'Talking & Listening', 'English'),
  item('EN3-VOCAB-01', 'Vocabulary', 'English'),
  item('EN3-RECOM-01', 'Reading Comprehension', 'English'),
  item('EN3-CWT-01', 'Writing', 'English'),
  item('EN3-SPELL-01', 'Spelling', 'English', { isOngoing: true }),
  item('EN3-HANDW-01', 'Handwriting Fluency', 'English'),
  item('EN3-HANDW-02', 'Digital Text Tools', 'English'),
  item('EN3-UARL-01', 'Literature: Imagery/Symbol', 'English'),
  item('EN3-UARL-02', 'Literature: Genre/Theme', 'English'),

  item('MA3-RN-01', 'Place Value', 'Mathematics'),
  item('MA3-RN-02', 'Ordering Decimals', 'Mathematics'),
  item('MA3-RN-03', 'Percentages/Fractions', 'Mathematics'),
  item('MA3-AR-01', 'Addition/Subtraction', 'Mathematics'),
  item('MA3-MR-01', 'Multiplication/Division', 'Mathematics'),
  item('MA3-MR-02', 'Order of Operations', 'Mathematics'),
  item('MA3-RQF-01', 'Comparing Fractions', 'Mathematics'),
  item('MA3-RQF-02', 'Fraction of a Quantity', 'Mathematics'),
  item('MA3-GM-01', 'Coordinates', 'Mathematics'),
  item('MA3-GM-02', 'Perimeter', 'Mathematics',
    { khanResource: 'Search "Area and perimeter" — Khan files this under their "4th grade" label despite matching Year 5 content', twinklResource: 'Search "perimeter Year 5"',
      otherIdeas: 'Measure real furniture or rooms at home; board games like Blokus.' }),
  item('MA3-GM-03', 'Angles', 'Mathematics',
    { khanResource: 'Search "Measuring angles" — same note, may show under their "4th grade"', twinklResource: 'Search "angles Year 5"',
      otherIdeas: 'GeoGebra.org has a free interactive angle tool; an angle hunt around the house.' }),
  item('MA3-2DS-01', 'Classifying Shapes', 'Mathematics'),
  item('MA3-2DS-02', 'Area (Rectangles)', 'Mathematics',
    { khanResource: 'Search "area of rectangles"' }),
  item('MA3-2DS-03', 'Area (Triangles/Parallelograms)', 'Mathematics',
    { khanResource: 'Search "area of triangles"' }),
  item('MA3-3DS-01', '3D Sketching', 'Mathematics'),
  item('MA3-3DS-02', 'Volume', 'Mathematics'),
  item('MA3-NSM-01', 'Mass', 'Mathematics'),
  item('MA3-NSM-02', '12/24hr Time', 'Mathematics'),
  item('MA3-DATA-01', 'Graphing', 'Mathematics'),
  item('MA3-DATA-02', 'Interpreting Graphs', 'Mathematics'),
  item('MA3-CHAN-01', 'Probability', 'Mathematics'),

  item('ST3-1WS-S', 'Working Scientifically', 'Science & Technology'),
  item('ST3-2DP-T', 'Design & Production', 'Science & Technology'),
  item('ST3-3DP-T', 'Algorithms', 'Science & Technology'),
  item('ST3-4LW-S', 'Living World: Environment', 'Science & Technology'),
  item('ST3-5LW-T', 'Sustainable Food', 'Science & Technology'),
  item('ST3-6MW-S', 'Material World: Heat', 'Science & Technology'),
  item('ST3-7MW-T', 'Material Properties', 'Science & Technology',
    { otherIdeas: 'A mini engineering test: stack blocks with/without "mortar" (glue or playdough).' }),
  item('ST3-8PW-ST', 'Energy Transformation', 'Science & Technology'),
  item('ST3-9PW-ST', 'Forces', 'Science & Technology'),
  item('ST3-10ES-S', 'Earth & Space', 'Science & Technology'),
  item('ST3-11DI-T', 'Digital Systems', 'Science & Technology'),

  item('GE3-1', 'Features of Places', 'HSIE'),
  item('GE3-2', 'People & Environment', 'HSIE'),
  item('GE3-3', 'Managing Places', 'HSIE'),
  item('GE3-4', 'Geographical Tools', 'HSIE'),
  item('HT3-1', "Australia's Development", 'HSIE'),
  item('HT3-2', 'Local Community History', 'HSIE',
    { otherIdeas: 'Trove; the State Library online collections; a local council heritage page.' }),
  item('HT3-3', 'Change & Continuity', 'HSIE'),
  item('HT3-4', 'Rights & Freedoms', 'HSIE'),
  item('HT3-5', 'Historical Inquiry', 'HSIE'),

  item('PD3-1', 'Self-Management/Change', 'PDHPE'),
  item('PD3-2', 'Resilience/Help-Seeking', 'PDHPE'),
  item('PD3-3', 'Empathy & Inclusion', 'PDHPE'),
  item('PD3-4', 'Movement Skill Adaptation', 'PDHPE', { isOngoing: true }),
  item('PD3-6', 'Health/Safety Factors', 'PDHPE'),
  item('PD3-7', 'Protective Strategies', 'PDHPE'),
  item('PD3-9', 'Self-Management in Situations', 'PDHPE'),
  item('PD3-10', 'Interpersonal Skills', 'PDHPE'),
  item('PD3-11', 'Movement Sequences', 'PDHPE'),

  item('CA3-VA', 'Visual Arts', 'Creative Arts'),
  item('CA3-MU', 'Music', 'Creative Arts'),
  item('CA3-DR', 'Drama', 'Creative Arts'),
  item('CA3-DA', 'Dance', 'Creative Arts'),
];

export const STAGE5_CHECKLIST: ChecklistSeed[] = [
  item('EN5-RVL-01', 'Interpreting Complex Texts', 'English'),
  item('EN5-URA-01', 'Language Forms/Features', 'English'),
  item('EN5-URB-01', 'Texts & Values', 'English'),
  item('EN5-URC-01', 'Valuing Texts', 'English'),
  item('EN5-ECA-01', 'Persuasive/Creative Writing', 'English'),
  item('EN5-ECB-01', 'Writing Process', 'English', { isOngoing: true }),

  item('MAO-WM-01', 'Working Mathematically', 'Mathematics', { isOngoing: true }),
  item('MA5-FIN-C-01', 'Simple Interest', 'Mathematics'),
  item('MA5-FIN-C-02', 'Compound Interest', 'Mathematics'),
  item('MA5-ALG-C-01', 'Algebraic Techniques', 'Mathematics'),
  item('MA5-IND-C-01', 'Indices', 'Mathematics'),
  item('MA5-EQU-C-01', 'Equations', 'Mathematics'),
  item('MA5-LIN-C-01', 'Linear Relationships A', 'Mathematics'),
  item('MA5-LIN-C-02', 'Linear Relationships B', 'Mathematics'),
  item('MA5-NLI-C-01', 'Non-Linear Relationships A', 'Mathematics'),
  item('MA5-NLI-C-02', 'Non-Linear Relationships B', 'Mathematics'),
  item('MA5-MAG-C-01', 'Scientific Notation', 'Mathematics'),
  item('MA5-TRG-C-01', 'Trigonometry A', 'Mathematics'),
  item('MA5-TRG-C-02', 'Trigonometry B', 'Mathematics'),
  item('MA5-ARE-C-01', 'Surface Area', 'Mathematics'),
  item('MA5-VOL-C-01', 'Volume', 'Mathematics'),
  item('MA5-GEO-C-01', 'Similarity & Scale', 'Mathematics'),
  item('MA5-DAT-C-01', 'Data Analysis A', 'Mathematics'),
  item('MA5-DAT-C-02', 'Bivariate Data', 'Mathematics'),
  item('MA5-PRO-C-01', 'Probability', 'Mathematics'),

  item('SC5-WS-01', 'Observing', 'Science'),
  item('SC5-WS-02', 'Questioning/Predicting', 'Science'),
  item('SC5-WS-03', 'Planning Investigations', 'Science'),
  item('SC5-WS-04', 'Conducting Investigations', 'Science'),
  item('SC5-WS-05', 'Processing Data', 'Science'),
  item('SC5-WS-06', 'Analysing Data', 'Science'),
  item('SC5-WS-07', 'Problem-Solving', 'Science'),
  item('SC5-WS-08', 'Communicating', 'Science'),
  item('SC5-EGY-01', 'Energy', 'Science'),
  item('SC5-DIS-01', 'Disease', 'Science'),
  item('SC5-MAT-01', 'Materials', 'Science'),
  item('SC5-ENV-01', 'Environment', 'Science'),
  item('SC5-GEV-01', 'Genetics/Evolution A', 'Science'),
  item('SC5-GEV-02', 'Genetics/Evolution B', 'Science'),
  item('SC5-RXN-01', 'Reactions A', 'Science'),
  item('SC5-RXN-02', 'Reactions B', 'Science'),
  item('SC5-WAM-01', 'Waves', 'Science'),
  item('SC5-WAM-02', 'Motion', 'Science'),
  item('SC5-DA2-01', 'Data Science/Evidence', 'Science'),

  item('GE5-1', 'Features of Places', 'HSIE Geography'),
  item('GE5-2', 'Processes/Influences', 'HSIE Geography'),
  item('GE5-3', 'Interactions & Connections', 'HSIE Geography'),
  item('GE5-4', 'Perspectives on Issues', 'HSIE Geography'),
  item('GE5-5', 'Managing Sustainably', 'HSIE Geography'),
  item('GE5-6', 'Human Wellbeing', 'HSIE Geography'),
  item('GE5-7', 'Geographical Tools', 'HSIE Geography'),
  item('GE5-8', 'Communicating Findings', 'HSIE Geography'),

  item('HT5-1', 'Forces That Shaped the World', 'HSIE History'),
  item('HT5-2', 'Continuity & Change', 'HSIE History'),
  item('HT5-3', 'Motives & Actions', 'HSIE History'),
  item('HT5-4', 'Causes & Effects', 'HSIE History'),
  item('HT5-5', 'Evaluating Sources', 'HSIE History'),
  item('HT5-6', 'Using Evidence', 'HSIE History'),
  item('HT5-7', 'Perspectives/Interpretations', 'HSIE History'),
  item('HT5-8', 'Source Analysis', 'HSIE History'),
  item('HT5-9', 'Historical Terms', 'HSIE History'),
  item('HT5-10', 'Communicating History', 'HSIE History'),

  item('PD5-1', 'Reflection & Resilience', 'PDHPE'),
  item('PD5-2', 'Health Info/Services', 'PDHPE'),
  item('PD5-3', 'Inclusivity & Relationships', 'PDHPE'),
  item('PD5-4', 'Movement Skills (Creative)', 'PDHPE', { isOngoing: true }),
  item('PD5-5', 'Movement Challenges', 'PDHPE'),
  item('PD5-6', 'Health/Safety Factors', 'PDHPE'),
  item('PD5-7', 'Community Health Strategies', 'PDHPE'),
  item('PD5-8', 'Personalised Health Plans', 'PDHPE'),
  item('PD5-9', 'Self-Management', 'PDHPE'),
  item('PD5-10', 'Interpersonal Skills', 'PDHPE'),
  item('PD5-11', 'Movement Sequences', 'PDHPE'),

  item('COM5-1', 'Business Concepts & Terminology', 'Commerce'),
  item('COM5-2', 'Rights & Responsibilities', 'Commerce'),
  item('COM5-3', 'Role of Law', 'Commerce'),
  item('COM5-4', 'Factors Affecting Decisions', 'Commerce'),
  item('COM5-5', 'Evaluating Options', 'Commerce'),
  item('COM5-6', 'Plans to Achieve Goals', 'Commerce'),
  item('COM5-7', 'Researching Information', 'Commerce'),
  item('COM5-8', 'Explaining Information', 'Commerce'),
  item('COM5-9', 'Working Independently/Collaboratively', 'Commerce', { isOngoing: true }),

  item('VAS5.1', 'Range/Autonomy in Artmaking', 'Visual Arts', { isOngoing: true }),
  item('VAS5.2', 'Artist-Artwork-World-Audience', 'Visual Arts'),
  item('VAS5.3', 'How Frames Affect Meaning', 'Visual Arts'),
  item('VAS5.4', 'World as Source of Ideas', 'Visual Arts'),
  item('VAS5.5', 'Informed Choices in Artmaking', 'Visual Arts'),
  item('VAS5.6', 'Technical Accomplishment', 'Visual Arts'),
  item('VAS5.7', 'Critical/Historical Interpretations', 'Visual Arts'),
  item('VAS5.8', 'Artist-Artwork-World-Audience (Critical Studies)', 'Visual Arts'),
  item('VAS5.9', 'Frames in Interpretation', 'Visual Arts'),
  item('VAS5.10', 'Art Criticism & Art History', 'Visual Arts'),
];

export function checklistForStage(stage: string | null | undefined): ChecklistSeed[] {
  if (!stage) return [];
  const normalized = stage.toLowerCase();
  if (normalized.includes('1')) return STAGE1_CHECKLIST;
  if (normalized.includes('3')) return STAGE3_CHECKLIST;
  if (normalized.includes('5')) return STAGE5_CHECKLIST;
  return [];
}
