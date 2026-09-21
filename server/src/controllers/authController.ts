import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { ProfessorProfile } from '../models/ProfessorProfile.js';
import { ResearcherProfile } from '../models/ResearcherProfile.js';
import { CompanyProfile } from '../models/CompanyProfile.js';
import { AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../utils/activity.js';

// Keep the development fallback aligned with authenticateToken. Production
// startup already requires JWT_SECRET, so this is only for local demo mode.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-nirmaan-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user: IUser): string {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role, institution, department, district, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'CITIZEN',
      institution,
      department,
      district: district || 'Ranchi',
      phone,
      impactPoints: 10,
      badges: ['GramUtthan Pioneer']
    });

    if (user.role === 'STUDENT') {
      await StudentProfile.create({
        userId: user._id,
        institution: institution || 'BIT Mesra',
        department: department || 'Civil Engineering',
        skills: ['Infrastructure Planning', 'AutoCAD', 'Surveying'],
        interestDomains: ['Rural Infrastructure', 'Water Security'],
      });
    } else if (user.role === 'PROFESSOR') {
      await ProfessorProfile.create({
        userId: user._id,
        institution: institution || 'BIT Mesra',
        department: department || 'Civil Engineering',
        designation: 'Associate Professor',
        expertiseAreas: ['Bridge Engineering', 'Structural Safety', 'Sustainable Materials'],
        publishedTopics: ['Rural Culvert Resiliency in Monsoon Zones'],
        contactEmail: user.email
      });
    }
 else if (user.role === 'RESEARCHER') {
      await ResearcherProfile.create({
        userId: user._id,
        institution: institution || 'Research Institute',
        department: department || 'Applied Research',
        expertiseAreas: ['Rural Innovation'],
        researchTopics: ['Civic Infrastructure', 'Water Security']
      });
    } else if (user.role === 'COMPANY') {
      await CompanyProfile.create({
        userId: user._id,
        companyName: name,
        industry: department || 'Technology',
        focusAreas: ['Rural Infrastructure', 'Digital Public Services'],
        capabilities: ['Mentorship', 'Technical Resources'],
        districts: [district || 'Ranchi'],
        contactEmail: user.email,
        verified: false
      });
    }

    const token = generateToken(user);

    await logActivity({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_REGISTERED',
      details: `New ${user.role} registered from ${user.district}`,
      entityType: 'SYSTEM'
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        department: user.department,
        district: user.district,
        impactPoints: user.impactPoints,
        badges: user.badges
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error during registration' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
      return;
    }

    const token = generateToken(user);

    await logActivity({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      details: `${user.name} logged in`,
      entityType: 'SYSTEM'
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        department: user.department,
        district: user.district,
        impactPoints: user.impactPoints,
        badges: user.badges
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
}

export async function demoLogin(req: Request, res: Response): Promise<void> {
  try {
    if (process.env.DEMO_MODE !== 'true') {
      res.status(404).json({ success: false, message: 'Demo login is disabled.' });
      return;
    }
    const { role } = req.body;
    const targetRole = (role || 'CITIZEN').toUpperCase();

    // Find seeded demo account for this role
    let user = await User.findOne({ role: targetRole, isDemoAccount: true });

    if (!user) {
      // Fallback to any user with this role
      user = await User.findOne({ role: targetRole });
    }

    if (!user) {
      // Create on the fly if not seeded yet
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('Demo@123', salt);
      user = await User.create({
        name: `Demo ${targetRole.charAt(0) + targetRole.slice(1).toLowerCase()}`,
        email: `${targetRole.toLowerCase()}@demo.com`,
        passwordHash: hash,
        role: targetRole as any,
        district: 'Ranchi',
        institution: targetRole === 'STUDENT' || targetRole === 'PROFESSOR' ? 'BIT Mesra' : undefined,
        department: targetRole === 'STUDENT' || targetRole === 'PROFESSOR' ? 'Civil & Environmental Engineering' : undefined,
        impactPoints: 120,
        badges: ['Demo Master', 'Jharkhand Innovator'],
        isDemoAccount: true
      });
    }

    if (user.role === 'RESEARCHER' && !(await ResearcherProfile.exists({ userId: user._id }))) {
      await ResearcherProfile.create({ userId: user._id, institution: user.institution || 'Research Institute', department: user.department || 'Applied Research', expertiseAreas: ['Civic Technology','Rural Innovation'], researchTopics: ['Infrastructure','Water Security'] });
    }
    if (user.role === 'COMPANY' && !(await CompanyProfile.exists({ userId: user._id }))) {
      await CompanyProfile.create({ userId: user._id, companyName: user.name, industry: 'Technology', focusAreas: ['Rural Infrastructure','Digital Public Services'], capabilities: ['Mentorship','Funding','Technical Resources'], districts: [user.district || 'Ranchi'], contactEmail: user.email, verified: true });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Logged in as demo ${targetRole}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        department: user.department,
        district: user.district,
        impactPoints: user.impactPoints,
        badges: user.badges
      }
    });
  } catch (err: any) {
    console.error('Demo login error:', err);
    res.status(500).json({ success: false, message: 'Demo login failed' });
  }
}

export async function getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  let profile = null;
  if (req.user.role === 'STUDENT') {
    profile = await StudentProfile.findOne({ userId: req.user._id });
  } else if (req.user.role === 'PROFESSOR') {
    profile = await ProfessorProfile.findOne({ userId: req.user._id });
  } else if (req.user.role === 'RESEARCHER') {
    profile = await ResearcherProfile.findOne({ userId: req.user._id });
  } else if (req.user.role === 'COMPANY') {
    profile = await CompanyProfile.findOne({ userId: req.user._id });
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      institution: req.user.institution,
      department: req.user.department,
      district: req.user.district,
      phone: req.user.phone,
      avatarUrl: req.user.avatarUrl,
      impactPoints: req.user.impactPoints,
      badges: req.user.badges,
      isDemoAccount: req.user.isDemoAccount,
      createdAt: req.user.createdAt,
      profile
    }
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
}
