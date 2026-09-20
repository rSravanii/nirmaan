import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ProblemReport } from '../models/ProblemReport.js';
import { Project } from '../models/Project.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { ProfessorProfile } from '../models/ProfessorProfile.js';
import { ResearcherProfile } from '../models/ResearcherProfile.js';

export async function getExpertDashboard(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;
  const profile = user.role === 'STUDENT' ? await StudentProfile.findOne({userId:user._id}).lean() : user.role === 'PROFESSOR' ? await ProfessorProfile.findOne({userId:user._id}).lean() : await ResearcherProfile.findOne({userId:user._id}).lean();
  const domains = (profile as any)?.expertiseAreas || (profile as any)?.interestDomains || [];
  const query:any = domains.length ? {$or:[{suggestedDomains:{$in:domains}},{tags:{$in:domains}}]} : {};
  const recommendedProblems = await ProblemReport.find({...query,status:{$in:['OPEN','VERIFIED']}}).sort({severity:-1,createdAt:-1}).limit(6).lean();
  const projects = await Project.find({$or:[{leadStudentId:user._id},{teamMembers:user._id},{mentorProfessorId:user._id}]}).sort({updatedAt:-1}).limit(10).populate('problemReportId','title category district').lean();
  res.json({success:true,profile,recommendedProblems,projects,stats:{recommendedProblems:recommendedProblems.length,projects:projects.length,impactPoints:user.impactPoints}});
}
