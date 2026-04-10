export type MeetingStatus = 'upcoming' | 'completed';
export type AttendanceStatus =
  | 'upcoming'
  | 'present'
  | 'absent'
  | 'left-early'
  | 'vacant';
export type AgendaImportance = 'high' | 'medium' | 'low';
export type VoteMode =
  | 'upcoming'
  | 'recorded-vote'
  | 'discussion'
  | 'public-hearing'
  | 'ceremonial'
  | 'procedural';
export type VoteStatus =
  | 'upcoming'
  | 'yes'
  | 'no'
  | 'abstain'
  | 'absent'
  | 'vacant'
  | 'not-voting'
  | 'not-confirmed';

export type CouncilMemberAttendance = {
  name: string;
  seat: string;
  role?: string;
  status: AttendanceStatus;
  note?: string;
};

export type CouncilVoteRecord = {
  name: string;
  seat: string;
  role?: string;
  status: VoteStatus;
  note?: string;
};

export type TrackerRelatedCoverage = {
  title: string;
  href: string;
};

export type CouncilAgendaItem = {
  code: string;
  itemNumber: string;
  slug: string;
  category: string;
  title: string;
  importance: AgendaImportance;
  presenter?: string;
  summary: string;
  watchReason: string;
  explainer: string;
  voteMode: VoteMode;
  voteHeadline: string;
  voteNote: string;
  voteRecords?: CouncilVoteRecord[];
  outcomePositiveLabel: string;
  outcomePositive: string;
  outcomeNegativeLabel: string;
  outcomeNegative: string;
  pros: string[];
  cons: string[];
  relatedCoverage?: TrackerRelatedCoverage;
};

export type CouncilAgendaSection = {
  id: string;
  title: string;
  description: string;
  itemSlugs: string[];
};

export type CouncilMeeting = {
  slug: string;
  title: string;
  date: string;
  status: MeetingStatus;
  workSessionTime: string;
  regularMeetingTime: string;
  locationName: string;
  locationAddress: string;
  locationCityStateZip: string;
  summary: string;
  agendaSourceTitle: string;
  agendaSourceUrl: string;
  sourceNotes: string[];
  attendanceNote: string;
  councilMembers: CouncilMemberAttendance[];
  vacantSeats: string[];
  closedSessionTopics: string[];
  agendaSections: CouncilAgendaSection[];
  agendaItems: CouncilAgendaItem[];
};

const april13Roster: CouncilMemberAttendance[] = [
  {
    name: 'Eugene Escobar Jr.',
    seat: 'Mayor',
    role: 'Mayor',
    status: 'upcoming',
  },
  {
    name: 'Terrance Johnson',
    seat: 'Place 1',
    status: 'upcoming',
  },
  {
    name: 'Cristina Todd',
    seat: 'Place 2',
    status: 'upcoming',
  },
  {
    name: 'Bryan Washington',
    seat: 'Place 3',
    status: 'upcoming',
  },
  {
    name: 'Vacant',
    seat: 'Place 4',
    status: 'vacant',
  },
  {
    name: 'Steve Deffibaugh',
    seat: 'Place 5',
    status: 'upcoming',
  },
  {
    name: 'Ben Long',
    seat: 'Place 6',
    status: 'upcoming',
  },
  {
    name: 'Carolyn David-Graves',
    seat: 'Place 7',
    status: 'upcoming',
  },
];

const march23Roster: CouncilMemberAttendance[] = [
  {
    name: 'Eugene Escobar Jr.',
    seat: 'Mayor',
    role: 'Mayor',
    status: 'present',
  },
  {
    name: 'Terrance Johnson',
    seat: 'Place 1',
    status: 'present',
  },
  {
    name: 'Cristina Todd',
    seat: 'Place 2',
    status: 'present',
  },
  {
    name: 'Bryan Washington',
    seat: 'Place 3',
    status: 'present',
  },
  {
    name: 'Vacant',
    seat: 'Place 4',
    status: 'vacant',
  },
  {
    name: 'Steve Deffibaugh',
    seat: 'Place 5',
    status: 'present',
  },
  {
    name: 'Ben Long',
    seat: 'Place 6',
    status: 'present',
  },
  {
    name: 'Carolyn David-Graves',
    seat: 'Place 7',
    status: 'present',
  },
];

const createMarch23UnanimousApproval = (): CouncilVoteRecord[] =>
  march23Roster.map((member) => {
    if (member.status === 'vacant') {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'vacant',
      };
    }

    if (member.seat === 'Mayor') {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'not-voting',
      };
    }

    return {
      name: member.name,
      seat: member.seat,
      role: member.role,
      status: 'yes',
    };
  });

const createMarch23UnconfirmedAction = (): CouncilVoteRecord[] =>
  march23Roster.map((member) => {
    if (member.status === 'vacant') {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'vacant',
      };
    }

    if (member.seat === 'Mayor') {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'not-voting',
      };
    }

    return {
      name: member.name,
      seat: member.seat,
      role: member.role,
      status: 'not-confirmed',
      note: 'Final result for this seat has not been fully confirmed in the tracker yet.',
    };
  });

