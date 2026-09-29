import React, { useRef, useState } from 'react';
import { VideoInstruction, Task } from '../../types';
import { Play, CheckCircle2, Circle, X, Clock, ExternalLink, Scissors, MessageSquare, AlertCircle } from 'lucide-react';

interface Props {
  instruction: VideoInstruction;
  task: Task;
  onClose: () => void;
  onToggleInstructionComplete: (instructionId: string) => void;
  onJumpTimestamp?: (seconds: number) => void;
}

export const VideoInstructionPlayerModal: React.FC<Props> = ({
  instruction,
  task,
  onClose,
  onToggleInstructionComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(instruction.timestampSeconds || 0);
  const [editorComment, setEditorComment] = useState('');
  const [commentsList, setCommentsList] = useState<string[]>([
    'Editor review: Transition cut placed at 00:15 in intro timeline. Verifying beat match.',
  ]);

  const jumpToTimestamp = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(Math.floor(videoRef.current.currentTime));
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorComment.trim()) return;
    setCommentsList([...commentsList, editorComment.trim()]);
    setEditorComment('');
  };

  const isMp4OrWebm = instruction.url.endsWith('.mp4') || instruction.url.endsWith('.webm') || instruction.url.includes('googleapis.com');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d0d]/60 backdrop-blur-xs select-none">
      {/* 20px Modal Radius, #ffffff surface, 1px solid #e7e7e7 */}
      <div className="relative w-full max-w-4xl bg-[#ffffff] border border-[#e7e7e7] rounded-[20px] shadow-none overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e7e7] bg-[#ffffff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] bg-[#ffeaec] text-[#690031]">
              <Scissors className="w-5 h-5 text-[#ff584a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#690031] bg-[#ffeaec] px-2 py-0.5 rounded-[999px]">
                  Video editor direction
                </span>
                <span className="text-[#9ca6af]">·</span>
                <span className="text-[13px] text-[#646f79] truncate max-w-xs font-light">
                  {task.title}
                </span>
              </div>
              <h2 className="text-[17px] font-medium text-[#0d0d0d]">
                {instruction.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#646f79] hover:text-[#0d0d0d] hover:bg-[#f3f3f3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Highlighted text anchor reference (Coral Blush + Deep Coral) */}
          {instruction.highlightedTextRef && (
            <div className="p-3.5 bg-[#ffeaec] border-l-2 border-[#ff584a] rounded-r-[8px]">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#690031] mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#ff584a]" />
                <span>Hyperlinked text anchor from task description</span>
              </div>
              <p className="text-[14px] italic text-[#690031] font-light">
                "{instruction.highlightedTextRef}"
              </p>
            </div>
          )}

          {/* Product UI Screenshot Card Frame: #222875 Asana Violet */}
          <div className="p-3 rounded-[16px] bg-[#222875] border border-[#222875]">
            <div className="relative rounded-[10px] overflow-hidden bg-black aspect-video flex items-center justify-center">
              {isMp4OrWebm ? (
                <video
                  ref={videoRef}
                  src={instruction.url}
                  controls
                  className="w-full h-full object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0d0d0d]">
                  <Play className="w-12 h-12 text-[#ff584a] mb-3" />
                  <p className="text-white font-medium text-base mb-1">
                    External Video Reference
                  </p>
                  <p className="text-xs text-[#9ca6af] max-w-md mb-4 truncate font-mono">
                    {instruction.url}
                  </p>
                  <a
                    href={instruction.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ffffff] text-[#0d0d0d] rounded-[100px] text-[13px] font-medium transition-colors"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Timestamp Action Bar & Target Section */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[12px] bg-[#fbfbfb] border border-[#e7e7e7]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#cbefff] text-[#222875] rounded-[999px] text-[12px] font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Target: {instruction.targetSection}</span>
              </div>
              {instruction.timestampSeconds !== undefined && (
                <button
                  onClick={() => jumpToTimestamp(instruction.timestampSeconds || 0)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ffffff] hover:bg-[#f3f3f3] text-[#0d0d0d] rounded-[100px] text-[12px] font-medium border border-[#e7e7e7] transition-colors"
                >
                  <Play className="w-3 h-3 fill-current text-[#ff584a]" />
                  <span>Jump to {instruction.timestampFormatted || '00:15'}</span>
                </button>
              )}
            </div>

            {/* Fulfill Checkbox for Video Editor */}
            <button
              onClick={() => onToggleInstructionComplete(instruction.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[100px] text-[12px] font-medium transition-all ${
                instruction.isCompletedByEditor
                  ? 'bg-[#0d0d0d] text-white'
                  : 'bg-[#f3f3f3] text-[#0d0d0d] hover:bg-[#e7e7e7]'
              }`}
            >
              {instruction.isCompletedByEditor ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#ff584a]" />
                  <span>Instruction applied in cut</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-[#646f79]" />
                  <span>Mark as cut in intro</span>
                </>
              )}
            </button>
          </div>

          {/* Detailed Direction Notes for Editor */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-[#646f79]">
              Director cut instructions
            </h4>
            <div className="p-4 rounded-[12px] bg-[#fbfbfb] border border-[#e7e7e7] text-[14px] text-[#3d3d3d] leading-[1.5] font-light">
              {instruction.notes}
            </div>
          </div>

          {/* Collaborative Editor Feedback Thread */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#646f79]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Editor timeline feedback & sync notes</span>
            </div>
            <div className="space-y-2">
              {commentsList.map((cmt, idx) => (
                <div
                  key={idx}
                  className="p-3 text-[13px] rounded-[8px] bg-[#f3f3f3] text-[#3d3d3d] border border-[#e7e7e7] font-light"
                >
                  {cmt}
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={editorComment}
                onChange={(e) => setEditorComment(e.target.value)}
                placeholder="Leave feedback on video cut (e.g. 'Cut matched at 00:15, preview uploaded')..."
                className="flex-1 px-3.5 py-2 text-[13px] rounded-[8px] bg-[#ffffff] border border-[#e7e7e7] text-[#0d0d0d] focus:outline-hidden focus:border-[#0d0d0d]"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#0d0d0d] hover:bg-[#3d3d3d] text-[#ffffff] rounded-[100px] text-[13px] font-medium transition-colors"
              >
                Send note
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e7e7e7] bg-[#ffffff] flex items-center justify-between text-[12px] text-[#646f79]">
          <span className="font-light">Targeted for Premiere / DaVinci Resolve intro timeline</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#f3f3f3] hover:bg-[#e7e7e7] text-[#0d0d0d] rounded-[100px] font-medium transition-colors"
          >
            Close viewer
          </button>
        </div>
      </div>
    </div>
  );
};
