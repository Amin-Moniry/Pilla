import React from 'react';
import { UserSettings, KeyboardLayoutType } from '../../types/typing';
import { sound } from '../../utils/sound';
import { resetUserData } from '../../utils/storage';
import { X, Volume2, Globe, Keyboard, ShieldAlert, Music, Settings, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: UserSettings) => void;
  onResetProgress: () => void;
}

const layouts: { id: KeyboardLayoutType; titleFa: string; titleEn: string; detail: string }[] = [
  { id: 'persian-standard', titleFa: 'فارسی استاندارد', titleEn: 'Persian Standard', detail: 'ISIRI 9147' },
  { id: 'qwerty', titleFa: 'استاندارد انگلیسی', titleEn: 'US QWERTY', detail: 'QWERTY' },
  { id: 'dvorak', titleFa: 'دووراک', titleEn: 'Dvorak', detail: 'Dvorak' },
  { id: 'colemak', titleFa: 'کولمک', titleEn: 'Colemak', detail: 'Colemak' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSaveSettings,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const isRTL = settings.language === 'fa';

  const update = (partial: Partial<UserSettings>) => {
    onSaveSettings({ ...settings, ...partial });
  };

  const handleConfirmReset = () => {
    const confirmMsg = isRTL
      ? 'آیا مطمئن هستید؟ تمام آمار، دستاوردها و مراحل دگردیسی ریست خواهند شد.'
      : 'Are you sure? All stats, XP, and metamorphosis progress will be cleared.';
    if (window.confirm(confirmMsg)) {
      resetUserData();
      onResetProgress();
      onClose();
    }
  };

  const soundThemes = [
    { id: 'royal-santoor', label: isRTL ? 'سنتور و سه‌تار' : 'Santoor & Setar' },
    { id: 'thock', label: isRTL ? 'کلیک بم و نرم' : 'Soft mechanical' },
    { id: 'cherry-mx', label: 'Cherry MX' },
    { id: 'creamy-linear', label: isRTL ? 'پاپ نرم' : 'Creamy linear' },
    { id: 'typewriter', label: isRTL ? 'ماشین‌تحریر قدیمی' : 'Vintage typewriter' },
    { id: 'crystal-drop', label: isRTL ? 'قطرهٔ بلورین' : 'Crystal drop' },
    { id: 'soft-bubble', label: isRTL ? 'حباب آرام' : 'Soft bubble' },
  ] as const;

  return (
    <div
      className="pilla-settings-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="pilla-settings-dialog"
        dir={isRTL ? 'rtl' : 'ltr'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pilla-settings-title"
      >
        <header className="pilla-settings-header">
          <div className="pilla-settings-title-wrap">
            <div className="pilla-settings-mark" aria-hidden="true">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <p className="pilla-settings-kicker">{isRTL ? 'فضای شخصی‌سازی پیله' : 'PILLA CONTROL ROOM'}</p>
              <h2 id="pilla-settings-title">
                {isRTL ? 'تنظیمات و ترجیحات' : 'Settings & preferences'}
              </h2>
              <p className="pilla-settings-subtitle">
                {isRTL ? 'تنظیمات خودت را ساده و دقیق مدیریت کن.' : 'Tune your experience, simply and precisely.'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="pilla-settings-close" aria-label={isRTL ? 'بستن تنظیمات' : 'Close settings'}>
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </header>

        <div className="pilla-settings-content">
          <div className="pilla-settings-grid">
            <div className="pilla-settings-column">
              <section className="pilla-settings-section" aria-labelledby="settings-language-title">
                <div className="pilla-settings-section-title">
                  <span className="pilla-settings-section-icon"><Globe className="h-4 w-4" /></span>
                  <div>
                    <h3 id="settings-language-title">{isRTL ? 'زبان برنامه' : 'Interface language'}</h3>
                    <p>{isRTL ? 'زبان محیط و تمرین‌ها' : 'App interface and lessons'}</p>
                  </div>
                </div>
                <div className="pilla-settings-choice-grid pilla-settings-language-grid">
                  {[
                    { id: 'fa', label: 'فارسی', detail: 'RTL' },
                    { id: 'en', label: 'English', detail: 'LTR' },
                  ].map((language) => (
                    <button
                      type="button"
                      key={language.id}
                      onClick={() =>
                        update({
                          language: language.id as UserSettings['language'],
                          keyboardLayout: language.id === 'fa' ? 'persian-standard' : 'qwerty',
                        })
                      }
                      className={`pilla-settings-choice ${settings.language === language.id ? 'is-selected' : ''}`}
                      aria-pressed={settings.language === language.id}
                    >
                      <span>{language.label}</span>
                      <small>{language.detail}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="pilla-settings-section" aria-labelledby="settings-layout-title">
                <div className="pilla-settings-section-title">
                  <span className="pilla-settings-section-icon"><Keyboard className="h-4 w-4" /></span>
                  <div>
                    <h3 id="settings-layout-title">{isRTL ? 'چیدمان صفحه‌کلید' : 'Keyboard layout'}</h3>
                    <p>{isRTL ? 'چیدمان صفحه‌کلید فیزیکی' : 'Choose your physical keyboard'}</p>
                  </div>
                </div>
                <div className="pilla-settings-choice-grid">
                  {layouts.map((layout) => (
                    <button
                      type="button"
                      key={layout.id}
                      onClick={() => update({ keyboardLayout: layout.id })}
                      className={`pilla-settings-choice pilla-layout-choice ${settings.keyboardLayout === layout.id ? 'is-selected' : ''}`}
                      aria-pressed={settings.keyboardLayout === layout.id}
                    >
                      <span>{isRTL ? layout.titleFa : layout.titleEn}</span>
                      <small>{layout.detail}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="pilla-settings-section" aria-labelledby="settings-typing-title">
                <div className="pilla-settings-section-title">
                  <span className="pilla-settings-section-icon"><Sparkles className="h-4 w-4" /></span>
                  <div>
                    <h3 id="settings-typing-title">{isRTL ? 'شیوهٔ تصحیح خطا' : 'Typing error policy'}</h3>
                    <p>{isRTL ? 'رفتار برنامه بعد از اشتباه' : 'How errors are handled'}</p>
                  </div>
                </div>
                <div className="pilla-settings-choice-grid">
                  {[
                    {
                      id: 'forgiving',
                      title: isRTL ? 'انعطاف‌پذیر' : 'Forgiving',
                      detail: isRTL ? 'امکان استفاده از Backspace' : 'Backspace is allowed',
                    },
                    {
                      id: 'strict',
                      title: isRTL ? 'سخت‌گیرانه' : 'Strict',
                      detail: isRTL ? 'تصحیح خطا برای ادامه لازم است' : 'Correct each error to continue',
                    },
                  ].map((mode) => (
                    <button
                      type="button"
                      key={mode.id}
                      onClick={() => update({ typingMode: mode.id as UserSettings['typingMode'] })}
                      className={`pilla-settings-choice pilla-mode-choice ${settings.typingMode === mode.id ? 'is-selected' : ''}`}
                      aria-pressed={settings.typingMode === mode.id}
                    >
                      <span>{mode.title}</span>
                      <small>{mode.detail}</small>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="pilla-settings-column">
              <section className="pilla-settings-section pilla-audio-section" aria-labelledby="settings-audio-title">
                <div className="pilla-settings-section-title">
                  <span className="pilla-settings-section-icon pilla-audio-icon"><Volume2 className="h-4 w-4" /></span>
                  <div>
                    <h3 id="settings-audio-title">{isRTL ? 'صدا و موسیقی' : 'Sound & music'}</h3>
                    <p>{isRTL ? 'افکت‌های کلید و موسیقی پیانو' : 'Key feedback and piano ambience'}</p>
                  </div>
                </div>

                <div className="pilla-range-card">
                  <div className="pilla-range-label">
                    <span>{isRTL ? 'شدت افکت‌های تایپ' : 'Typing sound level'}</span>
                    <strong>{Math.round((settings.soundVolume ?? 0.4) * 100)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume ?? 0.4}
                    aria-label={isRTL ? 'شدت صدای تایپ' : 'Typing sound level'}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      update({ soundVolume: value });
                      sound.setVolume(value);
                      sound.playKeyClick(settings.soundTheme);
                    }}
                  />
                </div>

                <div className={`pilla-ambient-card ${settings.ambientMusicEnabled ? 'is-on' : ''}`}>
                  <div className="pilla-ambient-heading">
                    <div className="pilla-ambient-mark"><Music className="h-4 w-4" aria-hidden="true" /></div>
                    <div className="pilla-ambient-copy">
                      <h4>{isRTL ? 'پیانوی آرام' : 'Soft piano ambience'}</h4>
                      <p>
                        {isRTL
                          ? 'پیوسته در تمام بخش‌ها، حتی هنگام تمرین.'
                          : 'Continuous in every section, including practice.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => update({ ambientMusicEnabled: !settings.ambientMusicEnabled })}
                      className={`pilla-settings-toggle ${settings.ambientMusicEnabled ? 'is-on' : ''}`}
                      aria-pressed={settings.ambientMusicEnabled}
                    >
                      {settings.ambientMusicEnabled
                        ? isRTL
                          ? 'روشن'
                          : 'On'
                        : isRTL
                          ? 'خاموش'
                          : 'Off'}
                    </button>
                  </div>
                  <div className="pilla-range-label pilla-music-volume-label">
                    <span>{isRTL ? 'شدت موسیقی' : 'Music level'}</span>
                    <strong>{Math.round((settings.ambientMusicVolume ?? 0.045) * 100)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.18"
                    step="0.01"
                    value={settings.ambientMusicVolume ?? 0.045}
                    aria-label={isRTL ? 'شدت موسیقی پیانو' : 'Piano music level'}
                    onChange={(event) => update({ ambientMusicVolume: Number(event.target.value) })}
                  />
                  <a
                    href="https://pixabay.com/music/ambient-background-music-soft-calm-1-min-368070/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pilla-track-credit"
                  >
                    {isRTL ? 'قطعه: Soft Calm · STAROSTIN / Pixabay' : 'Track: Soft Calm · STAROSTIN / Pixabay'}
                  </a>
                </div>

                <div className="pilla-theme-heading">
                  <span>{isRTL ? 'صدای کلیدها' : 'Keyboard sound'}</span>
                  <small>{isRTL ? 'برای شنیدن، انتخاب کن' : 'Select to preview'}</small>
                </div>
                <div className="pilla-theme-grid">
                  {soundThemes.map((theme) => (
                    <button
                      type="button"
                      key={theme.id}
                      onClick={() => {
                        update({ soundTheme: theme.id as UserSettings['soundTheme'] });
                        sound.playKeyClick(theme.id as UserSettings['soundTheme']);
                      }}
                      className={`pilla-theme-choice ${settings.soundTheme === theme.id ? 'is-selected' : ''}`}
                      aria-pressed={settings.soundTheme === theme.id}
                    >
                      <span>{theme.label}</span>
                      <span className="pilla-theme-preview" aria-hidden="true">▶</span>
                    </button>
                  ))}
                </div>

                <div className="pilla-interface-preview">
                  <div>
                    <h4>{isRTL ? 'طنین لمس رابط' : 'Interface touch tones'}</h4>
                    <p>{isRTL ? 'افکت‌های اختصاصی با الهام از حس نرم iOS و Galaxy.' : 'Original soft tones inspired by iOS and Galaxy.'}</p>
                  </div>
                  <div className="pilla-interface-buttons">
                    <button type="button" onClick={() => sound.playInterfaceTone('ios')}>
                      {isRTL ? 'لمس نرم' : 'Soft tap'}
                    </button>
                    <button type="button" onClick={() => sound.playInterfaceTone('galaxy')}>
                      {isRTL ? 'طنین گرم' : 'Warm chime'}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <footer className="pilla-settings-footer">
            <button type="button" onClick={handleConfirmReset} className="pilla-settings-reset">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              <span>{isRTL ? 'ریست همهٔ آمار' : 'Reset all progress'}</span>
            </button>
            <button type="button" onClick={onClose} className="pilla-settings-save">
              {isRTL ? 'ذخیره و بستن' : 'Done'}
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
};