import React, { useState } from 'react';
import { VideoInstruction } from '../../types';
import { X, Video, Scissors, Clock, Sparkles } from 'lucide-react';

interface Props {
  initialHighlightedText?: string;
  onAdd: (instruction: Omit<VideoInstruction, 'id' | 'isCompletedByEditor'>) => void;
  onClose: () => void;
}

export const AddVideoInstructionModal: React.FC<Props> = ({
  initialHighlightedText = '',
  onAdd,
  onClose,
}) => {
  const [title, setTitle] = useState(
    initialHighlightedText
      ? `Instruction: "${initialHighlightedText.slice(0, 30)}..."`
      : 'Intro Sequence Reference Clip'
  );
  const [url, setUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [targetSection, setTargetSection] = useState('Intro (0:00 - 0:15)');
  const [timestampFormatted, setTimestampFormatted] = useState('00:15');
  const [notes, setNotes] = useState(
    'Instruct the video editor to include this reference shot in the intro with dynamic whip-pan transition and sound effect riser.'
  );
  const [highlightedTextRef] = useState(initialHighlightedText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const parts = timestampFormatted.split(':');
    let seconds = 0;
    if (parts.length === 2) {
      seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    } else if (parts.length === 1) {
      seconds = parseInt(parts[0], 10);
    }

    onAdd({
      title: title.trim(),
      url: url.trim(),
      targetSection: targetSection.trim(),
      timestampFormatted: timestampFormatted.trim(),
      timestampSeconds: isNaN(seconds) ? 0 : seconds,
      notes: notes.trim(),
      highlightedTextRef: highlightedTextRef.trim() || undefined,
    });
    onClose();
  };

  const samplePresets = [
    {
      name: 'Intro Hook Zoom (00:15)',
      target: 'Intro (0:00 - 0:15)',
      time: '00:15',
      note: 'Instruct video editor: Include the fast 3D zoom-in hook before the title card.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      name: 'Kinetic B-Roll Overlay (00:45)',
      target: 'Body Section (0:30 - 1:15)',
      time: '00:45',
      note: 'Instruct video editor: Layer b-roll footage over narration with 10% film grain.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d0d]/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl bg-[#ffffff] border border-[#e7e7e7] rounded-[20px] shadow-none overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e7e7]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#ffeaec] text-[#690031]">
              <Video className="w-5 h-5 text-[#ff584a]" />
            </div>
            <div>
              <h3 className="text-[16px] font-medium text-[#0d0d0d]">
                Hyperlink video instruction
              </h3>
              <p className="text-[12px] text-[#646f79] font-light">
                Instruct the video editor with timestamped clips and visual references
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

        {/* Quick Presets: Pill Chips */}
        <div className="px-6 pt-4 pb-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#646f79] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#ff584a]" />
            <span>Preset video references</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTitle(preset.name);
                  setTargetSection(preset.target);
                  setTimestampFormatted(preset.time);
                  setNotes(preset.note);
                  setUrl(preset.url);
                }}
                className="px-3 py-1 text-[12px] rounded-[999px] bg-[#f3f3f3] hover:bg-[#ffeaec] hover:text-[#690031] text-[#0d0d0d] font-normal transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[13px]">
          {highlightedTextRef && (
            <div>
              <label className="block font-medium text-[#0d0d0d] mb-1">
                Highlighted text anchor
              </label>
              <div className="p-2.5 rounded-[6px] bg-[#ffeaec] border-l-2 border-[#ff584a] text-[12px] italic text-[#690031]">
                "{highlightedTextRef}"
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-[#0d0d0d] mb-1">
              Instruction title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Include this 3D camera pan in the intro"
              className="w-full px-3.5 py-2 rounded-[4px] bg-[#ffffff] border border-[#e7e7e7] text-[#0d0d0d] focus:outline-hidden focus:border-[#0d0d0d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#0d0d0d] mb-1">
                Target section in cut
              </label>
              <div className="relative">
                <Scissors className="w-4 h-4 absolute left-3 top-2.5 text-[#9ca6af]" />
                <input
                  type="text"
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value)}
                  placeholder="e.g. Intro (0:00 - 0:15)"
                  className="w-full pl-9 pr-3 py-2 rounded-[4px] bg-[#ffffff] border border-[#e7e7e7] text-[#0d0d0d] focus:outline-hidden focus:border-[#0d0d0d]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#0d0d0d] mb-1">
                Key timestamp
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2.5 text-[#9ca6af]" />
                <input
                  type="text"
                  value={timestampFormatted}
                  onChange={(e) => setTimestampFormatted(e.target.value)}
                  placeholder="e.g. 00:15"
                  className="w-full pl-9 pr-3 py-2 rounded-[4px] bg-[#ffffff] border border-[#e7e7e7] text-[#0d0d0d] focus:outline-hidden focus:border-[#0d0d0d]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#0d0d0d] mb-1">
              Video reference URL * (YouTube, Loom, MP4, Vimeo)
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-[4px] bg-[#ffffff] border border-[#e7e7e7] text-[#0d0d0d] focus:outline-hidden focus:border-[#0d0d0d]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#0d0d0d] mb-1">
              Instructions for the video editor
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain how the editor should apply this clip in the intro or timeline..."
              className="w-full px-3.5 py-2 rounded-[4px] bg-[#ffffff] border border-[#e7e7e7] text-[#0d0d0d] focus:outline-hidden focus:border-[#0d0d0d]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] text-[#646f79] hover:text-[#0d0d0d]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-[13px] font-medium text-white bg-[#0d0d0d] hover:bg-[#3d3d3d] rounded-[100px] transition-colors"
            >
              Attach instruction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
