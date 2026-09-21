import { Response } from 'express';
import mongoose from 'mongoose';
import { Project, IProject } from '../models/Project.js';
import { ProjectMilestone } from '../models/ProjectMilestone.js';
import { ProblemReport } from '../models/ProblemReport.js';
import { User } from '../models/User.js';
import { Reward } from '../models/Reward.js';
import { AuthRequest } from '../middleware/auth.js';
import { createAndSendNotification } from '../services/notifications/index.js';
import { logActivity } from '../utils/activity.js';
import { createKnowledgeFromProject } from '../services/knowledge/index.js';
import { appendProblemStatus } from '../utils/problemStatus.js';

export async function createProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, description, problemReportId, institution, department } = req.body;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const report = await ProblemReport.findById(problemReportId);
    if (!report) {
      res.status(404).json({ success: false, message: 'Problem report not found' });
      return;
    }

    const project = await Project.create({
      title,
      description,
      problemReportId,
      clusterId: report.clusterId,
      leadStudentId: req.user._id,
      teamMembers: [req.user._id],
      institution: institution || req.user.institution || 'BIT Mesra',
      department: department || req.user.department || 'Civil Engineering',
      status: 'IN_PROGRESS',
    });

    appendProblemStatus(
      report,
      'IN_PROGRESS',
      `A project, "${project.title}", has been assigned and work is starting.`,
      req.user._id,
    );
    report.claimedByProjectId = project._id as any;
    await report.save();

    if (report.reportedBy) {
      await createAndSendNotification({
        recipientId: report.reportedBy,
        title: 'Project Work Started',
        message: `A project team has started work on your report "${report.title}".`,
        type: 'SUCCESS',
        link: `/my-reports?reportId=${report._id}`,
        metadata: { reportId: report._id.toString(), status: 'IN_PROGRESS' },
      });
    }

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'PROJECT_CREATED',
      details: `Created project "${project.title}" for problem "${report.title}"`,
      entityType: 'PROJECT',
      entityId: project._id,
    });

    res.status(201).json({ success: true, project });
  } catch (err: any) {
    console.error('Error creating project:', err);
    res.status(500).json({ success: false, message: 'Server error creating project' });
  }
}

export async function getProjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, institution, department, myProjects } = req.query;
    const query: any = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (institution && institution !== 'All') {
      query.institution = institution;
    }
    if (department && department !== 'All') {
      query.department = department;
    }
    if (myProjects === 'true' && req.user) {
      query.$or = [{ leadStudentId: req.user._id }, { teamMembers: req.user._id }];
    }

    const projects = await Project.find(query)
      .populate('leadStudentId', 'name email institution department avatarUrl')
      .populate('problemReportId')
      .populate('milestones')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err: any) {
    console.error('Error getting projects:', err);
    res.status(500).json({ success: false, message: 'Server error fetching projects' });
  }
}

export async function getProjectById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate('leadStudentId', 'name email institution department avatarUrl')
      .populate('teamMembers', 'name email institution department avatarUrl')
      .populate('problemReportId')
      .populate('milestones')
      .populate('mentorProfessorId', 'name email institution department');

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(200).json({ success: true, project });
  } catch (err: any) {
    console.error('Error getting project by id:', err);
    res.status(500).json({ success: false, message: 'Server error fetching project' });
  }
}

