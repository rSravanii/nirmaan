import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.js';
import { ProblemReport } from '../models/ProblemReport.js';
import { KnowledgeRecord } from '../models/KnowledgeRecord.js';
import { KnowledgeMatchReview } from '../models/KnowledgeMatchReview.js';
import { findHistoricalMatches, createKnowledgeFromProject } from '../services/knowledge/index.js';
import { logActivity } from '../utils/activity.js';

export async function searchKnowledge(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { problemId, title, description, category, district, limit = '5' } = req.query;
    let input: any = { title: title || '', description: description || '', category, district, limit: Math.min(10, Number(limit) || 5) };
    if (problemId) {
      if (!mongoose.Types.ObjectId.isValid(problemId as string)) { res.status(400).json({ success:false, message:'Invalid problemId' }); return; }
      const problem = await ProblemReport.findById(problemId);
      if (!problem) { res.status(404).json({ success:false, message:'Problem not found' }); return; }
      input = { title: problem.title, description: problem.description, category: problem.category, district: problem.district, state: problem.state, tags: problem.tags, suggestedDomains: problem.suggestedDomains, limit: input.limit };
    }
    if (!input.title && !input.description) { res.status(400).json({ success:false, message:'problemId or title/description is required' }); return; }
    const matches = await findHistoricalMatches(input);
    await logActivity({ userId: req.user?._id, userName: req.user?.name || 'Admin', userRole: req.user?.role, action:'HISTORICAL_SEARCH', details:`Searched historical knowledge for ${input.title || 'new problem'}`, entityType:'SYSTEM', metadata:{ resultCount:matches.length } });
    res.json({ success:true, matches });
  } catch (err:any) { console.error(err); res.status(500).json({ success:false, message:'Historical search failed' }); }
}

export async function reviewKnowledgeMatch(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { problemReportId, knowledgeRecordId, similarity, decision, notes } = req.body;
    if (!mongoose.Types.ObjectId.isValid(problemReportId) || !mongoose.Types.ObjectId.isValid(knowledgeRecordId)) { res.status(400).json({success:false,message:'Invalid IDs'}); return; }
    if (!['APPROVED','REJECTED','NEEDS_REVIEW'].includes(decision)) { res.status(400).json({success:false,message:'Invalid decision'}); return; }
    const review = await KnowledgeMatchReview.create({ problemReportId, knowledgeRecordId, reviewerId:req.user!._id, similarity:Number(similarity)||0, decision, notes });
    await logActivity({ userId:req.user!._id, userName:req.user!.name, userRole:req.user!.role, action:'HISTORICAL_MATCH_REVIEWED', details:`${decision} historical match`, entityType:'VERIFICATION', entityId:review._id, metadata:{problemReportId,knowledgeRecordId,similarity} });
    res.json({success:true, review});
  } catch (err:any) { res.status(500).json({success:false,message:'Could not save review'}); }
}

export async function listKnowledge(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { category, status, search } = req.query;
    const q:any = { ...(category && category !== 'All' ? {category} : {}), ...(status && status !== 'All' ? {verificationStatus:status} : {}) };
    if (search) q.$or = [{title:{$regex:search,$options:'i'}},{problemText:{$regex:search,$options:'i'}},{solutionText:{$regex:search,$options:'i'}}];
    const records = await KnowledgeRecord.find(q).sort({createdAt:-1}).limit(100).populate('solutionId','title summary verificationStatus');
    res.json({success:true,records});
  } catch (err:any) { res.status(500).json({success:false,message:'Could not load knowledge records'}); }
}

export async function backfillKnowledge(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { Project } = await import('../models/Project.js');
    const projects = await Project.find({status:'VERIFIED',solutionSummary:{$exists:true,$ne:''}}).select('_id');
    let created=0;
    for (const p of projects) { if (await createKnowledgeFromProject(p._id, req.user!._id)) created++; }
    res.json({success:true,processed:projects.length,upserted:created});
  } catch (err:any) { res.status(500).json({success:false,message:'Backfill failed'}); }
}