const march23AgendaItems: CouncilAgendaItem[] = [
  {
    code: 'C1',
    itemNumber: '2026-071',
    slug: 'march-23-historical-preservation-committee',
    category: 'Work Session',
    title: 'Discussion regarding creation of historical preservation committee',
    importance: 'medium',
    summary:
      'This item was listed on the March 23 work-session agenda, but it was not actually discussed that night.',
    watchReason:
      'This is one of the city’s clearer signals that it may formalize how local history and preservation are handled.',
    explainer:
      'The agenda showed this as a work-session discussion item, but city communications later indicated it was not taken up during the workshop portion of the meeting. That means March 23 did not deliver a real public discussion on whether Princeton should create a historical preservation committee, even though the topic was posted.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed.',
    voteNote:
      'The main thing to watch is whether this returns on a future agenda for an actual public discussion.',
    outcomePositiveLabel: 'If it returns later',
    outcomePositive:
      'Princeton could create a formal body to help document historic sites and shape preservation policy.',
    outcomeNegativeLabel: 'If it stalls',
    outcomeNegative:
      'Historic preservation would remain a looser concept without a dedicated city structure behind it.',
    pros: [
      'Could help preserve local history before redevelopment pressure erases it.',
      'Creates a clearer place for preservation conversations to happen publicly.',
    ],
    cons: [
      'A committee adds process and only matters if council gives it a clear purpose.',
      'Without defined authority, the body could be mostly symbolic.',
    ],
  },
  {
    code: 'C2',
    itemNumber: '2026-072',
    slug: 'march-23-council-bylaws-discussion',
    category: 'Work Session',
    title:
      'Discussion of revised Council Relations Policy, Rules of Order, and Code of Ethics (Bylaws) for City Council and all boards, commissions, and committees',
    importance: 'high',
    summary:
      'This bylaws item was listed in work session, but it was not actually discussed there before the later regular-agenda vote.',
    watchReason:
      'Changes to council and board bylaws can reshape procedure, staff interactions, ethics expectations, and how future disputes are handled.',
    explainer:
      'Even though this item appeared on the work-session agenda, city communications later indicated it was not discussed during that workshop portion. The related bylaws still came back later under L4 for a regular-agenda vote, so the important takeaway is that the formal action happened without the earlier workshop discussion the posted agenda seemed to tee up.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed before the later L4 vote.',
    voteNote:
      'The binding action happened later under L4, not during the workshop portion.',
    outcomePositiveLabel: 'Because L4 still moved later',
    outcomePositive:
      'The city would move toward a more updated operating framework for council and boards.',
    outcomeNegativeLabel: 'Because there was no workshop discussion',
    outcomeNegative:
      'Residents had less public workshop context before the formal bylaws vote later in the meeting.',
    pros: [
      'Can clarify expectations for both council and appointed boards.',
      'Makes governance rules more visible before adoption.',
    ],
    cons: [
      'Bylaw changes can shift power and process in ways the public does not always notice right away.',
      'Technical governance language can be hard for residents to follow without explanation.',
    ],
  },
  {
    code: 'G1',
    itemNumber: '2026-03-23-R01',
    slug: 'march-23-water-monitoring-contract',
    category: 'Consent Agenda',
    title:
      'Contract renewal with 120Water, Inc. for pipeline inventory software and water data collection services through March 17, 2029',
    importance: 'high',
    summary:
      'Council approved the 120Water contract renewal covering pipeline inventory and water monitoring compliance work.',
    watchReason:
      'This item touches public health, lead and copper compliance, and how the city tracks its water infrastructure.',
    explainer:
      'The contract supports Princeton’s compliance work under the Lead and Copper Rule and helps the city manage pipeline-material records, reporting, and public notification workflows. Even though it moved through consent, it matters because it underpins how the city monitors and documents water-system risk.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote: 'Motion by Terrance Johnson. Second by Bryan Washington.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city keeps its water compliance platform in place through March 2029, including lead and copper monitoring support.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'Princeton would have had to revisit how it handles compliance, reporting, and pipeline inventory tracking.',
    pros: [
      'Supports public-health compliance and data tracking.',
      'Keeps an existing monitoring system in place without interruption.',
    ],
    cons: [
      'It is still a meaningful recurring cost even if it looks routine on the agenda.',
      'Consent placement limited separate public discussion.',
    ],
    relatedCoverage: {
      title:
        '$96K Water Monitoring Contract Up for Vote in Princeton—What It Means for Lead Safety',
      href: '/posts/princeton-water-monitoring-lead-safety-vote-march-23-2026',
    },
  },
  {
    code: 'G2',
    itemNumber: '2026-059',
    slug: 'march-23-early-march-minutes',
    category: 'Consent Agenda',
    title:
      'Approval of March 2, 2026 special meeting minutes and March 9, 2026 regular meeting minutes',
    importance: 'low',
    summary:
      'Council approved the March 2 and March 9 meeting minutes.',
    watchReason:
      'Minutes are procedural, but they become part of the official public record.',
    explainer:
      'Approving minutes may look routine, but it matters because the city’s written record shapes how past actions are documented and referenced later.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 as part of the remaining consent-agenda motion.',
    voteNote:
      'After G1, G3, G4, G5, G6, G7, and G10 were pulled out, the remaining consent items were approved together. Motion by Cristina Todd. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The March 2 and March 9 minutes would become part of the city’s official record in their approved form.',
    outcomeNegativeLabel: 'If delayed',
    outcomeNegative:
      'Council would likely hold the minutes for corrections or a later vote.',
    pros: [
      'Keeps the official record current.',
      'Gives council a chance to correct mistakes before approval.',
    ],
    cons: [
      'Procedural records often get little public scrutiny.',
      'Errors can linger if no one catches them.',
    ],
  },
  {
    code: 'G3',
    itemNumber: '2026-03-23-R04',
    slug: 'march-23-nra-grant',
    category: 'Consent Agenda',
    title:
      'Acceptance and appropriation of an $8,000 NRA Foundation grant for Simunition rifle training equipment',
    importance: 'medium',
    summary:
      'Council approved an $8,000 training-equipment grant for Princeton Police.',
    watchReason:
      'It is a smaller dollar item, but it feeds into how officers train for high-stress scenarios.',
    explainer:
      'This grant funds non-lethal training equipment that can help officers run more realistic exercises. It moved as part of a bundled police-grants approval on the consent agenda.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 as part of a grouped motion on G3 through G5.',
    voteNote: 'Motion by Cristina Todd. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city can accept and use the grant for scenario-based police training equipment.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The city would have lost or delayed access to that outside funding for training upgrades.',
    pros: [
      'Uses outside funding rather than the general budget.',
      'Supports more realistic officer training.',
    ],
    cons: [
      'Even training grants can raise questions about policing priorities.',
      'Consent placement can limit discussion about what the equipment means in practice.',
    ],
    relatedCoverage: {
      title:
        '$179K in Police Funding Up for Vote in Princeton—Training, Mental Health, and More',
      href: '/posts/princeton-police-grants-march-23-2026',
    },
  },
  {
    code: 'G4',
    itemNumber: '2026-03-23-R05',
    slug: 'march-23-crisis-intervention-grant',
    category: 'Consent Agenda',
    title:
      'Acceptance and appropriation of a $93,000 State Crisis Intervention Grant for a police and counselor co-response model',
    importance: 'high',
    summary:
      'Council approved a $93,000 crisis-intervention grant to support a co-response model pairing an officer with a counselor.',
    watchReason:
      'This item affects how Princeton responds to mental-health crisis calls and whether the city moves beyond a strictly enforcement-first model.',
    explainer:
      'The grant supports a co-response setup pairing a sworn officer with a Licensed Professional Counselor. That makes it one of the more policy-relevant public-safety items in the meeting because it changes how crisis calls could be handled on the ground.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 as part of a grouped motion on G3 through G5.',
    voteNote: 'Motion by Cristina Todd. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city can move ahead with a more specialized crisis-response model using outside grant money.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'Princeton would have lost or delayed a chance to build a more clinically informed crisis-response program.',
    pros: [
      'Can improve outcomes on mental-health-related calls.',
      'Leans on external funding rather than immediate general-fund dollars.',
    ],
    cons: [
      'Program success depends on execution and long-term support after grant funding.',
      'A co-response model still needs clear roles, training, and follow-up capacity.',
    ],
    relatedCoverage: {
      title:
        '$179K in Police Funding Up for Vote in Princeton—Training, Mental Health, and More',
      href: '/posts/princeton-police-grants-march-23-2026',
    },
  },
  {
    code: 'G5',
    itemNumber: '2026-03-23-R06',
    slug: 'march-23-officer-wellness-grant',
    category: 'Consent Agenda',
    title:
      'Acceptance and appropriation of a $78,620 Peace Officer Mental Health Grant for officer wellness services',
    importance: 'medium',
    summary:
      'Council approved a $78,620 officer-wellness grant aimed at peer support, services, training, and program oversight.',
    watchReason:
      'This is part of a broader police-support strategy that can affect staffing health, retention, and crisis response readiness.',
    explainer:
      'The grant is aimed inward at officer wellness rather than public-facing crisis response, but it still matters because wellness services, peer support, and training can shape department culture and performance.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 as part of a grouped motion on G3 through G5.',
    voteNote: 'Motion by Cristina Todd. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The department can move forward with grant-funded wellness supports and related training work.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The city would have lost or delayed outside funding tied to officer wellness initiatives.',
    pros: [
      'Brings in outside money for internal support services.',
      'Can improve support after critical incidents and ongoing job stress.',
    ],
    cons: [
      'Public-facing benefit can be harder to see immediately.',
      'Long-term sustainability can become a question once grant funding ends.',
    ],
    relatedCoverage: {
      title:
        '$179K in Police Funding Up for Vote in Princeton—Training, Mental Health, and More',
      href: '/posts/princeton-police-grants-march-23-2026',
    },
  },
  {
    code: 'G6',
    itemNumber: '2026-066',
    slug: 'march-23-plaza-street-replat',
    category: 'Consent Agenda',
    title:
      'Request from Shops at Cypress Bend LLC to replat Plaza Street 276 Addition Lot 2 into Lots 2R-1 and 2R-2',
    importance: 'medium',
    summary:
      'Council approved a replat request affecting Plaza Street 276 Addition.',
    watchReason:
      'Replats can quietly shape future pad development, lot layout, and commercial buildout without drawing much public attention.',
    explainer:
      'Even technical plat items matter because they can enable a different configuration of future development on the ground. This one passed on its own motion rather than inside the grouped police-grants vote.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote: 'Motion by Cristina Todd. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The lot can be reconfigured into the revised layout requested by the applicant.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The current plat arrangement would have stayed in place until the applicant returned with a different request.',
    pros: [
      'Lets the applicant move forward with a revised site configuration.',
      'Can improve buildout flexibility for the property owner.',
    ],
    cons: [
      'Technical land-use items often move with little public discussion.',
      'The agenda alone does not tell residents much about the downstream development effect.',
    ],
  },
  {
    code: 'G7',
    itemNumber: '2026-067',
    slug: 'march-23-shoppes-at-monticello-amendment',
    category: 'Consent Agenda',
    title:
      'Request from Cope Equities LLC to amend the preliminary plat for Shoppes at Monticello',
    importance: 'medium',
    summary:
      'Council approved a preliminary plat amendment for Shoppes at Monticello.',
    watchReason:
      'Plat amendments can alter how a commercial site is divided and ultimately built out.',
    explainer:
      'This item updates the preliminary plat layout for the Shoppes at Monticello property. These amendments often look technical, but they can be important for future pad sites, access, and commercial sequencing.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote: 'Motion by Cristina Todd. Second by Bryan Washington.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The amended preliminary plat can move forward as the new planning framework for that site.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The property would have remained tied to the previously approved preliminary layout.',
    pros: [
      'Provides more flexibility for the applicant’s site plan.',
      'Keeps the project moving through the development pipeline.',
    ],
    cons: [
      'Commercial site-shaping decisions can be hard for the public to parse from agenda text alone.',
      'Even technical approvals can have long-tail impacts on buildout pattern and access.',
    ],
  },
  {
    code: 'G8',
    itemNumber: '2026-03-23-R07',
    slug: 'march-23-etj-removal-cr995',
    category: 'Consent Agenda',
    title:
      'Request to remove 7000 County Road 995 from the city’s extraterritorial jurisdiction',
    importance: 'low',
    summary:
      'Council approved an ETJ-removal request for a 2.07-acre tract at 7000 County Road 995.',
    watchReason:
      'ETJ changes can reduce the city’s future planning reach even when they seem narrow and technical.',
    explainer:
      'This item removes a small tract from Princeton’s ETJ, reducing the city’s planning authority over it. Because it passed as part of the remaining consent motion, it did not get a separate standalone debate on the floor.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 as part of the remaining consent-agenda motion.',
    voteNote:
      'After G1, G3, G4, G5, G6, G7, and G10 were pulled out, the remaining consent items were approved together. Motion by Cristina Todd. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The tract would leave Princeton’s ETJ and the city would lose that layer of planning authority over it.',
    outcomeNegativeLabel: 'If not approved',
    outcomeNegative:
      'The tract would remain in the ETJ under the city’s existing framework.',
    pros: [
      'May simplify jurisdictional issues for the property owner.',
      'Can reduce city oversight where council does not see a need to keep it.',
    ],
    cons: [
      'The city gives up some future planning leverage.',
      'ETJ changes can move with little public attention.',
    ],
  },
  {
    code: 'G9',
    itemNumber: '2026-03-23-R08',
    slug: 'march-23-etj-removal-cr448',
    category: 'Consent Agenda',
    title:
      'Request to remove 9950 CR 448 from the city’s extraterritorial jurisdiction',
    importance: 'low',
    summary:
      'Council approved an ETJ-removal request for a 1.973-acre tract at 9950 CR 448.',
    watchReason:
      'Like other ETJ items, it affects where Princeton keeps future planning authority.',
    explainer:
      'This is another ETJ-removal request, this time tied to a tract on CR 448. Like G8, it passed as part of the remaining consent motion rather than through a separate standalone vote.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 as part of the remaining consent-agenda motion.',
    voteNote:
      'After G1, G3, G4, G5, G6, G7, and G10 were pulled out, the remaining consent items were approved together. Motion by Cristina Todd. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The tract would leave Princeton’s ETJ and the city’s planning reach over it would narrow.',
    outcomeNegativeLabel: 'If not approved',
    outcomeNegative:
      'The tract would remain under the city’s current ETJ framework.',
    pros: [
      'May align jurisdiction more closely with the owner’s preferred path.',
      'Can simplify city involvement in a specific tract.',
    ],
    cons: [
      'Reduces Princeton’s future leverage over land outside city limits.',
      'The practical implications are not always obvious to the public at the time of the vote.',
    ],
  },
  {
    code: 'G10',
    itemNumber: 'ORD-2026-03-23-03',
    slug: 'march-23-atmos-rrm-tariff',
    category: 'Consent Agenda',
    title:
      'Ordinance adopting the Atmos Mid-Tex Rate Review Mechanism tariff',
    importance: 'high',
    summary:
      'Council approved the Atmos Mid-Tex RRM tariff ordinance.',
    watchReason:
      'Utility-rate mechanism items matter because they can affect the framework used to review or pass through gas-utility cost changes.',
    explainer:
      'Rate-review-mechanism items often look technical, but they can shape how utility costs are reviewed and implemented. This ordinance moved through consent and passed unanimously among the six seated councilmembers who voted.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote: 'Motion by Cristina Todd. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city adopted the associated Atmos Mid-Tex tariff mechanism through the ordinance presented.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The city would have needed a different approach or later action on the tariff matter.',
    pros: [
      'Keeps the city’s utility-rate review framework aligned with the item presented.',
      'Lets council resolve a technical utility matter in one vote.',
    ],
    cons: [
      'Technical utility items are hard for residents to parse without deeper context.',
      'Consent placement can make a rate-related framework item easy to miss.',
    ],
  },
  {
    code: 'H1',
    itemNumber: '2026-060',
    slug: 'march-23-gfoa-acfr-award',
    category: 'Ceremonial',
    title:
      'Recognition of the GFOA Certificate of Achievement for Excellence in Financial Reporting',
    importance: 'low',
    summary:
      'Council recognized the city’s ACFR award from the Government Finance Officers Association.',
    watchReason:
      'This is ceremonial, but it reinforces the city’s message about its financial reporting record.',
    explainer:
      'Ceremonial recognitions do not change policy on their own, but they still show what the city wants residents to notice and how it frames institutional performance.',
    voteMode: 'ceremonial',
    voteHeadline: 'Recognition item; no separate policy vote tracked here.',
    voteNote:
      'This appears to have been handled as a ceremonial recognition rather than a contested governing action.',
    outcomePositiveLabel: 'If presented',
    outcomePositive:
      'The city publicly highlighted its financial-reporting recognition.',
    outcomeNegativeLabel: 'If deferred',
    outcomeNegative:
      'The recognition could have been pushed to a later meeting without broader policy effect.',
    pros: [
      'Publicly underscores financial-reporting performance.',
      'Lets residents see what benchmarks city leadership values.',
    ],
    cons: [
      'Recognition items do not answer deeper budget or spending questions on their own.',
      'Ceremonial segments can consume meeting time before substantive action items.',
    ],
  },
  {
    code: 'H2',
    itemNumber: '2026-061',
    slug: 'march-23-gfoa-budget-award',
    category: 'Ceremonial',
    title:
      'Recognition of the GFOA Distinguished Budget Presentation Award',
    importance: 'low',
    summary:
      'Council recognized the city’s budget presentation award from GFOA.',
    watchReason:
      'This is symbolic rather than legislative, but it is still part of how the city signals budget credibility.',
    explainer:
      'This item highlights the city’s budget-presentation recognition. It does not create a new policy or spending action by itself.',
    voteMode: 'ceremonial',
    voteHeadline: 'Recognition item; no separate policy vote tracked here.',
    voteNote:
      'This appears to have been a ceremonial presentation rather than a yes-or-no governing action.',
    outcomePositiveLabel: 'If presented',
    outcomePositive:
      'The city publicly acknowledged another finance-related recognition.',
    outcomeNegativeLabel: 'If deferred',
    outcomeNegative:
      'The recognition would simply move to another meeting.',
    pros: [
      'Signals the city’s emphasis on budget presentation standards.',
      'Can reinforce public trust messaging around city finances.',
    ],
    cons: [
      'Does not itself prove underlying policy choices were good.',
      'Symbolic recognition can overshadow harder financial questions.',
    ],
  },
  {
    code: 'H3',
    itemNumber: '2026-062',
    slug: 'march-23-gtot-investment-policy-award',
    category: 'Ceremonial',
    title:
      'Recognition of the GTOT Certificate of Distinction for the city’s investment policy',
    importance: 'low',
    summary:
      'Council recognized the city’s first GTOT investment-policy certificate.',
    watchReason:
      'This is mostly a symbolic recognition item tied to finance governance.',
    explainer:
      'The item recognizes the city’s written investment policy. It is more about signaling institutional practice than changing policy that night.',
    voteMode: 'ceremonial',
    voteHeadline: 'Recognition item; no separate policy vote tracked here.',
    voteNote:
      'This appears to have been handled as a ceremonial item.',
    outcomePositiveLabel: 'If presented',
    outcomePositive:
      'The city publicly highlighted its investment-policy recognition.',
    outcomeNegativeLabel: 'If deferred',
    outcomeNegative:
      'The recognition would have no major policy effect if moved to a later date.',
    pros: [
      'Reinforces attention to finance-policy standards.',
      'Shows the city valuing written financial controls.',
    ],
    cons: [
      'Ceremonial recognition is not the same thing as public accountability for financial decisions.',
      'The public benefit is mostly symbolic.',
    ],
  },
  {
    code: 'H4',
    itemNumber: '2026-070',
    slug: 'march-23-cdc-commendation',
    category: 'Ceremonial',
    title: 'Presentation and recognition of commendation to the Princeton CDC',
    importance: 'low',
    summary:
      'The Princeton CDC commendation item was tabled on March 23 instead of being presented that night.',
    watchReason:
      'This is a recognition item, but it still signals who the city is publicly highlighting.',
    explainer:
      'City communications after the meeting said this commendation item was tabled rather than presented on March 23. That means the recognition did not happen that night even though it appeared on the ceremonial agenda. The same commendation later appeared again on the April 13 agenda, which suggests it was moved to a later meeting.',
    voteMode: 'ceremonial',
    voteHeadline: 'Tabled rather than presented on March 23.',
    voteNote:
      'The city later described this ceremonial item as tabled; no separate policy vote is tracked here.',
    outcomePositiveLabel: 'If presented later',
    outcomePositive:
      'The CDC could still receive the commendation at a later meeting.',
    outcomeNegativeLabel: 'Because it was tabled',
    outcomeNegative:
      'The recognition did not occur during the March 23 meeting.',
    pros: [
      'Publicly acknowledges a city-affiliated organization.',
      'Signals civic relationships council wants to highlight.',
    ],
    cons: [
      'Symbolic recognition does not itself answer performance questions.',
      'Even ceremonial items can be delayed or moved without much explanation in the moment.',
    ],
  },
  {
    code: 'K1',
    itemNumber: 'ORD-2026-03-23-01',
    slug: 'march-23-ironwood-zoning-amendment',
    category: 'Public Hearing',
    title:
      'Public hearing and zoning amendment request for 599 W. Princeton Drive (Ironwood at Princeton)',
    importance: 'high',
    presenter: 'Presented by Shai Roos, Director of Development Services',
    summary:
      'Council approved the Ironwood zoning amendment 6-0, but added multiple changes focused on covered parking dimensions, a covered student bus stop, mold-testing certification, and council control over changes.',
    watchReason:
      'This was one of the meeting’s biggest land-use decisions because it affects a highly visible stalled multifamily project on U.S. 380.',
    explainer:
      'This was not a clean yes-or-no approval of the original proposal. Council approved K1 with added conditions, including covered parking spaces sized at 10 by 18, a covered bus stop with location to be coordinated after discussion with the school district, a new mold-testing certification submitted to the city, and removal of language allowing the city manager to approve minor changes so that changes come back to council instead. That makes the vote important not just because the project moved forward, but because council inserted more public-facing guardrails into the approval.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 with additional council changes.',
    voteNote:
      'Motion by Cristina Todd. Second by Bryan Washington. Approval included the added conditions described by the user plus city staff recommendations.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The zoning amendment can move forward, but with added conditions tied to parking, a student bus stop, mold certification, and council-level oversight of future changes.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The requested amendment would have been denied or delayed, leaving the project tied to its prior framework and unresolved conditions.',
    pros: [
      'Moves a high-profile stalled project forward while adding extra conditions.',
      'Council removed language that could have allowed future changes to stay out of public view.',
    ],
    cons: [
      'Approval still advances a controversial multifamily project along a sensitive corridor.',
      'Some project details still depend on later implementation and oversight.',
    ],
    relatedCoverage: {
      title: 'Ironwood: The Full Q&A',
      href: '/posts/ironwood-full-qa',
    },
  },
  {
    code: 'K2',
    itemNumber: 'ORD-2026-03-23-02',
    slug: 'march-23-longneck-rezoning',
    category: 'Public Hearing',
    title:
      'Public hearing and rezoning request for 1503 Longneck Road',
    importance: 'high',
    presenter: 'Presented by Shai Roos, Director of Development Services',
    summary:
      'Council did not move the Longneck rezoning forward on March 23 and instead continued and tabled it to the April 27 council meeting after P&Z had already tabled it.',
    watchReason:
      'This was a high-attention zoning item because of floodplain, drainage, traffic, and process concerns tied to the site.',
    explainer:
      'The mayor asked council to table the item until April 27 because Planning and Zoning had tabled it at its prior meeting, meaning council was not positioned to move ahead on the merits that night. After opening the public hearing, council voted to continue and table the case. That matters because it preserved the issue for a later meeting instead of forcing a premature approval or denial.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Continued and tabled to April 27, 2026 by a 6-0 vote.',
    voteNote:
      'Motion by Bryan Washington. Second by Terrance Johnson.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What the tabling means',
    outcomePositive:
      'The city held the case over to April 27 rather than forcing action before the process was ready.',
    outcomeNegativeLabel: 'If council had tried to push it through',
    outcomeNegative:
      'The city could have moved into a final zoning fight before P&Z and the supporting record were fully aligned.',
    pros: [
      'Gives the city and public more time before a final zoning decision.',
      'Avoids jumping ahead of a case that P&Z had already tabled.',
    ],
    cons: [
      'Delays clarity for both the applicant and nearby residents.',
      'Can leave uncertainty hanging over the corridor for another month.',
    ],
    relatedCoverage: {
      title: 'Floodplain and Drainage Concerns Delay Princeton’s Longneck Rezoning Vote',
      href: '/posts/floodplain-and-drainage-concerns-delay-princetons-longneck-rezoning-vote',
    },
  },
  {
    code: 'L1',
    itemNumber: '2026-03-23-R02',
    slug: 'march-23-acfr-acceptance',
    category: 'Regular Agenda',
    title:
      'Acceptance of the city’s FY2025 Annual Comprehensive Financial Report, Single Audit Report, and Independent Audit Report',
    importance: 'medium',
    summary:
      'Council approved the city’s FY2025 ACFR, Single Audit Report, and Independent Audit Report.',
    watchReason:
      'Audit and ACFR acceptance is one of the clearest public checkpoints on the city’s financial reporting.',
    explainer:
      'This is a finance-governance item rather than a flashy headline vote, but it matters because it formally accepts the city’s key audit and reporting documents for the fiscal year ended September 30, 2025.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote:
      'Motion by Carolyn David-Graves. Second by Steve Deffibaugh.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city formally accepted its annual reporting and audit documents for FY2025.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'Council would likely have needed follow-up or revisions before formally accepting the reports.',
    pros: [
      'Creates a formal public checkpoint on audited city finances.',
      'Lets council accept key year-end reporting in the open.',
    ],
    cons: [
      'Financial-report acceptance can feel technical and remote to most residents.',
      'Approval does not automatically resolve every deeper budget or management question.',
    ],
  },
  {
    code: 'L2',
    itemNumber: '2026-063',
    slug: 'march-23-pafr-presentation',
    category: 'Regular Agenda',
    title:
      'Presentation and discussion to accept the city’s Popular Annual Financial Report for FY2025',
    importance: 'medium',
    summary:
      'Council accepted the city’s Popular Annual Financial Report presentation 6-0.',
    watchReason:
      'The PAFR is meant to present city finances in a more accessible format than the full ACFR.',
    explainer:
      'Unlike the technical audit documents, the PAFR is the more public-facing summary version of the city’s financial picture. Accepting it matters because it shapes how the city packages its financial story for residents.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Accepted 6-0.',
    voteNote: 'Motion by Bryan Washington. Second by Terrance Johnson.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city can use the FY2025 PAFR as its accepted public-facing financial summary document.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'Council would likely have asked for revisions or further presentation before acceptance.',
    pros: [
      'Makes financial reporting easier for residents to digest.',
      'Creates a more accessible companion to the full ACFR.',
    ],
    cons: [
      'Summaries can smooth over complexities present in the full audit record.',
      'Approval of a presentation does not itself resolve financial concerns.',
    ],
  },
  {
    code: 'L3',
    itemNumber: '2026-03-23-R03',
    slug: 'march-23-whitewing-public-hearing-call',
    category: 'Regular Agenda',
    title:
      'Resolution determining costs and calling a public hearing on assessments for Whitewing Trails PID No. 2 Improvement Area 3C',
    importance: 'high',
    summary:
      'Council approved the next financing step for Whitewing Trails PID Area 3C by determining costs and calling the required public hearing.',
    watchReason:
      'This was a meaningful finance step because it advanced the assessment process for one of the city’s growth-related PID areas.',
    explainer:
      'This resolution did not levy the assessments itself, but it moved the process forward by determining costs and scheduling the public-hearing step needed before later assessment action. That makes it a major setup vote in the PID pipeline.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote: 'Motion by Terrance Johnson. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The Whitewing Trails assessment process moved into the public-hearing stage for Area 3C.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The assessment timeline for the district would have slowed or required a revised return item.',
    pros: [
      'Keeps the district financing process moving on schedule.',
      'Sets up a later public-hearing checkpoint before final assessment action.',
    ],
    cons: [
      'PID finance steps can be hard for residents to interpret in real time.',
      'Even setup resolutions can carry significant downstream implications.',
    ],
    relatedCoverage: {
      title:
        'Upcoming PID Actions Could Support Over 2,000 New Homes in Windmore, Southridge, and Eastridge Developments',
      href: '/posts/princeton-pid-developments-windmore-southridge-eastridge',
    },
  },
  {
    code: 'L4',
    itemNumber: '2026-03-23-R09',
    slug: 'march-23-amended-bylaws-vote',
    category: 'Regular Agenda',
    title:
      'Resolution approving revised Council Relations Policy, Rules of Order, and Code of Ethics (Bylaws)',
    importance: 'high',
    summary:
      'Council approved the revised bylaws 6-0, with a change tied to Todd’s recommendation in Section 8.1.',
    watchReason:
      'This is one of the meeting’s most important governance votes because it affects how council and city boards are expected to operate.',
    explainer:
      'Bylaws votes can look internal, but they shape procedure, conduct expectations, and the relationship between elected officials, boards, and staff. Based on the meeting notes provided, council approved L4 with a change associated with Todd’s recommendation in Section 8.1.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 with a Section 8.1 change.',
    voteNote:
      'The notes provided for this tracker clearly show passage 6-0 and the Section 8.1 change, but the exact motion-and-second sequence should still be cross-checked against the official minutes or video.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The revised council and board bylaws now move forward with the Section 8.1 change tied to Todd’s recommendation.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The city would have remained under its prior bylaw framework until a revised version returned.',
    pros: [
      'Updates governance rules in a more deliberate way.',
      'Shows council was willing to modify the proposal before approving it.',
    ],
    cons: [
      'Bylaw changes can have subtle but meaningful power and process consequences.',
      'The public often gets less context on internal governance changes than on zoning or spending votes.',
    ],
  },
  {
    code: 'L5',
    itemNumber: '2026-069',
    slug: 'march-23-tivoli-wastewater-agreement',
    category: 'Regular Agenda',
    title:
      'Non-Standard Wastewater Service Agreement for the Tivoli development, conditioned on written consent from the City of McKinney',
    importance: 'high',
    summary:
      'Council approved the Tivoli wastewater agreement, but only under the condition that written consent is obtained from the City of McKinney.',
    watchReason:
      'This item ties development progress to intercity utility consent, making it more than a routine infrastructure agreement.',
    explainer:
      'The conditional approval matters because it shows council was willing to move the agreement forward, but only if McKinney consents. That kind of condition can be decisive in whether a project actually proceeds or stalls at the utility-service stage.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 with a McKinney-consent condition.',
    voteNote: 'Motion by Steve Deffibaugh. Second by Bryan Washington.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The agreement can move forward, but only if the required written consent from McKinney is secured.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The Tivoli wastewater path would have needed a different agreement or further negotiation.',
    pros: [
      'Lets the city move the project forward without dropping the outside-consent safeguard.',
      'Makes the condition explicit rather than implied.',
    ],
    cons: [
      'Project progress still depends on another city’s written consent.',
      'Conditional approvals can look cleaner on paper than they are in practice.',
    ],
  },
  {
    code: 'L6',
    itemNumber: '2026-068',
    slug: 'march-23-eastridge-lift-station-acceptance',
    category: 'Regular Agenda',
    title:
      'Acceptance of Eastridge South Phase I Lift Station and public improvements',
    importance: 'medium',
    presenter: 'Presented by Preston Jones, Assistant Director of Public Works',
    summary:
      'Council approved acceptance of the Eastridge South Phase I lift station and public improvements.',
    watchReason:
      'Infrastructure acceptance items matter because they move completed systems into the city’s operating and maintenance sphere.',
    explainer:
      'Acceptance of a lift station and public improvements is a meaningful operational milestone because it moves finished infrastructure into the city system. Based on the meeting notes provided, council approved the item after a motion by Bryan Washington and a second by Carolyn David-Graves.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote:
      'Motion by Bryan Washington. Second by Carolyn David-Graves.',
    voteRecords: createMarch23UnanimousApproval(),
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The city formally accepts the lift station and associated public improvements into the public system.',
    outcomeNegativeLabel: 'If not approved',
    outcomeNegative:
      'The project would remain pending for more documentation, work, or a later vote.',
    pros: [
      'Moves finished infrastructure into formal city acceptance.',
      'Can mark a growth-related utility milestone for the area served.',
    ],
    cons: [
      'Acceptance items can transfer long-term maintenance responsibility to the city.',
    ],
  },
  {
    code: 'L7',
    itemNumber: '2026-064',
    slug: 'march-23-future-agenda-requests',
    category: 'Regular Agenda',
    title:
      'Requests for items to be placed on a future agenda',
    importance: 'high',
    summary:
      'Councilmembers used the future-agenda request period to flag a wide range of possible follow-up topics around governance, transparency, infrastructure, council operations, and board oversight.',
    watchReason:
      'This item can quietly define what council investigates or debates next, even when no immediate policy change happens that night.',
    explainer:
      'This agenda slot is less about taking a final vote and more about signaling what councilmembers want brought back later. Based on the notes provided, Steve Deffibaugh and Cristina Todd each raised multiple requests, including questions about pre-council meetings, the Deffibaugh Community Center forensic audit, board-member access and training, weekly reports, public-hearing notice procedures, PIR tracking, non-responsive records, and infrastructure-review presentations. Those notes should be read as examples from the discussion rather than a complete transcript of every future-agenda request raised by every councilmember that night.',
    voteMode: 'procedural',
    voteHeadline: 'Councilmembers used this item to flag topics for future meetings.',
    voteNote:
      'This was a future-agenda request period rather than a roll-call vote, so there is no member-by-member vote record to track here.',
    outcomePositiveLabel: 'If these requests come back',
    outcomePositive:
      'Some of these oversight, transparency, infrastructure, or governance topics could return on later agendas for fuller discussion or action.',
    outcomeNegativeLabel: 'If they do not return',
    outcomeNegative:
      'Those concerns may remain informal or unresolved without a later agenda item attached to them.',
    pros: [
      'Surfaces oversight issues before they disappear into staff email chains or informal discussion.',
      'Gives the public an early look at what council may revisit next.',
    ],
    cons: [
      'This tracker entry is directional rather than a full transcript of every request raised during that portion of the meeting.',
      'Future-agenda items can produce a long list without clear prioritization.',
    ],
  },
];

