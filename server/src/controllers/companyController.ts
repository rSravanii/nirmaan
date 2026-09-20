import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { CompanyProfile } from '../models/CompanyProfile.js';
import { CompanyOffer } from '../models/CompanyOffer.js';
import { CompanyParticipation } from '../models/CompanyParticipation.js';
import { Project } from '../models/Project.js';
import { ProblemReport } from '../models/ProblemReport.js';

export async function getCompanyDashboard(req: AuthRequest, res: Response): Promise<void> {
  const profile = await CompanyProfile.findOne({userId:req.user!._id}).lean();
  if (!profile) { res.status(404).json({success:false,message:'Company profile not found'}); return; }
  const focus = profile.focusAreas || [];
  const projects = await Project.find(focus.length ? { $or:[{department:{$in:focus}},{title:{$regex:focus.join('|'),$options:'i'}}] } : {}).sort({updatedAt:-1}).limit(12).populate('problemReportId','title category district severity').lean();
  const problems = await ProblemReport.find(focus.length ? {$or:[{category:{$in:focus}},{tags:{$in:focus}},{suggestedDomains:{$in:focus}}]} : {}).sort({createdAt:-1}).limit(12).lean();
  const offers = await CompanyOffer.find({companyId:profile._id}).sort({createdAt:-1}).limit(10).lean();
  const participations = await CompanyParticipation.find({companyId:profile._id}).sort({createdAt:-1}).limit(10).populate('projectId','title status institution').lean();
  res.json({success:true,profile,projects,problems,offers,participations,stats:{projects:projects.length,problems:problems.length,offers:offers.length,participations:participations.length}});
}

export async function createCompanyOffer(req: AuthRequest, res: Response): Promise<void> {
  const profile = await CompanyProfile.findOne({userId:req.user!._id});
  if (!profile) { res.status(404).json({success:false,message:'Company profile not found'}); return; }
  const {type,title,description,amount,projectId}=req.body;
  if (!type || !title || !description) { res.status(400).json({success:false,message:'type, title and description are required'}); return; }
  const offer = await CompanyOffer.create({companyId:profile._id,type,title,description,amount,projectId:projectId || undefined});
  res.status(201).json({success:true,offer});
}

export async function requestParticipation(req: AuthRequest, res: Response): Promise<void> {
  const profile = await CompanyProfile.findOne({userId:req.user!._id});
  if (!profile) { res.status(404).json({success:false,message:'Company profile not found'}); return; }
  const {projectId,participationType,notes}=req.body;
  if (!projectId || !participationType) { res.status(400).json({success:false,message:'projectId and participationType are required'}); return; }
  const participation = await CompanyParticipation.findOneAndUpdate({companyId:profile._id,projectId,participationType},{companyId:profile._id,projectId,participationType,notes,status:'REQUESTED'},{upsert:true,new:true,setDefaultsOnInsert:true});
  res.status(201).json({success:true,participation});
}
