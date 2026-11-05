import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MetamorphosisStageId } from '../types/typing';
import { METAMORPHOSIS_STAGES } from '../utils/metamorphosis';
import { sound } from '../utils/sound';

interface ButterflyAvatarProps {
  stageId: MetamorphosisStageId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isFlapping?: boolean;
  interactive?: boolean;
  onFlutter?: () => void;
}

export const ButterflyAvatar: React.FC<ButterflyAvatarProps> = ({
  stageId,
  size = 'md',
  isFlapping = false,
  interactive = true,
  onFlutter,
}) => {
  const [internalFlap, setInternalFlap] = useState(false);
  const stage = METAMORPHOSIS_STAGES[stageId] || METAMORPHOSIS_STAGES.egg;

  const sizeDimensions = {
    sm: { width: 44, height: 44, container: 'w-11 h-11' },
    md: { width: 68, height: 68, container: 'w-16 h-16 sm:w-20 sm:h-20' },
    lg: { width: 110, height: 110, container: 'w-28 h-28 sm:w-32 sm:h-32' },
    xl: { width: 180, height: 180, container: 'w-44 h-44 sm:w-56 sm:h-56' },
  }[size];

  const handleClick = () => {
    if (!interactive) return;
    setInternalFlap(true);
    sound.playFlap();
    if (onFlutter) onFlutter();
    setTimeout(() => setInternalFlap(false), 1200);
  };

  const active = isFlapping || internalFlap;

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center justify-center ${sizeDimensions.container} select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      }`}
      title={`${stage.nameEn} - ${stage.nameFa}`}
      aria-label={`${stage.nameEn} - ${stage.nameFa}`}
    >
      {/* Dynamic Keyframe Glowing Aura (Framer Motion) */}
      <motion.div
        animate={{
          scale: active ? [1, 1.35, 1.1, 1.4, 1] : [1, 1.18, 1],
          opacity: active ? [0.6, 0.95, 0.7, 0.9, 0.6] : [0.45, 0.7, 0.45],
        }}
        transition={{
          duration: active ? 1.2 : 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${stage.accentColor} 0%, rgba(245, 158, 11, 0.25) 60%, transparent 100%)`,
        }}
      />

      {/* Floating Keyframe Levitation Container */}
      <motion.div
        animate={{
          y: active ? [0, -10, 2, -6, 0] : [0, -6, 0],
          rotate: active ? [0, -3, 3, -2, 0] : [0, -1, 1, 0],
        }}
        transition={{
          duration: active ? 1.2 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-full h-full relative z-10 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageId}
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center"
          >
            {/* STAGE 1: سرآغاز ابریشم (Silk Genesis / Mystic Golden Sprout) */}
            {stageId === 'egg' && (
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                <defs>
                  <radialGradient id="silkGenesisGrad" cx="38%" cy="32%" r="68%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="25%" stopColor="#FEF08A" />
                    <stop offset="55%" stopColor="#F59E0B" />
                    <stop offset="85%" stopColor="#7E22CE" />
                    <stop offset="100%" stopColor="#2E1065" />
                  </radialGradient>
                  <linearGradient id="goldEdgeFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="40%" stopColor="#FDE68A" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>

                {/* Outer Lotus Leaf Petals / گلبرگ‌های اسلیمی تذهیب */}
                <motion.path
                  animate={{
                    scale: active ? [1, 1.05, 1] : [1, 1.02, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  d="M 50 12 C 30 28 22 56 34 78 C 42 90 58 90 66 78 C 78 56 70 28 50 12 Z"
                  fill="url(#silkGenesisGrad)"
                  stroke="url(#goldEdgeFoil)"
                  strokeWidth="2"
                />

                {/* Arabesque Gold Silk Threads / تارهای ابریشمین زرین */}
                <path
                  d="M 50 16 Q 34 44 50 70 Q 66 44 50 16"
                  stroke="#FFFBEB"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.9"
                />
                <path d="M 36 46 Q 50 56 64 46" stroke="url(#goldEdgeFoil)" strokeWidth="1.6" fill="none" />
                <path d="M 38 60 Q 50 70 62 60" stroke="url(#goldEdgeFoil)" strokeWidth="1.4" fill="none" />

                {/* Embedded Golden Crown Jewel / نگین زرین تپنده */}
                <motion.circle
                  animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  cx="50"
                  cy="48"
                  r="5"
                  fill="#FBBF24"
                  stroke="#FFFBEB"
                  strokeWidth="1.2"
                />
                <circle cx="48.5" cy="46.5" r="1.5" fill="#FFFFFF" />

                {/* Orbiting Stardust Particles */}
                <motion.circle
                  animate={{ y: [-2, 2, -2], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  cx="32"
                  cy="36"
                  r="1.2"
                  fill="#FDE68A"
                />
                <motion.circle
                  animate={{ y: [2, -2, 2], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  cx="68"
                  cy="40"
                  r="1.4"
                  fill="#FDE68A"
                />
              </svg>
            )}

            {/* STAGE 2: رهروی ابریشم (Silk Pilgrim) */}
            {stageId === 'silkworm' && (
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(245,158,11,0.55)]">
                <defs>
                  <linearGradient id="pilgrimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="30%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#7E22CE" />
                    <stop offset="100%" stopColor="#2E1065" />
                  </linearGradient>
                  <linearGradient id="goldBands" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>

                {/* Crawling Segments with Keyframe Pulse */}
                <motion.circle
                  animate={{ scale: active ? [1, 1.1, 1] : [1, 1.03, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  cx="25"
                  cy="62"
                  r="10"
                  fill="url(#pilgrimGrad)"
                  stroke="url(#goldBands)"
                  strokeWidth="1.4"
                />
                <circle cx="41" cy="54" r="12" fill="url(#pilgrimGrad)" stroke="url(#goldBands)" strokeWidth="1.4" />
                <circle cx="59" cy="50" r="13.5" fill="url(#pilgrimGrad)" stroke="url(#goldBands)" strokeWidth="1.5" />
                <circle cx="76" cy="44" r="12" fill="url(#pilgrimGrad)" stroke="url(#goldBands)" strokeWidth="1.5" />

                {/* Royal Crown / تاج زرین نوپا */}
                <polygon points="73,32 76,37 80,31 84,37 87,32 86,40 73,40" fill="#F59E0B" stroke="#FEF08A" strokeWidth="0.8" />
                <circle cx="80" cy="43" r="2.8" fill="#F59E0B" />
                <circle cx="81.2" cy="41.8" r="1" fill="#FFFFFF" />

                {/* Curved Golden Antenna */}
                <motion.path
                  animate={{ rotate: [-2, 3, -2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  d="M 80 32 Q 87 23 93 22"
                  stroke="#FDE68A"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="93" cy="22" r="1.8" fill="#F59E0B" />
              </svg>
            )}

            {/* STAGE 3: پیله زرین (Golden Cocoon) */}
            {stageId === 'cocoon' && (
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_18px_rgba(217,70,239,0.6)]">
                <defs>
                  <linearGradient id="silkCocoonFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="25%" stopColor="#FDE68A" />
                    <stop offset="55%" stopColor="#A855F7" />
                    <stop offset="85%" stopColor="#581C87" />
                    <stop offset="100%" stopColor="#1E0538" />
                  </linearGradient>
                </defs>

                {/* Golden Suspension Ribbon with Jewel */}
                <line x1="50" y1="2" x2="50" y2="24" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
                <circle cx="50" cy="24" r="3" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />

                {/* Main Cocoon Body */}
                <ellipse cx="50" cy="58" rx="22" ry="32" fill="url(#silkCocoonFill)" stroke="#F59E0B" strokeWidth="2" />

                {/* Intricate Tazhib Silk Threads / تارهای زرین مذهب */}
                <motion.path
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  d="M 32 44 Q 50 56 68 46"
                  stroke="#FEF08A"
                  strokeWidth="2.4"
                  fill="none"
                />
                <path d="M 29 56 Q 50 70 71 58" stroke="#FBBF24" strokeWidth="2.4" fill="none" />
                <path d="M 33 68 Q 50 82 67 70" stroke="#F59E0B" strokeWidth="2.2" fill="none" />
                <path d="M 38 78 Q 50 88 62 80" stroke="#FEF08A" strokeWidth="1.6" fill="none" opacity="0.8" />

                {/* Center Royal Seal Diamond / نگین فیروزه مرکزی */}
                <polygon points="50,54 54,58 50,63 46,58" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" />
              </svg>
            )}

            {/* STAGE 4: شکفتن شاهانه (Royal Emergence) */}
            {stageId === 'emerging' && (
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
                <defs>
                  <linearGradient id="emergWings" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="35%" stopColor="#FDE68A" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#3B0764" />
                  </linearGradient>
                  <linearGradient id="goldEdgeG" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>

                {/* Split Cocoon Shell */}
                <path d="M 29 76 C 20 54 30 34 45 28" stroke="url(#goldEdgeG)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
                <path d="M 71 76 C 80 54 70 34 55 28" stroke="url(#goldEdgeG)" strokeWidth="3.2" fill="none" strokeLinecap="round" />

                {/* Emerging Left Wing */}
                <motion.path
                  animate={{
                    rotate: active ? [-6, 6, -6] : [-2, 2, -2],
                    scaleX: active ? [1, 0.85, 1] : [1, 0.96, 1],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '50px 50px' }}
                  d="M 50 50 C 30 24 10 35 20 58 C 32 64 44 56 50 50"
                  fill="url(#emergWings)"
                  stroke="#FEF08A"
                  strokeWidth="1.6"
                />

                {/* Emerging Right Wing */}
                <motion.path
                  animate={{
                    rotate: active ? [6, -6, 6] : [2, -2, 2],
                    scaleX: active ? [1, 0.85, 1] : [1, 0.96, 1],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '50px 50px' }}
                  d="M 50 50 C 70 24 90 35 80 58 C 68 64 56 56 50 50"
                  fill="url(#emergWings)"
                  stroke="#FEF08A"
                  strokeWidth="1.6"
                />

                {/* Slender Chrysalis Body */}
                <ellipse cx="50" cy="54" rx="4.5" ry="17" fill="#FDE68A" stroke="#B45309" strokeWidth="1.2" />
              </svg>
            )}

            {/* STAGE 5 & 6: شهپر همایونی & پروانه زرین خسروانی (Royal Persian Miniature Butterfly) */}
            {(stageId === 'butterfly' || stageId === 'radiant-butterfly') && (
              <svg
                viewBox="0 0 120 120"
                className="w-full h-full filter drop-shadow-[0_0_25px_rgba(245,158,11,0.7)]"
              >
                <defs>
                  {/* Left Wing Gradient */}
                  <linearGradient id="sovereignWingLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="20%" stopColor="#FEF08A" />
                    <stop offset="45%" stopColor={stageId === 'radiant-butterfly' ? '#FBBF24' : '#F59E0B'} />
                    <stop offset="75%" stopColor={stageId === 'radiant-butterfly' ? '#A855F7' : '#C084FC'} />
                    <stop offset="100%" stopColor={stageId === 'radiant-butterfly' ? '#F59E0B' : '#3B0764'} />
                  </linearGradient>

                  {/* Right Wing Gradient */}
                  <linearGradient id="sovereignWingRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="20%" stopColor="#FEF08A" />
                    <stop offset="45%" stopColor={stageId === 'radiant-butterfly' ? '#FBBF24' : '#F59E0B'} />
                    <stop offset="75%" stopColor={stageId === 'radiant-butterfly' ? '#A855F7' : '#C084FC'} />
                    <stop offset="100%" stopColor={stageId === 'radiant-butterfly' ? '#F59E0B' : '#3B0764'} />
                  </linearGradient>

                  {/* Pure Gold Leaf Foil Stroke */}
                  <linearGradient id="sovereignGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#FEF08A" />
                    <stop offset="65%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                </defs>

                {/* LEFT WING with Keyframe Flapping Animation */}
                <motion.g
                  animate={{
                    rotate: active ? [-18, 14, -18, 10, 0] : [-4, 4, -4],
                    scaleX: active ? [1, 0.65, 1, 0.75, 1] : [1, 0.94, 1],
                  }}
                  transition={{
                    duration: active ? 0.7 : 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '60px 58px' }}
                >
                  {/* Forewing */}
                  <path
                    d="M 60 55 C 40 14 8 22 12 56 C 16 69 38 72 60 60 Z"
                    fill="url(#sovereignWingLeft)"
                    stroke="url(#sovereignGoldFoil)"
                    strokeWidth="2"
                  />
                  {/* Hindwing with Persian Scallop / اسلیمی دندانه‌دار */}
                  <path
                    d="M 60 60 C 36 70 22 92 40 103 C 52 106 60 84 60 65 Z"
                    fill="url(#sovereignWingLeft)"
                    stroke="url(#sovereignGoldFoil)"
                    strokeWidth="2"
                  />

                  {/* Gold Filigree Veins (تذهیب زرین) */}
                  <path d="M 60 55 Q 34 38 20 34" stroke="url(#sovereignGoldFoil)" strokeWidth="1.6" fill="none" />
                  <path d="M 60 55 Q 33 55 22 64" stroke="url(#sovereignGoldFoil)" strokeWidth="1.6" fill="none" />
                  <path d="M 60 62 Q 38 82 34 94" stroke="url(#sovereignGoldFoil)" strokeWidth="1.4" fill="none" />

                  {/* Persian Inset Turquoise Jewel / ترنج فیروزه */}
                  <ellipse cx="30" cy="46" rx="4.5" ry="8" transform="rotate(-30 30 46)" fill="#FBBF24" stroke="#FFFBEB" strokeWidth="1.2" />
                  <circle cx="36" cy="85" r="3" fill="#F59E0B" stroke="#FFFBEB" strokeWidth="1" />
                </motion.g>

                {/* RIGHT WING with Keyframe Flapping Animation */}
                <motion.g
                  animate={{
                    rotate: active ? [18, -14, 18, -10, 0] : [4, -4, 4],
                    scaleX: active ? [1, 0.65, 1, 0.75, 1] : [1, 0.94, 1],
                  }}
                  transition={{
                    duration: active ? 0.7 : 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '60px 58px' }}
                >
                  {/* Forewing */}
                  <path
                    d="M 60 55 C 80 14 112 22 108 56 C 104 69 82 72 60 60 Z"
                    fill="url(#sovereignWingRight)"
                    stroke="url(#sovereignGoldFoil)"
                    strokeWidth="2"
                  />
                  {/* Hindwing */}
                  <path
                    d="M 60 60 C 84 70 98 92 80 103 C 68 106 60 84 60 65 Z"
                    fill="url(#sovereignWingRight)"
                    stroke="url(#sovereignGoldFoil)"
                    strokeWidth="2"
                  />

                  {/* Gold Filigree Veins (تذهیب زرین) */}
                  <path d="M 60 55 Q 86 38 100 34" stroke="url(#sovereignGoldFoil)" strokeWidth="1.6" fill="none" />
                  <path d="M 60 55 Q 87 55 98 64" stroke="url(#sovereignGoldFoil)" strokeWidth="1.6" fill="none" />
                  <path d="M 60 62 Q 82 82 86 94" stroke="url(#sovereignGoldFoil)" strokeWidth="1.4" fill="none" />

                  {/* Persian Inset Turquoise Jewel / ترنج فیروزه */}
                  <ellipse cx="90" cy="46" rx="4.5" ry="8" transform="rotate(30 90 46)" fill="#FBBF24" stroke="#FFFBEB" strokeWidth="1.2" />
                  <circle cx="84" cy="85" r="3" fill="#F59E0B" stroke="#FFFBEB" strokeWidth="1" />
                </motion.g>

                {/* CENTRAL SLENDER SCEPTER BODY / پیکر همایونی زرین */}
                <ellipse cx="60" cy="62" rx="4" ry="24" fill="#FEF08A" stroke="#92400E" strokeWidth="1.4" />
                <circle cx="60" cy="36" r="4.8" fill="#FFFBEB" stroke="#92400E" strokeWidth="1.2" />

                {/* Royal Crown Jewel on Head */}
                <polygon points="60,28 64,33 60,35 56,33" fill="#F59E0B" stroke="#FFFBEB" strokeWidth="0.8" />

                {/* Calligraphic Antennae with Gold Finials */}
                <path d="M 60 34 Q 50 18 42 16" stroke="url(#sovereignGoldFoil)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <circle cx="41" cy="16" r="2.4" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.2" />

                <path d="M 60 34 Q 70 18 78 16" stroke="url(#sovereignGoldFoil)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <circle cx="79" cy="16" r="2.4" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.2" />

                {/* RADIANT CELESTIAL STARDUST PARTICLES */}
                {stageId === 'radiant-butterfly' && (
                  <>
                    <motion.circle
                      animate={{ scale: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      cx="18"
                      cy="30"
                      r="2.2"
                      fill="#FEF08A"
                    />
                    <motion.circle
                      animate={{ scale: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      cx="102"
                      cy="30"
                      r="2.2"
                      fill="#FBBF24"
                    />
                    <circle cx="26" cy="98" r="1.8" fill="#A855F7" />
                    <circle cx="94" cy="98" r="1.8" fill="#FDE68A" />
                  </>
                )}
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
