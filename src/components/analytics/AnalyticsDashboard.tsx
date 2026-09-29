import React from 'react';
import { Task, User, Project } from '../../types';
import {
  TrendingUp,
  CheckCircle2,
  Video,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  tasks: Task[];
  users: User[];
  projects: Project[];
}

export const AnalyticsDashboard: React.FC<Props> = ({ tasks, users, projects }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingApprovals = tasks.filter(
    (t) => t.requiresApproval && t.approvalStatus === 'pending'
  ).length;
  const videoInstructionsCount = tasks.reduce(
    (acc, t) => acc + t.videoInstructions.length,
    0
  );
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusCounts = {
    backlog: tasks.filter((t) => t.status === 'backlog').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    in_review: tasks.filter((t) => t.status === 'in_review').length,
    ready_for_approval: tasks.filter((t) => t.status === 'ready_for_approval').length,
    completed: completedTasks,
  };

  const sprintDays = [
    { day: 'Mon', completed: 2, total: 3 },
    { day: 'Tue', completed: 4, total: 5 },
    { day: 'Wed', completed: 3, total: 4 },
    { day: 'Thu', completed: 6, total: 7 },
    { day: 'Fri', completed: 5, total: 6 },
    { day: 'Sat', completed: 2, total: 2 },
    { day: 'Sun', completed: 1, total: 1 },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* KPI Stats Row: 1px solid #e7e7e7, zero box-shadow */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px]">
          <div className="flex items-center justify-between text-[12px] text-[#646f79] mb-2 font-normal">
            <span>Completion rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#ff584a]" />
          </div>
          <div className="text-[28px] font-medium font-mono tabular-nums text-[#0d0d0d] tracking-tight">
            {completionRate}%
          </div>
          <div className="text-[12px] text-[#646f79] font-light mt-1">
            {completedTasks} of {totalTasks} tasks closed
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px]">
          <div className="flex items-center justify-between text-[12px] text-[#646f79] mb-2 font-normal">
            <span>Pending approvals</span>
            <ShieldCheck className="w-4 h-4 text-[#ff584a]" />
          </div>
          <div className="text-[28px] font-medium font-mono tabular-nums text-[#0d0d0d] tracking-tight">
            {pendingApprovals}
          </div>
          <div className="text-[12px] text-[#646f79] font-light mt-1">
            Deliverables awaiting review
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px]">
          <div className="flex items-center justify-between text-[12px] text-[#646f79] mb-2 font-normal">
            <span>Video clips hyperlinked</span>
            <Video className="w-4 h-4 text-[#222875]" />
          </div>
          <div className="text-[28px] font-medium font-mono tabular-nums text-[#0d0d0d] tracking-tight">
            {videoInstructionsCount}
          </div>
          <div className="text-[12px] text-[#646f79] font-light mt-1">
            Editor intro instructions
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px]">
          <div className="flex items-center justify-between text-[12px] text-[#646f79] mb-2 font-normal">
            <span>Sprint velocity</span>
            <TrendingUp className="w-4 h-4 text-[#0d0d0d]" />
          </div>
          <div className="text-[28px] font-medium font-mono tabular-nums text-[#0d0d0d] tracking-tight">
            23.5 <span className="text-[14px] font-normal text-[#646f79]">pts</span>
          </div>
          <div className="text-[12px] text-[#646f79] font-light mt-1">
            +18% compared to last cycle
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Velocity Chart */}
        <div className="lg:col-span-2 p-6 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-medium text-[#0d0d0d]">
                Team delivery velocity & burndown
              </h3>
              <p className="text-[13px] text-[#646f79] font-light">
                Daily task completion vs scheduled capacity
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#222875] bg-[#cbefff] px-3 py-1 rounded-[999px]">
              Current Sprint
            </span>
          </div>

          {/* SVG Bar Chart with Asana Violet & Coral Accent */}
          <div className="h-56 w-full flex flex-col justify-end pt-4">
            <div className="flex items-end justify-between h-44 gap-3 px-2 border-b border-[#e7e7e7]">
              {sprintDays.map((sd) => {
                const heightPercent = (sd.completed / 7) * 100;
                return (
                  <div key={sd.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="opacity-0 group-hover:opacity-100 text-[11px] font-mono text-[#646f79] transition-opacity">
                      {sd.completed}
                    </span>
                    <div className="w-full max-w-[36px] bg-[#f3f3f3] rounded-t-[4px] overflow-hidden h-full flex flex-col justify-end">
                      <div
                        className="w-full bg-[#0d0d0d] group-hover:bg-[#ff584a] rounded-t-[4px] transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-light text-[#646f79] mt-1">
                      {sd.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="p-6 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] space-y-4">
          <div>
            <h3 className="text-[16px] font-medium text-[#0d0d0d]">
              Status distribution
            </h3>
            <p className="text-[13px] text-[#646f79] font-light">
              Active pipeline stages across projects
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Completed */}
            <div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="text-[#0d0d0d] font-normal">Completed</span>
                <span className="font-mono tabular-nums text-[#646f79] text-[12px]">
                  {statusCounts.completed} ({totalTasks > 0 ? Math.round((statusCounts.completed / totalTasks) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2 rounded-[999px] bg-[#f3f3f3] overflow-hidden">
                <div
                  className="h-full bg-[#ff584a] rounded-[999px]"
                  style={{ width: `${totalTasks > 0 ? (statusCounts.completed / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* In Progress */}
            <div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="text-[#0d0d0d] font-normal">In progress</span>
                <span className="font-mono tabular-nums text-[#646f79] text-[12px]">
                  {statusCounts.in_progress}
                </span>
              </div>
              <div className="h-2 rounded-[999px] bg-[#f3f3f3] overflow-hidden">
                <div
                  className="h-full bg-[#0d0d0d] rounded-[999px]"
                  style={{ width: `${totalTasks > 0 ? (statusCounts.in_progress / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Ready for Approval */}
            <div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="text-[#690031] font-medium">Pending sign-off</span>
                <span className="font-mono tabular-nums text-[#646f79] text-[12px]">
                  {statusCounts.ready_for_approval}
                </span>
              </div>
              <div className="h-2 rounded-[999px] bg-[#f3f3f3] overflow-hidden">
                <div
                  className="h-full bg-[#ffeaec] border border-[#ff584a] rounded-[999px]"
                  style={{ width: `${totalTasks > 0 ? (statusCounts.ready_for_approval / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* In Review */}
            <div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="text-[#222875] font-normal">In review</span>
                <span className="font-mono tabular-nums text-[#646f79] text-[12px]">
                  {statusCounts.in_review}
                </span>
              </div>
              <div className="h-2 rounded-[999px] bg-[#f3f3f3] overflow-hidden">
                <div
                  className="h-full bg-[#222875] rounded-[999px]"
                  style={{ width: `${totalTasks > 0 ? (statusCounts.in_review / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Backlog */}
            <div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="text-[#646f79] font-normal">Backlog</span>
                <span className="font-mono tabular-nums text-[#646f79] text-[12px]">
                  {statusCounts.backlog}
                </span>
              </div>
              <div className="h-2 rounded-[999px] bg-[#f3f3f3] overflow-hidden">
                <div
                  className="h-full bg-[#e7e7e7] rounded-[999px]"
                  style={{ width: `${totalTasks > 0 ? (statusCounts.backlog / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Workload Grid */}
      <div className="p-6 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] space-y-4">
        <div>
          <h3 className="text-[16px] font-medium text-[#0d0d0d]">
            Team workload & allocation
          </h3>
          <p className="text-[13px] text-[#646f79] font-light">
            Active assignments and deliverable volume per team member
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map((user) => {
            const userTasks = tasks.filter((t) => t.assigneeId === user.id);
            const userCompleted = userTasks.filter((t) => t.status === 'completed').length;

            return (
              <div
                key={user.id}
                className="p-4 rounded-[10px] bg-[#fbfbfb] border border-[#e7e7e7] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium text-white shadow-none"
                    style={{ backgroundColor: user.color || '#222875' }}
                  >
                    {user.initials}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-[#0d0d0d]">
                      {user.name}
                    </h4>
                    <p className="text-[12px] text-[#646f79] font-light">{user.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[13px] font-mono tabular-nums text-[#0d0d0d]">
                    {userTasks.length} tasks
                  </div>
                  <div className="text-[11px] text-[#646f79] font-light">
                    {userCompleted} completed
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
