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
  motionBy?: string;
  secondBy?: string;
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
    status: 'absent',
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

const createApril13FiveZeroApproval = (): CouncilVoteRecord[] =>
  april13Roster.map((member) => {
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

    if (member.seat === 'Place 3') {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'absent',
      };
    }

    return {
      name: member.name,
      seat: member.seat,
      role: member.role,
      status: 'yes',
    };
  });

const createApril13ThreeTwoApproval = (): CouncilVoteRecord[] =>
  april13Roster.map((member) => {
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

    if (member.seat === 'Place 3') {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'absent',
      };
    }

    if (member.seat === 'Place 1' || member.seat === 'Place 2') {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'no',
      };
    }

    return {
      name: member.name,
      seat: member.seat,
      role: member.role,
      status: 'yes',
    };
  });

const april27Roster: CouncilMemberAttendance[] = [
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

const createApril27SixZeroApproval = (): CouncilVoteRecord[] =>
  april27Roster.map((member) => {
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

const createApril27FiveOneNoApproval = (noSeat: string): CouncilVoteRecord[] =>
  april27Roster.map((member) => {
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

    if (member.seat === noSeat) {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'no',
      };
    }

    return {
      name: member.name,
      seat: member.seat,
      role: member.role,
      status: 'yes',
    };
  });

const createApril27FiveYesOneAbstain = (abstainSeat: string): CouncilVoteRecord[] =>
  april27Roster.map((member) => {
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

    if (member.seat === abstainSeat) {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'abstain',
      };
    }

    return {
      name: member.name,
      seat: member.seat,
      role: member.role,
      status: 'yes',
    };
  });

const createApril27Pd46Vote = (): CouncilVoteRecord[] =>
  april27Roster.map((member) => {
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

    if (member.seat === 'Place 1' || member.seat === 'Place 2') {
      return {
        name: member.name,
        seat: member.seat,
        role: member.role,
        status: 'no',
      };
    }

    return {
      name: member.name,
      seat: member.seat,
      role: member.role,
      status: 'yes',
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
    motionBy: 'Terrance Johnson',
    secondBy: 'Bryan Washington',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Bryan Washington',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Cristina Todd',
    secondBy: 'Bryan Washington',
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
    motionBy: 'Bryan Washington',
    secondBy: 'Terrance Johnson',
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
    motionBy: 'Carolyn David-Graves',
    secondBy: 'Steve Deffibaugh',
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
    motionBy: 'Bryan Washington',
    secondBy: 'Terrance Johnson',
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
    motionBy: 'Terrance Johnson',
    secondBy: 'Carolyn David-Graves',
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
    motionBy: 'Steve Deffibaugh',
    secondBy: 'Bryan Washington',
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
    motionBy: 'Bryan Washington',
    secondBy: 'Carolyn David-Graves',
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
      'This work-session item was posted for April 13, but it was not actually discussed after council moved into closed session instead.',
    watchReason:
      'This is a high-interest public safety item because any direction given here could shape future local restrictions and enforcement.',
    explainer:
      'Based on the user-provided meeting notes, council did not take up the posted work-session discussions on April 13 and later future-agenda requests referenced the workshop items as tabled. That means this public-safety topic stayed in the pipeline rather than getting a real public discussion that night.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed on April 13.',
    voteNote:
      'User-provided meeting notes indicate the posted work-session items were tabled after council moved into closed session instead of taking up the workshop discussions.',
    outcomePositiveLabel: 'If it returns later',
    outcomePositive:
      'Council could come back with a real workshop discussion or drafted ordinance changes at a later meeting.',
    outcomeNegativeLabel: 'Because it was tabled',
    outcomeNegative:
      'Residents did not get a public April 13 discussion on the ordinance changes that night.',
    pros: [
      'Could strengthen local protections or enforcement in areas residents are already focused on.',
      'Forces council to explain what the city legally can and cannot do.',
    ],
    cons: [
      'No public workshop discussion happened despite the item being posted on the agenda.',
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
      'This work-session item was posted for April 13, but it was not actually discussed after council moved into closed session instead.',
    watchReason:
      'It could become the city’s first formal structure for identifying historic assets and advising on preservation policy.',
    explainer:
      'The agenda posted this as an early governance discussion about creating a historical preservation committee, but the user-provided meeting notes indicate the work-session items were not taken up that night. So the key public takeaway is not a new policy direction, but that this idea remains unresolved and could return later.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed on April 13.',
    voteNote:
      'User-provided meeting notes indicate the posted work-session items were tabled rather than discussed during the workshop portion.',
    outcomePositiveLabel: 'If it returns later',
    outcomePositive:
      'Princeton could still begin building a preservation framework before redevelopment pressure erases older places or local history.',
    outcomeNegativeLabel: 'Because it was tabled',
    outcomeNegative:
      'Historic preservation remained an open question without a public April 13 discussion to move it forward.',
    pros: [
      'Could help the city document and protect places that matter before growth changes them.',
      'Creates a more formal public process around preservation decisions.',
    ],
    cons: [
      'No public workshop discussion happened despite the item being posted on the agenda.',
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
      'This work-session item was posted for April 13, but it was not actually discussed after council moved into closed session instead.',
    watchReason:
      'Short-term rental rules can affect neighborhoods, property owners, enforcement workload, and future land-use policy.',
    explainer:
      'The agenda signaled an early-stage conversation on short-term rentals, but the user-provided meeting notes indicate the posted workshop items were not taken up and were later referenced as tabled. That leaves the issue alive without giving residents the public discussion the agenda seemed to promise.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed on April 13.',
    voteNote:
      'User-provided meeting notes indicate the posted work-session items were tabled rather than discussed during the workshop portion.',
    outcomePositiveLabel: 'If it returns later',
    outcomePositive:
      'Residents and property owners could still see a clearer ruleset later, including what is allowed, where, and how violations would be handled.',
    outcomeNegativeLabel: 'Because it was tabled',
    outcomeNegative:
      'Short-term rental policy stayed unresolved without a public April 13 discussion.',
    pros: [
      'A formal policy can reduce ambiguity for both neighbors and property owners.',
      'Lets council address noise, parking, or safety concerns before they spread.',
    ],
    cons: [
      'No public workshop discussion happened despite the item being posted on the agenda.',
      'New limits could frustrate owners who rely on short-term rental income.',
      'Enforcement can be difficult if the city adopts rules without enough staffing or clarity.',
    ],
  },
  {
    code: 'I1',
    itemNumber: 'Executive session action',
    slug: 'interim-legal-counsel-agreement',
    category: 'Action Pertaining to Executive Session',
    title:
      'Action authorizing the mayor to enter into an interim legal-services agreement after the city attorney resignation',
    importance: 'high',
    summary:
      'Council approved 5-0 an executive-session-related action authorizing the mayor to move forward with an interim legal-services agreement, based on the user-provided meeting notes.',
    watchReason:
      'Who advises the city during litigation, personnel matters, and governance fights can affect high-stakes decisions quickly.',
    explainer:
      'According to the user-provided meeting notes, Terrance Johnson made the motion and Cristina Todd seconded an action authorizing the mayor to get into an agreement with Nichols Jackson as interim outside counsel after the city attorney resignation. Because the law-firm name was heard through the live meeting audio rather than copied from official minutes, this tracker preserves it as reported but should still be cross-checked against the city’s final record once available.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 5-0.',
    voteNote:
      'Motion by Terrance Johnson. Second by Cristina Todd. The law-firm name should be cross-checked against official minutes or video once the city posts them.',
    motionBy: 'Terrance Johnson',
    secondBy: 'Cristina Todd',
    voteRecords: createApril13FiveZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The mayor was authorized to move ahead with an interim outside-counsel arrangement while the city addresses the city attorney resignation.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The city would have needed a different path for interim legal representation or a later return item.',
    pros: [
      'Gives the city a faster path to interim legal support during active litigation and personnel matters.',
      'Creates an open-session record that council authorized the arrangement.',
    ],
    cons: [
      'Interim counsel decisions can move quickly with limited public detail at the time of the vote.',
      'The exact firm name and formal agreement terms still need official record confirmation.',
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
      'Council pulled G1 out of the consent agenda and then approved the dump-truck purchase on a separate 5-0 vote.',
    watchReason:
      'This is a routine procurement item, but it still commits public money and adds equipment capacity.',
    explainer:
      'Even routine fleet purchases are worth tracking because they show where the city is directing capital spending and equipment capacity. On April 13, council removed this item from the broader consent-agenda motion and approved it separately.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 5-0 after being pulled from consent.',
    voteNote:
      'Motion by Steve Deffibaugh. Second by Ben Long.',
    motionBy: 'Steve Deffibaugh',
    secondBy: 'Ben Long',
    voteRecords: createApril13FiveZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city can move ahead with the purchase and add the truck to its fleet for public works or related field operations.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'Staff would have needed to revisit the purchase, pricing, or operational need before bringing it back.',
    pros: [
      'Adds or replaces equipment the city likely depends on for field work.',
      'Council still approved the purchase after handling it separately from the rest of consent.',
    ],
    cons: [
      'It is still a six-figure public cost when related equipment or budget tradeoffs may not be obvious from the agenda alone.',
      'Routine equipment items can still move with limited public discussion.',
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
      'Council approved the March 23 regular-meeting minutes as part of the April 13 consent-agenda motion.',
    watchReason:
      'Minutes matter because they become part of the formal public record, even when the item itself is procedural.',
    explainer:
      'Approving minutes is usually routine, but it still matters because the city’s written record can influence how past decisions are understood later. On April 13, this item passed inside the broader consent-agenda vote after G1 was removed for separate consideration.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 5-0 as part of the consent-agenda motion with G1 removed.',
    voteNote:
      'Motion by Cristina Todd. Second by Terrance Johnson.',
    motionBy: 'Cristina Todd',
    secondBy: 'Terrance Johnson',
    voteRecords: createApril13FiveZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The March 23 minutes become part of the city’s official record in their current form.',
    outcomeNegativeLabel: 'If it had been delayed',
    outcomeNegative:
      'Council likely would have asked for corrections or held the minutes for a later meeting.',
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
      'Council approved removal of the 3303 Rooster Lane tract from Princeton’s ETJ as part of the April 13 consent-agenda motion.',
    watchReason:
      'ETJ decisions can affect future planning authority, subdivision review, and the city’s long-term growth footprint.',
    explainer:
      'The ETJ is the area outside city limits where a city still has certain planning and development authority. Removing land from the ETJ reduces Princeton’s reach over that property, which can matter for how future development, annexation, or infrastructure coordination unfolds. On April 13, this item passed inside the broader consent-agenda vote after G1 was removed.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 5-0 as part of the consent-agenda motion with G1 removed.',
    voteNote:
      'Motion by Cristina Todd. Second by Terrance Johnson.',
    motionBy: 'Cristina Todd',
    secondBy: 'Terrance Johnson',
    voteRecords: createApril13FiveZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The tract would leave Princeton’s ETJ, narrowing the city’s planning authority over that parcel.',
    outcomeNegativeLabel: 'If it had been rejected',
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
      'Council presented the commendation to the Princeton Community Development Corporation during the ceremonial portion of the meeting.',
    watchReason:
      'This does not change policy, but it signals which organizations or partnerships the city is elevating publicly.',
    explainer:
      'Ceremonial recognitions do not create new law or spending authority on their own, but they still show what the city chooses to spotlight. Based on the user-provided meeting notes, this commendation was presented on April 13 after having been tabled at the prior March 23 meeting.',
    voteMode: 'ceremonial',
    voteHeadline: 'Presented during the ceremonial portion; no separate policy vote tracked here.',
    voteNote:
      'This was handled as a recognition item rather than a contested governing action.',
    outcomePositiveLabel: 'What happened',
    outcomePositive:
      'The CDC received the commendation and the city publicly highlighted the contribution being recognized.',
    outcomeNegativeLabel: 'If it had been deferred again',
    outcomeNegative:
      'The recognition would likely have moved to a later agenda again without broader policy impact.',
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
      'Council recognized officers receiving their RISE awards during the ceremonial portion of the meeting.',
    watchReason:
      'This is a public recognition item rather than a policy change.',
    explainer:
      'Like other ceremonial agenda entries, this item was about recognition and morale rather than a change in city policy. Based on the user-provided meeting notes, the ceremonial items were all presented during the regular meeting.',
    voteMode: 'ceremonial',
    voteHeadline: 'Presented during the ceremonial portion; no separate policy vote tracked here.',
    voteNote:
      'This was handled as a recognition item rather than a yes-or-no governing action.',
    outcomePositiveLabel: 'What happened',
    outcomePositive:
      'The officers received formal recognition during the meeting.',
    outcomeNegativeLabel: 'If it had been deferred',
    outcomeNegative:
      'The recognition would likely have moved to a later meeting without broader policy consequences.',
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
      'Council presented the Sexual Assault Awareness and Prevention Month proclamation during the ceremonial portion of the meeting.',
    watchReason:
      'This is symbolic rather than regulatory, but it publicly frames what the city is emphasizing that month.',
    explainer:
      'Proclamations are symbolic acts that express public support or recognition. They do not create enforceable policy by themselves, but they can still matter as statements of priority, solidarity, or civic messaging. Based on the user-provided meeting notes, this proclamation was handled during the ceremonial portion of the regular meeting.',
    voteMode: 'ceremonial',
    voteHeadline: 'Presented during the ceremonial portion; no separate policy vote tracked here.',
    voteNote:
      'The significance here is symbolic and public-facing, not legislative.',
    outcomePositiveLabel: 'What happened',
    outcomePositive:
      'The city formally recognized Sexual Assault Awareness and Prevention Month during the meeting.',
    outcomeNegativeLabel: 'If it had been deferred',
    outcomeNegative:
      'The symbolic recognition would have moved later or not occurred at this meeting.',
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
      'Council opened the Whitewing Trails PID public hearing, heard no speakers, and closed it shortly after.',
    watchReason:
      'This is the public-comment gateway for a financing decision that can affect specific property owners and shape how infrastructure is funded.',
    explainer:
      'A public hearing is the formal moment when residents or affected owners can weigh in before the council moves to ordinance action. Based on the user-provided meeting notes, council opened the hearing, no one came forward to speak, and the hearing was then closed. That cleared the way for the related L3 and L4 PID actions later in the meeting.',
    voteMode: 'public-hearing',
    voteHeadline: 'Public hearing opened and closed with no public speakers noted.',
    voteNote:
      'The hearing itself was the tracked action here; the binding financing votes came later under L3 and L4.',
    outcomePositiveLabel: 'Because the hearing was completed',
    outcomePositive:
      'Council could move into the related assessment and bond items with the public-hearing requirement satisfied.',
    outcomeNegativeLabel: 'If major objections had surfaced',
    outcomeNegative:
      'Council could still have proceeded, but the hearing might have exposed unresolved concerns that shaped or delayed the later ordinances.',
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
      'Council approved acceptance of the 6th Street Lift Station and related public improvements on a 5-0 vote.',
    watchReason:
      'Wastewater infrastructure acceptance is a meaningful milestone because it can affect service capacity, maintenance responsibility, and future growth readiness.',
    explainer:
      'When a city accepts a lift station and related improvements, it is usually confirming that the infrastructure has been completed to a standard that allows it to become part of the public system. That can matter for capacity, operations, and future development served by the infrastructure. On April 13, council approved the acceptance on a 5-0 vote.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 5-0.',
    voteNote:
      'Motion by Steve Deffibaugh. Second by Carolyn David-Graves.',
    motionBy: 'Steve Deffibaugh',
    secondBy: 'Carolyn David-Graves',
    voteRecords: createApril13FiveZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city would formally accept the lift station and associated improvements, taking them into the public side of the system.',
    outcomeNegativeLabel: 'If it had been rejected or delayed',
    outcomeNegative:
      'The project might have needed more documentation, corrections, or negotiations before acceptance could occur.',
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
      'Council approved the on-call public-works professional service contracts on a 5-0 vote.',
    watchReason:
      'These contracts can shape how quickly the city moves on infrastructure work and how much discretion staff has to tap outside consultants over several years.',
    explainer:
      'On-call professional service contracts usually create a pre-approved bench of outside firms the city can use for engineering, design, inspections, or related project support without running a full new procurement each time. That can speed project delivery, but it also places a lot of value in the initial contract structure and scope. On April 13, council approved the item on a 5-0 vote.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 5-0.',
    voteNote:
      'Motion by Carolyn David-Graves. Second by Steve Deffibaugh.',
    motionBy: 'Carolyn David-Graves',
    secondBy: 'Steve Deffibaugh',
    voteRecords: createApril13FiveZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'City staff would gain a ready-made set of outside professional services for upcoming public works needs, likely accelerating future project support.',
    outcomeNegativeLabel: 'If it had been rejected or revised',
    outcomeNegative:
      'The city might have needed to rebid, narrow, or restructure the contracts before moving forward.',
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
      'Council approved the Whitewing Trails PID assessment ordinance 3-2, with Terrance Johnson and Cristina Todd voting no based on the user-provided meeting notes.',
    watchReason:
      'This is one of the meeting’s most consequential financing items because it can place district-specific payment obligations and liens on properties in the affected area.',
    explainer:
      'Based on the ordinance title, this item formally sets assessments tied to improvements in Whitewing Trails PID Area 3C. In a PID structure, those assessments are generally charged to benefiting properties rather than funded by the city’s general tax base. On April 13, council approved the ordinance 3-2, with the user-provided meeting notes recording no votes from Terrance Johnson and Cristina Todd.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 3-2.',
    voteNote:
      'Motion by Steve Deffibaugh. Second by Carolyn David-Graves. User-provided meeting notes record no votes from Terrance Johnson and Cristina Todd.',
    motionBy: 'Steve Deffibaugh',
    secondBy: 'Carolyn David-Graves',
    voteRecords: createApril13ThreeTwoApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The assessment ordinance would take effect, locking in the method the city uses to charge and collect district costs from affected properties.',
    outcomeNegativeLabel: 'If it had been rejected or delayed',
    outcomeNegative:
      'The district financing plan likely would have needed to be reworked, delayed, or separated from the current schedule.',
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
      'Council approved the Whitewing Trails PID bond ordinance 3-2, with Terrance Johnson and Cristina Todd recorded as no votes in the user-provided meeting notes.',
    watchReason:
      'This is a major infrastructure-finance decision because it determines how the district can raise money now and repay it later.',
    explainer:
      'This item authorizes bonds backed by special assessments rather than general citywide tax revenue. In plain terms, that can give the project access to larger upfront capital for improvements, but it also formalizes a financing structure that depends on assessment-backed repayment. On April 13, council approved the ordinance 3-2. The user-provided meeting notes list Steve Deffibaugh as the maker, Cristina Todd as the second, and both Todd and Terrance Johnson as no votes, so the tracker preserves that sequence as reported pending official minutes or video cross-check.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 3-2.',
    voteNote:
      'User-provided meeting notes list Steve Deffibaugh as the maker, Cristina Todd as the second, and record no votes from Todd and Terrance Johnson. This should be cross-checked against the city’s official minutes or video once posted.',
    motionBy: 'Steve Deffibaugh',
    secondBy: 'Cristina Todd',
    voteRecords: createApril13ThreeTwoApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city could move forward with the bond structure, giving the PID a stronger financing tool to fund improvements up front.',
    outcomeNegativeLabel: 'If it had been rejected or postponed',
    outcomeNegative:
      'The project’s financing timeline could have slowed down while council or staff reworked the structure.',
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
      'Councilmembers used the future-agenda item to request a roadway study, traffic enforcement discussion, the return of tabled work-session items, bylaw posting and signatures, draft data-center and notary ordinances, and a status report on required Collin County uploads.',
    watchReason:
      'This can quietly shape what comes next even when the item itself is procedural.',
    explainer:
      'Agenda-setting items do not usually deliver immediate policy change, but they can be useful early warnings. Based on the user-provided meeting notes, Eugene Escobar Jr. requested a roadway study; Carolyn David-Graves requested a traffic-enforcement-unit discussion; Terrance Johnson asked for the three tabled work-session items to come back on the next agenda and possibly for action; and Cristina Todd requested updated and signed bylaws on the city website, a drafted data-center ordinance, a drafted notary policy and procedure ordinance, and a staff report by May 25 on required Collin County website uploads.',
    voteMode: 'procedural',
    voteHeadline: 'Councilmembers used this item to queue up future topics rather than take a roll-call vote.',
    voteNote:
      'This was a future-agenda request period rather than a member-by-member vote item, so no roll-call vote is tracked here.',
    outcomePositiveLabel: 'If these requests return later',
    outcomePositive:
      'Residents could see follow-up debates on roads, traffic enforcement, tabled work-session items, governance documents, and transparency-related compliance questions.',
    outcomeNegativeLabel: 'If they do not return',
    outcomeNegative:
      'Those issues may linger informally without a guaranteed future agenda slot tied to this request period.',
    pros: [
      'Provides a visible path for bringing new topics into the public meeting process.',
      'Lets residents see what may be coming next before a full debate happens.',
    ],
    cons: [
      'Future-agenda request periods can stack up a lot of topics without making clear which ones will actually come back first.',
      'This tracker entry reflects the requests captured in the user-provided meeting notes rather than a verbatim transcript.',
    ],
  },
];

const april27AgendaItems: CouncilAgendaItem[] = [
  {
    code: 'C1',
    itemNumber: '2026-082',
    slug: 'april-27-historical-preservation-committee',
    category: 'Work Session',
    title: 'Discussion regarding creation of historical preservation committee',
    importance: 'medium',
    summary:
      'Council discussed the idea of a historical preservation committee and indicated the next step is more research into classifications, structure, and what council wants to see before moving further.',
    watchReason:
      'This is still one of the clearer signals that Princeton may build a formal preservation structure before redevelopment pressure grows further.',
    explainer:
      'Unlike the earlier posted-but-not-discussed work-session items on March 23 and April 13, this topic was actually discussed on April 27. Based on the user-provided meeting notes, the conversation did not end with a final policy decision, but it did move the concept forward into a research-and-refinement stage. That matters because it turns preservation from a placeholder topic into an active governance question.',
    voteMode: 'discussion',
    voteHeadline: 'Discussed in work session; next step is more research and refinement.',
    voteNote:
      'User-provided notes indicate council wants more information on classifications, structure, and what members want the committee to cover before any formal action.',
    outcomePositiveLabel: 'If it keeps moving',
    outcomePositive:
      'Princeton could eventually create a more formal process for documenting historic assets and advising on preservation questions.',
    outcomeNegativeLabel: 'If it stalls again',
    outcomeNegative:
      'The city may keep talking about preservation without building an actual structure behind it.',
    pros: [
      'Keeps preservation policy from being decided only after older places are already gone.',
      'Lets council refine what kind of preservation structure would actually fit Princeton.',
    ],
    cons: [
      'Research phases can drag on without producing a concrete follow-up item.',
      'A committee can become symbolic if council never gives it a clear lane.',
    ],
  },
  {
    code: 'C2',
    itemNumber: '2026-083',
    slug: 'april-27-short-term-rentals',
    category: 'Work Session',
    title: 'Discussion regarding short-term rentals',
    importance: 'high',
    summary:
      'Council discussed short-term rentals and signaled that staff will now work on an ordinance for future consideration.',
    watchReason:
      'This is one of the clearest policy shifts on the agenda because it moves short-term rentals from general discussion toward actual ordinance drafting.',
    explainer:
      'Short-term rental debates affect neighborhoods, property owners, enforcement, and how the city handles issues like parking, noise, safety, and local contacts. Based on the user-provided notes, council agreed that the city should work on an ordinance, which is a meaningful step beyond simply talking about the issue. It does not settle the final rules, but it does mean Princeton is moving toward a more formal regulatory framework.',
    voteMode: 'discussion',
    voteHeadline: 'Discussed in work session; city will work on an ordinance next.',
    voteNote:
      'User-provided notes indicate council aligned on moving the issue into ordinance drafting rather than leaving it at a conceptual stage.',
    outcomePositiveLabel: 'If ordinance drafting goes well',
    outcomePositive:
      'Residents and property owners could soon get clearer rules on what is allowed, how it is enforced, and what standards apply.',
    outcomeNegativeLabel: 'If the process bogs down',
    outcomeNegative:
      'The city could still be left with growing short-term rental pressure but no adopted policy to manage it.',
    pros: [
      'Moves the city toward a real policy framework instead of open-ended discussion.',
      'Creates a path for public debate over the actual ordinance language later.',
    ],
    cons: [
      'The hard part is still ahead because ordinance details can divide council, neighbors, and owners.',
      'Poorly drafted rules can create confusion or enforcement problems.',
    ],
  },
  {
    code: 'C3',
    itemNumber: '2026-093',
    slug: 'april-27-parc-update',
    category: 'Work Session',
    title: '2023 Parks Bond Project Update: Multi-Gen Facility and Branding',
    importance: 'medium',
    summary:
      'This PARC and multi-gen facility update was listed on the work-session agenda, but it was not discussed on April 27.',
    watchReason:
      'PARC remains one of the city’s biggest public projects even when its update gets skipped.',
    explainer:
      'The official city highlights page said this item was listed but not discussed. That matters because the project is large enough that delayed public discussion can still affect how clearly residents understand cost, design, and next steps.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed.',
    voteNote:
      'The city’s April 29 highlights page specifically lists this item among the posted work-session topics council did not discuss.',
    outcomePositiveLabel: 'If it returns later',
    outcomePositive:
      'Residents could still get a more complete update on the project’s design, branding, and bond-funded direction.',
    outcomeNegativeLabel: 'Because it was skipped',
    outcomeNegative:
      'One of the city’s biggest public projects went another meeting without a fresh public discussion.',
    pros: [
      'Still leaves room for a more focused future update.',
      'Avoids forcing a rushed discussion if council was not ready.',
    ],
    cons: [
      'Residents got less public context on a major parks bond project.',
      'Delayed discussion can make it harder to follow project evolution in real time.',
    ],
  },
  {
    code: 'C4',
    itemNumber: '2026-094',
    slug: 'april-27-roadway-status-update',
    category: 'Work Session',
    title: 'Roadway Status Update',
    importance: 'high',
    summary:
      'The roadway status update was posted for work session, but it was not discussed on April 27.',
    watchReason:
      'Roadway conditions and project timing are one of the most immediate quality-of-life issues for residents, so skipped updates still matter.',
    explainer:
      'The city’s own highlights page lists the roadway update among the items council did not discuss in work session. Given how often traffic, road condition, and construction timing come up in Princeton, missing a roadway update still leaves an information gap for residents trying to track where road work stands.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed.',
    voteNote:
      'The official city highlights page identified this as one of the listed-but-not-discussed work-session items.',
    outcomePositiveLabel: 'If it comes back later',
    outcomePositive:
      'Residents could still get a clearer project-by-project picture on roads, timing, and priorities.',
    outcomeNegativeLabel: 'Because it was skipped',
    outcomeNegative:
      'A high-interest infrastructure update did not actually happen in public on April 27.',
    pros: [
      'Can still return later with more complete material.',
      'Avoids treating a large infrastructure topic superficially.',
    ],
    cons: [
      'Residents lost a chance for a live public road-status discussion.',
      'Traffic and roadway concerns keep building even when updates get deferred.',
    ],
  },
  {
    code: 'C5',
    itemNumber: '2026-098',
    slug: 'april-27-ebike-regulations',
    category: 'Work Session',
    title: 'Discussion regarding e-bike regulations',
    importance: 'medium',
    summary:
      'The e-bike regulations item was posted on the work-session agenda, but it was not discussed on April 27.',
    watchReason:
      'This is a smaller item than roads or zoning, but it still touches public-safety and quality-of-life rules that could grow in importance later.',
    explainer:
      'The official city highlights page lists e-bike regulations among the posted items council did not discuss. For now, the main takeaway is that Princeton still has not had the public policy conversation this agenda suggested might happen.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed.',
    voteNote:
      'The official city highlights page lists this item among the skipped work-session topics.',
    outcomePositiveLabel: 'If it returns later',
    outcomePositive:
      'Council could still build a clearer framework around e-bike use, safety, and enforcement.',
    outcomeNegativeLabel: 'Because it was skipped',
    outcomeNegative:
      'No public direction was set on e-bike policy at this meeting.',
    pros: [
      'Leaves room for a more deliberate policy conversation later.',
      'Could eventually help the city address safety issues before they spread.',
    ],
    cons: [
      'Residents got no public update despite the item being posted.',
      'The city still has no visible public direction from this meeting on the topic.',
    ],
  },
  {
    code: 'C6',
    itemNumber: '2026-099',
    slug: 'april-27-sex-offender-registration-ordinance',
    category: 'Work Session',
    title: 'Discussion regarding sex offender registration ordinance',
    importance: 'high',
    summary:
      'The sex offender registration ordinance item was posted for work session, but it was not discussed on April 27.',
    watchReason:
      'This is a high-interest public-safety issue where residents are likely to care more about what did not happen than about a routine agenda omission.',
    explainer:
      'The official city highlights page lists this item among the work-session topics council did not discuss. That means a publicly sensitive ordinance topic stayed unresolved again, even though it was posted on the agenda. For tracking purposes, the important fact is not a new rule but the absence of public movement.',
    voteMode: 'discussion',
    voteHeadline: 'Listed for work session, but not discussed.',
    voteNote:
      'The official city highlights page lists this item among the posted work-session topics council did not take up.',
    outcomePositiveLabel: 'If it returns later',
    outcomePositive:
      'Residents could still see a clearer public discussion on what the city can or cannot change locally.',
    outcomeNegativeLabel: 'Because it was skipped',
    outcomeNegative:
      'The ordinance discussion remains unresolved without new public direction from April 27.',
    pros: [
      'Still leaves room for a more careful future discussion instead of a rushed one.',
      'Can return later with more legal clarity or staff preparation.',
    ],
    cons: [
      'Residents got no April 27 public discussion on a high-interest safety issue.',
      'Repeated delays can deepen frustration and uncertainty.',
    ],
    relatedCoverage: {
      title:
        'Princeton reviewing sex offender ordinance changes after public pressure ahead of April 13 meeting',
      href: '/posts/princeton-reviewing-sex-offender-ordinance-changes-ahead-of-april-13-meeting',
    },
  },
  {
    code: 'G1',
    itemNumber: '2026-095',
    slug: 'april-27-tax-collection-agreement',
    category: 'Consent Agenda',
    title: "Interlocal Cooperation Agreement for Ad Valorem Tax Collection Services with Collin County Tax Assessor's Office and the City",
    importance: 'medium',
    summary:
      'Council approved the tax-collection interlocal agreement as part of the main consent-agenda motion with G1 and G2 only.',
    watchReason:
      'This affects a basic administrative system behind how the city handles property-tax collection.',
    explainer:
      'This is not the flashiest agenda item, but it still matters because property-tax collection agreements shape a basic city function that residents rely on in the background. On April 27, council approved it inside the consent-agenda motion that covered only G1 and G2 before the later plat items were pulled out for individual handling.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved as part of the G1-G2 consent motion on a 5-1 vote.',
    voteNote:
      'Motion by Cristina Todd. Second by Terrance Johnson. User-provided notes record Carolyn David-Graves as the lone no vote.',
    motionBy: 'Cristina Todd',
    secondBy: 'Terrance Johnson',
    voteRecords: createApril27FiveOneNoApproval('Place 7'),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city can continue moving forward with the tax-collection arrangement under the approved agreement.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'Council likely would have needed to revisit the collection arrangement or seek revisions before moving forward.',
    pros: [
      'Keeps a core city tax-administration function moving.',
      'Creates an open vote record on an otherwise technical agreement.',
    ],
    cons: [
      'Administrative agreements can still carry cost or oversight questions that get little public discussion.',
      'The agenda title alone does not explain why a no vote was cast.',
    ],
  },
  {
    code: 'G2',
    itemNumber: '2026-084',
    slug: 'april-27-april-13-minutes',
    category: 'Consent Agenda',
    title: 'Approval of April 13, 2026 City Council regular meeting minutes',
    importance: 'low',
    summary:
      'Council approved the April 13 meeting minutes as part of the same 5-1 consent-agenda motion that covered G1 and G2.',
    watchReason:
      'Minutes are procedural, but they become the city’s formal written record of a prior meeting.',
    explainer:
      'Approving minutes can look routine, but it is still how the city locks in its official written account of prior meetings. On April 27, council approved the April 13 minutes inside the same G1-G2 consent motion, with Carolyn David-Graves recorded as the lone no vote according to the user-provided notes.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved as part of the G1-G2 consent motion on a 5-1 vote.',
    voteNote:
      'Motion by Cristina Todd. Second by Terrance Johnson. User-provided notes record Carolyn David-Graves as the lone no vote.',
    motionBy: 'Cristina Todd',
    secondBy: 'Terrance Johnson',
    voteRecords: createApril27FiveOneNoApproval('Place 7'),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The April 13 minutes become part of the official city record in their approved form.',
    outcomeNegativeLabel: 'If it had been delayed',
    outcomeNegative:
      'Council likely would have held the minutes for corrections or later approval.',
    pros: [
      'Keeps the city’s meeting record current.',
      'Provides a formal point for corrections if needed before approval.',
    ],
    cons: [
      'Minutes often get less public scrutiny than larger policy items.',
      'A split vote on minutes can signal deeper disagreement without much explanation in the title alone.',
    ],
  },
  {
    code: 'G3',
    itemNumber: '2026-087',
    slug: 'april-27-banschbach-middle-school-final-plat',
    category: 'Consent Agenda',
    title: 'Final plat for Crossmill Lot 58X Block A for Banschbach Middle School',
    importance: 'high',
    summary:
      'Council approved the Banschbach Middle School final plat without infrastructure on a recorded vote, with Ben Long abstaining.',
    watchReason:
      'This is one of the clearer growth-pressure items because it ties school expansion to road readiness, plats, and infrastructure timing in Crossmill.',
    explainer:
      'This final plat is one of the key school-growth items tied to the Crossmill area. Council approved it without infrastructure, meaning council passed the final plat itself but did not approve the infrastructure side of the item at that time. That keeps the plat moving while still separating the infrastructure piece from the vote.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved without infrastructure on a 5-1 vote with one abstention.',
    voteNote:
      'Motion by Cristina Todd. Second by Carolyn David-Graves. Ben Long abstained.',
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
    voteRecords: createApril27FiveYesOneAbstain('Place 6'),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The school plat can keep moving forward while the infrastructure condition remains separated from full plat approval.',
    outcomeNegativeLabel: 'If it had failed or been delayed',
    outcomeNegative:
      'The school-related development timeline in Crossmill could have slowed or returned for revisions.',
    pros: [
      'Moves a major school site forward in the city process.',
      'Keeps infrastructure concerns visible instead of pretending they are already finished.',
    ],
    cons: [
      'Conditional or partial-style approvals can still leave residents confused about what is fully complete.',
      'School timing stays tied to infrastructure and roadway readiness.',
    ],
    relatedCoverage: {
      title:
        'A New Middle School and Elementary School Are on the Way in Princeton',
      href: '/posts/princeton-new-middle-school-elementary-crossmill/',
    },
  },
  {
    code: 'G4',
    itemNumber: '2026-088',
    slug: 'april-27-joyce-carrell-elementary-final-plat',
    category: 'Consent Agenda',
    title: 'Final plat for Crossmill Lot 27X Block 1 for Joyce Carrell Elementary School',
    importance: 'high',
    summary:
      'Council approved the Joyce Carrell Elementary School final plat without infrastructure on a recorded vote, with Ben Long abstaining.',
    watchReason:
      'This is paired with the Banschbach plat as one of the clearest signs that school growth and infrastructure timing are now directly linked in Crossmill.',
    explainer:
      'Like the Banschbach item, this plat moves another Princeton ISD site forward while preserving the infrastructure caveat in the approval. In practical terms, council approved the final plat but not the infrastructure side of the item at that time. That matters because residents are not just watching school sites appear on paper. They are watching whether roads and supporting systems keep up too.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved without infrastructure on a 5-1 vote with one abstention.',
    voteNote:
      'Motion by Cristina Todd. Second by Carolyn David-Graves. Ben Long abstained.',
    motionBy: 'Cristina Todd',
    secondBy: 'Carolyn David-Graves',
    voteRecords: createApril27FiveYesOneAbstain('Place 6'),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The elementary school plat can keep moving through the city process while infrastructure remains a distinct issue to watch.',
    outcomeNegativeLabel: 'If it had failed or been delayed',
    outcomeNegative:
      'The school-site timeline in Crossmill could have slowed or come back with further questions.',
    pros: [
      'Advances another major school site inside a fast-growing area.',
      'Keeps the infrastructure condition visible instead of burying it.',
    ],
    cons: [
      'Residents may still be left asking what “without infrastructure” means in practice.',
      'The school-opening path remains tied to unfinished surrounding systems.',
    ],
    relatedCoverage: {
      title:
        'A New Middle School and Elementary School Are on the Way in Princeton',
      href: '/posts/princeton-new-middle-school-elementary-crossmill/',
    },
  },
  {
    code: 'G5',
    itemNumber: '2026-089',
    slug: 'april-27-crossmill-phase-1a-final-plat',
    category: 'Consent Agenda',
    title: 'Final plat for Crossmill Phase 1A subject to acceptance of Brookside Blvd.',
    importance: 'high',
    summary:
      'Council tabled the Crossmill Phase 1A final plat to the May 11 meeting, with the city’s April 29 highlights page noting the item was tabled by the applicant.',
    watchReason:
      'This is one of the more important development-control points because it ties growth timing directly to Brookside Boulevard and the Crossmill buildout.',
    explainer:
      'The official agenda framed this item around Brookside Boulevard acceptance, and council formally tabled it to May 11. The city’s own highlights page adds that the item was tabled by the applicant. That makes the key public takeaway timing rather than rejection: this growth item is still alive, but it did not move on April 27.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Tabled to May 11, 2026 on a 6-0 vote.',
    voteNote:
      'Motion by Bryan Washington. Second by Carolyn David-Graves. The city’s April 29 highlights page says the item was tabled by the applicant.',
    motionBy: 'Bryan Washington',
    secondBy: 'Carolyn David-Graves',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What tabling means',
    outcomePositive:
      'Council kept the item alive for a near-term return instead of forcing a premature approval or denial.',
    outcomeNegativeLabel: 'What it also means',
    outcomeNegative:
      'Residents still do not have a final April 27 outcome on one of the larger Crossmill items tied to Brookside timing.',
    pros: [
      'Gives the applicant and city more time to resolve timing or condition issues.',
      'Avoids pushing through a plat before council is ready.',
    ],
    cons: [
      'Delays public clarity on a major Crossmill item.',
      'Can keep surrounding growth and infrastructure questions hanging longer.',
    ],
    relatedCoverage: {
      title:
        'Princeton’s Monday Agenda Is Packed: New Schools, Short Term Rentals, PD 46, Roads, PARC, Police Cameras, and the City Manager Search',
      href: '/posts/princeton-monday-april-27-2026-city-council-agenda/',
    },
  },
  {
    code: 'G6',
    itemNumber: '2026-090',
    slug: 'april-27-whitewing-trails-phase-4a1-final-plat',
    category: 'Consent Agenda',
    title: 'Final plat for Whitewing Trails - Phase 4A-1',
    importance: 'medium',
    summary:
      'Council approved the Whitewing Trails Phase 4A-1 final plat without infrastructure on a 6-0 vote.',
    watchReason:
      'This item adds to the broader pattern of neighborhood growth continuing while infrastructure questions stay in the background.',
    explainer:
      'Whitewing Trails keeps showing up as part of Princeton’s active growth pipeline. Council approved this phase without infrastructure, which means the plat moved but not with a clean everything-is-finished signal attached to it.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved without infrastructure on a 6-0 vote.',
    voteNote:
      'Motion by Cristina Todd. Second by Bryan Washington.',
    motionBy: 'Cristina Todd',
    secondBy: 'Bryan Washington',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'This phase can keep moving through the city process while infrastructure remains a distinct issue to keep watching.',
    outcomeNegativeLabel: 'If it had failed or been delayed',
    outcomeNegative:
      'The phase would likely have come back later with more documentation or revised timing.',
    pros: [
      'Keeps the subdivision pipeline moving.',
      'Maintains a public record that the phase was not simply approved as fully infrastructure-complete.',
    ],
    cons: [
      'Residents may still get limited clarity on what the infrastructure caveat changes on the ground.',
      'Growth keeps moving even when the supporting systems conversation stays complicated.',
    ],
  },
  {
    code: 'G7',
    itemNumber: '2026-091',
    slug: 'april-27-whitewing-trails-phase-3e-final-plat',
    category: 'Consent Agenda',
    title: 'Final plat for Whitewing Trails Phase 3E',
    importance: 'medium',
    summary:
      'Council approved the Whitewing Trails Phase 3E final plat without infrastructure on a 6-0 vote.',
    watchReason:
      'This is another example of the city moving neighborhood phases forward while still separating them from a fully clean infrastructure picture.',
    explainer:
      'Like the other plat items that night, this vote matters less because of a dramatic debate and more because it shows how Princeton is handling growth in practice. The phase moved forward, but the approval language captured in the notes kept infrastructure from disappearing as a concern.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved without infrastructure on a 6-0 vote.',
    voteNote:
      'Motion by Cristina Todd. Second by Bryan Washington.',
    motionBy: 'Cristina Todd',
    secondBy: 'Bryan Washington',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The phase can continue moving while infrastructure remains a separately visible issue.',
    outcomeNegativeLabel: 'If it had failed or been delayed',
    outcomeNegative:
      'The project phase would likely have needed more time or more revisions before returning.',
    pros: [
      'Keeps subdivision processing moving.',
      'Preserves a more cautious public record than a blanket approval might.',
    ],
    cons: [
      'The practical meaning of “without infrastructure” can still be hard for residents to parse.',
      'Repeated conditional-style approvals can make growth harder to follow clearly.',
    ],
  },
  {
    code: 'G8',
    itemNumber: '2026-092',
    slug: 'april-27-eastridge-phase-8-final-plat',
    category: 'Consent Agenda',
    title: 'Final plat for Eastridge Phase 8',
    importance: 'medium',
    summary:
      'Council approved the Eastridge Phase 8 final plat without infrastructure on a 6-0 vote.',
    watchReason:
      'This is another growth-through-plats item that contributes to the larger question of whether infrastructure is keeping pace with approvals.',
    explainer:
      'Eastridge Phase 8 moved forward on April 27, but the approval came without infrastructure. That keeps the public meaning grounded: this was movement, not a declaration that every supporting piece is already complete.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved without infrastructure on a 6-0 vote.',
    voteNote:
      'Motion by Carolyn David-Graves. Second by Cristina Todd.',
    motionBy: 'Carolyn David-Graves',
    secondBy: 'Cristina Todd',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The phase can keep moving in the city process while infrastructure remains a visible qualifier.',
    outcomeNegativeLabel: 'If it had failed or been delayed',
    outcomeNegative:
      'The project phase likely would have returned with more work or more documentation before advancing.',
    pros: [
      'Allows the project phase to keep moving.',
      'Retains a public acknowledgment that infrastructure is still part of the story.',
    ],
    cons: [
      'Residents can still be left unclear on the real-world timeline behind the plat.',
      'Conditional-feeling approvals can blur what is done and what is not.',
    ],
  },
  {
    code: 'I1',
    itemNumber: 'Executive session action',
    slug: 'april-27-alternate-city-manager-appointment',
    category: 'Action Pertaining to Executive Session',
    title: 'Appointment of Chief James Waters as alternate city manager for the City of Princeton',
    importance: 'high',
    summary:
      'After executive session, council approved the appointment of Chief James Waters as alternate city manager on a 6-0 vote.',
    watchReason:
      'This is a meaningful governance and continuity decision because it affects who can step into management authority during a period of instability and active recruitment.',
    explainer:
      'Leadership continuity matters more in a fast-growing city, not less. Council came out of executive session and approved making Chief James Waters the alternate city manager. Bryan Washington made the motion and Terrance Johnson seconded it, giving the city a formal alternate management appointment during an active leadership transition.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 after executive session.',
    voteNote:
      'Motion by Bryan Washington. Second by Terrance Johnson.',
    motionBy: 'Bryan Washington',
    secondBy: 'Terrance Johnson',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city has a formally approved alternate city manager in place while the broader management situation continues to evolve.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'Council likely would have needed a different continuity plan or a return item for alternate management authority.',
    pros: [
      'Adds continuity during a period of leadership transition.',
      'Creates a clear public vote record on who can fill that role.',
    ],
    cons: [
      'The public may still want a fuller explanation of how the alternate role will be used.',
      'Leadership reshuffling can also signal deeper instability rather than calm.',
    ],
  },
  {
    code: 'J1',
    itemNumber: 'ORD-2026-04-27',
    slug: 'april-27-pd46-longneck-rezoning',
    category: 'Public Hearing',
    title: 'Rezoning the property at 1503 Longneck Road from Single Family Estate (SF-E) to Planned Development 46 (PD-46)',
    importance: 'high',
    summary:
      'Council approved the PD-46 rezoning after continuing the public hearing from March 23 on a 4-2 vote, with Terrance Johnson and Cristina Todd voting no.',
    watchReason:
      'This was one of the meeting’s most watched land-use items because it turned a disputed Longneck Road case into an actual council decision.',
    explainer:
      'The public hearing mattered because it moved the Longneck Road case from months of buildup into a real council outcome. The city’s own April 29 highlights page confirms the rezoning was approved, and the vote was 4-2 with Terrance Johnson and Cristina Todd voting no. Steve Deffibaugh made the motion and Carolyn David-Graves seconded it.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved after the continued public hearing on a 4-2 vote.',
    voteNote:
      'Motion by Steve Deffibaugh. Second by Carolyn David-Graves. Terrance Johnson and Cristina Todd voted no.',
    motionBy: 'Steve Deffibaugh',
    secondBy: 'Carolyn David-Graves',
    voteRecords: createApril27Pd46Vote(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The Longneck Road property can now move forward under the PD-46 zoning structure instead of remaining under SF-E.',
    outcomeNegativeLabel: 'What the opposition signals',
    outcomeNegative:
      'The split vote shows this was not a clean consensus item, and concerns about fit, process, or surrounding impacts did not disappear just because the ordinance passed.',
    pros: [
      'Creates a final council direction on a case that had already been delayed and watched closely.',
      'Moves the property out of limbo and into a defined zoning outcome.',
    ],
    cons: [
      'The split vote suggests lingering concern rather than broad agreement.',
      'Public notes do not yet fully clarify every individual vote detail from the floor.',
    ],
    relatedCoverage: {
      title:
        'Inside the Legal Fight Over PD 46 and Princeton’s City Attorney Resignation',
      href: '/posts/inside-the-legal-fight-over-pd-46-and-princetons-city-attorney-resignation/',
    },
  },
  {
    code: 'K1',
    itemNumber: '2025-086',
    slug: 'april-27-larry-thompson-ntmwd-reappointment',
    category: 'Regular Agenda',
    title: 'Reappointment of Larry Thompson to the North Texas Municipal Water District Board',
    importance: 'medium',
    summary:
      'Council approved Larry Thompson’s reappointment to the North Texas Municipal Water District Board on a 6-0 vote.',
    watchReason:
      'Board representation at NTMWD matters because water and regional utility policy affect Princeton’s long-term growth and service capacity.',
    explainer:
      'Appointments like this can look routine, but regional utility boards matter in a fast-growing city. On April 27, council backed the reappointment unanimously, preserving continuity in Princeton’s representation at a board that touches long-term infrastructure and water issues.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote:
      'Motion by Steve Deffibaugh. Second by Bryan Washington.',
    motionBy: 'Steve Deffibaugh',
    secondBy: 'Bryan Washington',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'Princeton keeps the same appointee in place on the NTMWD board.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'Council would have needed a different appointment path or a new nominee.',
    pros: [
      'Maintains continuity in a regional board role tied to utilities and infrastructure.',
      'Avoids unnecessary disruption in representation.',
    ],
    cons: [
      'Routine appointment items can still get little public scrutiny.',
      'The agenda alone does not explain competing options because none were presented here.',
    ],
  },
  {
    code: 'K2',
    itemNumber: '2026-04-27-R06',
    slug: 'april-27-mvcp-grant-application',
    category: 'Regular Agenda',
    title: 'Resolution authorizing an application for a Motor Vehicle Crime Prevention Authority grant',
    importance: 'high',
    summary:
      'Council approved the Motor Vehicle Crime Prevention Authority grant application on a 6-0 vote.',
    watchReason:
      'This is one of the clearest public-safety technology and theft-response items on the agenda because it connects grant funding to enforcement tools the city wants to add or support.',
    explainer:
      'The grant item matters because it is tied to vehicle theft and catalytic-converter theft response, including technology and enforcement support that can directly affect how the city handles those crimes. On April 27, council approved the application unanimously, which means the city can continue pursuing outside funding rather than leaving the idea at the memo stage.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0.',
    voteNote:
      'Motion by Steve Deffibaugh. Second by Carolyn David-Graves.',
    motionBy: 'Steve Deffibaugh',
    secondBy: 'Carolyn David-Graves',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city can move forward with the grant application and keep building out its vehicle-crime response tools if funding is awarded.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The city would have lost or delayed this outside-funding path for vehicle-crime prevention support.',
    pros: [
      'Uses a grant route rather than relying only on local money.',
      'Supports public-safety work tied to theft issues residents can feel directly.',
    ],
    cons: [
      'Public-safety technology still raises oversight and transparency questions.',
      'Approval of the application does not by itself answer how every tool would be governed if funded.',
    ],
  },
  {
    code: 'K3',
    itemNumber: '2026-04-27-R01',
    slug: 'april-27-whitewing-trails-pid-resolution',
    category: 'Regular Agenda',
    title: 'Resolution authorizing Whitewing Trails Public Improvement District No. 2 Improvement Areas 3A-3C',
    importance: 'high',
    summary:
      'Council approved the Whitewing Trails PID resolution 6-0, but changed the authorization so it goes to the interim city manager instead of the mayor.',
    watchReason:
      'This item matters not just because it passed, but because council changed who the authorization power runs through.',
    explainer:
      'PID-related actions often look technical, but they shape how improvements and financing move in growth areas. On April 27, council approved this resolution unanimously, while also changing the authorization lane from the mayor to the interim city manager. That governance tweak matters because it changes where execution authority sits after the vote.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 6-0 with authorization shifted to the interim city manager.',
    voteNote:
      'Motion by Cristina Todd. Second by Bryan Washington. User-provided notes state the approval was amended so authorization went to the interim city manager rather than the mayor.',
    motionBy: 'Cristina Todd',
    secondBy: 'Bryan Washington',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The resolution moves forward and the operational authorization now flows through the interim city manager instead of the mayor.',
    outcomeNegativeLabel: 'If it had failed',
    outcomeNegative:
      'The Whitewing Trails PID action likely would have returned for revision or further direction.',
    pros: [
      'Moves the item forward while clarifying who carries the authorization.',
      'Shows council was willing to modify execution language rather than just rubber-stamp the resolution.',
    ],
    cons: [
      'PID items can still be hard for residents to interpret without support material.',
      'A shift in authorization authority can signal deeper governance preferences that the agenda title does not explain.',
    ],
  },
  {
    code: 'K4',
    itemNumber: '2026-04-27-R04',
    slug: 'april-27-parks-building-ffe',
    category: 'Regular Agenda',
    title: 'Purchase of furniture, fixtures, and equipment for the Parks & Recreation Administrative and Maintenance Building',
    importance: 'medium',
    summary:
      'Council approved the Parks and Recreation building furniture, fixtures, and equipment purchase on a 5-1 vote, with Terrance Johnson voting no.',
    watchReason:
      'This is a meaningful public-spending item because it moves a city facility from planning toward being physically equipped and operational.',
    explainer:
      'FF&E items can sound minor compared with roads or rezonings, but they still represent real capital spending and signal a facility moving toward use. On April 27, council approved the purchase 5-1, which means the project kept moving but not with total agreement.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Approved 5-1.',
    voteNote:
      'Motion by Bryan Washington. Second by Steve Deffibaugh. User-provided notes record Terrance Johnson as the lone no vote.',
    motionBy: 'Bryan Washington',
    secondBy: 'Steve Deffibaugh',
    voteRecords: createApril27FiveOneNoApproval('Place 1'),
    outcomePositiveLabel: 'What approval means',
    outcomePositive:
      'The city can move ahead with equipping the Parks and Recreation building from the approved budget source.',
    outcomeNegativeLabel: 'What the split vote signals',
    outcomeNegative:
      'The 5-1 result shows at least one councilmember had enough concern to oppose the spending even though the item passed.',
    pros: [
      'Keeps a city facility moving toward actual operational readiness.',
      'Creates a visible record on spending rather than burying the item in consent.',
    ],
    cons: [
      'FF&E spending can still feel abstract to residents compared with more visible infrastructure needs.',
      'A split vote signals unresolved concern over value, timing, or need.',
    ],
  },
  {
    code: 'K5',
    itemNumber: '2026-096',
    slug: 'april-27-city-manager-recruitment-process',
    category: 'Regular Agenda',
    title: 'Discussion and possible action regarding the City Manager recruitment process, including timeline, recruitment firm, and next steps',
    importance: 'high',
    summary:
      'Council tabled the city manager recruitment-process item to the next meeting on a 6-0 vote.',
    watchReason:
      'This is one of the most important governance items on the agenda because the permanent city manager will shape how Princeton handles growth, staffing, and execution across departments.',
    explainer:
      'The city manager search is not just an HR topic. It is a power, continuity, and operations topic. On April 27, council did not choose a final direction and instead tabled the item to the next meeting, which means one of the city’s biggest leadership decisions stayed open.',
    voteMode: 'recorded-vote',
    voteHeadline: 'Tabled to the next meeting by a 6-0 vote.',
    voteNote:
      'Motion by Bryan Washington. Second by Steve Deffibaugh.',
    motionBy: 'Bryan Washington',
    secondBy: 'Steve Deffibaugh',
    voteRecords: createApril27SixZeroApproval(),
    outcomePositiveLabel: 'What tabling means',
    outcomePositive:
      'Council kept the process alive and gave itself more time rather than forcing a rushed decision.',
    outcomeNegativeLabel: 'What it also means',
    outcomeNegative:
      'The city still did not settle a permanent recruitment path on April 27.',
    pros: [
      'Allows more time on a high-stakes leadership decision.',
      'Avoids locking in a process before council is ready.',
    ],
    cons: [
      'Leadership uncertainty continues longer.',
      'Delays on city-manager decisions can ripple across many other city functions.',
    ],
  },
  {
    code: 'K6',
    itemNumber: '2026-097',
    slug: 'april-27-princeton-town-center-update',
    category: 'Regular Agenda',
    title: 'Discussion and review of the Princeton Town Center, including an update and associated incentive agreement',
    importance: 'medium',
    summary:
      'Council received the Princeton Town Center update and associated discussion without a separate tracked vote.',
    watchReason:
      'Town Center remains one of the city’s more visible development stories, especially because it carries both project expectations and an incentive-agreement angle.',
    explainer:
      'The value of this item is less about a final yes-or-no vote and more about keeping a major development and incentive topic in public view. On April 27, the update and discussion happened, which means residents got movement in information rather than a fresh binding vote.',
    voteMode: 'discussion',
    voteHeadline: 'Update and discussion received; no separate roll-call vote tracked here.',
    voteNote:
      'User-provided notes indicate council completed the Town Center discussion and update segment without a separate final vote being captured in the tracker.',
    outcomePositiveLabel: 'What discussion means',
    outcomePositive:
      'Council and the public at least received another public update on one of Princeton’s bigger development stories.',
    outcomeNegativeLabel: 'What it does not mean',
    outcomeNegative:
      'An update is not the same thing as a final accountability checkpoint on incentives, timing, or delivery.',
    pros: [
      'Keeps the Town Center conversation visible in public.',
      'Lets residents track development and incentive issues over time.',
    ],
    cons: [
      'Discussion items can still leave a lot of uncertainty if no new action follows.',
      'Without minutes or video context, the full tone of the discussion can be harder to capture than the fact that it happened.',
    ],
  },
  {
    code: 'K7',
    itemNumber: '2026-085',
    slug: 'april-27-future-agenda-requests',
    category: 'Regular Agenda',
    title: 'Request for items to be placed on a future agenda and not for discussion',
    importance: 'medium',
    summary:
      'Councilmembers raised their requests and concerns during the future-agenda request period rather than taking a separate roll-call vote.',
    watchReason:
      'This is where later agendas often quietly start, even when no immediate policy action happens in the room that night.',
    explainer:
      'Future-agenda request items are less about a same-night result and more about what council wants to bring back. Based on the user-provided notes, members made their requests and concerns, which means this section still served as a pipeline-setting moment even without a separate yes-or-no vote.',
    voteMode: 'procedural',
    voteHeadline: 'Handled as the future-agenda request period; no separate roll-call vote tracked.',
    voteNote:
      'User-provided notes indicate councilmembers made their requests and concerns during this item.',
    outcomePositiveLabel: 'If requests return later',
    outcomePositive:
      'Some of the concerns raised here could become future action or discussion items.',
    outcomeNegativeLabel: 'If they do not return',
    outcomeNegative:
      'The concerns may remain informal without a later agenda slot attached to them.',
    pros: [
      'Gives councilmembers a visible path to queue up future issues.',
      'Helps readers see where later agendas may come from.',
    ],
    cons: [
      'The item can be important without giving the public much closure that night.',
      'Without fuller notes, it is hard to capture every request as a clean formal action.',
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
    status: 'completed',
    workSessionTime: '6:00 PM',
    regularMeetingTime: '6:30 PM',
    locationName: 'Princeton Municipal Center, Council Chambers',
    locationAddress: '2000 East Princeton Drive',
    locationCityStateZip: 'Princeton, Texas 75407',
    summary:
      'The April 13 meeting skipped the posted work-session discussions, included a 5-0 executive-session-related legal-services action, passed the remaining consent agenda 5-0 with G1 pulled for its own 5-0 vote, and ended with split 3-2 Whitewing Trails PID votes plus a new round of future-agenda requests.',
    agendaSourceTitle: 'Official City Council work session and regular meeting agenda',
    agendaSourceUrl: 'https://princetontx.gov/AgendaCenter/City-Council-2/',
    sourceNotes: [
      'Tracker details are based on the official posted April 13 agenda and the user-provided meeting notes supplied on April 14, 2026.',
      'The three posted work-session discussion items are marked as not discussed because the user-provided notes indicate council moved into closed session instead and later future-agenda requests referenced those workshop items as tabled.',
      'The interim legal-services action description and law-firm name reflect the user-provided notes from the meeting recording and should still be cross-checked against the city’s official minutes or video once posted.',
      'Where the user-provided notes clearly captured a motion, second, and result, the tracker records those votes directly rather than leaving them as pending.',
    ],
    attendanceNote:
      'Cristina Todd arrived late during the work session, Bryan Washington was not there, and all other seated officials were present. By the regular meeting, everyone except Washington and the vacant Place 4 was there.',
    councilMembers: april13Roster,
    vacantSeats: [
      'Place 4 was vacant at the time of the April 13, 2026 meeting ahead of the May 2 special election.',
    ],
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
          'These three items were posted for the 6:00 PM work session, but the user-provided notes indicate council moved into closed session instead and did not discuss them that night.',
        itemSlugs: [
          'sex-offender-ordinance-enhancements',
          'historical-preservation-committee',
          'short-term-rentals',
        ],
      },
      {
        id: 'executive-action',
        title: 'Executive Session Action',
        description:
          'This open-session action authorized interim legal-services work tied to the city attorney resignation, based on the user-provided meeting notes.',
        itemSlugs: ['interim-legal-counsel-agreement'],
      },
      {
        id: 'consent',
        title: 'Consent Agenda',
        description:
          'Council approved the remaining consent agenda 5-0 after pulling G1 out for a separate standalone vote.',
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
          'The ceremonial items were presented during the regular meeting rather than handled as policy votes.',
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
          'Council opened the PID public hearing, heard no speakers, and then closed it before moving to the related financing items.',
        itemSlugs: ['whitewing-trails-pid-public-hearing'],
      },
      {
        id: 'regular-agenda',
        title: 'Regular Agenda',
        description:
          'These were the main open-session action items, including two 5-0 approvals, two split 3-2 PID votes, and the future-agenda request period.',
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
  {
    slug: 'april-27-2026',
    title: 'Princeton City Council Meeting Tracker: April 27, 2026',
    date: '2026-04-27',
    status: 'completed',
    workSessionTime: '6:00 PM',
    regularMeetingTime: '6:30 PM',
    locationName: 'Princeton Municipal Center, Council Chambers',
    locationAddress: '2000 East Princeton Drive',
    locationCityStateZip: 'Princeton, Texas 75407',
    summary:
      'The April 27 meeting brought real work-session discussion on historical preservation and short-term rentals, approved PD-46 at Longneck Road, advanced most of the pulled plat items, made an alternate city manager appointment after executive session, and tabled both Crossmill Phase 1A and the city manager recruitment item to a later meeting.',
    agendaSourceTitle: 'Official City Council work session and regular meeting agenda',
    agendaSourceUrl: 'https://www.princetontx.gov/AgendaCenter/ViewFile/Agenda/_04272026-1684',
    sourceNotes: [
      'Tracker details are based on the official posted April 27, 2026 agenda PDF, the city’s April 29, 2026 council highlights page, and the meeting record supplied on April 30, 2026.',
      'The official city highlights page confirms that C1 and C2 were discussed, C3 through C6 were not discussed, G1 and G2 passed on consent, G5 was tabled to May 11, G3, G4, and G6 through G8 were pulled and approved, and the Longneck PD-46 rezoning was approved.',
      'Vote splits, motion makers, and seconds reflect the meeting record directly unless a detail was explicitly marked as unclear.',
      'Where a specific detail was not captured in the meeting record, the tracker leaves only that missing piece unfilled instead of guessing.',
    ],
    attendanceNote:
      'All seated officials were present for both the work session and the regular meeting. Place 4 remained vacant at the time of the meeting.',
    councilMembers: april27Roster,
    vacantSeats: [
      'Place 4 was vacant at the time of the April 27, 2026 meeting.',
    ],
    closedSessionTopics: [
      'Consultation with the city attorney regarding pending or contemplated litigation, settlement offers, or legal conflicts tied to agenda matters.',
      'Sicily Laguna Azure, LLC v. City of Princeton, Texas et al.',
      'North Collin Special Utility District v. City of Princeton, Texas.',
      'Security devices or security audits.',
      'Personnel matters involving the city manager search, city manager, and city attorney.',
    ],
    agendaSections: [
      {
        id: 'work-session',
        title: 'Work Session',
        description:
          'The work session included two real policy discussions on historical preservation and short-term rentals, while four other listed topics did not get discussed that night.',
        itemSlugs: [
          'april-27-historical-preservation-committee',
          'april-27-short-term-rentals',
          'april-27-parc-update',
          'april-27-roadway-status-update',
          'april-27-ebike-regulations',
          'april-27-sex-offender-registration-ordinance',
        ],
      },
      {
        id: 'consent',
        title: 'Consent Agenda',
        description:
          'G1 and G2 passed inside the main consent motion, while G3 through G8 were pulled out for separate handling.',
        itemSlugs: [
          'april-27-tax-collection-agreement',
          'april-27-april-13-minutes',
          'april-27-banschbach-middle-school-final-plat',
          'april-27-joyce-carrell-elementary-final-plat',
          'april-27-crossmill-phase-1a-final-plat',
          'april-27-whitewing-trails-phase-4a1-final-plat',
          'april-27-whitewing-trails-phase-3e-final-plat',
          'april-27-eastridge-phase-8-final-plat',
        ],
      },
      {
        id: 'executive-action',
        title: 'Action Pertaining to Executive Session',
        description:
          'After executive session, council returned in open session and approved an alternate city manager appointment.',
        itemSlugs: ['april-27-alternate-city-manager-appointment'],
      },
      {
        id: 'public-hearing',
        title: 'Public Hearing',
        description:
          'The Longneck Road PD-46 rezoning returned from March 23 and ended with a recorded 4-2 approval.',
        itemSlugs: ['april-27-pd46-longneck-rezoning'],
      },
      {
        id: 'regular-agenda',
        title: 'Regular Agenda',
        description:
          'These were the main open-session action and discussion items after the consent and public-hearing portions.',
        itemSlugs: [
          'april-27-larry-thompson-ntmwd-reappointment',
          'april-27-mvcp-grant-application',
          'april-27-whitewing-trails-pid-resolution',
          'april-27-parks-building-ffe',
          'april-27-city-manager-recruitment-process',
          'april-27-princeton-town-center-update',
          'april-27-future-agenda-requests',
        ],
      },
    ],
    agendaItems: april27AgendaItems,
  },
];

export const getCityCouncilMeeting = (slug: string) =>
  cityCouncilMeetings.find((meeting) => meeting.slug === slug);

export const getCouncilAgendaItem = (
  meeting: CouncilMeeting,
  itemSlug: string
) => meeting.agendaItems.find((item) => item.slug === itemSlug);
