// Curriculum checklist seed data — the real NSW outcome codes and full
// official outcome text for each stage, used to populate a child's checklist
// automatically when their profile's "stage" is set.
//
// `title` holds the complete official outcome description (word for word
// from the original printable checklists), and `plainExplanation` holds the
// short, plain-language gloss that sat in italics underneath it — matching
// the format of the original documents exactly.
//
// Resource fields (Khan/Twinkl/other ideas) are filled in where we've
// already researched them for George and Louis; the rest are left blank for
// the parent to fill in via the Task Manager as they go.

export type ChecklistSeed = {
  code: string;
  title: string;
  plainExplanation?: string;
  subject: string;
  isOngoing?: boolean;
  markoffCriteria?: string;
  khanResource?: string;
  twinklResource?: string;
  otherIdeas?: string;
};

function item(code: string, title: string, plainExplanation: string, subject: string, extra: Partial<ChecklistSeed> = {}): ChecklistSeed {
  return { code, title, plainExplanation, subject, ...extra };
}

export const STAGE1_CHECKLIST: ChecklistSeed[] = [
  item('EN1-OLC-01', 'Communicates using conversational language to extend and elaborate ideas', 'Talking and listening — holding a conversation, explaining an idea', 'English'),
  item('EN1-VOCAB-01', 'Understands and effectively uses everyday, topic and subject-specific vocabulary', 'Vocabulary — using and understanding a growing range of words', 'English'),
  item('EN1-PHOKW-01', "Uses initial and extended phonics, including vowel digraphs and trigraphs, to read and spell", "Phonics — sound-letter patterns like 'oa', 'igh', 'ough'", 'English'),
  item('EN1-REFLU-01', 'Reads unseen texts aloud with automaticity, prosody and self-correction', 'Reading fluency — smooth, expressive reading aloud', 'English'),
  item('EN1-RECOM-01', 'Comprehends independently read texts by activating background knowledge and monitoring meaning', "Reading comprehension — understanding what he's read", 'English'),
  item('EN1-CWT-01', 'Plans, creates and revises texts for different purposes, including paragraphs', 'Writing — short stories, recounts, information texts', 'English'),
  item('EN1-SPELL-01', 'Applies phonological, orthographic and morphological knowledge when spelling', 'Spelling strategies beyond sounding out — word patterns and parts', 'English', { isOngoing: true }),
  item('EN1-HANDW-01', 'Uses a legible, fluent handwriting style, and digital tools, to create texts', 'Handwriting and basic typing', 'English'),
  item('EN1-UARL-01', 'Understands and responds to literature by creating texts with similar features', 'Responding to stories and poems, borrowing ideas for his own writing', 'English'),

  item('MA1-RWN-01', 'Reads, writes and orders 2- and 3-digit numbers using place value', 'Place value to the hundreds', 'Mathematics'),
  item('MA1-RWN-02', 'Partitions numbers to 1000 to record quantity values', 'Breaking numbers into hundreds, tens and ones', 'Mathematics'),
  item('MA1-CSQ-01', 'Uses number bonds and the addition\u2013subtraction relationship to solve problems', 'E.g. knowing 7+3=10 also means 10\u22123=7', 'Mathematics'),
  item('MA1-FG-01', 'Solves simple multiplication and division problems using equal groups and sharing', 'Early times-tables and sharing into groups', 'Mathematics'),
  item('MA1-GM-01', 'Represents and describes the positions of objects in familiar locations', "Maps, directions, 'next to', 'behind'", 'Mathematics'),
  item('MA1-GM-02', 'Measures, records and compares lengths using informal units, metres and centimetres', 'Using a ruler and tape measure', 'Mathematics'),
  item('MA1-GM-03', 'Creates and recognises halves, quarters and eighths of a length', 'Folding and measuring fractions of a length', 'Mathematics'),
  item('MA1-2DS-01', 'Recognises, describes and represents shapes including quadrilaterals and other polygons', 'Naming 2D shapes by their properties', 'Mathematics'),
  item('MA1-2DS-02', 'Measures and compares areas using informal units in rows and columns', 'Covering a shape with tiles or squares', 'Mathematics'),
  item('MA1-3DS-01', 'Recognises, describes and represents familiar three-dimensional objects', 'Cubes, cones, spheres, prisms', 'Mathematics',
    { khanResource: '2nd grade math \u2192 Geometry unit \u2192 "Identify shapes", "Classify shapes"', twinklResource: 'Search "3D shapes Year 2"',
      otherIdeas: 'A shape hunt around the house; short "3D shapes for kids" videos.' }),
  item('MA1-3DS-02', 'Measures, records and compares capacity and volume using informal units', 'How many cups fill a jug', 'Mathematics'),
  item('MA1-NSM-01', 'Measures, records and compares the masses of objects using informal units', 'Balance scales and everyday objects', 'Mathematics'),
  item('MA1-NSM-02', 'Describes, compares and orders durations, and reads half- and quarter-hour time', 'Reading a clock to the half and quarter hour', 'Mathematics',
    { khanResource: '2nd grade math \u2192 Measurement unit \u2192 "Telling time" lessons', twinklResource: 'Search "telling time Year 2"',
      otherIdeas: 'A play/toy clock for hands-on practice; the game "What\'s the Time, Mr Wolf?"' }),
  item('MA1-DATA-01', 'Gathers and organises data, displaying it in lists, tables and picture graphs', 'Simple surveys and tally counts', 'Mathematics'),
  item('MA1-DATA-02', 'Reasons about data representations to describe and interpret results', "Reading and talking about a graph he's made", 'Mathematics'),
  item('MA1-CHAN-01', 'Recognises and describes the element of chance in everyday events', "'Likely', 'unlikely', 'certain', 'impossible'", 'Mathematics'),

  item('ST1-1WS-S', 'Observes, questions and collects data to communicate and compare ideas', 'Working scientifically \u2014 the core investigation skill', 'Science & Technology', { isOngoing: true }),
  item('ST1-2DP-T', 'Uses materials, tools and equipment to develop solutions for a need or opportunity', 'Simple design and making tasks', 'Science & Technology'),
  item('ST1-3DP-T', 'Describes, follows and represents algorithms to solve problems', 'Step-by-step instructions, unplugged coding', 'Science & Technology'),
  item('ST1-4LW-S', 'Describes observable features of living things and their environments', 'Living World \u2014 plants, animals, habitats', 'Science & Technology'),
  item('ST1-6MW-S', 'Identifies that materials can be changed or combined', 'Material World \u2014 mixing, melting, dissolving', 'Science & Technology'),
  item('ST1-7MW-T', 'Describes how the properties of materials determine their use', 'Why we use wood, metal, plastic for different jobs', 'Science & Technology'),
  item('ST1-8PW-S', 'Describes common forms of energy and explores characteristics of sound energy', 'Physical World \u2014 light, heat, sound', 'Science & Technology'),
  item('ST1-9PW-ST', 'Investigates how forces and energy are used in products', 'Pushes, pulls, simple machines and toys', 'Science & Technology'),
  item('ST1-10ES-S', "Recognises observable changes in the sky and on the land, and identifies Earth's resources", 'Earth and Space \u2014 weather, day/night, natural resources', 'Science & Technology',
    { otherIdeas: 'The Bureau of Meteorology website; growing something small at home.' }),
  item('ST1-11DI-T', 'Identifies the components of digital systems and explores how data is represented', 'Digital technologies \u2014 what makes up a device', 'Science & Technology'),

  item('GE1-1', 'Describes features of places and the connections people have with places', 'Geography \u2014 what makes a place special', 'HSIE'),
  item('GE1-2', 'Identifies ways in which people interact with and care for places', 'Geography \u2014 looking after local spaces and environments', 'HSIE'),
  item('GE1-3', 'Communicates geographical information and uses geographical tools for inquiry', 'Geography \u2014 simple maps, photos, observations', 'HSIE'),
  item('HT1-1', 'Communicates an understanding of change and continuity in family life', 'History \u2014 how family life has changed over time', 'HSIE',
    { otherIdeas: 'Trove (National Library photo archive); ask a grandparent what life was like.' }),
  item('HT1-2', 'Identifies and describes significant people, events, places and sites in the local community over time', 'History \u2014 local history and community stories', 'HSIE'),
  item('HT1-3', "Describes the effects of changing technology on people's lives over time", 'History \u2014 old vs new technology and daily life', 'HSIE'),
  item('HT1-4', 'Demonstrates skills of historical inquiry and communication', 'History \u2014 asking questions about the past, using sources like photos', 'HSIE'),

  item('PD1-SM', 'Identifies personal strengths and strategies to manage feelings and emotions', 'Topic area \u2014 exact NESA codes vary; this reflects the Stage 1 focus', 'PDHPE'),
  item('PD1-IP', 'Builds and maintains respectful relationships and cooperates with others', 'Sharing, turn-taking, working in a pair or group', 'PDHPE'),
  item('PD1-MOV', 'Performs fundamental movement skills \u2014 running, jumping, throwing, catching, balancing \u2014 with control', 'Core physical education skills for this age', 'PDHPE', { isOngoing: true }),
  item('PD1-HS', 'Understands personal hygiene, safety rules and healthy choices', 'Sun safety, road safety, healthy food choices', 'PDHPE'),
  item('PD1-AP', 'Participates regularly in physical activity for enjoyment and fitness', 'Being active most days, trying new activities', 'PDHPE', { isOngoing: true }),

  item('CA1-VA', 'Makes artworks using a range of materials and techniques, and talks about what he made', 'Topic area \u2014 covers the four Creative Arts strands', 'Creative Arts'),
  item('CA1-MU', 'Sings, claps rhythms and experiments with sound using voice and instruments', 'Simple rhythm and pitch games', 'Creative Arts'),
  item('CA1-DR', 'Takes on roles and improvises in dramatic play', 'Pretend play, simple role-play scenes', 'Creative Arts'),
  item('CA1-DA', 'Explores movement, space and rhythm to express ideas', 'Moving to music, simple sequences', 'Creative Arts'),
];

