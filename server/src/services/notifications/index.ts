import { Notification, INotification } from '../../models/Notification.js';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export function setSocketIO(io: SocketIOServer) {
  ioInstance = io;
}

export async function createAndSendNotification(params: {
  recipientId: string | mongoose.Types.ObjectId;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'MATCH' | 'VERIFICATION';
  link?: string;
  metadata?: Record<string, any>;
}): Promise<INotification> {
  const notif = await Notification.create({
    recipientId: params.recipientId,
    title: params.title,
    message: params.message,
    type: params.type || 'INFO',
    link: params.link,
    metadata: params.metadata,
  });

  if (ioInstance) {
    ioInstance.to(`user_${params.recipientId.toString()}`).emit('notification', notif);
    // Also broadcast to public notification feed if general
    ioInstance.emit('global_activity', {
      title: params.title,
      message: params.message,
      createdAt: notif.createdAt
    });
  }

  return notif;
}
