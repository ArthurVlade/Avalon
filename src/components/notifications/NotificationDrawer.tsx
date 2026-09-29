import React, { useState } from 'react';
import { NotificationItem, User } from '../../types';
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  AtSign,
  X,
  CheckCheck,
} from 'lucide-react';

interface Props {
  notifications: NotificationItem[];
  users: User[];
  currentUserId: string;
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectNotificationTask: (taskId: string) => void;
}

export const NotificationDrawer: React.FC<Props> = ({
  notifications,
  users,
  currentUserId,
  onClose,
  onMarkAllRead,
  onSelectNotificationTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-[#ff584a] shrink-0" />;
      case 'approval_required':
      case 'approved':
        return <ShieldCheck className="w-4 h-4 text-[#690031] shrink-0" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-[#222875] shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-[#646f79] shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#ffffff] border-l border-[#e7e7e7] flex flex-col shadow-none select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e7e7] bg-[#ffffff]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-[8px] bg-[#ffeaec] text-[#690031]">
            <Bell className="w-4 h-4 text-[#ff584a]" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-[#0d0d0d]">
              Stakeholder notifications
            </h3>
            <p className="text-[12px] text-[#646f79] font-light">
              Alerts on completed deliverables & sign-offs
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-[#646f79] hover:text-[#0d0d0d] hover:bg-[#f3f3f3]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Subheader controls */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#e7e7e7] bg-[#fbfbfb] text-[12px]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`font-medium transition-colors ${
              filter === 'all'
                ? 'text-[#0d0d0d] underline underline-offset-4'
                : 'text-[#646f79] hover:text-[#0d0d0d]'
            }`}
          >
            All ({notifications.length})
          </button>
          <span className="text-[#9ca6af]">·</span>
          <button
            onClick={() => setFilter('unread')}
            className={`font-medium transition-colors ${
              filter === 'unread'
                ? 'text-[#0d0d0d] underline underline-offset-4'
                : 'text-[#646f79] hover:text-[#0d0d0d]'
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1 text-[11px] font-normal text-[#646f79] hover:text-[#0d0d0d]"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f3f3f3] p-3 space-y-1">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-[#646f79] font-light">
            No notifications in this queue. Stakeholders are automatically alerted when tasks are completed or submitted for approval.
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const sender = users.find((u) => u.id === notif.senderId);

            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.taskId) {
                    onSelectNotificationTask(notif.taskId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-[10px] transition-all cursor-pointer flex items-start gap-3 ${
                  !notif.read
                    ? 'bg-[#ffeaec]/50 hover:bg-[#ffeaec]/80 border border-[#ff584a]/20'
                    : 'hover:bg-[#fbfbfb]'
                }`}
              >
                <div className="mt-0.5">{getIcon(notif.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="font-medium text-[#0d0d0d] truncate pr-2">
                      {notif.title}
                    </span>
                    <span className="text-[11px] text-[#646f79] shrink-0 font-mono">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[13px] text-[#3d3d3d] font-light leading-[1.4]">
                    {notif.message}
                  </p>

                  {sender && (
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#646f79]">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-white text-[8px]"
                        style={{ backgroundColor: sender.color || '#222875' }}
                      >
                        {sender.initials}
                      </div>
                      <span className="font-light">{sender.name} ({sender.title})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#e7e7e7] bg-[#fbfbfb] text-center">
        <span className="text-[12px] text-[#646f79] font-light">
          Stakeholders receive automated notifications upon task completion & approval requests
        </span>
      </div>
    </div>
  );
};
