import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProblemReport, IProblemReport } from '../models/ProblemReport.js';
import { ProblemCluster, IProblemCluster } from '../models/ProblemCluster.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { ProjectMilestone } from '../models/ProjectMilestone.js';
import { Reward } from '../models/Reward.js';
import { AuthRequest } from '../middleware/auth.js';
import { aiService } from '../services/ai/index.js';
import { deduplicationEngine } from '../services/deduplication/index.js';
import { smartMatchingEngine } from '../services/matching/index.js';
import { createAndSendNotification } from '../services/notifications/index.js';
import { logActivity } from '../utils/activity.js';
import { sanitizePublicSummary, maskPhoneNumber, maskEmail } from '../utils/privacy.js';
import { appendProblemStatus } from '../utils/problemStatus.js';

export async function createProblemReport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      title,
      description,
      category,
      district,
      village,
      latitude,
      longitude,
      originalLanguage,
      isAnonymous,
      cameraCaptured,
      affectedPopulation
    } = req.body;

    if (!title || !description || !district) {
      res.status(400).json({ success: false, message: 'Title, description, and district are required.' });
      return;
    }

    // Process uploaded files
    const files = req.files as Express.Multer.File[] | undefined;
    const photoUrls: string[] = [];
    let audioUrl: string | undefined;

    if (files && Array.isArray(files)) {
      for (const file of files) {
        const baseUrl = (process.env.PUBLIC_API_URL || '').replace(/\/$/, '');
        const fileUrl = `${baseUrl}/uploads/${file.filename}`;
        if (file.mimetype.startsWith('image/')) {
          photoUrls.push(fileUrl);
        } else if (file.mimetype.startsWith('audio/')) {
          audioUrl = fileUrl;
        }
      }
    }

    // Also support direct photo URL passed in body if captured via webcam canvas dataURL
    if (req.body.photoData && !photoUrls.length && typeof req.body.photoData === 'string') {
      // Backward-compatible support for older clients. New clients upload FormData files.
      if (req.body.photoData.startsWith('data:image/')) {
        photoUrls.push(req.body.photoData);
      }
    }

    // Run AI Orchestration Pipeline
    const aiAnalysis = await aiService.analyzeReport({
      title,
      description,
      language: originalLanguage || 'en',
      district,
      village,
      category,
      affectedPopulation: affectedPopulation ? parseInt(affectedPopulation, 10) : undefined
    });

    // Generate embedding for deduplication & smart matching
    const embedding = await aiService.generateEmbedding(
      `${aiAnalysis.translatedText} ${aiAnalysis.category} ${district}`
    );

    // Run Semantic Deduplication Engine
    const dedupResult = await deduplicationEngine.checkDuplicates(
      aiAnalysis.translatedText,
      description,
      district,
      aiAnalysis.category,
      embedding
    );

    // Coordinates fallback (Jharkhand districts defaults if geolocation denied)
    const districtCoords: Record<string, { lat: number; lng: number }> = {
      Ranchi: { lat: 23.3441, lng: 85.3096 },
      'East Singhbhum': { lat: 22.8046, lng: 86.2029 },
      'West Singhbhum': { lat: 22.5667, lng: 85.8167 },
      Hazaribagh: { lat: 23.9925, lng: 85.3637 },
      Bokaro: { lat: 23.6693, lng: 86.1511 },
      Dhanbad: { lat: 23.7957, lng: 86.4304 },
      Dumka: { lat: 24.2676, lng: 87.2484 },
      Deoghar: { lat: 24.4826, lng: 86.6974 },
      Gumla: { lat: 23.0441, lng: 84.5422 },
      Simdega: { lat: 22.6167, lng: 84.5000 },
    };

    const parsedLat = parseFloat(latitude) || districtCoords[district]?.lat || 23.3441;
    const parsedLng = parseFloat(longitude) || districtCoords[district]?.lng || 85.3096;

    let clusterId: mongoose.Types.ObjectId | undefined;

    if (dedupResult.isDuplicate && dedupResult.clusterId) {
      clusterId = new mongoose.Types.ObjectId(dedupResult.clusterId);
      // Update existing cluster
      await ProblemCluster.findByIdAndUpdate(clusterId, {
        $inc: { 
          reportCount: 1, 
          totalAffectedPopulation: aiAnalysis.affectedPopulation 
        },
        $addToSet: { tags: { $each: aiAnalysis.tags } }
      });
    }

    const report = await ProblemReport.create({
      title,
      description,
      originalLanguage: aiAnalysis.detectedLanguage,
      translatedText: aiAnalysis.translatedText,
      aiSummary: sanitizePublicSummary(aiAnalysis.summary),
      category: aiAnalysis.category,
      subcategory: aiAnalysis.subcategory,
      severity: aiAnalysis.severity,
      affectedPopulation: aiAnalysis.affectedPopulation,
      locationName: village ? `${village}, ${district}` : district,
      village: village || '',
      district,
      state: 'Jharkhand',
      coordinates: {
        latitude: parsedLat,
        longitude: parsedLng,
      },
      photos: photoUrls,
      cameraCaptured: cameraCaptured === true || cameraCaptured === 'true',
      audioUrl,
      reportedBy: req.user ? req.user._id : undefined,
      isAnonymous: isAnonymous === true || isAnonymous === 'true',
      reporterContactMasked: req.user ? maskPhoneNumber(req.user.phone) : undefined,
      clusterId,
      duplicateConfidence: dedupResult.highestSimilarity,
      isDuplicate: dedupResult.isDuplicate,
      status: 'OPEN',
      statusHistory: [{
        status: 'OPEN',
        note: 'Report submitted and awaiting authority verification.',
        updatedBy: req.user?._id,
        updatedAt: new Date(),
      }],
      verificationStatus: 'PENDING',
      embedding,
      tags: aiAnalysis.tags,
      suggestedDomains: aiAnalysis.suggestedResearchDomains,
      aiMetadata: {
        confidence: aiAnalysis.confidence,
        provider: aiAnalysis.provider,
        isFallback: aiAnalysis.isFallback,
        extractedEntities: aiAnalysis.locationEntities,
      }
    });

    // If duplicate was found and cluster was updated, link report to cluster
    if (clusterId) {
      await ProblemCluster.findByIdAndUpdate(clusterId, {
        $push: { reportIds: report._id }
      });
    } else if (dedupResult.isDuplicate && dedupResult.candidates.length > 0) {
      // Create new cluster grouping both
      const newCluster = await ProblemCluster.create({
        title: `Consolidated Issue: ${aiAnalysis.category} in ${district}`,
        category: aiAnalysis.category,
        district,
        village: village || '',
        coordinates: { latitude: parsedLat, longitude: parsedLng },
        severity: aiAnalysis.severity,
        status: 'OPEN',
        primaryReportId: report._id,
        reportIds: [report._id, new mongoose.Types.ObjectId(dedupResult.candidates[0].reportId)],
        reportCount: 2,
        totalAffectedPopulation: aiAnalysis.affectedPopulation * 2,
        embedding,
        tags: aiAnalysis.tags,
        suggestedResearchDomains: aiAnalysis.suggestedResearchDomains,
      });

      report.clusterId = newCluster._id as any;
      await report.save();
    }

    // Award impact points to reporter if registered user
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { impactPoints: 15 } });
      await Reward.create({
        userId: req.user._id,
        points: 15,
        reason: 'Submitted rural civic problem report',
        sourceType: 'REPORT_VERIFIED',
        relatedId: report._id,
      });
    }

    // Log Activity
    await logActivity({
      userId: req.user?._id,
      userName: req.user ? req.user.name : 'Anonymous Citizen',
      userRole: req.user?.role || 'CITIZEN',
      action: 'PROBLEM_REPORTED',
      details: `Reported "${title}" in ${district} (${aiAnalysis.category})`,
      entityType: 'REPORT',
      entityId: report._id,
    });

    // Notify Evaluators
    const evaluators = await User.find({ role: 'EVALUATOR' });
    for (const evaluator of evaluators) {
      await createAndSendNotification({
        recipientId: evaluator._id,
        title: 'New Problem Report Submitted',
        message: `A new ${aiAnalysis.severity} severity issue "${title}" was reported in ${district}. Requires verification.`,
        type: 'VERIFICATION',
        link: `/evaluator?reportId=${report._id}`
      });
    }

    // Return structured response with AI and Dedup info
    res.status(201).json({
      success: true,
      message: 'Problem report submitted and processed successfully.',
      report,
      aiAnalysis: {
        ...aiAnalysis,
        duplicateCandidates: dedupResult.candidates,
        isDuplicate: dedupResult.isDuplicate,
        highestSimilarity: dedupResult.highestSimilarity,
        explanation: dedupResult.explanation,
      }
    });
  } catch (err: any) {
    console.error('Error submitting report:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating problem report' });
  }
}