export async function addProjectMilestone(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, description, phaseNumber, evidenceNotes } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Process uploaded evidence files
    const files = req.files as Express.Multer.File[] | undefined;
    const evidenceFiles: string[] = [];
    if (files && Array.isArray(files)) {
      for (const file of files) {
        evidenceFiles.push(`/uploads/${file.filename}`);
      }
    }

    const milestone = await ProjectMilestone.create({
      projectId: project._id,
      title: title || 'Milestone Assessment',
      description: description || 'Field survey and engineering design validation.',
      phaseNumber: phaseNumber ? parseInt(phaseNumber, 10) : (project.milestones.length + 1),
      evidenceFiles,
      evidenceNotes,
      status: 'SUBMITTED',
      submittedAt: new Date()
    });

    project.milestones.push(milestone._id as any);
    project.status = 'IN_PROGRESS';
    await project.save();

    const report = await ProblemReport.findById(project.problemReportId);
    if (report && report.status !== 'IN_PROGRESS') {
      appendProblemStatus(
        report,
        'IN_PROGRESS',
        `Project work is in progress: milestone "${milestone.title}" was submitted.`,
        req.user?._id,
      );
      await report.save();
      if (report.reportedBy) {
        await createAndSendNotification({
          recipientId: report.reportedBy,
          title: 'Project Work In Progress',
          message: `Work has progressed on your report "${report.title}".`,
          type: 'INFO',
          link: `/my-reports?reportId=${report._id}`,
          metadata: { reportId: report._id.toString(), status: 'IN_PROGRESS' },
        });
      }
    }

    await logActivity({
      userId: req.user?._id,
      userName: req.user?.name || 'Student',
      userRole: 'STUDENT',
      action: 'MILESTONE_SUBMITTED',
      details: `Submitted milestone "${milestone.title}" for project "${project.title}"`,
      entityType: 'MILESTONE',
      entityId: milestone._id,
    });

    // Notify Evaluators that milestone requires verification
    const evaluators = await User.find({ role: 'EVALUATOR' });
    for (const evaluator of evaluators) {
      await createAndSendNotification({
        recipientId: evaluator._id,
        title: 'Project Milestone Submitted',
        message: `Project "${project.title}" submitted milestone: "${milestone.title}". Verification needed.`,
        type: 'VERIFICATION',
        link: `/evaluator?projectId=${project._id}`
      });
    }

    res.status(201).json({ success: true, message: 'Milestone created and submitted for evaluation', milestone, project });
  } catch (err: any) {
    console.error('Error adding milestone:', err);
    res.status(500).json({ success: false, message: 'Server error adding milestone' });
  }
}

export async function updateMilestone(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { milestoneId } = req.params;
    const { status, reviewerNotes } = req.body; // status: 'APPROVED' | 'REJECTED'

    const milestone = await ProjectMilestone.findById(milestoneId);
    if (!milestone) {
      res.status(404).json({ success: false, message: 'Milestone not found' });
      return;
    }

    milestone.status = status;
    milestone.reviewerNotes = reviewerNotes;
    milestone.reviewedBy = req.user?._id;
    milestone.verifiedAt = new Date();
    await milestone.save();

    const project = await Project.findById(milestone.projectId);
    if (project && status === 'APPROVED') {
      // Award impact points to student
      await User.findByIdAndUpdate(project.leadStudentId, { $inc: { impactPoints: 30 } });
      await Reward.create({
        userId: project.leadStudentId,
        points: 30,
        reason: `Milestone verified: ${milestone.title}`,
        sourceType: 'MILESTONE_COMPLETED',
        relatedId: milestone._id,
      });

      await createAndSendNotification({
        recipientId: project.leadStudentId,
        title: 'Milestone Verified!',
        message: `Your milestone "${milestone.title}" has been approved! +30 Impact Points awarded.`,
        type: 'SUCCESS',
        link: `/projects/${project._id}`
      });
    }

    res.status(200).json({ success: true, milestone });
  } catch (err: any) {
    console.error('Error updating milestone:', err);
    res.status(500).json({ success: false, message: 'Server error updating milestone' });
  }
}

