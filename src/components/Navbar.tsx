import React from 'react';
import { Language, UserStats } from '../types/typing';
import { ButterflyAvatar } from './ButterflyAvatar';
import { sound } from '../utils/sound';
import { Settings, Globe, Crown } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  language: Language;
  userStats: UserStats;
  onSelectTab: (tab: string) => void;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  language,
  userStats,
  onSelectTab,
  onToggleLanguage,
  onOpenSettings,
}) => {
  const isRTL = language === 'fa';

  const navLinks = [
    { id: 'dashboard', labelEn: 'Home', labelFa: 'خانه' },
    { id: 'learn', labelEn: 'Learn', labelFa: 'یادگیری' },
    { id: 'practice', labelEn: 'Practice', labelFa: 'تمرین' },
    { id: 'races', labelEn: 'Races', labelFa: 'مسابقه' },
    { id: 'test', labelEn: 'Speed test', labelFa: 'آزمون سرعت' },
    { id: 'stats', labelEn: 'Insights', labelFa: 'آمار' },
    { id: 'posture', labelEn: 'Posture', labelFa: 'ارگونومی' },
  ];

  const renderNavLinks = (mobile = false) =>
    navLinks.map((link) => {
      const isActive = activeTab === link.id;
      return (
        <button
          type="button"
          key={link.id}
          onClick={() => {
            sound.playInterfaceTone('ios');
            onSelectTab(link.id);
          }}
          aria-current={isActive ? 'page' : undefined}
          className={`pilla-nav-link ${mobile ? 'pilla-nav-link-mobile' : ''} ${
            isActive ? 'is-active' : ''
          }`}
        >
          <span className="pilla-nav-dot" aria-hidden="true" />
          <span>{isRTL ? link.labelFa : link.labelEn}</span>
        </button>
      );
    });

  return (
    <header className="pilla-header sticky top-0 z-40 w-full">
      <div className="pilla-header-inner max-w-7xl mx-auto px-3 sm:px-6">
        <div className="pilla-header-main">
          <div className="pilla-brand-group">
            <div className="pilla-avatar-frame">
              <ButterflyAvatar stageId={userStats.stage} size="sm" interactive={true} />
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playInterfaceTone('galaxy');
                onSelectTab('dashboard');
              }}
              className="pilla-brand-button text-start"
              aria-label={isRTL ? 'بازگشت به خانهٔ پیلا' : 'Go to Pilla home'}
            >
              <span className={`pilla-brand-word ${isRTL ? 'pilla-brand-word-fa' : ''}`}>
                {isRTL ? 'پیلا' : 'Pilla'}
              </span>
              <span className="pilla-level-chip" title={isRTL ? 'سطح فعلی' : 'Current level'}>
                <Crown className="pilla-level-crown" aria-hidden="true" />
                <span className="pilla-level-label">{isRTL ? 'سطح' : 'LEVEL'}</span>
                <span className="pilla-level-number">{String(userStats.level).padStart(2, '0')}</span>
              </span>
            </button>
          </div>

          <nav
            className="pilla-desktop-nav hidden lg:flex"
            aria-label={isRTL ? 'بخش‌های برنامه' : 'Main navigation'}
          >
            {renderNavLinks()}
          </nav>

          <div className="pilla-header-actions">
            <button
              type="button"
              onClick={() => {
                sound.playInterfaceTone('galaxy');
                onToggleLanguage();
              }}
              className="pilla-header-action pilla-language-action"
              title={isRTL ? 'تغییر زبان به انگلیسی' : 'Switch language to Persian'}
              aria-label={isRTL ? 'Switch language to English' : 'Switch language to Persian'}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span>{isRTL ? 'EN' : 'فا'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playInterfaceTone('ios');
                onOpenSettings();
              }}
              className="pilla-header-action pilla-settings-action"
              title={isRTL ? 'تنظیمات' : 'Settings'}
              aria-label={isRTL ? 'تنظیمات' : 'Settings'}
            >
              <Settings className="h-[17px] w-[17px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <nav
        className="pilla-mobile-nav lg:hidden"
        aria-label={isRTL ? 'بخش‌های برنامه' : 'Main navigation'}
      >
        {renderNavLinks(true)}
      </nav>
    </header>
  );
};