export async function getProblems(req: Request, res: Response): Promise<void> {
  try {
    const {
      district,
      category,
      severity,
      status,
      verificationStatus,
      search,
      page = '1',
      limit = '25'
    } = req.query;

    const query: any = {};

    if (district && district !== 'All') {
      query.district = district;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (severity && severity !== 'All') {
      query.severity = severity;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (verificationStatus && verificationStatus !== 'All') {
      query.verificationStatus = verificationStatus;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { village: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const total = await ProblemReport.countDocuments(query);
    const reports = await ProblemReport.find(query)
      .populate('reportedBy', 'name email role institution')
      .populate('clusterId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      reports,
    });
  } catch (err: any) {
    console.error('Error fetching problems:', err);
    res.status(500).json({ success: false, message: 'Server error fetching problems' });
  }
}

export async function getProblemById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid problem report ID' });
      return;
    }

    const report = await ProblemReport.findById(id)
      .populate('reportedBy', 'name role district institution')
      .populate('clusterId')
      .populate('claimedByProjectId');

    if (!report) {
      res.status(404).json({ success: false, message: 'Problem report not found' });
      return;
    }

    // Citizen tracking is private: a citizen may only inspect their own report.
    // Other existing public, evaluator, and administrator workflows remain intact.
    if (req.user?.role === 'CITIZEN' && (!report.reportedBy || !report.reportedBy.equals(req.user._id))) {
      res.status(403).json({ success: false, message: 'You can only access reports that you submitted.' });
      return;
    }

    // Privacy mask if user is not ADMIN or EVALUATOR
    const isPrivileged = req.user && ['ADMIN', 'EVALUATOR'].includes(req.user.role);
    if (!isPrivileged && report.isAnonymous) {
      report.reportedBy = undefined;
    }

    res.status(200).json({ success: true, report });
  } catch (err: any) {
    console.error('Error getting problem by ID:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving problem report' });
  }
}

