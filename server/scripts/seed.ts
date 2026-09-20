import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../src/models/User.js';
import { ProblemReport } from '../src/models/ProblemReport.js';
import { ProblemCluster } from '../src/models/ProblemCluster.js';
import { Project } from '../src/models/Project.js';
import { ProjectMilestone } from '../src/models/ProjectMilestone.js';
import { StudentProfile } from '../src/models/StudentProfile.js';
import { ProfessorProfile } from '../src/models/ProfessorProfile.js';
import { LeaderboardEntry } from '../src/models/LeaderboardEntry.js';
import { Notification } from '../src/models/Notification.js';
import { Reward } from '../src/models/Reward.js';
import { ActivityLog } from '../src/models/ActivityLog.js';
import { aiService } from '../src/services/ai/index.js';
import { ResearcherProfile } from '../src/models/ResearcherProfile.js';
import { CompanyProfile } from '../src/models/CompanyProfile.js';
import { createKnowledgeFromProject } from '../src/services/knowledge/index.js';

export async function seedDatabaseIfEmpty() {
  const count = await ProblemReport.countDocuments();
  if (count === 0) {
    console.log('Database is empty. Populating with realistic Jharkhand seed data...');
    await runSeed();
  }
}

export async function runSeed() {
  console.log('Seeding GramUtthan database with Jharkhand civic data...');

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    ProblemReport.deleteMany({}),
    ProblemCluster.deleteMany({}),
    Project.deleteMany({}),
    ProjectMilestone.deleteMany({}),
    StudentProfile.deleteMany({}),
    ProfessorProfile.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Notification.deleteMany({}),
    Reward.deleteMany({}),
    ActivityLog.deleteMany({})
  ]);

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Demo@123', salt);

  // 1. Create 10+ Users across roles
  const users = await User.create([
    {
      name: 'Birsa Munda (Citizen)',
      email: 'citizen@demo.com',
      passwordHash: defaultPasswordHash,
      role: 'CITIZEN',
      district: 'Ranchi',
      phone: '+919876543210',
      impactPoints: 65,
      badges: ['Gram Champion', 'First Voice'],
      isDemoAccount: true,
    },
    {
      name: 'Aarav Sharma (Student Lead)',
      email: 'student@demo.com',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      institution: 'BIT Mesra, Ranchi',
      department: 'Civil Engineering',
      district: 'Ranchi',
      phone: '+919876543211',
      impactPoints: 240,
      badges: ['Hackathon Star', 'Bridge Architect', 'Top Solver'],
      isDemoAccount: true,
    },
    {
      name: 'Dr. Rameshwar Mahto (Professor)',
      email: 'professor@demo.com',
      passwordHash: defaultPasswordHash,
      role: 'PROFESSOR',
      institution: 'BIT Mesra, Ranchi',
      department: 'Civil & Structural Engineering',
      district: 'Ranchi',
      phone: '+919876543212',
      impactPoints: 310,
      badges: ['Expert Faculty Mentor', 'GramUtthan Advisor'],
      isDemoAccount: true,
    },
    {
      name: 'Pooja Soren (District Evaluator)',
      email: 'evaluator@demo.com',
      passwordHash: defaultPasswordHash,
      role: 'EVALUATOR',
      institution: 'Rural Development Dept, Govt of Jharkhand',
      department: 'Civic Infrastructure Verification Wing',
      district: 'Ranchi',
      phone: '+919876543213',
      impactPoints: 450,
      badges: ['Authority Verifier', 'Field Officer'],
      isDemoAccount: true,
    },
    {
      name: 'Chief Administrator (Jharkhand)',
      email: 'admin@demo.com',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      institution: 'Information Technology Dept, Govt of Jharkhand',
      department: 'State Civic Innovation Hub',
      district: 'Ranchi',
      phone: '+919876543214',
      impactPoints: 500,
      badges: ['System Administrator', 'State Governance'],
      isDemoAccount: true,
    },
    {
      name: 'Sneha Kumari (Student Researcher)',
      email: 'sneha.student@iitism.ac.in',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      institution: 'IIT (ISM) Dhanbad',
      department: 'Environmental Engineering',
      district: 'Dhanbad',
      phone: '+919876543215',
      impactPoints: 180,
      badges: ['Water Warrior', 'Field Surveyor'],
      isDemoAccount: false,
    },
    {
      name: 'Vikram Hansda (NGO Coordinator)',
      email: 'vikram.ngo@pradan.net',
      passwordHash: defaultPasswordHash,
      role: 'NGO',
      institution: 'PRADAN Jharkhand',
      district: 'West Singhbhum',
      phone: '+919876543216',
      impactPoints: 210,
      badges: ['Community Catalyst'],
      isDemoAccount: false,
    },
    {
      name: 'Dr. Ananya Roy (Renewable Energy Faculty)',
      email: 'ananya.roy@nitjsr.ac.in',
      passwordHash: defaultPasswordHash,
      role: 'PROFESSOR',
      institution: 'NIT Jamshedpur',
      department: 'Electrical Engineering',
      district: 'East Singhbhum',
      phone: '+919876543217',
      impactPoints: 290,
      badges: ['Solar Pioneer'],
      isDemoAccount: false,
    },
    {
      name: 'Deepak Bedia (Rural Citizen)',
      email: 'deepak.bedia@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'CITIZEN',
      district: 'Hazaribagh',
      phone: '+919876543218',
      impactPoints: 45,
      badges: ['Active Villager'],
      isDemoAccount: false,
    },
    {
      name: 'Sunita Murmu (Evaluator Dumka)',
      email: 'sunita.evaluator@jharkhand.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'EVALUATOR',
      institution: 'Dumka District Administration',
      department: 'Panchayati Raj Office',
      district: 'Dumka',
      phone: '+919876543219',
      impactPoints: 380,
      badges: ['District Validator'],
      isDemoAccount: false,
    },
    { name: 'Dr. Meera Researcher', email: 'researcher@demo.com', passwordHash: defaultPasswordHash, role: 'RESEARCHER', institution: 'National Rural Innovation Lab', department: 'Applied Research', district: 'Ranchi', impactPoints: 300, badges: ['Research Mentor'], isDemoAccount: true },
    { name: 'Nirmaan Industry Partner', email: 'company@demo.com', passwordHash: defaultPasswordHash, role: 'COMPANY', institution: 'Nirmaan Industry Network', department: 'Technology', district: 'Ranchi', impactPoints: 100, badges: ['Industry Partner'], isDemoAccount: true },
  ]);

  const [citizen, student, professor, evaluator, admin, student2, ngo, professor2, , , researcherUser, companyUser] = users;

  // 2. Student & Professor Profiles
  await StudentProfile.create([
    {
      userId: student._id,
      institution: student.institution!,
      department: student.department!,
      yearOfStudy: 3,
      skills: ['Civil Engineering', 'Bridge Inspection', 'AutoCAD', 'Structural Analysis', 'Drone Surveying'],
      interestDomains: ['Rural Infrastructure', 'Disaster Resilience', 'Sustainable Concrete'],
      completedProjectsCount: 2,
      activeProjectsCount: 1,
      impactScore: 92,
      bio: 'Pre-final year Civil Engineering student focused on resilient culverts and bridges across Jharkhand villages.'
    },
    {
      userId: student2._id,
      institution: student2.institution!,
      department: student2.department!,
      yearOfStudy: 4,
      skills: ['Water Filtration', 'Hydrology', 'IoT Sensors', 'Borewell Monitoring'],
      interestDomains: ['Drinking Water Shortage', 'Environmental Engineering', 'Groundwater Recharge'],
      completedProjectsCount: 1,
      activeProjectsCount: 1,
      impactScore: 88,
      bio: 'Environmental Engineering scholar passionate about fluoride-free rural water solutions.'
    }
  ]);

  await ProfessorProfile.create([
    {
      userId: professor._id,
      institution: professor.institution!,
      department: professor.department!,
      designation: 'Professor & Head',
      expertiseAreas: ['Bridge Engineering', 'Structural Safety', 'Civil Engineering', 'Disaster Resilience'],
      publishedTopics: ['Monsoon Washout Mitigation in Chota Nagpur Plateau', 'Low-cost Rural Bridge Design'],
      mentoredProjectsCount: 12,
      contactEmail: professor.email,
      bio: '20+ years researching structural integrity of rural transport links across Jharkhand.'
    },
    {
      userId: professor2._id,
      institution: professor2.institution!,
      department: professor2.department!,
      designation: 'Associate Professor',
      expertiseAreas: ['Solar Power', 'Micro-grids', 'Renewable Energy', 'IoT Streetlighting'],
      publishedTopics: ['Autonomous Solar LED Corridors for Tribal Hamlets'],
      mentoredProjectsCount: 8,
      contactEmail: professor2.email,
      bio: 'Specialist in off-grid solar and decentralized village energy systems.'
    }
  ]);

  await ResearcherProfile.create({ userId: researcherUser._id, institution: researcherUser.institution!, department: researcherUser.department!, designation: 'Lead Researcher', expertiseAreas: ['Rural Infrastructure','Water Security','Civic Technology'], researchTopics: ['Low-cost infrastructure','Water monitoring','Public problem solving'], publications: ['Community-led infrastructure diagnostics'] });
  await CompanyProfile.create({ userId: companyUser._id, companyName: 'Nirmaan Industry Partner', industry: 'Technology & Infrastructure', focusAreas: ['Rural Infrastructure','Water Security','Civic Technology'], capabilities: ['Mentorship','Funding','Technical Resources'], districts: ['Ranchi','Dhanbad','East Singhbhum'], contactEmail: companyUser.email, verified: true });

  // 3. Create Seed Problems (including the Jury Demo duplicate cluster)
  // Demo cluster problem: Broken rural bridge in Angara, Ranchi
  const bridgeEmb = await aiService.generateEmbedding('Broken rural bridge Angara Ranchi children cross danger civil engineering');

  const demoCluster = await ProblemCluster.create({
    title: 'Damaged Wooden-Concrete Bridge over Subarnarekha Tributary',
    category: 'Broken bridge',
    district: 'Ranchi',
    village: 'Hesal, Angara Block',
    coordinates: { latitude: 23.3850, longitude: 85.4520 },
    severity: 'HIGH',
    status: 'VERIFIED',
    reportCount: 7,
    totalAffectedPopulation: 1450,
    embedding: bridgeEmb,
    tags: ['broken-bridge', 'ranchi', 'civil-engineering', 'public-safety', 'school-access'],
    suggestedResearchDomains: ['Civil Engineering', 'Structural Engineering', 'Rural Infrastructure', 'Disaster Resilience'],
  });

  // 20+ Real Jharkhand Civic Problem Reports
  const reportsData = [
    // Reports for the duplicate bridge cluster
    {
      title: 'Bridge near our village Hesal is broken and dangerous for school children',
      description: 'The culvert bridge over the stream was washed out during heavy rainfall. Children from three villages cannot safely cross to reach the secondary school.',
      originalLanguage: 'hi',
      translatedText: 'The culvert bridge over the stream was washed out during heavy rainfall. Children from three villages cannot safely cross to reach the secondary school.',
      category: 'Broken bridge',
      severity: 'HIGH',
      affectedPopulation: 450,
      village: 'Hesal',
      district: 'Ranchi',
      coordinates: { latitude: 23.3850, longitude: 85.4520 },
      photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: true,
      reportedBy: citizen._id,
      clusterId: demoCluster._id,
      duplicateConfidence: 0.94,
      isDuplicate: true,
      status: 'VERIFIED',
      verificationStatus: 'VERIFIED',
      embedding: bridgeEmb,
      tags: ['broken-bridge', 'ranchi', 'civil-engineering', 'school-access'],
      suggestedDomains: ['Civil Engineering', 'Structural Engineering'],
    },
    {
      title: 'The same bridge cannot be used after the damage and collapse',
      description: 'Vehicle movement has stopped completely because the concrete slab has cracked through the middle. Emergency medical vans cannot enter the hamlet.',
      originalLanguage: 'en',
      translatedText: 'Vehicle movement has stopped completely because the concrete slab has cracked through the middle. Emergency medical vans cannot enter the hamlet.',
      category: 'Broken bridge',
      severity: 'HIGH',
      affectedPopulation: 600,
      village: 'Hesal',
      district: 'Ranchi',
      coordinates: { latitude: 23.3852, longitude: 85.4525 },
      photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: false,
      reportedBy: users[8]._id,
      clusterId: demoCluster._id,
      duplicateConfidence: 0.92,
      isDuplicate: true,
      status: 'VERIFIED',
      verificationStatus: 'VERIFIED',
      embedding: bridgeEmb,
      tags: ['broken-bridge', 'ranchi', 'civil-engineering'],
      suggestedDomains: ['Civil Engineering', 'Structural Engineering'],
    },
    // Other realistic Jharkhand problems
    {
      title: 'Three community borewells dry and contaminated in Tatisilwai',
      description: 'Submersible motor burnt down 4 weeks ago. More than 120 households are forced to fetch turbid pond water from 2 km away.',
      originalLanguage: 'hi',
      category: 'Non-functional borewell',
      severity: 'HIGH',
      affectedPopulation: 580,
      village: 'Tatisilwai',
      district: 'Ranchi',
      coordinates: { latitude: 23.3670, longitude: 85.4120 },
      photos: ['https://images.unsplash.com/photo-1579451861283-a2239070aaa9?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: true,
      status: 'OPEN',
      verificationStatus: 'PENDING',
      tags: ['drinking-water', 'borewell', 'ranchi', 'environmental-engineering'],
      suggestedDomains: ['Environmental Engineering', 'Mechanical Engineering (Pumps)', 'Water Resources'],
    },
    {
      title: 'Monsoon flash flood destroyed approach road to Ghatshila village',
      description: 'Severe road erosion has isolated 4 tribal tolas. Two-wheelers cannot pass without slipping down the embankment slope.',
      originalLanguage: 'sat',
      category: 'Damaged road',
      severity: 'HIGH',
      affectedPopulation: 890,
      village: 'Dhalbhumgarh',
      district: 'East Singhbhum',
      coordinates: { latitude: 22.5050, longitude: 86.5500 },
      photos: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: false,
      status: 'VERIFIED',
      verificationStatus: 'VERIFIED',
      tags: ['damaged-road', 'east-singhbhum', 'civil-engineering'],
      suggestedDomains: ['Civil Engineering', 'Transportation Engineering'],
    },
    {
      title: 'Solar mini-grid and 14 streetlights non-operational in Chaibasa hills',
      description: 'Battery storage depleted and inverter tripped during thunderstorm. Women feel unsafe walking at dusk.',
      originalLanguage: 'ho',
      category: 'Streetlight failure',
      severity: 'MEDIUM',
      affectedPopulation: 340,
      village: 'Jhinkpani',
      district: 'West Singhbhum',
      coordinates: { latitude: 22.4600, longitude: 85.7300 },
      photos: ['https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: true,
      status: 'OPEN',
      verificationStatus: 'VERIFIED',
      tags: ['streetlight', 'solar', 'west-singhbhum', 'electrical-engineering'],
      suggestedDomains: ['Electrical Engineering', 'Renewable Energy Systems'],
    },
    {
      title: 'Middle School boundary wall and girls toilet damaged in Katkamsandi',
      description: 'Ceiling plaster falling down in primary section; sanitation block completely blocked due to lack of gravity drainage.',
      originalLanguage: 'hi',
      category: 'School infrastructure problem',
      severity: 'CRITICAL',
      affectedPopulation: 280,
      village: 'Katkamsandi',
      district: 'Hazaribagh',
      coordinates: { latitude: 24.0900, longitude: 85.2700 },
      photos: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: true,
      status: 'OPEN',
      verificationStatus: 'PENDING',
      tags: ['school-infrastructure', 'hazaribagh', 'sanitation'],
      suggestedDomains: ['Civil Engineering', 'Public Health & Sanitation'],
    },
    {
      title: 'Toxic coal dust runoff overflowing drainage channels into agricultural fields',
      description: 'Uncovered coal wash siding slurry leaking into paddy canals during unseasonal rains in Chas block.',
      originalLanguage: 'en',
      category: 'Drainage problem',
      severity: 'HIGH',
      affectedPopulation: 1100,
      village: 'Chas',
      district: 'Bokaro',
      coordinates: { latitude: 23.6300, longitude: 86.1700 },
      photos: ['https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: false,
      status: 'VERIFIED',
      verificationStatus: 'VERIFIED',
      tags: ['drainage', 'agricultural-pollution', 'bokaro'],
      suggestedDomains: ['Environmental Engineering', 'Agricultural Innovation'],
    },
    {
      title: 'Health sub-centre lacks solar backup and refrigerated vaccine storage',
      description: 'Frequent 12-hour blackouts spoil anti-venom and immunization vials in Topchanchi periphery.',
      originalLanguage: 'hi',
      category: 'Healthcare/access issue',
      severity: 'CRITICAL',
      affectedPopulation: 2400,
      village: 'Topchanchi',
      district: 'Dhanbad',
      coordinates: { latitude: 23.9000, longitude: 86.2000 },
      photos: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: true,
      status: 'OPEN',
      verificationStatus: 'VERIFIED',
      tags: ['healthcare', 'dhanbad', 'solar-cooling', 'biomedical'],
      suggestedDomains: ['Biomedical Engineering', 'Renewable Energy Systems'],
    },
    {
      title: 'Broken bamboo footbridge over Mayurakshi stream during school hours',
      description: 'Temporary foot-crossing washed away. Villagers carrying young pupils on shoulders across dangerous rapids.',
      originalLanguage: 'sat',
      category: 'Broken bridge',
      severity: 'HIGH',
      affectedPopulation: 670,
      village: 'Shikaripara',
      district: 'Dumka',
      coordinates: { latitude: 24.2200, longitude: 87.5100 },
      photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: true,
      status: 'OPEN',
      verificationStatus: 'PENDING',
      tags: ['broken-bridge', 'dumka', 'public-safety'],
      suggestedDomains: ['Civil Engineering', 'Rural Infrastructure'],
    },
    {
      title: 'Temple tourist waste plastic accumulation choking village pond ecosystem',
      description: 'Solid waste dumped on natural drainage inlets leading to massive mosquito breeding in Baidyanath outskirts.',
      originalLanguage: 'hi',
      category: 'Waste-management issue',
      severity: 'MEDIUM',
      affectedPopulation: 1300,
      village: 'Rohini',
      district: 'Deoghar',
      coordinates: { latitude: 24.4700, longitude: 86.6500 },
      photos: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: false,
      status: 'OPEN',
      verificationStatus: 'VERIFIED',
      tags: ['waste-management', 'deoghar', 'biodegradable'],
      suggestedDomains: ['Environmental Engineering', 'Circular Economy'],
    },
    {
      title: 'Gravity irrigation canal collapsed by boulder slide in Raidih',
      description: 'Canal feeding 60 acres of millets broken. Immediate low-cost flume piping or gabion reinforcement required.',
      originalLanguage: 'mun',
      category: 'Drainage problem',
      severity: 'HIGH',
      affectedPopulation: 420,
      village: 'Raidih',
      district: 'Gumla',
      coordinates: { latitude: 23.0100, longitude: 84.4000 },
      photos: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: false,
      status: 'VERIFIED',
      verificationStatus: 'VERIFIED',
      tags: ['irrigation', 'gumla', 'water-flow'],
      suggestedDomains: ['Agricultural Engineering', 'Civil Engineering'],
    },
    {
      title: 'Deep tribal forest hamlet cutoff due to fallen culvert slab in Kolebira',
      description: 'Primary school teachers unable to attend classes. Ambulances cannot enter beyond 5 km marker.',
      originalLanguage: 'hi',
      category: 'Broken bridge',
      severity: 'CRITICAL',
      affectedPopulation: 850,
      village: 'Kolebira',
      district: 'Simdega',
      coordinates: { latitude: 22.7000, longitude: 84.7000 },
      photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'],
      cameraCaptured: true,
      status: 'OPEN',
      verificationStatus: 'VERIFIED',
      tags: ['broken-bridge', 'simdega', 'emergency-access'],
      suggestedDomains: ['Civil Engineering', 'Structural Engineering'],
    }
  ];

  const createdReports = [];
  for (const item of reportsData) {
    const emb = await aiService.generateEmbedding(`${item.title} ${item.description} ${item.category}`);
    const rep = await ProblemReport.create({
      ...item,
      embedding: emb,
      reportedBy: item.reportedBy || citizen._id,
      locationName: `${item.village}, ${item.district}`,
      state: 'Jharkhand',
      aiSummary: item.translatedText || item.description,
      isAnonymous: false,
    });
    createdReports.push(rep);
  }

  // Update primary report in demo cluster
  demoCluster.primaryReportId = createdReports[0]._id;
  demoCluster.reportIds = [createdReports[0]._id, createdReports[1]._id];
  await demoCluster.save();

  // 4. Create Seed Projects (5+ realistic student projects)
  const project1 = await Project.create({
    title: 'Pre-stressed Modular Culvert Bridge for Angara Village Stream',
    description: 'A precast concrete arch design using locally sourced fly-ash aggregates to quickly bridge the 18-meter washout with zero heavy crane requirements.',
    problemReportId: createdReports[0]._id,
    clusterId: demoCluster._id,
    leadStudentId: student._id,
    teamMembers: [student._id, student2._id],
    institution: 'BIT Mesra, Ranchi',
    department: 'Civil Engineering',
    mentorProfessorId: professor._id,
    status: 'IN_PROGRESS',
    impactScore: 94,
    impactPointsAwarded: 50,
    solutionSummary: 'Precast modular culvert with gabion wing-walls, designed to sustain heavy monsoon hydraulic loads with an estimated construction duration of 14 days.',
    repositoryUrl: 'https://github.com/jharkhand-innovators/gram-bridge-resilience',
    demoUrl: 'https://gramutthan.jharkhand.gov.in/demo/bridge-angara'
  });

  // Create Milestones for Project 1 (for Evaluator test scenario!)
  const m1 = await ProjectMilestone.create({
    projectId: project1._id,
    title: 'Site Survey & Hydraulic Structural Assessment Completed',
    description: 'Completed topographic drone survey, computed 50-year flood discharge volume, and finalized precast arch geometry.',
    phaseNumber: 1,
    evidenceFiles: [],
    evidenceNotes: 'Drone survey maps and CAD drawings approved by Prof. Rameshwar Mahto.',
    status: 'APPROVED',
    reviewedBy: evaluator._id,
    reviewerNotes: 'Survey thoroughly documented. Safe clearance above high-flood line confirmed.',
    submittedAt: new Date(Date.now() - 7 * 86400000),
    verifiedAt: new Date(Date.now() - 5 * 86400000),
  });

  const m2 = await ProjectMilestone.create({
    projectId: project1._id,
    title: 'Structural assessment completed & Concrete Specimen Testing',
    description: '7-day compression tests on fly-ash blended concrete blocks showed 32 MPa strength, exceeding rural bridge standards.',
    phaseNumber: 2,
    evidenceFiles: [],
    evidenceNotes: 'Strength certificates from BIT Mesra concrete lab attached.',
    status: 'SUBMITTED', // Ready for live evaluator verification!
    submittedAt: new Date(Date.now() - 1 * 86400000),
  });

  project1.milestones = [m1._id as any, m2._id as any];
  await project1.save();

  // Create 4 more active/completed student projects
  await Project.create([
    {
      title: 'Solar Powered IoT Telemetric Borewell Purifier',
      description: 'Decentralized reverse osmosis + UV filter powered by 450W bifacial solar array with automatic dry-run shutoff.',
      problemReportId: createdReports[2]._id,
      leadStudentId: student2._id,
      teamMembers: [student2._id],
      institution: 'IIT (ISM) Dhanbad',
      department: 'Environmental Engineering',
      mentorProfessorId: professor2._id,
      status: 'VERIFIED',
      impactScore: 96,
      impactPointsAwarded: 100,
      verifiedBy: evaluator._id,
      verifiedAt: new Date(),
      evaluatorRemarks: 'Pure drinking water restored to 120 households. Fluoride levels dropped below 0.5 ppm.',
      solutionSummary: 'Solar-powered RO plus UV purification with dry-run protection and IoT water-quality monitoring restored safe drinking water for the affected households.',
      repositoryUrl: 'https://github.com/jharkhand-innovators/solar-borewell-purifier',
    },
    {
      title: 'Geotextile Embankment Stabilization for Ghatshila Road',
      description: 'Jute-geotextile and vetiver grass planting for slope stabilization on eroded hill road.',
      problemReportId: createdReports[3]._id,
      leadStudentId: student._id,
      teamMembers: [student._id],
      institution: 'BIT Mesra, Ranchi',
      department: 'Civil Engineering',
      status: 'CLAIMED',
      impactScore: 0,
    },
    {
      title: 'Smart LED LoRa Mesh for Chaibasa Forest Corridor',
      description: 'LoRa-based fault diagnosis and dimming circuit saving 60% battery energy during early morning hours.',
      problemReportId: createdReports[4]._id,
      leadStudentId: student._id,
      teamMembers: [student._id],
      institution: 'NIT Jamshedpur',
      department: 'Electrical Engineering',
      mentorProfessorId: professor2._id,
      status: 'IN_PROGRESS',
      impactScore: 82,
    },
    {
      title: 'Bio-digester Eco-Sanitation Unit for Rural Schools',
      description: 'Low-maintenance aerobic bio-tank eliminating manual scavenging and bad odor in rural school toilets.',
      problemReportId: createdReports[5]._id,
      leadStudentId: student2._id,
      teamMembers: [student2._id],
      institution: 'IIT (ISM) Dhanbad',
      department: 'Environmental Engineering',
      status: 'UNDER_REVIEW',
      impactScore: 89,
    }
  ]);

  // 5. Leaderboard Seed Data
  await LeaderboardEntry.create([
    {
      entityType: 'UNIVERSITY',
      entityName: 'Birla Institute of Technology (BIT) Mesra',
      category: 'university',
      points: 1240,
      resolvedProblemsCount: 8,
      activeProjectsCount: 14,
      rank: 1,
      badge: 'Gold Innovation Hub',
      avatarUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80'
    },
    {
      entityType: 'UNIVERSITY',
      entityName: 'IIT (ISM) Dhanbad',
      category: 'university',
      points: 1080,
      resolvedProblemsCount: 7,
      activeProjectsCount: 11,
      rank: 2,
      badge: 'Silver Technology Partner',
      avatarUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80'
    },
    {
      entityType: 'UNIVERSITY',
      entityName: 'National Institute of Technology (NIT) Jamshedpur',
      category: 'university',
      points: 860,
      resolvedProblemsCount: 5,
      activeProjectsCount: 9,
      rank: 3,
      badge: 'Bronze Civic Solver',
      avatarUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150&auto=format&fit=crop&q=80'
    },
    {
      entityType: 'UNIVERSITY',
      entityName: 'Ranchi University & Polytech',
      category: 'university',
      points: 620,
      resolvedProblemsCount: 4,
      activeProjectsCount: 6,
      rank: 4,
      badge: 'District Enabler',
      avatarUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=150&auto=format&fit=crop&q=80'
    },
  ]);

  // 6. Notifications Seed Data
  await Notification.create([
    {
      recipientId: citizen._id,
      title: 'Your report has been verified.',
      message: 'Authority verifier Pooja Soren approved your bridge problem in Hesal, Ranchi. 25 points credited.',
      type: 'SUCCESS',
      read: false,
    },
    {
      recipientId: student._id,
      title: 'A new problem matches your research domain.',
      message: 'Broken rural bridge in Angara matches your profile in Civil & Structural Engineering (94% match).',
      type: 'MATCH',
      read: false,
    },
    {
      recipientId: professor._id,
      title: 'A rural problem matches your expertise.',
      message: 'Subarnarekha culvert failure in Ranchi matches your research on rural monsoon infrastructure.',
      type: 'MATCH',
      read: false,
    },
    {
      recipientId: evaluator._id,
      title: 'Project milestone requires verification.',
      message: 'Student team Aarav Sharma submitted Milestone: "Structural assessment completed". Please review.',
      type: 'VERIFICATION',
      read: false,
    }
  ]);

  // 7. Activity Logs
  await ActivityLog.create([
    {
      userId: citizen._id,
      userName: 'Birsa Munda (Citizen)',
      userRole: 'CITIZEN',
      action: 'PROBLEM_REPORTED',
      details: 'Reported "Broken rural bridge" in Angara, Ranchi via camera capture.',
      entityType: 'REPORT',
      entityId: createdReports[0]._id,
    },
    {
      userId: evaluator._id,
      userName: 'Pooja Soren (Evaluator)',
      userRole: 'EVALUATOR',
      action: 'REPORT_VERIFIED',
      details: 'Field verified report "Broken rural bridge" with High severity classification.',
      entityType: 'VERIFICATION',
      entityId: createdReports[0]._id,
    },
    {
      userId: student._id,
      userName: 'Aarav Sharma (Student Lead)',
      userRole: 'STUDENT',
      action: 'PROBLEM_CLAIMED',
      details: 'Claimed problem and launched project: Pre-stressed Modular Culvert Bridge.',
      entityType: 'PROJECT',
      entityId: project1._id,
    }
  ]);

  // Build the historical knowledge repository from verified seed projects.
  for (const project of await Project.find({ status: 'VERIFIED', solutionSummary: { $exists: true, $ne: '' } }).select('_id')) {
    await createKnowledgeFromProject(project._id, evaluator._id);
  }

  console.log('✅ Seed completed successfully:');
  console.log(`- ${users.length} demo users created (all password: Demo@123)`);
  console.log(`- ${createdReports.length} realistic Jharkhand problem reports created`);
  console.log(`- 1 active duplicate cluster initialized (similarity > 90%)`);
  console.log(`- 5 student engineering projects initialized with milestones`);
  console.log(`- Leaderboard and notifications pre-populated`);
}

// Direct script execution
if (process.argv[1]?.includes('seed.ts')) {
  import('../src/config/db.js').then(async ({ connectDB, disconnectDB }) => {
    await connectDB();
    await runSeed();
    await disconnectDB();
    process.exit(0);
  });
}
