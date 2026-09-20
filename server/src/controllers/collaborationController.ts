import { Response } from 'express';
import { ActivityLog } from '../models/ActivityLog.js';
import { Project } from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../utils/activity.js';

export async function getProjectActivity(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const activities = await ActivityLog.find({
      $or: [
        { entityId: id },
        { 'metadata.projectId': id }
      ]
    }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({ success: true, activities });
  } catch (err: any) {
    console.error('Error fetching project activity:', err);
    res.status(500).json({ success: false, message: 'Server error fetching activity' });
  }
}

export async function addProjectComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      res.status(400).json({ success: false, message: 'Comment text is required' });
      return;
    }

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const activity = await ActivityLog.create({
      userId: req.user?._id,
      userName: req.user?.name || 'Anonymous Contributor',
      userRole: req.user?.role || 'COLLABORATOR',
      action: 'PROJECT_COMMENT',
      details: comment.trim(),
      entityType: 'PROJECT',
      entityId: project._id,
      metadata: { projectId: project._id.toString() }
    });

    res.status(201).json({ success: true, message: 'Comment posted', comment: activity });
  } catch (err: any) {
    console.error('Error adding comment:', err);
    res.status(500).json({ success: false, message: 'Server error posting comment' });
  }
}