export async function verifyProblem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body; // status: 'VERIFIED' | 'REJECTED'

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status must be VERIFIED or REJECTED.' });
      return;
    }

    const report = await ProblemReport.findById(id);
    if (!report) {
      res.status(404).json({ success: false, message: 'Problem report not found.' });
      return;
    }

    const verificationNote = remarks || (status === 'VERIFIED' ? 'Field verification confirmed by authority.' : 'Report dismissed.');
    report.verificationStatus = status;
    report.verifiedBy = req.user?._id;
    report.verificationNotes = verificationNote;
    appendProblemStatus(report, status, verificationNote, req.user?._id);
    await report.save();

    // Reward and notify the original citizen after an authority decision.
    if (report.reportedBy) {
      if (status === 'VERIFIED') {
        await User.findByIdAndUpdate(report.reportedBy, { $inc: { impactPoints: 25 } });
      await Reward.create({
        userId: report.reportedBy,
        points: 25,
        reason: 'Report officially verified by authority',
        sourceType: 'REPORT_VERIFIED',
        relatedId: report._id,
      });

      }

      await createAndSendNotification({
        recipientId: report.reportedBy,
        title: status === 'VERIFIED' ? 'Report Verified!' : 'Report Rejected',
        message: status === 'VERIFIED'
          ? `Your report "${report.title}" in ${report.district} has been verified by the authority. You earned 25 Impact Points!`
          : `Your report "${report.title}" was not approved. ${verificationNote}`,
        type: status === 'VERIFIED' ? 'SUCCESS' : 'WARNING',
        link: `/my-reports?reportId=${report._id}`,
        metadata: { reportId: report._id.toString(), status },
      });
    }

    await logActivity({
      userId: req.user?._id,
      userName: req.user ? req.user.name : 'Evaluator',
      userRole: 'EVALUATOR',
      action: 'REPORT_VERIFIED',
      details: `${status} report "${report.title}": ${remarks || ''}`,
      entityType: 'VERIFICATION',
      entityId: report._id,
    });

    res.status(200).json({
      success: true,
      message: `Problem report has been ${status.toLowerCase()}.`,
      report
    });
  } catch (err: any) {
    console.error('Error verifying problem:', err);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
}