const april13AgendaItems: CouncilAgendaItem[] = [
  {
    code: 'C1',
    itemNumber: '2026-076',
    slug: 'sex-offender-ordinance-enhancements',
    category: 'Work Session',
    title:
      'Discussion regarding proposed enhancements to the current City of Princeton Sex Offender Ordinance',
    importance: 'high',
    summary:
      'Council is set to discuss possible changes to Princeton’s sex offender ordinance, but the posted agenda does not include the amendment language yet.',
    watchReason:
      'This is a high-interest public safety item because any direction given here could shape future local restrictions and enforcement.',
    explainer:
      'This is a discussion item rather than a final ordinance vote. Based on the agenda title and the site’s existing reporting, council appears poised to talk about tightening the city’s current rules, likely around where registered offenders can live or what local enforcement tools the city can use. The biggest thing to watch is whether council gives staff a clear path to bring back a specific ordinance, and how city leaders describe the legal limits under Texas law.',
    voteMode: 'discussion',
    voteHeadline: 'No final vote is scheduled on this agenda item.',
    voteNote:
      'Because this sits in the work session, the practical signal is whether council moves the idea toward a later ordinance for adoption.',
    outcomePositiveLabel: 'If council moves it forward',
    outcomePositive:
      'Staff could return with a drafted ordinance or amendment package for a future meeting, giving residents a clearer look at the exact restrictions under consideration.',
    outcomeNegativeLabel: 'If momentum stalls',
    outcomeNegative:
      'The city may leave the current ordinance in place for now, and public pressure would likely continue until a more concrete proposal appears.',
    pros: [
      'Could strengthen local protections or enforcement in areas residents are already focused on.',
      'Forces council to explain what the city legally can and cannot do.',
    ],
    cons: [
      'The agenda does not show the actual amendment text yet, which limits public review before the meeting.',
      'Cities can only push so far before state law and constitutional limits narrow their options.',
    ],
    relatedCoverage: {
      title:
        'Princeton reviewing sex offender ordinance changes after public pressure ahead of April 13 meeting',
      href: '/posts/princeton-reviewing-sex-offender-ordinance-changes-ahead-of-april-13-meeting',
    },
  },
  {
    code: 'C2',
    itemNumber: '2026-081',
    slug: 'historical-preservation-committee',
    category: 'Work Session',
    title: 'Discussion regarding creation of historical preservation committee',
    importance: 'medium',
    summary:
      'Council will discuss whether Princeton should create a historical preservation committee.',
    watchReason:
      'It could become the city’s first formal structure for identifying historic assets and advising on preservation policy.',
    explainer:
      'This appears to be an early governance conversation about whether Princeton wants a dedicated body focused on preserving historic buildings, sites, or community identity. A committee would not automatically create hard protections on its own, but it could be the first institutional step toward inventories, recommendations, preservation incentives, or future design standards.',
    voteMode: 'discussion',
    voteHeadline: 'No final vote is scheduled on this agenda item.',
    voteNote:
      'Watch for whether council wants staff to define the committee’s mission, powers, and membership for a future vote.',
    outcomePositiveLabel: 'If council moves it forward',
    outcomePositive:
      'Princeton could begin building a preservation framework before redevelopment pressure erases older places or local history.',
    outcomeNegativeLabel: 'If it does not advance',
    outcomeNegative:
      'Historic preservation would likely remain informal, with no standing city body to review or champion it.',
    pros: [
      'Could help the city document and protect places that matter before growth changes them.',
      'Creates a more formal public process around preservation decisions.',
    ],
    cons: [
      'New committees can add process and staff workload before their role is fully defined.',
      'If the committee lacks clear authority, it could raise expectations without producing much change.',
    ],
  },
  {
    code: 'C3',
    itemNumber: '2026-082',
    slug: 'short-term-rentals',
    category: 'Work Session',
    title: 'Discussion regarding short-term rentals',
    importance: 'high',
    summary:
      'Council is opening a policy discussion on short-term rentals such as Airbnb-style properties.',
    watchReason:
      'Short-term rental rules can affect neighborhoods, property owners, enforcement workload, and future land-use policy.',
    explainer:
      'The agenda suggests Princeton is entering an early-stage conversation on whether and how to regulate short-term rentals. Cities usually use these discussions to weigh registration requirements, safety rules, occupancy limits, parking concerns, nuisance enforcement, and where short-term rentals should be allowed. Even without a vote on April 13, this is a meaningful signal that council is considering a formal policy response.',
    voteMode: 'discussion',
    voteHeadline: 'No final vote is scheduled on this agenda item.',
    voteNote:
      'The main thing to watch is whether council asks staff to draft options or begins steering toward tighter rules.',
    outcomePositiveLabel: 'If council moves it toward regulation',
    outcomePositive:
      'Residents and property owners would likely see a clearer ruleset later, including what is allowed, where, and how violations would be handled.',
    outcomeNegativeLabel: 'If the issue is left unresolved',
    outcomeNegative:
      'Short-term rental activity may continue without a clear citywide framework, leaving disputes to ad hoc enforcement or future complaints.',
    pros: [
      'A formal policy can reduce ambiguity for both neighbors and property owners.',
      'Lets council address noise, parking, or safety concerns before they spread.',
    ],
    cons: [
      'New limits could frustrate owners who rely on short-term rental income.',
      'Enforcement can be difficult if the city adopts rules without enough staffing or clarity.',
    ],
  },
  {
    code: 'G1',
    itemNumber: '2026-04-13-R01',
    slug: 'dump-truck-purchase',
    category: 'Consent Agenda',
    title:
      'Resolution authorizing the purchase of a 10ft bed, 6 cubic yard dump truck from Custom Truck One Source, Inc. for $92,440.00',
    importance: 'medium',
    summary:
      'Council is set to consider a $92,440 purchase for a new city dump truck.',
    watchReason:
      'This is a routine procurement item, but it still commits public money and adds equipment capacity.',
    explainer:
      'This item appears to be a standard equipment purchase. Even routine purchases are worth tracking because they show where the city is directing capital spending and whether departments are expanding or replacing equipment. Since it sits on the consent agenda, the most likely path is approval with little debate unless a councilmember pulls it for separate discussion.',
    voteMode: 'upcoming',
    voteHeadline: 'Vote pending.',
    voteNote:
      'Unless a councilmember pulls it out of consent, this item would typically be approved as part of one larger motion.',
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The city can move ahead with the purchase and add the truck to its fleet for public works or related field operations.',
    outcomeNegativeLabel: 'If rejected or delayed',
    outcomeNegative:
      'Staff would need to revisit the purchase, pricing, or operational need before bringing it back.',
    pros: [
      'Adds or replaces equipment the city likely depends on for field work.',
      'Consent placement suggests staff sees the purchase as straightforward and ready.',
    ],
    cons: [
      'It is still a six-figure public cost when related equipment or budget tradeoffs may not be obvious from the agenda alone.',
      'Consent agenda items can move quickly with limited public discussion.',
    ],
  },
  {
    code: 'G2',
    itemNumber: '2026-073',
    slug: 'march-23-meeting-minutes',
    category: 'Consent Agenda',
    title: 'Approval of March 23, 2026 City Council regular meeting minutes',
    importance: 'low',
    summary:
      'Council is being asked to approve the official written minutes from the March 23 meeting.',
    watchReason:
      'Minutes matter because they become part of the formal public record, even when the item itself is procedural.',
    explainer:
      'Approving minutes is usually routine, but it still matters because the city’s written record can influence how past decisions are understood later. If councilmembers believe the minutes are incomplete or inaccurate, they can request changes before approval.',
    voteMode: 'upcoming',
    voteHeadline: 'Vote pending.',
    voteNote:
      'This is a routine consent item unless someone raises a concern about the record.',
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The March 23 minutes become part of the city’s official record in their current form.',
    outcomeNegativeLabel: 'If delayed',
    outcomeNegative:
      'Council would likely ask for corrections or hold the minutes for a later meeting.',
    pros: [
      'Keeps the city’s public record current and organized.',
      'Gives council a chance to correct the official record if needed.',
    ],
    cons: [
      'Often gets very little public attention despite being an important archival document.',
      'If inaccuracies slip through, they can persist in the official record.',
    ],
  },
  {
    code: 'G3',
    itemNumber: '2026-04-13-R04',
    slug: 'rooster-lane-etj-removal',
    category: 'Consent Agenda',
    title:
      'Resolution to remove 3303 Rooster Lane, a 2.25-acre tract, from the city’s extraterritorial jurisdiction',
    importance: 'medium',
    summary:
      'Council is considering removing a 2.25-acre tract at 3303 Rooster Lane from Princeton’s ETJ.',
    watchReason:
      'ETJ decisions can affect future planning authority, subdivision review, and the city’s long-term growth footprint.',
    explainer:
      'The ETJ is the area outside city limits where a city still has certain planning and development authority. Removing land from the ETJ reduces Princeton’s reach over that property, which can matter for how future development, annexation, or infrastructure coordination unfolds. Because this is on consent, it may not get much discussion unless someone intentionally slows it down.',
    voteMode: 'upcoming',
    voteHeadline: 'Vote pending.',
    voteNote:
      'This item can pass as part of the consent agenda unless a councilmember wants separate debate.',
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The tract would leave Princeton’s ETJ, narrowing the city’s planning authority over that parcel.',
    outcomeNegativeLabel: 'If rejected',
    outcomeNegative:
      'The property would remain under the city’s current ETJ framework for now.',
    pros: [
      'May reflect a property owner request that simplifies jurisdictional boundaries or future plans.',
      'Can reduce city oversight where council thinks local control is no longer appropriate.',
    ],
    cons: [
      'The city gives up some planning leverage over land that could still affect Princeton’s future growth pattern.',
      'The public may not get much debate because the item is currently placed in consent.',
    ],
  },
  {
    code: 'H1',
    itemNumber: '2026-077',
    slug: 'cdc-commendation',
    category: 'Ceremonial',
    title:
      'Presentation and recognition of commendation to the Princeton Community Development Corporation',
    importance: 'low',
    summary:
      'Council will recognize the Princeton Community Development Corporation with a commendation.',
    watchReason:
      'This does not change policy, but it signals which organizations or partnerships the city is elevating publicly.',
    explainer:
      'Ceremonial recognitions do not create new law or spending authority on their own, but they still show what the city chooses to spotlight. For residents tracking local influence or priorities, public commendations can be small but useful signals.',
    voteMode: 'ceremonial',
    voteHeadline: 'This is a recognition item rather than a policy vote.',
    voteNote:
      'Expect a presentation rather than a contested council decision.',
    outcomePositiveLabel: 'If presented as planned',
    outcomePositive:
      'The CDC receives a public commendation and the city highlights the contribution being recognized.',
    outcomeNegativeLabel: 'If deferred',
    outcomeNegative:
      'The recognition would likely move to a later agenda without broader policy impact.',
    pros: [
      'Publicly acknowledges work the city wants residents to notice.',
      'Can reinforce relationships between city leadership and local partner organizations.',
    ],
    cons: [
      'Ceremonial items take time even when no formal policy is being decided.',
      'The public benefit of a recognition can be hard to assess from the agenda title alone.',
    ],
  },
  {
    code: 'H2',
    itemNumber: '2026-078',
    slug: 'rise-awards',
    category: 'Ceremonial',
    title: 'Presentation and recognition of officers receiving their RISE awards',
    importance: 'low',
    summary:
      'Council will recognize officers receiving RISE awards.',
    watchReason:
      'This is a public recognition item rather than a policy change.',
    explainer:
      'Like other ceremonial agenda entries, this item is mainly about recognition and morale, not a change in city policy. It may still matter to residents who closely follow policing, city culture, or public-facing recognition decisions.',
    voteMode: 'ceremonial',
    voteHeadline: 'This is a recognition item rather than a policy vote.',
    voteNote:
      'Expect acknowledgments and presentations rather than a yes-or-no governing action.',
    outcomePositiveLabel: 'If presented as planned',
    outcomePositive:
      'The officers receive formal recognition during the meeting.',
    outcomeNegativeLabel: 'If deferred',
    outcomeNegative:
      'The recognition would likely move to a later meeting without broader policy consequences.',
    pros: [
      'Can reinforce morale and public visibility for city employees.',
      'Helps residents see what achievements city leaders are choosing to celebrate.',
    ],
    cons: [
      'It does not answer larger policy or accountability questions on its own.',
      'Ceremonial segments can extend the meeting before substantive votes begin.',
    ],
  },
  {
    code: 'H3',
    itemNumber: '2026-075',
    slug: 'sexual-assault-awareness-proclamation',
    category: 'Ceremonial',
    title:
      'Proclamation honoring Sexual Assault Awareness and Prevention Month for April 2026',
    importance: 'low',
    summary:
      'Council will issue a proclamation for Sexual Assault Awareness and Prevention Month.',
    watchReason:
      'This is symbolic rather than regulatory, but it publicly frames what the city is emphasizing that month.',
    explainer:
      'Proclamations are symbolic acts that express public support or recognition. They do not create enforceable policy by themselves, but they can still matter as statements of priority, solidarity, or civic messaging.',
    voteMode: 'ceremonial',
    voteHeadline: 'This is a proclamation item rather than a policy vote.',
    voteNote:
      'The significance here is symbolic and public-facing, not legislative.',
    outcomePositiveLabel: 'If presented as planned',
    outcomePositive:
      'The city formally recognizes Sexual Assault Awareness and Prevention Month during the meeting.',
    outcomeNegativeLabel: 'If deferred',
    outcomeNegative:
      'The symbolic recognition would move later or not occur at this meeting.',
    pros: [
      'Publicly acknowledges an issue that affects community safety and support systems.',
      'Signals city willingness to align itself with prevention and survivor-awareness efforts.',
    ],
    cons: [
      'Proclamations do not automatically come with funding, services, or policy changes.',
      'Symbolic action can look thin if it is not paired with concrete follow-through.',
    ],
  },
  {
    code: 'K1',
    itemNumber: '2026-079',
    slug: 'whitewing-trails-pid-public-hearing',
    category: 'Public Hearing',
    title:
      'Public hearing on the levy of assessments in Whitewing Trails PID No. 2 for Improvement Area 3C',
    importance: 'high',
    summary:
      'Council will open a public hearing before later considering Whitewing Trails PID assessments for Improvement Area 3C.',
    watchReason:
      'This is the public-comment gateway for a financing decision that can affect specific property owners and shape how infrastructure is funded.',
    explainer:
      'A public hearing is the formal moment when residents or affected owners can weigh in before the council moves to ordinance action. Based on the agenda language, this hearing is directly tied to the Whitewing Trails PID assessment item later in the meeting. It matters because PID assessments can place long-term costs on properties inside the district while funding infrastructure up front.',
    voteMode: 'public-hearing',
    voteHeadline: 'Public hearing first, then related votes later in the meeting.',
    voteNote:
      'The hearing itself is about public input; the binding financing actions appear later under L3 and L4.',
    outcomePositiveLabel: 'If the hearing proceeds cleanly',
    outcomePositive:
      'Council can move into the related assessment and bond items with the public hearing requirement satisfied.',
    outcomeNegativeLabel: 'If major objections surface',
    outcomeNegative:
      'Council could still proceed, but the hearing could expose unresolved concerns that shape or delay the later ordinances.',
    pros: [
      'Gives affected residents and owners a formal chance to comment before related ordinances are considered.',
      'Creates a public record around a complicated financing issue.',
    ],
    cons: [
      'Public hearings can move quickly even when the underlying financing structure is technical and hard to follow.',
      'Residents may still struggle to understand the district-level impacts without reviewing the supporting documents.',
    ],
  },
  {
    code: 'L1',
    itemNumber: '2026-080',
    slug: 'sixth-street-lift-station-acceptance',
    category: 'Regular Agenda',
    title:
      'Acceptance of the 6th Street Lift Station and associated public improvements',
    importance: 'high',
    presenter: 'Presented by Preston Jones, Assistant Director of Public Works',
    summary:
      'Council is being asked to accept the 6th Street Lift Station and related public improvements into the city system.',
    watchReason:
      'Wastewater infrastructure acceptance is a meaningful milestone because it can affect service capacity, maintenance responsibility, and future growth readiness.',
    explainer:
      'When a city accepts a lift station and related improvements, it is usually confirming that the infrastructure has been completed to a standard that allows it to become part of the public system. That can matter for capacity, operations, and future development served by the infrastructure. If there are unresolved quality or documentation concerns, council could delay acceptance.',
    voteMode: 'upcoming',
    voteHeadline: 'Vote pending.',
    voteNote:
      'This is a regular agenda action item, so council is expected to decide whether to accept the improvements.',
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The city would formally accept the lift station and associated improvements, taking them into the public side of the system.',
    outcomeNegativeLabel: 'If rejected or delayed',
    outcomeNegative:
      'The project may need more documentation, corrections, or negotiations before acceptance can occur.',
    pros: [
      'Moves finished infrastructure into regular public use and oversight.',
      'Can signal progress on growth-related utility capacity.',
    ],
    cons: [
      'If acceptance happens before issues are fully resolved, the city could inherit long-term maintenance problems.',
      'The agenda alone does not tell residents the full condition or context of the project.',
    ],
  },
  {
    code: 'L2',
    itemNumber: '2026-04-13-R03',
    slug: 'public-works-on-call-contracts',
    category: 'Regular Agenda',
    title:
      'Resolution authorizing on-call professional service contracts to support public works projects through September 30, 2028, with up to two one-year renewals',
    importance: 'high',
    summary:
      'Council is considering multi-year on-call professional service contracts for public works support.',
    watchReason:
      'These contracts can shape how quickly the city moves on infrastructure work and how much discretion staff has to tap outside consultants over several years.',
    explainer:
      'On-call professional service contracts usually create a pre-approved bench of outside firms the city can use for engineering, design, inspections, or related project support without running a full new procurement each time. That can speed project delivery, but it also places a lot of value in the initial contract structure and scope. The multi-year timeline here makes this more than a small housekeeping item.',
    voteMode: 'upcoming',
    voteHeadline: 'Vote pending.',
    voteNote:
      'Because the contracts run through 2028 with optional renewals, the practical impact could last well beyond one project cycle.',
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'City staff would gain a ready-made set of outside professional services for upcoming public works needs, likely accelerating future project support.',
    outcomeNegativeLabel: 'If rejected or revised',
    outcomeNegative:
      'The city may need to rebid, narrow, or restructure the contracts before moving forward.',
    pros: [
      'Can speed up public works delivery by giving staff faster access to outside expertise.',
      'Helps the city respond to multiple projects without starting from scratch every time.',
    ],
    cons: [
      'Long-duration on-call contracts can reduce visibility into later task-specific decisions.',
      'If the contract pool is not well structured, the city could be locked into an arrangement that needs revision later.',
    ],
  },
  {
    code: 'L3',
    itemNumber: 'ORD-2026-04-13',
    slug: 'whitewing-trails-pid-assessments',
    category: 'Regular Agenda',
    title:
      'Ordinance levying assessments for Whitewing Trails PID No. 2 Improvement Area 3C',
    importance: 'high',
    summary:
      'Council is set to consider an ordinance that would levy assessments in Whitewing Trails PID No. 2 Improvement Area 3C.',
    watchReason:
      'This is one of the meeting’s most consequential financing items because it can place district-specific payment obligations and liens on properties in the affected area.',
    explainer:
      'Based on the ordinance title, this item would formally set assessments tied to improvements in Whitewing Trails PID Area 3C. In a PID structure, those assessments are generally charged to benefiting properties rather than funded by the city’s general tax base. That can help finance infrastructure for development, but it also means owners in the district can carry a long-term repayment burden tied to those improvements.',
    voteMode: 'upcoming',
    voteHeadline: 'Vote pending.',
    voteNote:
      'This is the core action item that turns the assessment framework into a live ordinance if adopted.',
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The assessment ordinance would take effect, locking in the method the city uses to charge and collect district costs from affected properties.',
    outcomeNegativeLabel: 'If rejected or delayed',
    outcomeNegative:
      'The district financing plan would likely need to be reworked, delayed, or separated from the current schedule.',
    pros: [
      'Allows infrastructure costs to be assigned to the benefiting district instead of broadly across all city taxpayers.',
      'Can help move forward district improvements sooner than pay-as-you-go funding would allow.',
    ],
    cons: [
      'Creates financial obligations and lien structures that property owners in the district must carry.',
      'PID financing can be difficult for residents to interpret without detailed supporting documents.',
    ],
  },
  {
    code: 'L4',
    itemNumber: 'ORD-2026-04-13-01',
    slug: 'whitewing-trails-pid-bonds',
    category: 'Regular Agenda',
    title:
      'Ordinance authorizing special assessment revenue bonds for Whitewing Trails PID No. 2 Improvement Areas 3A-3C',
    importance: 'high',
    summary:
      'Council is considering special assessment revenue bonds tied to Whitewing Trails PID improvements across Areas 3A through 3C.',
    watchReason:
      'This is a major infrastructure-finance decision because it determines how the district can raise money now and repay it later.',
    explainer:
      'This agenda item appears to authorize bonds backed by special assessments rather than general citywide tax revenue. In plain terms, that can give the project access to larger upfront capital for improvements, but it also formalizes a financing structure that depends on assessment-backed repayment. Bond ordinances are often dense, but they matter because they shape the city’s risk exposure, the district’s repayment path, and how quickly infrastructure can be delivered.',
    voteMode: 'upcoming',
    voteHeadline: 'Vote pending.',
    voteNote:
      'This appears to be the financing companion to the assessment ordinance and could be one of the most consequential votes of the night.',
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'The city could move forward with the bond structure, giving the PID a stronger financing tool to fund improvements up front.',
    outcomeNegativeLabel: 'If rejected or postponed',
    outcomeNegative:
      'The project’s financing timeline could slow down while council or staff rework the structure.',
    pros: [
      'Provides a mechanism to fund district improvements sooner rather than waiting on slower cash collection.',
      'Keeps the repayment structure tied to district assessments instead of the general city tax base.',
    ],
    cons: [
      'Bond structures add complexity and long-tail financial obligations.',
      'If assumptions behind the district or assessments change, financing pressure can intensify later.',
    ],
  },
  {
    code: 'L5',
    itemNumber: '2026-074',
    slug: 'future-agenda-requests',
    category: 'Regular Agenda',
    title:
      'Consider approving requests for items to be placed on a future agenda and not for discussion',
    importance: 'low',
    summary:
      'Council may approve requests to place items on a future agenda, but the agenda notes these requests are not for discussion tonight.',
    watchReason:
      'This can quietly shape what comes next even when the item itself is procedural.',
    explainer:
      'Agenda-setting items do not usually deliver immediate policy change, but they can be useful early warnings. If council agrees to place something on a future agenda, it signals what issues may be coming back for a fuller public debate later.',
    voteMode: 'procedural',
    voteHeadline: 'Procedural action pending.',
    voteNote:
      'The practical significance depends on what topics council chooses to queue up for later meetings.',
    outcomePositiveLabel: 'If approved',
    outcomePositive:
      'Requested items would move into the pipeline for a future agenda where they could receive fuller discussion or action.',
    outcomeNegativeLabel: 'If declined',
    outcomeNegative:
      'Those proposed topics would not be scheduled for a future council agenda through this item.',
    pros: [
      'Provides a visible path for bringing new topics into the public meeting process.',
      'Lets residents see what may be coming next before a full debate happens.',
    ],
    cons: [
      'The agenda does not tell the public much about the underlying requests themselves.',
      'Because discussion is limited, residents may still be left guessing about the future topic list.',
    ],
  },
];

