import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { MetamorphosisStageId, Language, UserStats } from '../../types/typing';
import { METAMORPHOSIS_STAGES, getStageForLevel, getLevelFromXp } from '../../utils/metamorphosis';
import { ButterflyAvatar } from '../ButterflyAvatar';
import { sound } from '../../utils/sound';
import { Play, RotateCcw, Sparkles, Crown, Feather, Zap, ArrowLeft, ArrowRight, Eye } from 'lucide-react';

interface MetamorphosisShowcaseProps {
  userStats: UserStats;
  language: Language;
  onStartQuickPractice: () => void;
  onExploreCurriculum: () => void;
}

export const MetamorphosisShowcase: React.FC<MetamorphosisShowcaseProps> = ({
  userStats,
  language,
  onStartQuickPractice,
  onExploreCurriculum,
}) => {
  const isRTL = language === 'fa';
  const userCurrentStage = getStageForLevel(userStats.level);
  const [selectedStageId, setSelectedStageId] = useState<MetamorphosisStageId>(userCurrentStage.id);
  const [isAutoMorphing, setIsAutoMorphing] = useState(false);
  const [isFlapping, setIsFlapping] = useState(false);

  // Sync selected stage when user's actual level changes
  useEffect(() => {
    setSelectedStageId(userCurrentStage.id);
  }, [userCurrentStage.id]);

  const stagesOrder: MetamorphosisStageId[] = [
    'egg',
    'silkworm',
    'cocoon',
    'emerging',
    'butterfly',
    'radiant-butterfly',
  ];

  const currentDisplayStage = METAMORPHOSIS_STAGES[selectedStageId];
  const levelInfo = getLevelFromXp(userStats.xp);

  // Auto-Timelapse Morph through all 6 stages
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isAutoMorphing) {
      const currentIndex = stagesOrder.indexOf(selectedStageId);
      const nextIndex = (currentIndex + 1) % stagesOrder.length;
      timeout = setTimeout(() => {
        setSelectedStageId(stagesOrder[nextIndex]);
        sound.playFlap();
        if (nextIndex === stagesOrder.length - 1) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#F59E0B', '#FBBF24', '#A855F7'],
            });
          } catch {
            // ignore
          }
        }
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isAutoMorphing, selectedStageId]);

  const handleFlutter = () => {
    setIsFlapping(true);
    sound.playFlap();
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#FDE68A', '#F59E0B', '#A855F7'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setIsFlapping(false), 1200);
  };

  const handleToggleTimelapse = () => {
    setIsAutoMorphing((prev) => !prev);
  };

  return (
    <div
      className="pilla-home-morph-card relative w-full rounded-3xl royal-card border border-amber-500/35 backdrop-blur-2xl shadow-2xl overflow-hidden p-6 sm:p-10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Animated Stardust Spots */}
      <motion.div
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${currentDisplayStage.accentColor} 0%, rgba(245, 158, 11, 0.15) 70%, transparent 100%)`,
        }}
      />
      <motion.div
        animate={{ opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7E22CE 0%, rgba(34, 211, 238, 0.15) 70%, transparent 100%)',
        }}
      />

      {/* Main Morph Arena Split */}
      <div className="pilla-home-morph-layout relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left/Center Visual Stage: Glowing Morphing Butterfly */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="pilla-home-butterfly-frame relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1E0938]/90 to-[#0C0318]/95 border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex flex-col items-center">
            {/* Crown Tag if viewing current unlocked stage */}
            {selectedStageId === userCurrentStage.id ? (
              <div className="pilla-home-current-stage absolute -top-3.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 border border-amber-300 text-slate-950 text-[10px] font-extrabold flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                <Crown className="w-3.5 h-3.5 text-slate-950" />
                <span>{isRTL ? 'مقام کنونی شما' : 'Your Current Stage'}</span>
              </div>
            ) : (
              <div className="pilla-home-preview-stage absolute -top-3.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-800 text-purple-300 text-[10px] font-medium flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRTL ? 'پیش‌نمایش دگردیسی' : 'Previewing Stage'}</span>
              </div>
            )}

            {/* Framer Motion Keyframe Glowing Butterfly */}
            <ButterflyAvatar
              stageId={selectedStageId}
              size="xl"
              isFlapping={isFlapping}
              interactive={true}
              onFlutter={handleFlutter}
            />

            {/* Quick Micro-Interaction Buttons */}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleFlutter}
                className="pilla-home-flutter-button flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRTL ? 'بال‌زدن شهپر' : 'Flutter Wings'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleTimelapse}
                className={`pilla-home-cycle-button flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
                  isAutoMorphing
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-800/40 text-slate-300'
                }`}
              >
                {isAutoMorphing ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoMorphing ? (isRTL ? 'توقف گردش' : 'Pause Cycle') : (isRTL ? 'گردش خودکار' : 'Auto Timelapse')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right/Text & Controller Section */}
        <div className="pilla-home-stage-copy flex-1 flex flex-col gap-4 text-center sm:text-start">
          {/* Stage Metadata Tag */}
          <div className="pilla-home-stage-meta flex items-center justify-center sm:justify-start gap-2.5">
            <span className="pilla-home-level-chip px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              Level {currentDisplayStage.minLevel}+
            </span>
            <span className="text-xs text-purple-300 font-medium">
              {isRTL ? currentDisplayStage.titleFa : currentDisplayStage.titleEn}
            </span>
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStageId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="pilla-home-stage-title text-2xl sm:text-4xl font-extrabold gold-text-gradient tracking-tight">
                {isRTL ? currentDisplayStage.nameFa : currentDisplayStage.nameEn}
              </h2>
              <p className="pilla-home-stage-description text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
                {isRTL ? currentDisplayStage.descriptionFa : currentDisplayStage.descriptionEn}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Real-time Level XP Bar of Typist */}
          <div className="pilla-home-xp-card mt-2 flex flex-col gap-1.5 p-4 rounded-2xl bg-[#140626]/80 border border-amber-500/25">
            <div className="flex justify-between text-[11px] text-amber-300/80 font-mono">
              <span className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isRTL ? 'سطح شما:' : 'Current Typist Rank:'} Level {levelInfo.level}
                </span>
              </span>
              <span className="font-bold text-amber-300">
                {levelInfo.currentLevelXp} / {levelInfo.nextLevelXpRequired} XP ({levelInfo.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-purple-950/80 overflow-hidden border border-purple-900/60">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_10px_#F59E0B]"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
            <button
              type="button"
              onClick={onStartQuickPractice}
              className="pilla-home-primary-action flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 hover:from-amber-400 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.45)] transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <Play className="w-4 h-4 fill-current text-slate-950" />
              <span>{isRTL ? 'آغاز تمرین روزانه' : 'Start Daily Practice'}</span>
            </button>

            <button
              type="button"
              onClick={onExploreCurriculum}
              className="pilla-home-secondary-action flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1B0B33]/80 hover:bg-[#28104D] border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all hover:border-amber-400/60"
            >
              <Feather className="w-4 h-4 text-amber-400" />
              <span>{isRTL ? 'مراتب آموزش ده‌انگشتی' : 'Explore Curriculum'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Metamorphosis Evolution Timeline Bar / زنجیره مراحل دگردیسی */}
      <div className="pilla-home-evolution mt-8 pt-6 border-t border-amber-500/25 flex flex-col gap-3">
        <div className="pilla-home-evolution-heading flex items-center justify-between text-xs font-semibold text-amber-300/80">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRTL ? 'زنجیره مراتب دگردیسی (برای پیش‌نمایش کلیک کنید):' : 'Metamorphosis Stages Timeline (Click to preview):'}</span>
          </span>
          <span className="text-[11px] text-purple-300 font-normal hidden sm:inline">
            {isRTL ? 'از سرآغاز تا اوج کمال' : 'Genesis to Sovereign Radiant'}
          </span>
        </div>

        {/* 6 Stage Interactive Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {stagesOrder.map((sId, idx) => {
            const st = METAMORPHOSIS_STAGES[sId];
            const isSelected = selectedStageId === sId;
            const isUnlocked = userStats.level >= st.minLevel;

            return (
              <button
                type="button"
                key={sId}
                onClick={() => {
                  setSelectedStageId(sId);
                  setIsAutoMorphing(false);
                  sound.playFlap();
                }}
                aria-pressed={isSelected}
                className={`pilla-home-stage-choice ${isSelected ? 'is-selected' : isUnlocked ? 'is-unlocked' : 'is-locked'} p-2.5 rounded-2xl border text-start flex flex-col gap-1 transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/25 to-purple-900/40 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
                    : isUnlocked
                    ? 'bg-[#15072B]/80 border-purple-900/50 hover:border-amber-500/40 text-slate-300'
                    : 'bg-[#100422]/60 border-purple-950/70 opacity-60 hover:opacity-80'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-400" />
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    Lvl {st.minLevel}+
                  </span>
                  {sId === userCurrentStage.id && (
                    <Crown className="w-3 h-3 text-amber-400" />
                  )}
                </div>

                <span className="text-xs font-bold text-white truncate">
                  {isRTL ? st.nameFa.split('(')[0].trim() : st.nameEn.split('(')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