export const STAGE3_CHECKLIST: ChecklistSeed[] = [
  item('EN3-OLC-01', 'Communicates to wide audiences with social and cultural awareness, by interacting and presenting, and by analysing and evaluating for understanding', 'Talking and listening \u2014 presenting to a group, adjusting language for the audience', 'English'),
  item('EN3-VOCAB-01', 'Extends Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, morphological analysis and generating precise definitions for specific contexts', 'Vocabulary \u2014 more precise, subject-specific words; understanding word parts', 'English'),
  item('EN3-RECOM-01', 'Fluently reads and comprehends texts for wide purposes, analysing text structures and language, and by monitoring comprehension', 'Reading fluency and comprehension combined', 'English'),
  item('EN3-CWT-01', 'Plans, creates and revises written texts for multiple purposes and audiences through selection of text features, sentence-level grammar, punctuation and word-level language', 'Writing \u2014 narrative, informative and persuasive texts', 'English'),
  item('EN3-SPELL-01', 'Automatically applies taught phonological, orthographic and morphological generalisations and strategies when spelling, and justifies spelling strategies used', 'Spelling with growing automaticity and self-correction', 'English', { isOngoing: true }),
  item('EN3-HANDW-01', 'Sustains a legible, fluent and automatic handwriting style', 'Handwriting fluency', 'English'),
  item('EN3-HANDW-02', 'Selects digital technologies to suit audience and purpose to create texts', 'Choosing the right digital tool for the task', 'English'),
  item('EN3-UARL-01', 'Analyses representations of ideas in literature through narrative, character, imagery, symbol and connotation, and adapts these representations when creating texts', 'Responding to literature \u2014 deeper analysis of character and imagery', 'English'),
  item('EN3-UARL-02', 'Analyses representations of ideas in literature through genre and theme that reflect perspective and context, argument and authority, and adapts these representations when creating texts', 'Responding to literature \u2014 genre, theme and perspective', 'English'),

  item('MA3-RN-01', 'Applies an understanding of place value and the role of zero to represent the properties of numbers', 'Place value for large numbers', 'Mathematics'),
  item('MA3-RN-02', 'Compares and orders decimals up to 3 decimal places', 'Decimals', 'Mathematics'),
  item('MA3-RN-03', 'Determines percentages of quantities, and finds equivalent fractions and decimals for benchmark percentage values', 'Percentages and equivalence', 'Mathematics'),
  item('MA3-AR-01', 'Selects and applies appropriate strategies to solve addition and subtraction problems', 'Additive strategies with larger numbers', 'Mathematics'),
  item('MA3-MR-01', 'Selects and applies appropriate strategies to solve multiplication and division problems', 'Multiplicative strategies', 'Mathematics'),
  item('MA3-MR-02', 'Constructs and completes number sentences involving multiplicative relations, applying the order of operations to calculations', 'Order of operations', 'Mathematics'),
  item('MA3-RQF-01', 'Compares and orders fractions with denominators of 2, 3, 4, 5, 6, 8 and 10', 'Comparing fractions', 'Mathematics'),
  item('MA3-RQF-02', 'Determines 1/2, 1/4, 1/5 and 1/10 of measures and quantities', 'Finding fractional amounts', 'Mathematics'),
  item('MA3-GM-01', 'Locates and describes points on a coordinate plane', 'Coordinates and grids', 'Mathematics'),
  item('MA3-GM-02', 'Selects and uses the appropriate unit and device to measure lengths and distances including perimeters', 'Length, distance and perimeter', 'Mathematics',
    { khanResource: 'Search "Area and perimeter" \u2014 Khan files this under their "4th grade" label despite matching Year 5 content', twinklResource: 'Search "perimeter Year 5"',
      otherIdeas: 'Measure real furniture or rooms at home; board games like Blokus.' }),
  item('MA3-GM-03', 'Measures and constructs angles, and identifies the relationships between angles on a straight line and angles at a point', 'Angles', 'Mathematics',
    { khanResource: 'Search "Measuring angles" \u2014 same note, may show under their "4th grade"', twinklResource: 'Search "angles Year 5"',
      otherIdeas: 'GeoGebra.org has a free interactive angle tool; an angle hunt around the house.' }),
  item('MA3-2DS-01', 'Investigates and classifies two-dimensional shapes, including triangles and quadrilaterals based on their properties', '2D shape properties', 'Mathematics'),
  item('MA3-2DS-02', 'Selects and uses the appropriate unit to calculate areas, including areas of rectangles', 'Area of rectangles', 'Mathematics',
    { khanResource: 'Search "area of rectangles"' }),
  item('MA3-2DS-03', 'Combines, splits and rearranges shapes to determine the area of parallelograms and triangles', 'Area of parallelograms and triangles', 'Mathematics',
    { khanResource: 'Search "area of triangles"' }),
  item('MA3-3DS-01', 'Visualises, sketches and constructs three-dimensional objects, including prisms and pyramids, making connections to two-dimensional representations', '3D objects, prisms and pyramids', 'Mathematics'),
  item('MA3-3DS-02', 'Selects and uses the appropriate unit to estimate, measure and calculate volumes and capacities', 'Volume and capacity', 'Mathematics'),
  item('MA3-NSM-01', 'Selects and uses the appropriate unit and device to measure the masses of objects', 'Mass', 'Mathematics'),
  item('MA3-NSM-02', 'Measures and compares duration, using 12- and 24-hour time and am and pm notation', 'Time, including 24-hour clock', 'Mathematics'),
  item('MA3-DATA-01', 'Constructs graphs using many-to-one scales', 'Graphing with scaled data', 'Mathematics'),
  item('MA3-DATA-02', 'Interprets data displays, including timelines and line graphs', 'Reading timelines and line graphs', 'Mathematics'),
  item('MA3-CHAN-01', 'Conducts chance experiments and quantifies the probability', 'Probability as a number', 'Mathematics'),

  item('ST3-1WS-S', 'Plans and conducts scientific investigations to answer testable questions, and collects and summarises data to communicate conclusions', 'Working scientifically \u2014 fair tests and conclusions', 'Science & Technology', { isOngoing: true }),
  item('ST3-2DP-T', 'Plans and uses materials, tools and equipment to develop solutions for a need or opportunity', 'Design and production tasks', 'Science & Technology'),
  item('ST3-3DP-T', 'Defines problems, and designs, modifies and follows algorithms to develop solutions', 'Coding and algorithms', 'Science & Technology'),
  item('ST3-4LW-S', 'Examines how the environment affects the growth, survival and adaptation of living things', 'Living World \u2014 adaptation and environment', 'Science & Technology'),
  item('ST3-5LW-T', 'Explains how food and fibre are produced sustainably in managed environments for health and nutrition', 'Agriculture and sustainable food production', 'Science & Technology'),
  item('ST3-6MW-S', 'Explains the effect of heat on the properties and behaviour of materials', 'Material World \u2014 heat and materials', 'Science & Technology'),
  item('ST3-7MW-T', 'Explains how the properties of materials determine their use for a range of purposes', 'Choosing materials for purpose', 'Science & Technology',
    { otherIdeas: 'A mini engineering test: stack blocks with/without "mortar" (glue or playdough).' }),
  item('ST3-8PW-ST', 'Explains how energy is transformed from one form to another', 'Physical World \u2014 energy transformation', 'Science & Technology'),
  item('ST3-9PW-ST', 'Investigates the effects of increasing or decreasing the strength of a specific contact or non-contact force', 'Forces', 'Science & Technology'),
  item('ST3-10ES-S', "Explains regular events in the solar system and geological events on the Earth's surface", 'Earth and Space', 'Science & Technology'),
  item('ST3-11DI-T', 'Explains how digital systems represent data, connect together to form networks and transmit data', 'Digital technologies \u2014 networks and data', 'Science & Technology'),

  item('GE3-1', 'Describes the diverse features and characteristics of places and environments', 'Geography \u2014 features of places', 'HSIE'),
  item('GE3-2', 'Explains interactions and connections between people, places and environments', 'Geography \u2014 how people and places interact', 'HSIE'),
  item('GE3-3', 'Compares and contrasts influences on the management of places and environments', 'Geography \u2014 managing places and environments', 'HSIE'),
  item('GE3-4', 'Acquires, processes and communicates geographical information using geographical tools for inquiry', 'Geography \u2014 maps, tools, geographical inquiry', 'HSIE'),
  item('HT3-1', 'Describes and explains the significance of people, places and events to the development of Australia', 'History \u2014 colonial Australia', 'HSIE'),
  item('HT3-2', 'Describes and explains different experiences of people living in Australia over time', 'History \u2014 varied experiences over time', 'HSIE',
    { otherIdeas: 'Trove; the State Library online collections; a local council heritage page.' }),
  item('HT3-3', 'Identifies change and continuity and describes the causes and effects of change on Australian society', 'History \u2014 Australia as a nation, change over time', 'HSIE'),
  item('HT3-4', 'Describes and explains the struggles for rights and freedoms in Australia', 'History \u2014 rights and freedoms', 'HSIE'),
  item('HT3-5', 'Applies a variety of skills of historical inquiry and communication', 'History \u2014 inquiry skills, using sources', 'HSIE'),

  item('PD3-1', 'Identifies and applies strengths and strategies to manage life changes and transitions', 'Self-management \u2014 coping with change', 'PDHPE'),
  item('PD3-2', 'Investigates information, community resources and strategies to demonstrate resilience and seek help for themselves and others', 'Resilience and help-seeking', 'PDHPE'),
  item('PD3-3', 'Evaluates the impact of empathy, inclusion and respect on themselves and others', 'Empathy, inclusion and respect', 'PDHPE'),
  item('PD3-4', 'Adapts movement skills in a variety of physical activity contexts', 'Movement skills across different sports/activities', 'PDHPE', { isOngoing: true }),
  item('PD3-6', 'Distinguishes contextual factors that influence health, safety, wellbeing and participation in physical activity which are controllable and uncontrollable', "Health and safety \u2014 what can and can't be controlled", 'PDHPE'),
  item('PD3-7', 'Proposes and implements actions and protective strategies that promote health, safety, wellbeing and physically active spaces', 'Protective strategies and safety planning', 'PDHPE'),
  item('PD3-9', 'Applies and adapts self-management skills to respond to personal and group situations', 'Self-management in real situations', 'PDHPE'),
  item('PD3-10', 'Selects and uses interpersonal skills to interact respectfully with others to promote inclusion and build connections', 'Interpersonal skills', 'PDHPE'),
  item('PD3-11', 'Selects, manipulates and modifies movement skills and concepts to effectively create and perform movement sequences', 'Composing and performing movement sequences', 'PDHPE'),

  item('CA3-VA', 'Investigates subject matter and makes artworks for different audiences, using a range of materials, techniques and viewpoints', 'Topic area \u2014 exact NESA codes vary; this reflects the Stage 3 focus', 'Creative Arts'),
  item('CA3-MU', 'Performs, composes and uses listening skills to communicate musical ideas, and describes how musical elements convey meaning', 'More independent composing and performing', 'Creative Arts'),
  item('CA3-DR', 'Makes and performs drama to embody and enact characters, ideas and stories for an audience', 'Devised drama and performance for an audience', 'Creative Arts'),
  item('CA3-DA', 'Composes and performs dance to communicate ideas to an audience, describing how the elements of dance convey meaning', 'Composing and performing dance sequences', 'Creative Arts'),
];

