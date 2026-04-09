import { defineRegistryRecord } from './registry';

export const exampleRegistryRecord = defineRegistryRecord({
  id: 'example-person',
  name: 'EXAMPLE,PERSON',
  aliases: ['EXAMPLE,PERSON A'],
  birthDate: '1970-01-01',
  alternateBirthDates: ['1970-01-02'],
  sid: '00000000',
  sex: 'Male',
  race: 'White',
  ethnicity: 'Non-Hispanic',
  riskLevel: 'MODERATE',
  registrationEnd: 'LIFETIME',
  verificationRequirement: 'ANNUALLY',
  address: '123 Example Street',
  city: 'Princeton',
  state: 'TX',
  zip: '75407',
  neighborhood: 'West Princeton',
  status: 'Verified',
  sourceAgency: 'PRINCETON POLICE DEPT',
  sourceUrl: 'https://example.com',
  notices: [
    'Example notice text from the official source.',
  ],
  photo: {
    imageUrl: '',
    reportedDate: '2026-01-01',
  },
  lastUpdated: '2026-01-01',
  location: {
    lat: 33.1809,
    lng: -96.4986,
  },
  physicalDescription: {
    height: `5'10"`,
    weight: '180 lbs',
    hairColor: 'BROWN',
    eyeColor: 'GREEN',
    shoeSize: '10.0',
    shoeWidth: 'D',
  },
  events: [
    {
      date: '2026-01-01',
      type: 'Verification',
      agency: 'PRINCETON POLICE DEPT',
    },
    {
      date: '2018-01-01',
      type: 'Registration',
      agency: 'PRINCETON POLICE DEPT',
    },
  ],
  offenses: [
    {
      offense: 'EXAMPLE OFFENSE',
      statute: 'TEXAS PENAL CODE 00.000',
      victimSex: 'Female',
      victimAge: '14',
      dispositionDate: '2018-01-01',
      judgment: 'PROBATION/COMMUNITY SUPERVISION',
    },
  ],
});