export const cityCouncilMeetings: CouncilMeeting[] = [
  {
    slug: 'march-23-2026',
    title: 'Princeton City Council Meeting Tracker: March 23, 2026',
    date: '2026-03-23',
    status: 'completed',
    workSessionTime: '5:30 PM',
    regularMeetingTime: '6:30 PM',
    locationName: 'Princeton Municipal Center, Council Chambers',
    locationAddress: '2000 East Princeton Drive',
    locationCityStateZip: 'Princeton, Texas 75407',
    summary:
      'The March 23 meeting ended with a 6-0 approval of the Ironwood zoning amendment with added conditions, a 6-0 tabling of the Longneck rezoning to April 27, and a long list of other unanimous votes among the six seated councilmembers.',
    agendaSourceTitle: 'Official City Council work session and regular meeting agenda',
    agendaSourceUrl: 'https://princetontx.gov/AgendaCenter/City-Council-2/',
    sourceNotes: [
      'Tracker details are based on the official posted March 23 agenda PDF plus the user-provided meeting notes supplied on April 9, 2026.',
      'Where the user-provided notes clearly captured a motion, second, and result, the tracker records those votes directly.',
      'Per later city communications relayed by the user, the two listed March 23 work-session items were not actually discussed during the workshop portion.',
      'Where the notes did not clearly capture a final result, the tracker marks the item as not fully confirmed rather than guessing.',
    ],
    attendanceNote:
      'Carolyn David-Graves and Bryan Washington arrived late during the work session, but all seated officials except the vacant Place 4 were present for the regular meeting.',
    councilMembers: march23Roster,
    vacantSeats: ['Place 4 was vacant at the time of the March 23, 2026 meeting.'],
    closedSessionTopics: [
      'Consultation with the city attorney regarding litigation, settlement, or legal conflicts tied to agenda matters.',
      'Settlement agreement regarding jurisdictional boundaries and water and sewer service territory with the City of McKinney.',
      'Eastridge Development Agreement.',
      'Whitewing Trails Development Agreement.',
      'Economic development negotiations tied to Project Homerun.',
      'Personnel matters involving the city manager search.',
    ],
    agendaSections: [
      {
        id: 'work-session',
        title: 'Work Session',
        description:
          'These items were listed for the 5:30 PM pre-council work session, but later city communications indicated they were not actually discussed that night.',
        itemSlugs: [
          'march-23-historical-preservation-committee',
          'march-23-council-bylaws-discussion',
        ],
      },
      {
        id: 'consent',
        title: 'Consent Agenda',
        description:
          'These items were listed as routine consent items, though some had individually noted motions in the user-provided meeting notes.',
        itemSlugs: [
          'march-23-water-monitoring-contract',
          'march-23-early-march-minutes',
          'march-23-nra-grant',
          'march-23-crisis-intervention-grant',
          'march-23-officer-wellness-grant',
          'march-23-plaza-street-replat',
          'march-23-shoppes-at-monticello-amendment',
          'march-23-etj-removal-cr995',
          'march-23-etj-removal-cr448',
          'march-23-atmos-rrm-tariff',
        ],
      },
      {
        id: 'ceremonial',
        title: 'Ceremonial Items',
        description:
          'These items recognized city achievements and organizations rather than creating new policy.',
        itemSlugs: [
          'march-23-gfoa-acfr-award',
          'march-23-gfoa-budget-award',
          'march-23-gtot-investment-policy-award',
          'march-23-cdc-commendation',
        ],
      },
      {
        id: 'public-hearing',
        title: 'Public Hearings',
        description:
          'These were the highest-profile land-use items of the night, including the Ironwood vote and the Longneck tabling decision.',
        itemSlugs: [
          'march-23-ironwood-zoning-amendment',
          'march-23-longneck-rezoning',
        ],
      },
      {
        id: 'regular-agenda',
        title: 'Regular Agenda',
        description:
          'These were the main finance, infrastructure, governance, and future-agenda action items considered individually.',
        itemSlugs: [
          'march-23-acfr-acceptance',
          'march-23-pafr-presentation',
          'march-23-whitewing-public-hearing-call',
          'march-23-amended-bylaws-vote',
          'march-23-tivoli-wastewater-agreement',
          'march-23-eastridge-lift-station-acceptance',
          'march-23-future-agenda-requests',
        ],
      },
    ],
    agendaItems: march23AgendaItems,
  },
  {
    slug: 'april-13-2026',
    title: 'Princeton City Council Meeting Tracker: April 13, 2026',
    date: '2026-04-13',
    status: 'upcoming',
    workSessionTime: '6:00 PM',
    regularMeetingTime: '6:30 PM',
    locationName: 'Princeton Municipal Center, Council Chambers',
    locationAddress: '2000 East Princeton Drive',
    locationCityStateZip: 'Princeton, Texas 75407',
    summary:
      'The April 13 agenda combines three policy-heavy work session discussions with several consequential infrastructure and PID financing items in the regular meeting.',
    agendaSourceTitle: 'Official City Council work session and regular meeting agenda',
    agendaSourceUrl: 'https://princetontx.gov/AgendaCenter/City-Council-2/',
    sourceNotes: [
      'Tracker details are based on the official posted agenda and the attached April 13 agenda PDF.',
      'Item explainers are our plain-English read of the agenda language. Some support documents were referenced in the agenda but were not included in the attached PDF, so a few explanations are necessarily directional rather than memo-level specific.',
      'Attendance and vote trackers will stay marked as upcoming until the meeting, minutes, or video confirm what happened.',
    ],
    attendanceNote:
      'Place 4 is vacant as of now and for this meeting ahead of the May 2, 2026 special election. Attendance will update after roll call.',
    councilMembers: april13Roster,
    vacantSeats: ['Place 4 is vacant pending the May 2, 2026 special election.'],
    closedSessionTopics: [
      'Consultation with the city attorney regarding pending or contemplated litigation, settlement offers, or legal conflicts tied to agenda matters.',
      'Sicily Laguna Azure, LLC v. City of Princeton, Texas et al.',
      'North Collin Special Utility District v. City of Princeton, Texas.',
      'Security devices or security audits.',
      'Personnel matters involving the City Attorney, Interim City Attorney, and City Council P&Z Liaison.',
    ],
    agendaSections: [
      {
        id: 'work-session',
        title: 'Work Session',
        description:
          'These items are scheduled during the 6:00 PM pre-council work session and are mainly for discussion and direction-setting.',
        itemSlugs: [
          'sex-offender-ordinance-enhancements',
          'historical-preservation-committee',
          'short-term-rentals',
        ],
      },
      {
        id: 'consent',
        title: 'Consent Agenda',
        description:
          'These items are usually voted on together unless a councilmember pulls one out for separate discussion.',
        itemSlugs: [
          'dump-truck-purchase',
          'march-23-meeting-minutes',
          'rooster-lane-etj-removal',
        ],
      },
      {
        id: 'ceremonial',
        title: 'Ceremonial Items',
        description:
          'These items recognize people, organizations, or causes rather than changing city policy.',
        itemSlugs: [
          'cdc-commendation',
          'rise-awards',
          'sexual-assault-awareness-proclamation',
        ],
      },
      {
        id: 'public-hearing',
        title: 'Public Hearing',
        description:
          'This hearing creates the public-input record before related financing ordinances come up later in the meeting.',
        itemSlugs: ['whitewing-trails-pid-public-hearing'],
      },
      {
        id: 'regular-agenda',
        title: 'Regular Agenda',
        description:
          'These are the main action items where council is expected to vote individually.',
        itemSlugs: [
          'sixth-street-lift-station-acceptance',
          'public-works-on-call-contracts',
          'whitewing-trails-pid-assessments',
          'whitewing-trails-pid-bonds',
          'future-agenda-requests',
        ],
      },
    ],
    agendaItems: april13AgendaItems,
  },
];

export const getCityCouncilMeeting = (slug: string) =>
  cityCouncilMeetings.find((meeting) => meeting.slug === slug);

export const getCouncilAgendaItem = (
  meeting: CouncilMeeting,
  itemSlug: string
) => meeting.agendaItems.find((item) => item.slug === itemSlug);