// Covers the 5 mandatory KLAs still current in Year 10: English, Mathematics,
// Science, HSIE and PDHPE. Creative Arts and Technology (Mandatory) are
// typically already completed in Years 7-8, so they're deliberately not
// included here (matching the source printable checklist).
export const STAGE5_CHECKLIST: ChecklistSeed[] = [
  item('EN5-RVL-01', 'Uses a range of personal, creative and critical strategies to interpret complex texts', 'Interpreting complex texts from multiple angles', 'English'),
  item('EN5-URA-01', 'Analyses how meaning is created through the use and interpretation of increasingly complex language forms, features and structures', 'Analysing language forms and structures', 'English'),
  item('EN5-URB-01', 'Evaluates how texts represent ideas and experiences, and how they can affirm or challenge values and attitudes', 'Evaluating how texts represent ideas and challenge values', 'English'),
  item('EN5-URC-01', 'Investigates and explains ways of valuing texts and the relationships between them', "Comparing texts and how they're valued", 'English'),
  item('EN5-ECA-01', 'Crafts personal, creative and critical texts for a range of audiences by experimenting with and controlling language forms and features to shape meaning', 'Writing \u2014 crafting texts for different audiences', 'English'),
  item('EN5-ECB-01', 'Uses processes of planning, monitoring, revising and reflecting to purposefully develop and refine composition of texts', 'Writing process \u2014 drafting, revising, reflecting', 'English', { isOngoing: true }),

  item('MAO-WM-01', 'Develops understanding and fluency in mathematics through exploring and connecting mathematical concepts, choosing and applying techniques to solve problems, and communicating reasoning clearly', 'Overarching working mathematically outcome', 'Mathematics', { isOngoing: true }),
  item('MA5-FIN-C-01', 'Solves financial problems involving simple interest, earning money and spending money', 'Financial maths A', 'Mathematics'),
  item('MA5-FIN-C-02', 'Solves financial problems involving compound interest and depreciation', 'Financial maths B', 'Mathematics'),
  item('MA5-ALG-C-01', 'Simplifies algebraic fractions with numerical denominators and expands algebraic expressions', 'Algebraic techniques', 'Mathematics'),
  item('MA5-IND-C-01', 'Simplifies algebraic expressions involving positive-integer and zero indices, and establishes the meaning of negative indices for numerical bases', 'Indices', 'Mathematics'),
  item('MA5-EQU-C-01', 'Solves linear equations of up to 3 steps, limited to one algebraic fraction', 'Equations', 'Mathematics'),
  item('MA5-LIN-C-01', 'Determines the midpoint, gradient and length of an interval, and graphs linear relationships, with and without digital tools', 'Linear relationships A', 'Mathematics'),
  item('MA5-LIN-C-02', 'Graphs and interprets linear relationships using the gradient/slope-intercept form', 'Linear relationships B', 'Mathematics'),
  item('MA5-NLI-C-01', 'Identifies connections between algebraic and graphical representations of quadratic and exponential relationships in various contexts', 'Non-linear relationships A', 'Mathematics'),
  item('MA5-NLI-C-02', 'Identifies and compares features of parabolas and exponential curves in various contexts', 'Non-linear relationships B', 'Mathematics'),
  item('MA5-MAG-C-01', 'Solves measurement problems by using scientific notation to represent numbers and rounding to a given number of significant figures', 'Scientific notation and significant figures', 'Mathematics'),
  item('MA5-TRG-C-01', 'Applies trigonometric ratios to solve right-angled triangle problems', 'Trigonometry A', 'Mathematics'),
  item('MA5-TRG-C-02', 'Applies trigonometry to solve problems, including bearings and angles of elevation and depression', 'Trigonometry B', 'Mathematics'),
  item('MA5-ARE-C-01', 'Solves problems involving the surface area of right prisms and practical problems involving the area of composite shapes and solids', 'Surface area', 'Mathematics'),
  item('MA5-VOL-C-01', 'Solves problems involving the volume of composite solids consisting of right prisms and cylinders', 'Volume', 'Mathematics'),
  item('MA5-GEO-C-01', 'Identifies and applies the properties of similar figures and scale drawings to solve problems', 'Similarity and scale', 'Mathematics'),
  item('MA5-DAT-C-01', 'Compares and analyses datasets using summary statistics and graphical representations', 'Data analysis A', 'Mathematics'),
  item('MA5-DAT-C-02', 'Displays and interprets datasets involving bivariate data', 'Data analysis B \u2014 bivariate data', 'Mathematics'),
  item('MA5-PRO-C-01', 'Solves problems involving probabilities in multistage chance experiments and simulations', 'Probability', 'Mathematics'),

  item('SC5-WS-01', 'Observing \u2014 selects and uses scientific tools and instruments for accurate observations', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC5-WS-02', 'Questioning and predicting \u2014 develops questions and hypotheses for scientific investigation', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC5-WS-03', 'Planning investigations \u2014 designs safe, ethical, valid and reliable investigations', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC5-WS-04', 'Conducting investigations \u2014 follows a planned procedure to undertake safe, ethical, valid and reliable investigations', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC5-WS-05', 'Processing data and information \u2014 selects and uses a range of tools to process and represent data', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC5-WS-06', 'Analysing data and information \u2014 analyses data from investigations to identify trends, patterns and relationships, and draws conclusions', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC5-WS-07', 'Problem-solving \u2014 selects suitable problem-solving strategies and evaluates proposed solutions to identified problems', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC5-WS-08', 'Communicating \u2014 communicates scientific arguments with evidence, using scientific language and terminology in a range of communication forms', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC5-EGY-01', 'Evaluates current and alternative energy use based on ethical and sustainability considerations', 'Energy', 'Science'),
  item('SC5-DIS-01', 'Explains how an understanding of the causes of disease can be used to prevent and manage the spread of disease', 'Disease', 'Science'),
  item('SC5-MAT-01', 'Assesses the uses of materials based on their physical and chemical properties', 'Materials', 'Science'),
  item('SC5-ENV-01', 'Analyses the impact of human activity on the natural world', 'Environmental sustainability', 'Science'),
  item('SC5-GEV-01', 'Describes the relationship between the diversity of living things and the theory of evolution', 'Genetics and evolutionary change A', 'Science'),
  item('SC5-GEV-02', 'Explains how DNA is responsible for the transmission of heritable characteristics and can be manipulated through genetic technologies', 'Genetics and evolutionary change B', 'Science'),
  item('SC5-RXN-01', 'Describes a range of reaction types', 'Reactions A', 'Science'),
  item('SC5-RXN-02', 'Explains the factors that affect the rate of chemical reactions', 'Reactions B', 'Science'),
  item('SC5-WAM-01', 'Describes the features and applications of different forms of waves', 'Waves and motion A', 'Science'),
  item('SC5-WAM-02', "Explains the motion of objects using Newton's laws of motion", 'Waves and motion B', 'Science'),
  item('SC5-DA2-01', 'Assesses the use of scientific knowledge and data in evidence-based decisions and when verifying the legitimacy of claims', 'Data science \u2014 evaluating claims and evidence', 'Science'),

  item('GE5-1', 'Explains the diverse features and characteristics of a range of places and environments', 'Features of places', 'HSIE Geography'),
  item('GE5-2', 'Explains processes and influences that form and transform places and environments', 'How places are formed and transformed', 'HSIE Geography'),
  item('GE5-3', 'Analyses the effect of interactions and connections between people, places and environments', 'People, places and environments', 'HSIE Geography'),
  item('GE5-4', 'Accounts for perspectives of people and organisations on a range of geographical issues', 'Different perspectives on geographical issues', 'HSIE Geography'),
  item('GE5-5', 'Assesses management strategies for places and environments for their sustainability', 'Managing places sustainably', 'HSIE Geography'),
  item('GE5-6', 'Analyses differences in human wellbeing and ways to improve human wellbeing', 'Human wellbeing', 'HSIE Geography'),
  item('GE5-7', 'Acquires and processes geographical information by selecting and using appropriate and relevant geographical tools for inquiry', 'Geographical tools and inquiry', 'HSIE Geography'),
  item('GE5-8', 'Communicates geographical information to a range of audiences using a variety of strategies', 'Communicating geographical findings', 'HSIE Geography'),

  item('HT5-1', 'Explains and assesses the historical forces and factors that shaped the modern world and Australia', 'Forces that shaped the modern world', 'HSIE History'),
  item('HT5-2', 'Sequences and explains the significant patterns of continuity and change in the development of the modern world and Australia', 'Continuity and change', 'HSIE History'),
  item('HT5-3', 'Explains and analyses the motives and actions of past individuals and groups in the historical contexts that shaped the modern world and Australia', 'Motives and actions of individuals and groups', 'HSIE History'),
  item('HT5-4', 'Explains and analyses the causes and effects of events and developments in the modern world and Australia', 'Causes and effects', 'HSIE History'),
  item('HT5-5', 'Identifies and evaluates the usefulness of sources in the historical inquiry process', 'Evaluating historical sources', 'HSIE History'),
  item('HT5-6', 'Uses relevant evidence from sources to support historical narratives, explanations and analyses of the modern world and Australia', 'Using evidence to support analysis', 'HSIE History'),
  item('HT5-7', 'Explains different contexts, perspectives and interpretations of the modern world and Australia', 'Different perspectives and interpretations', 'HSIE History'),
  item('HT5-8', 'Selects and analyses a range of historical sources to locate information relevant to an historical inquiry', 'Source analysis for inquiry', 'HSIE History'),
  item('HT5-9', 'Applies a range of relevant historical terms and concepts when communicating an understanding of the past', 'Historical terms and concepts', 'HSIE History'),
  item('HT5-10', 'Selects and uses appropriate oral, written, visual and digital forms to communicate effectively about the past for different audiences', 'Communicating history to an audience', 'HSIE History'),

  item('PD5-1', "Assesses their own and others' capacity to reflect on and respond positively to challenges", 'Self-reflection and resilience', 'PDHPE'),
  item('PD5-2', 'Researches and appraises the effectiveness of health information and support services available in the community', 'Evaluating health information and services', 'PDHPE'),
  item('PD5-3', 'Analyses factors and strategies that enhance inclusivity, equality and respectful relationships', 'Inclusivity and respectful relationships', 'PDHPE'),
  item('PD5-4', 'Adapts and improvises movement skills to perform creative movement across a range of dynamic physical activity contexts', 'Movement skills \u2014 creative and adaptive', 'PDHPE', { isOngoing: true }),
  item('PD5-5', 'Appraises and justifies choices of actions when solving complex movement challenges', 'Movement challenges and decision-making', 'PDHPE'),
  item('PD5-6', 'Critiques contextual factors, attitudes and behaviours to effectively promote health, safety, wellbeing and participation in physical activity', 'Critiquing health and safety factors', 'PDHPE'),
  item('PD5-7', 'Plans, implements and critiques strategies to promote health, safety, wellbeing and participation in physical activity in their communities', 'Community health strategies', 'PDHPE'),
  item('PD5-8', 'Designs, implements and evaluates personalised plans to enhance health and participation in a lifetime of physical activity', 'Personalised health and activity plans', 'PDHPE'),
  item('PD5-9', 'Assesses and applies self-management skills to effectively manage complex situations', 'Self-management in complex situations', 'PDHPE'),
  item('PD5-10', 'Critiques their ability to enact interpersonal skills to build and maintain respectful and inclusive relationships in a variety of group contexts', 'Interpersonal skills across group contexts', 'PDHPE'),
  item('PD5-11', 'Refines and applies movement skills and concepts to compose and perform innovative movement sequences', 'Composing and performing movement sequences', 'PDHPE', { isOngoing: true }),
];

