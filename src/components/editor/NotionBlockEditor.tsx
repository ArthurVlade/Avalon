import React, { useState } from 'react';
import { EditorBlock, VideoInstruction } from '../../types';
import {
  Heading2,
  ListTodo,
  Code,
  Video,
  FileText,
  Plus,
  Trash2,
  GripVertical,
  Scissors,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialContent?: string;
  onHyperlinkVideoClick?: (selectedText: string) => void;
  onOpenVideoModal?: (instruction: VideoInstruction) => void;
}

export const NotionBlockEditor: React.FC<Props> = ({
  initialContent = '',
  onHyperlinkVideoClick,
  onOpenVideoModal,
}) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    {
      id: 'b1',
      type: 'paragraph',
      content: initialContent || 'Cut the initial 30 seconds of Episode 1. Follow the hyperlinked reference video for the exact kinetic typography and camera whip transitions. Ensure audio dip is timed to narration start.',
    },
    {
      id: 'b2',
      type: 'video_instruction',
      content: 'Intro Hook Reference Clip (00:15 whip zoom)',
      videoData: {
        id: 'vi_block_1',
        title: 'Include dynamic 3D camera pan in the intro',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        timestampSeconds: 15,
        timestampFormatted: '00:15',
        targetSection: 'Intro Hook (0:00 - 0:18)',
        notes: 'Follow the whip-pan camera move before revealing the episode title.',
        isCompletedByEditor: true,
      },
    },
    {
      id: 'b3',
      type: 'heading2',
      content: 'Video Editor Checklist & Specifications',
    },
    {
      id: 'b4',
      type: 'todo',
      content: 'Lock frame rate at 23.976 fps with ProRes 422 HQ proxy files',
      completed: true,
    },
    {
      id: 'b5',
      type: 'todo',
      content: 'Sync timecode markers between Camera A and audio boom track',
      completed: false,
    },
    {
      id: 'b6',
      type: 'callout',
      content: 'Stakeholder note: Elena and Marcus require sign-off on the first 15 seconds before color grading begins.',
    },
  ]);

  const [activeMenuBlockId, setActiveMenuBlockId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');

  const handleSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      setSelectedText(sel.toString().trim());
    } else {
      setSelectedText('');
    }
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const toggleTodo = (id: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b)));
  };

  const addBlock = (index: number, type: EditorBlock['type'] = 'paragraph') => {
    const newBlock: EditorBlock = {
      id: `block_${Date.now()}`,
      type,
      content: '',
      completed: false,
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setActiveMenuBlockId(null);
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const changeBlockType = (id: string, type: EditorBlock['type']) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, type } : b)));
    setActiveMenuBlockId(null);
  };

  return (
    <div className="relative font-sans text-[#0d0d0d]" onMouseUp={handleSelection}>
      {/* Floating text selection action bar in Asana style */}
      {selectedText && (
        <div className="sticky top-2 z-20 mx-auto my-2 flex items-center gap-2 p-1.5 bg-[#0d0d0d] text-white rounded-[100px] border border-[#3d3d3d] w-max text-[12px]">
          <span className="text-[#9ca6af] pl-2 italic max-w-xs truncate">"{selectedText}"</span>
          <div className="h-4 w-px bg-[#3d3d3d]" />
          <button
            onClick={() => onHyperlinkVideoClick?.(selectedText)}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#ff584a] hover:bg-[#e0483a] rounded-[100px] font-medium text-white transition-colors"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Hyperlink video to intro</span>
          </button>
        </div>
      )}

      {/* Blocks */}
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="group relative flex items-start gap-2 -ml-6 pl-6 py-0.5 rounded-[4px] hover:bg-[#fbfbfb] transition-colors"
          >
            {/* Block Hover Drag/Menu handle */}
            <div className="absolute left-0 top-1 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 text-[#9ca6af] transition-opacity">
              <button
                type="button"
                onClick={() =>
                  setActiveMenuBlockId(activeMenuBlockId === block.id ? null : block.id)
                }
                className="p-0.5 hover:bg-[#e7e7e7] rounded text-[#646f79]"
                title="Change block type"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="cursor-grab">
                <GripVertical className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Block Type Picker Menu */}
            {activeMenuBlockId === block.id && (
              <div className="absolute left-0 top-8 z-30 w-52 p-1.5 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] space-y-1 text-[12px] shadow-none">
                <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[#646f79]">
                  Turn into block
                </div>
                <button
                  onClick={() => changeBlockType(block.id, 'paragraph')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#f3f3f3] text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-[#646f79]" />
                  <span>Text Paragraph</span>
                </button>
                <button
                  onClick={() => changeBlockType(block.id, 'heading2')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#f3f3f3] text-left"
                >
                  <Heading2 className="w-3.5 h-3.5 text-[#646f79]" />
                  <span>Heading</span>
                </button>
                <button
                  onClick={() => changeBlockType(block.id, 'todo')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#f3f3f3] text-left"
                >
                  <ListTodo className="w-3.5 h-3.5 text-[#646f79]" />
                  <span>To-Do Item</span>
                </button>
                <button
                  onClick={() => changeBlockType(block.id, 'callout')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#f3f3f3] text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ff584a]" />
                  <span>Callout Note</span>
                </button>
                <button
                  onClick={() => changeBlockType(block.id, 'code')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#f3f3f3] text-left"
                >
                  <Code className="w-3.5 h-3.5 text-[#646f79]" />
                  <span>Code / Timecode</span>
                </button>
                <button
                  onClick={() => onHyperlinkVideoClick?.(block.content || 'Intro Hook')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#ffeaec] text-[#690031] text-left font-medium"
                >
                  <Video className="w-3.5 h-3.5 text-[#ff584a]" />
                  <span>Hyperlink Video Reference</span>
                </button>
                <div className="h-px bg-[#e7e7e7] my-1" />
                <button
                  onClick={() => removeBlock(block.id)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#ffeaec] text-[#690031] text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Block</span>
                </button>
              </div>
            )}

            {/* Block Body Rendering */}
            <div className="flex-1 min-w-0">
              {block.type === 'paragraph' && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                  className="outline-hidden text-[14px] leading-[1.5] text-[#3d3d3d] font-light py-0.5"
                >
                  {block.content}
                </div>
              )}

              {block.type === 'heading2' && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                  className="outline-hidden text-[17px] font-medium text-[#0d0d0d] pt-2 pb-1"
                >
                  {block.content}
                </div>
              )}

              {block.type === 'todo' && (
                <div className="flex items-center gap-2.5 py-0.5">
                  <button
                    type="button"
                    onClick={() => toggleTodo(block.id)}
                    className="text-[#9ca6af] hover:text-[#0d0d0d]"
                  >
                    {block.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#ff584a]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#9ca6af]" />
                    )}
                  </button>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                    className={`outline-hidden text-[14px] flex-1 font-light ${
                      block.completed
                        ? 'line-through text-[#9ca6af]'
                        : 'text-[#3d3d3d]'
                    }`}
                  >
                    {block.content}
                  </div>
                </div>
              )}

              {block.type === 'callout' && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-[8px] bg-[#ffeaec] border-l-2 border-[#ff584a] my-1">
                  <Sparkles className="w-4 h-4 text-[#ff584a] shrink-0 mt-0.5" />
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                    className="outline-hidden text-[13px] text-[#690031] leading-[1.4] font-normal flex-1"
                  >
                    {block.content}
                  </div>
                </div>
              )}

              {block.type === 'code' && (
                <pre className="p-3 rounded-[6px] bg-[#0d0d0d] text-[#cbefff] font-mono text-[12px] overflow-x-auto my-1 border border-[#0d0d0d]">
                  <code
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                    className="outline-hidden"
                  >
                    {block.content || '00:00:15:00 - WHIP_ZOOM_IN_HOOK'}
                  </code>
                </pre>
              )}

              {block.type === 'video_instruction' && block.videoData && (
                <div className="my-2.5 p-4 rounded-[12px] bg-[#222875] text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] bg-[#cbefff] text-[#222875] text-[11px] font-medium">
                        <Scissors className="w-3 h-3" />
                        <span>{block.videoData.targetSection}</span>
                      </span>
                      <span className="font-mono text-[11px] text-[#ffffff]/80">
                        @{block.videoData.timestampFormatted}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenVideoModal?.(block.videoData!)}
                      className="px-4 py-1.5 bg-[#ffffff] hover:bg-[#f3f3f3] text-[#0d0d0d] rounded-[100px] text-[12px] font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Open player</span>
                    </button>
                  </div>
                  <h4 className="text-[14px] font-medium text-white mb-1">
                    {block.videoData.title}
                  </h4>
                  <p className="text-[12px] text-[#cbefff]/90 leading-relaxed font-light">
                    {block.videoData.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Block footer */}
      <button
        type="button"
        onClick={() => addBlock(blocks.length - 1, 'paragraph')}
        className="mt-3 flex items-center gap-2 text-[12px] text-[#646f79] hover:text-[#0d0d0d] transition-colors py-1"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Click to add a block</span>
      </button>
    </div>
  );
};