export async function submitProjectSolution(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { solutionSummary, repositoryUrl, demoUrl } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    project.status = 'UNDER_REVIEW';
    project.solutionSummary = solutionSummary;
    project.repositoryUrl = repositoryUrl;
    project.demoUrl = demoUrl;
    await project.save();

    const report = await ProblemReport.findById(project.problemReportId);
    if (report) {
      appendProblemStatus(
        report,
        'SUBMITTED',
        `The solution for project "${project.title}" was submitted.`,
        req.user?._id,
      );
      appendProblemStatus(
        report,
        'UNDER_REVIEW',
        `The proposed solution for project "${project.title}" was submitted for final authority review.`,
        req.user?._id,
      );
      await report.save();
      if (report.reportedBy) {
        await createAndSendNotification({
          recipientId: report.reportedBy,
          title: 'Solution Submitted for Verification',
          message: `A solution for your report "${report.title}" has been submitted for government verification.`,
          type: 'INFO',
          link: `/my-reports?reportId=${report._id}`,
          metadata: { reportId: report._id.toString(), status: 'UNDER_REVIEW' },
        });
      }
    }

    await logActivity({
      userId: req.user?._id,
      userName: req.user?.name || 'Student',
      userRole: 'STUDENT',
      action: 'PROJECT_SUBMITTED',
      details: `Project "${project.title}" submitted for final authority verification`,
      entityType: 'PROJECT',
      entityId: project._id,
    });

    res.status(200).json({ success: true, message: 'Project submitted for final evaluation', project });
  } catch (err: any) {
    console.error('Error submitting project:', err);
    res.status(500).json({ success: false, message: 'Server error submitting project' });
  }
}

export async function verifyProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { remarks, impactScore = 95 } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const resolutionNote = remarks || 'Impact verified on-site. Problem effectively resolved.';
    project.status = 'VERIFIED';
    project.impactScore = impactScore;
    project.impactPointsAwarded = 100;
    project.verifiedBy = req.user?._id;
    project.verifiedAt = new Date();
    project.evaluatorRemarks = resolutionNote;
    await project.save();

    // Convert verified project + solution into searchable historical knowledge.
    await createKnowledgeFromProject(project._id, req.user?._id);

    // Mark the citizen's report as resolved and retain the full tracking audit.
    const report = await ProblemReport.findById(project.problemReportId);
    if (report) {
      appendProblemStatus(
        report,
        'RESOLVED',
        resolutionNote,
        req.user?._id,
      );
      await report.save();

      if (report.reportedBy) {
        await createAndSendNotification({
          recipientId: report.reportedBy,
          title: 'Your Report Has Been Resolved!',
          message: `The solution for your report "${report.title}" has been verified and the issue is marked resolved.`,
          type: 'SUCCESS',
          link: `/my-reports?reportId=${report._id}`,
          metadata: { reportId: report._id.toString(), status: 'RESOLVED' },
        });
      }
    }

    // Award 100 impact points to lead student and team members
    await User.findByIdAndUpdate(project.leadStudentId, { 
      $inc: { impactPoints: 100 },
      $addToSet: { badges: 'Jharkhand Impact Champion' }
    });

    await Reward.create({
      userId: project.leadStudentId,
      points: 100,
      reason: `Project verified: ${project.title}`,
      sourceType: 'SOLUTION_VERIFIED',
      relatedId: project._id,
    });

    await createAndSendNotification({
      recipientId: project.leadStudentId,
      title: 'Project VERIFIED! 🎉',
      message: `Congratulations! Your solution for "${project.title}" has been verified. 100 Impact Points awarded!`,
      type: 'SUCCESS',
      link: `/projects/${project._id}`
    });

    await logActivity({
      userId: req.user?._id,
      userName: req.user?.name || 'Evaluator',
      userRole: 'EVALUATOR',
      action: 'PROJECT_VERIFIED',
      details: `Project "${project.title}" marked as VERIFIED: ${project.evaluatorRemarks}`,
      entityType: 'VERIFICATION',
      entityId: project._id,
    });

    res.status(200).json({ success: true, message: 'Project successfully verified and impact points awarded!', project });
  } catch (err: any) {
    console.error('Error verifying project:', err);
    res.status(500).json({ success: false, message: 'Server error verifying project' });
  }
}