// Official wording confirmed directly from NESA's own "Record of learning and
// achievement using syllabus outcomes" homeschooling templates for English,
// Mathematics, and Science & Technology. Geography and History confirmed
// across multiple independent NSW curriculum sources. PDHPE and Creative
// Arts are genuinely "embedded within content" rather than discrete outcomes
// at Stage 2 (per NESA's own syllabus overview), so — matching how Stage 1
// and Stage 3 already handle this — these use topic labels rather than
// invented codes.
export const STAGE2_CHECKLIST: ChecklistSeed[] = [
  item('EN2-OLC-01', 'Communicates with familiar audiences for social and learning purposes, by interacting, understanding and presenting', 'Talking and listening for familiar audiences', 'English'),
  item('EN2-VOCAB-01', 'Builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, and by defining and analysing words', 'Vocabulary \u2014 wider, more precise word choices', 'English'),
  item('EN2-REFLU-01', 'Sustains independent reading with accuracy, automaticity, rate and prosody suited to purpose, audience and meaning', 'Reading fluency \u2014 sustained, expressive reading', 'English'),
  item('EN2-RECOM-01', 'Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension', 'Reading comprehension across a range of texts', 'English'),
  item('EN2-CWT-01', 'Plans, creates and revises written texts for imaginative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience', 'Writing \u2014 imaginative texts', 'English'),
  item('EN2-CWT-02', 'Plans, creates and revises written texts for informative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience', 'Writing \u2014 informative texts', 'English'),
  item('EN2-CWT-03', 'Plans, creates and revises written texts for persuasive purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience', 'Writing \u2014 persuasive texts', 'English'),
  item('EN2-SPELL-01', 'Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts', 'Spelling \u2014 selecting and explaining strategies', 'English', { isOngoing: true }),
  item('EN2-HANDW-01', 'Forms legible joined letters to develop handwriting fluency', 'Handwriting \u2014 joined, fluent letters', 'English'),
  item('EN2-HANDW-02', 'Uses digital technologies to create texts', 'Using digital tools to create texts', 'English'),
  item('EN2-UARL-01', 'Identifies and describes how ideas are represented in literature and strategically uses similar representations when creating texts', 'Responding to literature and borrowing its techniques', 'English'),

  item('MAO-WM-01', 'Develops understanding and fluency in mathematics through exploring and connecting mathematical concepts, choosing and applying mathematical techniques to solve problems, and communicating their thinking and reasoning coherently and clearly', 'Overarching working mathematically outcome', 'Mathematics', { isOngoing: true }),
  item('MA2-RN-01', 'Applies an understanding of place value and the role of zero to represent numbers to at least tens of thousands', 'Place value to tens of thousands', 'Mathematics'),
  item('MA2-RN-02', 'Represents and compares decimals up to 2 decimal places using place value', 'Decimals to 2 places', 'Mathematics'),
  item('MA2-AR-01', 'Selects and uses mental and written strategies for addition and subtraction involving 2- and 3-digit numbers', 'Addition and subtraction strategies', 'Mathematics'),
  item('MA2-AR-02', 'Completes number sentences involving addition and subtraction by finding missing values', 'Missing-value number sentences', 'Mathematics'),
  item('MA2-MR-01', 'Represents and uses the structure of multiplicative relations to 10 \u00d7 10 to solve problems', 'Times tables to 10x10', 'Mathematics'),
  item('MA2-MR-02', 'Completes number sentences involving multiplication and division by finding missing values', 'Missing-value multiplication/division sentences', 'Mathematics'),
  item('MA2-PF-01', 'Represents and compares halves, quarters, thirds and fifths as lengths on a number line and their related fractions formed by halving (eighths, sixths and tenths)', 'Fractions on a number line', 'Mathematics'),
  item('MA2-GM-01', 'Uses grid maps and directional language to locate positions and follow routes', 'Grid maps and directions', 'Mathematics'),
  item('MA2-GM-02', 'Measures and estimates lengths in metres, centimetres and millimetres', 'Length in m, cm and mm', 'Mathematics'),
  item('MA2-GM-03', 'Identifies angles and classifies them by comparing to a right angle', 'Angles compared to a right angle', 'Mathematics'),
  item('MA2-2DS-01', 'Compares two-dimensional shapes and describes their features', '2D shape features', 'Mathematics'),
  item('MA2-2DS-02', 'Performs transformations by combining and splitting two-dimensional shapes', 'Combining and splitting 2D shapes', 'Mathematics'),
  item('MA2-2DS-03', 'Estimates, measures and compares areas using square centimetres and square metres', 'Area in sq cm and sq m', 'Mathematics'),
  item('MA2-3DS-01', 'Makes and sketches models and nets of three-dimensional objects including prisms and pyramids', '3D models and nets', 'Mathematics'),
  item('MA2-3DS-02', 'Estimates, measures and compares capacities (internal volumes) using litres, millilitres and volumes using cubic centimetres', 'Capacity and volume', 'Mathematics'),
  item('MA2-NSM-01', 'Estimates, measures and compares the masses of objects using kilograms and grams', 'Mass in kg and g', 'Mathematics'),
  item('MA2-NSM-02', 'Represents and interprets analog and digital time in hours, minutes and seconds', 'Analog and digital time', 'Mathematics'),
  item('MA2-DATA-01', 'Collects discrete data and constructs graphs using a given scale', 'Collecting data, scaled graphs', 'Mathematics'),
  item('MA2-DATA-02', 'Interprets data in tables, dot plots and column graphs', 'Interpreting tables and graphs', 'Mathematics'),
  item('MA2-CHAN-01', 'Records and compares the results of chance experiments', 'Chance experiments', 'Mathematics'),

  item('ST2-1WS-S', 'Questions, plans and conducts scientific investigations, collects and summarises data and communicates using scientific representations', 'Working scientifically', 'Science & Technology', { isOngoing: true }),
  item('ST2-2DP-T', 'Selects and uses materials, tools and equipment to develop solutions for a need or opportunity', 'Design and production tasks', 'Science & Technology'),
  item('ST2-3DP-T', 'Defines problems, describes and follows algorithms to develop solutions', 'Algorithms and coding', 'Science & Technology'),
  item('ST2-4LW-S', 'Compares features and characteristics of living and non-living things', 'Living vs non-living things', 'Science & Technology'),
  item('ST2-5LW-T', 'Describes how agricultural processes are used to grow plants and raise animals for food, clothing and shelter', 'Agriculture and food production', 'Science & Technology'),
  item('ST2-6MW-S', 'Describes how adding or removing heat causes a change of state', 'Heat and changes of state', 'Science & Technology'),
  item('ST2-7MW-T', 'Investigates the suitability of natural and processed materials for a range of purposes', 'Material suitability for purpose', 'Science & Technology'),
  item('ST2-8PW-ST', 'Describes the characteristics and effects of common forms of energy, such as light and heat', 'Forms of energy', 'Science & Technology'),
  item('ST2-9PW-ST', "Describes how contact and non-contact forces affect an object's motion", 'Contact and non-contact forces', 'Science & Technology'),
  item('ST2-10ES-S', "Investigates regular changes caused by interactions between the Earth and the Sun, and changes to the Earth's surface", 'Earth, Sun and surface changes', 'Science & Technology'),
  item('ST2-11DI-T', 'Describes how digital systems represent and transmit data', 'Digital systems and data', 'Science & Technology'),

  item('GE2-1', 'Examines features and characteristics of places and environments', 'Features of places', 'HSIE'),
  item('GE2-2', 'Describes the ways people, places and environments interact', 'People, places and environments interacting', 'HSIE'),
  item('GE2-3', 'Examines differing perceptions about the management of places and environments', 'Different views on managing places', 'HSIE'),
  item('GE2-4', 'Acquires and communicates geographical information using geographical tools for inquiry', 'Geographical tools and inquiry', 'HSIE'),
  item('HT2-1', 'Identifies celebrations and commemorations of significance in Australia and the world', 'Celebrations and commemorations', 'HSIE'),
  item('HT2-2', 'Describes and explains how significant individuals, groups and events contributed to changes in the local community over time', 'Local community change over time', 'HSIE'),
  item('HT2-3', 'Describes people, events and actions related to world exploration and its effects', 'World exploration and its effects', 'HSIE'),
  item('HT2-4', 'Describes and explains effects of British colonisation in Australia', 'British colonisation of Australia', 'HSIE'),
  item('HT2-5', 'Applies skills of historical inquiry and communication', 'Historical inquiry skills', 'HSIE'),

  item('PD2-SM', 'Identifies and practises strategies to manage change, transitions, and emotions', 'Topic area \u2014 embedded within content at Stage 2, exact NESA codes vary', 'PDHPE'),
  item('PD2-IP', 'Contributes to healthy and respectful relationships, and demonstrates inclusive behaviour', 'Relationships and inclusion', 'PDHPE'),
  item('PD2-MOV', 'Refines fundamental movement skills and applies them in a range of physical activities', 'Movement skills across activities', 'PDHPE', { isOngoing: true }),
  item('PD2-HS', 'Identifies factors that influence health, safety and wellbeing decisions', 'Health and safety decision-making', 'PDHPE'),
  item('PD2-AP', 'Participates in a range of physical activities that develop health-related fitness', 'Active participation and fitness', 'PDHPE', { isOngoing: true }),

  item('CA2-VA', 'Makes artworks using a widening range of materials, techniques and subject matter, and discusses the ideas behind them', 'Topic area \u2014 embedded within content at Stage 2, exact NESA codes vary', 'Creative Arts'),
  item('CA2-MU', 'Sings, plays and composes simple rhythmic and melodic patterns, and identifies musical elements in pieces they listen to', 'Composing, performing and listening', 'Creative Arts'),
  item('CA2-DR', 'Devises and performs drama using role and situation to explore ideas', 'Devised drama and role-play', 'Creative Arts'),
  item('CA2-DA', 'Composes and performs simple movement sequences using elements of dance', 'Composing and performing dance', 'Creative Arts'),
];

