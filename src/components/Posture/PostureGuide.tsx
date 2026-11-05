import React from 'react';
import { Language } from '../../types/typing';
import {
  ShieldCheck,
  Eye,
  Compass,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  Keyboard,
  Monitor,
  Armchair,
  Footprints,
  Clock,
} from 'lucide-react';

interface PostureGuideProps {
  language: Language;
}

const photoCredit = (
  isRTL: boolean,
  url: string,
  photographer: string
) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    {isRTL ? `عکس: ${photographer} / Pexels` : `Photo: ${photographer} / Pexels`}
  </a>
);

export const PostureGuide: React.FC<PostureGuideProps> = ({ language }) => {
  const isRTL = language === 'fa';

  const principles = [
    {
      icon: <Armchair aria-hidden="true" />,
      number: '02',
      title: isRTL ? 'آرنج و مچ در خطی راحت' : 'Comfortable elbows and wrists',
      description: isRTL
        ? 'آرنج‌ها را نزدیک بدن و حدود ۹۰ تا ۱۰۰ درجه نگه دار. مچ‌ها صاف و هم‌راستای ساعد باشند؛ نه به بالا خم شوند و نه روی لبهٔ میز تحت فشار بمانند. شانه‌ها را رها کن و دست‌ها را سبک روی صفحه‌کلید نگه دار.'
        : 'Keep elbows close to your body at roughly 90–100°. Let wrists stay straight and aligned with your forearms—without bending up or pressing into the desk edge. Relax your shoulders and keep your hands light.',
      iconClass: 'arm',
    },
    {
      icon: <Monitor aria-hidden="true" />,
      number: '03',
      title: isRTL ? 'نمایشگر روبه‌رو و هم‌سطح نگاه' : 'A screen at a comfortable eye line',
      description: isRTL
        ? 'نمایشگر را روبه‌رو قرار بده؛ لبهٔ بالایی آن نزدیک ارتفاع چشم و فاصله‌اش تقریباً به اندازهٔ یک دست باشد (حدود ۵۰ تا ۷۰ سانتی‌متر). برای دیدن متن، چشم‌ها را از صفحه‌کلید بردار و به نمایشگر نگاه کن.'
        : 'Place the screen directly ahead, with its top near eye level and about an arm’s length away (roughly 50–70 cm). Look at the screen to read; let your fingers learn the keyboard by touch.',
      iconClass: 'screen',
    },
    {
      icon: <HeartPulse aria-hidden="true" />,
      number: '04',
      title: isRTL ? 'ریتم آرام و مکث‌های کوتاه' : 'A calm rhythm and short breaks',
      description: isRTL
        ? 'کلیدها را با فشار سبک بزن؛ شانه و فک را رها نگه دار و سرعت را پله‌پله بالا ببر. هر ۲۰ دقیقه، ۲۰ ثانیه به نقطه‌ای دور نگاه کن و هر از گاهی دست‌ها را از صفحه‌کلید بردار.'
        : 'Use light keystrokes, relax your shoulders and jaw, and build speed gradually. Every 20 minutes, look at something about 20 feet away for 20 seconds, and occasionally rest your hands.',
      iconClass: 'rhythm',
    },
  ];

  const setupItems = [
    {
      icon: <Footprints aria-hidden="true" />,
      title: isRTL ? 'پاها تکیه‌دار' : 'Feet supported',
      description: isRTL ? 'کف پا روی زمین یا زیرپایی.' : 'On the floor or a footrest.',
    },
    {
      icon: <Armchair aria-hidden="true" />,
      title: isRTL ? 'کمر راحت' : 'Back supported',
      description: isRTL ? 'تکیه‌گاه صندلی را تنظیم کن.' : 'Adjust the chair backrest.',
    },
    {
      icon: <Keyboard aria-hidden="true" />,
      title: isRTL ? 'صفحه‌کلید نزدیک' : 'Keyboard nearby',
      description: isRTL ? 'آرنج‌ها را به بدن نزدیک نگه دار.' : 'Keep elbows close to your sides.',
    },
    {
      icon: <Eye aria-hidden="true" />,
      title: isRTL ? 'چشم‌ها استراحت کنند' : 'Give your eyes a pause',
      description: isRTL ? 'گاهی به دوردست نگاه کن.' : 'Shift your gaze into the distance.',
    },
  ];

  return (
    <div className="pilla-posture-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="pilla-posture-hero">
        <div className="pilla-posture-hero-copy">
          <div className="pilla-posture-eyebrow">
            <span className="pilla-posture-eyebrow-mark"><ShieldCheck className="h-4 w-4" /></span>
            <span>{isRTL ? 'راهنمای سلامت و ارگونومی' : 'ERGONOMICS & WELLBEING'}</span>
          </div>
          <h2>{isRTL ? 'وضعیت راحت، تایپ روان' : 'Comfortable posture. Smoother typing.'}</h2>
          <p>
            {isRTL
              ? 'با چند تنظیم کوچک، فشار اضافه را از بدن کم کن و تمرکزت را روی متن نگه دار. راهنمای زیر را متناسب با بدن و میز خودت تنظیم کن؛ راحتی مهم‌تر از رسیدن به یک زاویهٔ کاملاً ثابت است.'
              : 'A few thoughtful adjustments can reduce unnecessary strain and help you focus on the words. Adapt these cues to your body and workspace—comfort matters more than hitting a rigid angle.'}
          </p>
          <div className="pilla-posture-pills">
            <span>{isRTL ? 'جای دست' : 'Hand position'}</span>
            <span>{isRTL ? 'نمایشگر' : 'Screen setup'}</span>
            <span>{isRTL ? 'مکث کوتاه' : 'Gentle breaks'}</span>
          </div>
        </div>
        <figure className="pilla-posture-hero-photo">
          <img
            src="/images/ergonomics-workstation.jpeg"
            alt={isRTL ? 'نمای کناری از فردی که پشت میز و صفحه‌کلید کار می‌کند' : 'Side view of a person working at a desk and keyboard'}
          />
          <figcaption>
            {photoCredit(isRTL, 'https://www.pexels.com/photo/woman-working-on-a-computer-in-an-office-12911961/', 'Mizuno K')}
          </figcaption>
        </figure>
      </section>

      <section className="pilla-home-row-card">
        <div className="pilla-home-row-copy">
          <div className="pilla-posture-card-kicker">
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>{isRTL ? 'نقطهٔ شروع دست‌ها · ۰۱' : 'YOUR HOME ROW · 01'}</span>
          </div>
          <h3>{isRTL ? 'ردیف خانه؛ جای برگشت انگشت‌ها' : 'Home row: a place to return to'}</h3>
          <p>
            {isRTL
              ? 'در چیدمان فارسی، برجستگی‌های کوچک روی «ب» و «ت» به انگشتان اشاره کمک می‌کنند جای شروع را با لمس پیدا کنند. انگشتان را آرام روی ردیف مبنا بگذار؛ بعد از هر حرکت، بدون عجله به همان جایگاه برگرد. لازم نیست برای پیدا کردن کلیدها به دست‌ها نگاه کنی.'
              : 'On the Persian layout, the small tactile bumps on “ب” and “ت” help your index fingers find their starting spots by touch. Rest your fingers lightly on the home row, then return there after each reach. Let touch—not a glance at your hands—guide the movement.'}
          </p>
          <div className="pilla-home-keys" aria-label={isRTL ? 'کلیدهای مبنا' : 'Home-row keys'}>
            <span><b>ب</b>{isRTL ? 'انگشت اشارهٔ چپ' : 'Left index'}</span>
            <span><b>ت</b>{isRTL ? 'انگشت اشارهٔ راست' : 'Right index'}</span>
          </div>
        </div>
        <figure className="pilla-home-row-photo">
          <img
            src="/images/keyboard-home-row.webp"
            alt={isRTL ? 'نمای نزدیک دست‌ها روی صفحه‌کلید روشن هنگام تایپ' : 'Close-up of hands typing on a light keyboard'}
          />
          <figcaption>
            {photoCredit(isRTL, 'https://www.pexels.com/photo/close-up-of-hands-typing-on-a-keyboard-30535780/', 'Vitaly Gariev')}
          </figcaption>
        </figure>
      </section>

      <section className="pilla-posture-principles">
        <div className="pilla-posture-section-heading">
          <div>
            <p>{isRTL ? 'تنظیم‌های ساده، اثر ماندگار' : 'SMALL ADJUSTMENTS, EVERYDAY COMFORT'}</p>
            <h3>{isRTL ? 'سه نشانه برای یک میز راحت‌تر' : 'Three cues for a more comfortable setup'}</h3>
          </div>
          <span className="pilla-posture-section-chip">{isRTL ? '۳ نکته' : '3 CUES'}</span>
        </div>
        <div className="pilla-posture-card-grid">
          {principles.map((principle) => (
            <article className="pilla-posture-info-card" key={principle.number}>
              <div className={`pilla-posture-icon ${principle.iconClass}`}>{principle.icon}</div>
              <span className="pilla-posture-number">{principle.number}</span>
              <h4>{principle.title}</h4>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pilla-setup-section">
        <div className="pilla-posture-section-heading">
          <div>
            <p>{isRTL ? 'قبل از شروع تمرین' : 'BEFORE YOUR NEXT SESSION'}</p>
            <h3>{isRTL ? 'چک‌لیست یک‌دقیقه‌ای میز کار' : 'Your one-minute desk check'}</h3>
          </div>
          <span className="pilla-posture-section-chip">{isRTL ? 'سریع و کاربردی' : 'QUICK SETUP'}</span>
        </div>
        <div className="pilla-setup-grid">
          {setupItems.map((item) => (
            <div className="pilla-setup-item" key={item.title}>
              <span className="pilla-setup-icon">{item.icon}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pilla-posture-habits">
        <article className="pilla-habit-card do">
          <div className="pilla-habit-title">
            <CheckCircle2 className="h-[18px] w-[18px]" aria-hidden="true" />
            <h3>{isRTL ? 'عادت‌های سازنده' : 'Helpful habits'}</h3>
          </div>
          <ul>
            <li>{isRTL ? 'پاها را روی زمین یا زیرپایی نگه دار.' : 'Keep your feet supported.'}</li>
            <li>{isRTL ? 'صفحه‌کلید و ماوس را نزدیک بدن قرار بده.' : 'Keep the keyboard and mouse within easy reach.'}</li>
            <li>{isRTL ? 'با سرعتی تایپ کن که شانه و انگشت‌ها آرام بمانند.' : 'Choose a pace that keeps your shoulders and fingers relaxed.'}</li>
          </ul>
        </article>
        <article className="pilla-habit-card avoid">
          <div className="pilla-habit-title">
            <AlertTriangle className="h-[18px] w-[18px]" aria-hidden="true" />
            <h3>{isRTL ? 'چیزهایی که بهتر است پرهیز کنی' : 'Habits to avoid'}</h3>
          </div>
          <ul>
            <li>{isRTL ? 'خم شدن طولانی به‌سمت نمایشگر یا پایین آوردن سر.' : 'Leaning toward the screen or craning your neck.'}</li>
            <li>{isRTL ? 'فشار دادن مچ‌ها به لبهٔ سخت میز.' : 'Pressing wrists against a hard desk edge.'}</li>
            <li>{isRTL ? 'کوبیدن محکم روی کلیدها یا ادامه دادن با وجود ناراحتی.' : 'Hammering keys or pushing through discomfort.'}</li>
          </ul>
        </article>
      </section>

      <p className="pilla-posture-note">
        <Clock className="h-4 w-4" aria-hidden="true" />
        <span>
          {isRTL
            ? 'اگر دردی ماندگار یا ناراحتی داری، تمرین را متوقف کن و وضعیت میز و صندلی را دوباره تنظیم کن.'
            : 'If discomfort persists, pause and readjust your chair and workstation before continuing.'}
        </span>
      </p>
    </div>
  );
};