export async function claimProblem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { projectTitle, projectDescription, institution, department } = req.body;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to claim problem.' });
      return;
    }

    const report = await ProblemReport.findById(id);
    if (!report) {
      res.status(404).json({ success: false, message: 'Problem report not found.' });
      return;
    }

    if (report.status === 'CLAIMED' || report.status === 'IN_PROGRESS' || report.status === 'RESOLVED') {
      res.status(409).json({ success: false, message: 'This problem is already claimed or in progress.' });
      return;
    }

    // Create Project
    const project = await Project.create({
      title: projectTitle || `Resolution: ${report.title}`,
      description: projectDescription || `Student engineering solution addressing "${report.title}" in ${report.district}.`,
      problemReportId: report._id,
      clusterId: report.clusterId,
      leadStudentId: req.user._id,
      teamMembers: [req.user._id],
      institution: institution || req.user.institution || 'BIT Mesra',
      department: department || req.user.department || 'Civil Engineering',
      status: 'CLAIMED',
      impactScore: 0,
      impactPointsAwarded: 20,
    });

    // Create Initial Milestone
    const milestone1 = await ProjectMilestone.create({
      projectId: project._id,
      title: 'Site Analysis & Feasibility Study',
      description: 'Initial remote survey, structural assessment, and material estimation.',
      phaseNumber: 1,
      status: 'PENDING'
    });

    project.milestones = [milestone1._id as any];
    await project.save();

    // Update Report status
    appendProblemStatus(
      report,
      'CLAIMED',
      `Claimed by ${project.institution} for project "${project.title}".`,
      req.user._id,
    );
    report.claimedByProjectId = project._id as any;
    await report.save();

    // Reward student with impact points
    await User.findByIdAndUpdate(req.user._id, { $inc: { impactPoints: 20 } });
    await Reward.create({
      userId: req.user._id,
      points: 20,
      reason: 'Claimed rural problem for engineering solution',
      sourceType: 'PROBLEM_CLAIMED',
      relatedId: project._id,
    });

    // Notify original citizen reporter
    if (report.reportedBy) {
      await createAndSendNotification({
        recipientId: report.reportedBy,
        title: 'Your Report Has Been Claimed!',
        message: `A university engineering team from ${project.institution} has claimed your report "${report.title}" and started work!`,
        type: 'SUCCESS',
        link: `/my-reports?reportId=${report._id}`,
        metadata: { reportId: report._id.toString(), status: 'CLAIMED' },
      });
    }

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'PROBLEM_CLAIMED',
      details: `Claimed "${report.title}" and created Project "${project.title}"`,
      entityType: 'PROJECT',
      entityId: project._id,
    });

    res.status(201).json({
      success: true,
      message: 'Problem claimed successfully and new project initialized.',
      project,
      report
    });
  } catch (err: any) {
    console.error('Error claiming problem:', err);
    res.status(500).json({ success: false, message: 'Server error claiming problem' });
  }
}

export async function getProblemMatches(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const report = await ProblemReport.findById(id);

    if (!report) {
      res.status(404).json({ success: false, message: 'Problem report not found' });
      return;
    }

    const matches = await smartMatchingEngine.matchProblemToResearchers(
      report.title,
      report.description,
      report.category,
      report.suggestedDomains || [],
      report.embedding
    );

    res.status(200).json({
      success: true,
      problemId: id,
      title: report.title,
      category: report.category,
      matches
    });
  } catch (err: any) {
    console.error('Error getting problem matches:', err);
    res.status(500).json({ success: false, message: 'Server error calculating researcher matches' });
  }
}
export async function getMyReports(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const reports = await ProblemReport.find({
      reportedBy: req.user._id
    })
      .populate('claimedByProjectId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports
    });
  } catch (err: any) {
    console.error('Error fetching my reports:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch your reports'
    });
  }
}