// Same sourcing approach as Stage 2: official wording for English, Mathematics,
// Science and Technology (Mandatory) confirmed directly from NESA's homeschooling
// templates; History and Geography confirmed across multiple independent
// sources; PDHPE uses topic labels since NESA's own Stage 4/5 PDHPE syllabus
// is mid-transition to a new 2024 version (implementation still being phased
// in), so precise current codes are less stable to pin down than for the
// other KLAs.
export const STAGE4_CHECKLIST: ChecklistSeed[] = [
  item('EN4-RVL-01', 'Uses a range of personal, creative and critical strategies to read texts that are complex in their ideas and construction', 'Reading complex texts', 'English'),
  item('EN4-URA-01', 'Analyses how meaning is created through the use of and response to language forms, features and structures', 'Analysing language forms and structures', 'English'),
  item('EN4-URB-01', 'Examines and explains how texts represent ideas, experiences and values', 'How texts represent ideas and values', 'English'),
  item('EN4-URC-01', 'Identifies and explains ways of valuing texts and the connections between them', 'Valuing texts and connections between them', 'English'),
  item('EN4-ECA-01', 'Creates personal, creative and critical texts for a range of audiences by using linguistic and stylistic conventions of language to express ideas', 'Writing \u2014 creating texts for different audiences', 'English'),
  item('EN4-ECB-01', 'Uses processes of planning, monitoring, revising and reflecting to support and develop composition of texts', 'Writing process \u2014 planning, revising, reflecting', 'English', { isOngoing: true }),

  item('MAO-WM-01', 'Develops understanding and fluency in mathematics through exploring and connecting mathematical concepts, choosing and applying mathematical techniques to solve problems, and communicating their thinking and reasoning coherently and clearly', 'Overarching working mathematically outcome', 'Mathematics', { isOngoing: true }),
  item('MA4-INT-C-01', 'Compares, orders and calculates with integers to solve problems', 'Integers', 'Mathematics'),
  item('MA4-FRC-C-01', 'Represents and operates with fractions, decimals and percentages to solve problems', 'Fractions, decimals, percentages', 'Mathematics'),
  item('MA4-RAT-C-01', 'Solves problems involving ratios and rates, and analyses distance\u2013time graphs', 'Ratios, rates and distance-time graphs', 'Mathematics'),
  item('MA4-ALG-C-01', 'Generalises number properties to operate with algebraic expressions including expansion and factorisation', 'Algebraic expressions', 'Mathematics'),
  item('MA4-IND-C-01', 'Operates with primes and roots, positive-integer and zero indices involving numerical bases and establishes the relevant index laws', 'Indices, primes and roots', 'Mathematics'),
  item('MA4-EQU-C-01', 'Solves linear equations of up to 2 steps and quadratic equations of the form ax\u00b2 = c', 'Linear and simple quadratic equations', 'Mathematics'),
  item('MA4-LIN-C-01', 'Creates and displays number patterns and finds graphical solutions to problems involving linear relationships', 'Number patterns and linear graphs', 'Mathematics'),
  item('MA4-LEN-C-01', 'Applies knowledge of the perimeter of plane shapes and the circumference of circles to solve problems', 'Perimeter and circumference', 'Mathematics'),
  item('MA4-PYT-C-01', "Applies Pythagoras' theorem to solve problems in various contexts", "Pythagoras' theorem", 'Mathematics'),
  item('MA4-ARE-C-01', 'Applies knowledge of area and composite area involving triangles, quadrilaterals and circles to solve problems', 'Area and composite area', 'Mathematics'),
  item('MA4-VOL-C-01', 'Applies knowledge of volume and capacity to solve problems involving right prisms and cylinders', 'Volume and capacity', 'Mathematics'),
  item('MA4-ANG-C-01', 'Applies angle relationships to solve problems, including those related to transversals on sets of parallel lines', 'Angle relationships', 'Mathematics'),
  item('MA4-GEO-C-01', 'Identifies and applies the properties of triangles and quadrilaterals to solve problems', 'Triangle and quadrilateral properties', 'Mathematics'),
  item('MA4-DAT-C-01', 'Classifies and displays data using a variety of graphical representations', 'Displaying data graphically', 'Mathematics'),
  item('MA4-DAT-C-02', 'Analyses simple datasets using measures of centre, range and shape of the data', 'Analysing datasets', 'Mathematics'),
  item('MA4-PRO-C-01', 'Solves problems involving the probabilities of simple chance experiments', 'Probability of simple chance experiments', 'Mathematics'),

  item('SC4-WS-01', 'Observing \u2014 uses scientific tools and instruments for observations', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC4-WS-02', 'Questioning and predicting \u2014 identifies questions and makes predictions to guide scientific investigations', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC4-WS-03', 'Planning investigations \u2014 plans safe and valid investigations', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC4-WS-04', 'Conducting investigations \u2014 follows a planned procedure to undertake safe and valid investigations', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC4-WS-05', 'Processing data and information \u2014 uses a variety of ways to process and represent data', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC4-WS-06', 'Analysing data and information \u2014 uses data to identify trends, patterns and relationships, and draw conclusions', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC4-WS-07', 'Problem-solving \u2014 identifies problem-solving strategies and proposes solutions', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC4-WS-08', 'Communicating \u2014 communicates scientific concepts and ideas using a range of communication forms', 'Working Scientifically', 'Science', { isOngoing: true }),
  item('SC4-OTU-01', 'Explains how observations are used by scientists to increase knowledge and understanding of the Universe', 'The Universe', 'Science'),
  item('SC4-FOR-01', 'Describes the effects of forces in everyday contexts', 'Forces in everyday contexts', 'Science'),
  item('SC4-CLS-01', 'Describes the unique features of cells in living things and how structural features can be used to classify organisms', 'Cells and classification', 'Science'),
  item('SC4-SOL-01', 'Explains how the properties of substances enable separation in a range of techniques', 'Separating substances', 'Science'),
  item('SC4-LIV-01', 'Describes the role, structure and function of a range of living systems and their components', 'Living systems', 'Science'),
  item('SC4-PRT-01', 'Explains how uses of elements and compounds are influenced by scientific understanding and discoveries relating to their properties', 'Elements and compounds', 'Science'),
  item('SC4-CHG-01', 'Explains how energy causes geological and chemical change', 'Energy causing geological/chemical change', 'Science'),
  item('SC4-DA1-01', 'Explains how data is used by scientists to model and predict scientific phenomena', 'Data, modelling and prediction', 'Science'),

  item('GE4-1', 'Locates and describes the diverse features and characteristics of a range of places and environments', 'Features of places', 'HSIE Geography'),
  item('GE4-2', 'Describes processes and influences that form and transform places and environments', 'How places are formed and transformed', 'HSIE Geography'),
  item('GE4-3', 'Explains how interactions and connections between people, places and environments result in change', 'Interactions causing change', 'HSIE Geography'),
  item('GE4-4', 'Examines perspectives of people and organisations on a range of geographical issues', 'Perspectives on geographical issues', 'HSIE Geography'),

  item('HT4-1', 'Describes the nature of history and archaeology and explains their contribution to an understanding of the past', 'The nature of history and archaeology', 'HSIE History'),
  item('HT4-2', 'Describes major periods of historical time and sequences events, people and societies from the past', 'Sequencing historical time', 'HSIE History'),
  item('HT4-3', 'Describes and assesses the motives and actions of past individuals and groups in the context of past societies', 'Motives and actions of individuals/groups', 'HSIE History'),
  item('HT4-4', 'Describes and explains the causes and effects of events and developments of past societies over time', 'Causes and effects', 'HSIE History'),
  item('HT4-5', 'Identifies the meaning, purpose and context of historical sources', 'Meaning and context of sources', 'HSIE History'),
  item('HT4-6', 'Uses evidence from sources to support historical narratives and explanations', 'Using evidence from sources', 'HSIE History'),
  item('HT4-7', 'Identifies and describes different contexts, perspectives and interpretations of the past', 'Different perspectives and interpretations', 'HSIE History'),
  item('HT4-8', 'Locates, selects and organises information from sources to develop an historical inquiry', 'Organising sources for inquiry', 'HSIE History'),
  item('HT4-9', 'Uses a range of historical terms and concepts when communicating an understanding of the past', 'Historical terms and concepts', 'HSIE History'),
  item('HT4-10', 'Selects and uses appropriate oral, written, visual and digital forms to communicate about the past', 'Communicating about the past', 'HSIE History'),

  item('TE4-SDP-01', 'Explains relationships between sustainability, design and production', 'Sustainability, design and production', 'Technology (Mandatory)'),
  item('TE4-PDP-01', 'Describes the practices and processes of designers and producers', 'Practices of designers and producers', 'Technology (Mandatory)'),
  item('TE4-MSC-01', 'Explains how materials, systems and components contribute to solutions', 'Materials, systems and components', 'Technology (Mandatory)'),
  item('TE4-PPM-01', 'Applies processes in the planning, management and production of projects', 'Planning, managing and producing projects', 'Technology (Mandatory)'),
  item('TE4-DES-01', 'Communicates and evaluates design ideas and solutions', 'Communicating and evaluating design', 'Technology (Mandatory)'),
  item('TE4-SAF-01', 'Selects and safely uses tools, materials, technologies and processes', 'Safe use of tools and materials', 'Technology (Mandatory)'),
  item('TE4-DIG-01', 'Demonstrates technological literacy to safely interact in digital environments', 'Digital literacy and safety', 'Technology (Mandatory)'),
  item('TE4-DIG-02', 'Uses data and digital systems to code, design and produce projects', 'Coding and digital systems', 'Technology (Mandatory)'),

  item('PD4-1', 'Reflects on strengths and challenges to affirm a sense of self and take action to promote a positive sense of self', 'Topic area \u2014 PDHPE syllabus is mid-transition to a new 2024 version, exact current codes vary', 'PDHPE'),
  item('PD4-2', 'Explores strategies to manage current and future challenges', 'Managing challenges and transitions', 'PDHPE'),
  item('PD4-3', 'Evaluates factors that shape identities and adapts personal responses accordingly', 'Identity and personal responses', 'PDHPE'),
  item('PD4-4', 'Performs and refines movement skills in a range of dynamic physical activity contexts', 'Movement skills across contexts', 'PDHPE', { isOngoing: true }),
  item('PD4-6', 'Recognises how contextual factors influence attitudes and behaviours and proposes strategies to enhance health, safety, wellbeing and participation in physical activity', 'Health/safety attitudes and strategies', 'PDHPE'),
  item('PD4-7', 'Displays leadership to enhance the health, safety and wellbeing of their communities', 'Leadership for community health', 'PDHPE'),
  item('PD4-8', 'Plans for and participates in activities that encourage health and a lifetime of physical activity', 'Lifetime physical activity planning', 'PDHPE', { isOngoing: true }),
  item('PD4-9', 'Applies and refines interpersonal skills to assist themselves and others to interact respectfully', 'Interpersonal skills', 'PDHPE'),
];

export function checklistForStage(stage: string | null | undefined): ChecklistSeed[] {
  if (!stage) return [];
  const normalized = stage.toLowerCase();
  if (normalized.includes('1')) return STAGE1_CHECKLIST;
  if (normalized.includes('2')) return STAGE2_CHECKLIST;
  if (normalized.includes('3')) return STAGE3_CHECKLIST;
  if (normalized.includes('4')) return STAGE4_CHECKLIST;
  if (normalized.includes('5')) return STAGE5_CHECKLIST;
  return [];
}
