import { FingerType } from '../../types/typing';

export const FINGER_TIPS: Record<FingerType, { whyEn: string; whyFa: string; errEn: string; errFa: string }> = {
  'left-pinky': {
    whyEn: 'The left pinky is your weakest finger, so it needs the most repetition. Training it now saves years of slow typing.',
    whyFa: 'انگشت کوچک چپ ضعیف‌ترین انگشت شماست و بیش از همه به تکرار نیاز دارد. تمرین آن از همین حالا سال‌ها کندی را جبران می‌کند.',
    errEn: 'Tilting the whole hand sideways to reach. Move only the finger, then return it home.',
    errFa: 'کج کردن کل دست برای رسیدن به کلید. فقط انگشت را حرکت دهید و سپس به خانه برگردانید.',
  },
  'left-ring': {
    whyEn: 'The ring finger is weak and tied to its neighbours by tendons. Slow, clean repetition makes it independent.',
    whyFa: 'انگشت انگشتری ضعیف است و با رباط‌هایش به انگشتان کناری گره خورده؛ تکرار آرام و دقیق آن را مستقل می‌کند.',
    errEn: 'Using the middle finger to "help" because the ring finger feels clumsy.',
    errFa: 'کمک گرفتن از انگشت میانی چون انگشتری دست‌وپاچلفتی به نظر می‌رسد.',
  },
  'left-middle': {
    whyEn: 'The middle finger is long and strong. It is the anchor of each hand and reaches the top and bottom rows easily.',
    whyFa: 'انگشت میانی بلند و نیرومند است؛ لنگر هر دست است و به‌آسانی به ردیف بالا و پایین می‌رسد.',
    errEn: 'Letting the finger flatten. Keep it curved and strike with the fingertip.',
    errFa: 'صاف کردن انگشت. آن را خمیده نگه دارید و با نوک انگشت ضربه بزنید.',
  },
  'left-index': {
    whyEn: 'Each index finger covers two columns of keys, so it does the most work. A strong index finger is the base of speed.',
    whyFa: 'هر انگشت اشاره دو ستون کلید را پوشش می‌دهد و بیشترین کار را انجام می‌دهد؛ اشارهٔ نیرومند پایهٔ سرعت است.',
    errEn: 'Moving the whole hand toward the far column instead of stretching the finger.',
    errFa: 'حرکت دادن کل دست به‌سوی ستون دورتر به‌جای کشیدن انگشت.',
  },
  thumb: {
    whyEn: 'Your thumbs press the space bar. Using one thumb consistently makes spacing automatic.',
    whyFa: 'شست‌ها کلید فاصله را می‌زنند. استفادهٔ یکنواخت از یک شست، فاصله را خودکار می‌کند.',
    errEn: 'Hitting space with a bent finger or pausing before each space.',
    errFa: 'زدن فاصله با انگشت دیگر یا مکث پیش از هر فاصله.',
  },
  'right-index': {
    whyEn: 'Each index finger covers two columns of keys, so it does the most work. A strong index finger is the base of speed.',
    whyFa: 'هر انگشت اشاره دو ستون کلید را پوشش می‌دهد و بیشترین کار را انجام می‌دهد؛ اشارهٔ نیرومند پایهٔ سرعت است.',
    errEn: 'Moving the whole hand toward the far column instead of stretching the finger.',
    errFa: 'حرکت دادن کل دست به‌سوی ستون دورتر به‌جای کشیدن انگشت.',
  },
  'right-middle': {
    whyEn: 'The middle finger is long and strong. It is the anchor of each hand and reaches the top and bottom rows easily.',
    whyFa: 'انگشت میانی بلند و نیرومند است؛ لنگر هر دست است و به‌آسانی به ردیف بالا و پایین می‌رسد.',
    errEn: 'Letting the finger flatten. Keep it curved and strike with the fingertip.',
    errFa: 'صاف کردن انگشت. آن را خمیده نگه دارید و با نوک انگشت ضربه بزنید.',
  },
  'right-ring': {
    whyEn: 'The ring finger is weak and tied to its neighbours by tendons. Slow, clean repetition makes it independent.',
    whyFa: 'انگشت انگشتری ضعیف است و با رباط‌هایش به انگشتان کناری گره خورده؛ تکرار آرام و دقیق آن را مستقل می‌کند.',
    errEn: 'Using the middle finger to "help" because the ring finger feels clumsy.',
    errFa: 'کمک گرفتن از انگشت میانی چون انگشتری دست‌وپاچلفتی به نظر می‌رسد.',
  },
  'right-pinky': {
    whyEn: 'The right pinky guards Enter, Backspace, punctuation and many letters. Typists who skip training it stay slow forever.',
    whyFa: 'انگشت کوچک راست نگهبان اینتر، بک‌اسپیس، علائم نگارشی و حروف بسیاری است. کسی که آن را تمرین نکند همیشه کند می‌ماند.',
    errEn: 'Tilting the wrist outward. Move only the finger, then return it home.',
    errFa: 'کج کردن مچ به بیرون. فقط انگشت را حرکت دهید و به خانه برگردانید.',
  },
};

export interface RoleCopy {
  tEn: string;
  tFa: string;
  iEn: string;
  iFa: string;
}

export const ROLE_COPY: Record<string, RoleCopy> = {
  isolate: {
    tEn: 'One key at a time',
    tFa: 'یک کلید در هر بار',
    iEn: 'Keyboard and hand guide are on. Repeat each new key until the finger moves by itself.',
    iFa: 'صفحه‌کلید و راهنمای دست روشن است. هر کلید تازه را آن‌قدر تکرار کنید تا انگشت خودکار حرکت کند.',
  },
  anchor: {
    tEn: 'New keys + familiar keys',
    tFa: 'کلیدهای تازه + کلیدهای آشنا',
    iEn: 'Pair the new keys with keys you already know. Return each finger home after every stroke.',
    iFa: 'کلیدهای تازه را با کلیدهای آشنا جفت کنید. پس از هر ضربه انگشت را به خانه برگردانید.',
  },
  groups: {
    tEn: 'Letter groups',
    tFa: 'گروه‌های حرفی',
    iEn: 'Short groups train finger order. Stay relaxed and keep a steady beat.',
    iFa: 'گروه‌های کوتاه ترتیب حرکت انگشتان را می‌آموزند. آرام باشید و ضرب یکنواخت نگه دارید.',
  },
  words: {
    tEn: 'Real words',
    tFa: 'واژه‌های واقعی',
    iEn: 'Real words build the habit of typing whole shapes, not single letters.',
    iFa: 'واژه‌های واقعی عادتِ تایپ «شکل کامل واژه» را می‌سازند، نه تک‌حرف.',
  },
  mixed: {
    tEn: 'Mixed practice',
    tFa: 'تمرین ترکیبی',
    iEn: 'Everything learned so far, mixed together. Accuracy first.',
    iFa: 'همهٔ آموخته‌ها با هم آمیخته شده‌اند. دقت در اولویت است.',
  },
  text: {
    tEn: 'Read and type',
    tFa: 'بخوان و بنویس',
    iEn: 'Read one word ahead of your fingers and keep your rhythm even.',
    iFa: 'یک واژه جلوتر از انگشتانتان بخوانید و ریتم را یکنواخت نگه دارید.',
  },
};

export const FREE_SUFFIX = {
  en: ' The on-screen keyboard is hidden: trust your fingers.',
  fa: ' صفحه‌کلید مجازی پنهان است؛ به انگشتانتان اعتماد کنید.',
};

export const KIND_DEFAULTS: Record<
  string,
  { subEn: string; subFa: string; whyEn: string; whyFa: string; errEn: string; errFa: string }
> = {
  foundation: {
    subEn: 'Build the habits every other lesson depends on',
    subFa: 'عادت‌هایی که همهٔ درس‌های دیگر به آن‌ها وابسته‌اند',
    whyEn: 'Posture and home position decide how fast and how safely you will type for the rest of your life.',
    whyFa: 'نشستن و جایگاه مبنا تعیین می‌کنند که تا پایان عمر چقدر سریع و چقدر سالم تایپ کنید.',
    errEn: 'Looking at the keyboard, resting wrists on the desk, or hunching the shoulders.',
    errFa: 'نگاه به صفحه‌کلید، تکیه دادن مچ‌ها به میز یا قوز کردن شانه‌ها.',
  },
  intro: {
    subEn: 'Meet new keys, then drill them until they are automatic',
    subFa: 'آشنایی با کلیدهای تازه و تکرار تا خودکار شدن',
    whyEn: 'Keys are learned in small steps. Every new key is drilled alone first, then with keys you already know.',
    whyFa: 'کلیدها گام‌به‌گام آموخته می‌شوند: هر کلید ابتدا تنها و سپس در کنار کلیدهای آشنا تمرین می‌شود.',
    errEn: 'Looking down, or typing faster than your accuracy allows.',
    errFa: 'نگاه به پایین یا تایپ سریع‌تر از آنچه دقت اجازه می‌دهد.',
  },
  reinforce: {
    subEn: 'A second long session on the same keys — repetition builds muscle memory',
    subFa: 'نشست دوم و بلند روی همان کلیدها — تکرار، حافظهٔ عضلانی می‌سازد',
    whyEn: 'Muscle memory forms during repetition, not during explanation. This lesson gives the new keys the extra minutes they need.',
    whyFa: 'حافظهٔ عضلانی در تکرار ساخته می‌شود، نه در توضیح. این درس دقایق اضافهٔ لازم را به کلیدهای تازه می‌دهد.',
    errEn: 'Rushing. If accuracy drops below the goal, slow down.',
    errFa: 'شتاب‌زدگی. اگر دقت از هدف پایین‌تر آمد، آهسته‌تر شوید.',
  },
  hand: {
    subEn: 'One hand works alone while the other rests on its home keys',
    subFa: 'یک دست به‌تنهایی کار می‌کند و دست دیگر روی کلیدهای مبنا استراحت می‌کند',
    whyEn: 'Most people have a weaker hand. Training each hand alone removes the weakness and balances both hands.',
    whyFa: 'بیشتر مردم یک دست ضعیف‌تر دارند. تمرین جداگانهٔ هر دست ضعف را از میان می‌برد و دو دست را متوازن می‌کند.',
    errEn: 'Letting the resting hand drift off its home keys.',
    errFa: 'رها کردن دست استراحت‌کننده از روی کلیدهای مبنا.',
  },
  words: {
    subEn: 'Real words made from the keys you know',
    subFa: 'واژه‌های واقعی از کلیدهایی که می‌شناسید',
    whyEn: 'Real words train the finger sequences you will use every day.',
    whyFa: 'واژه‌های واقعی توالی حرکت انگشتانی را می‌آموزند که هر روز به کار می‌برید.',
    errEn: 'Typing letter by letter instead of word by word.',
    errFa: 'تایپ حرف‌به‌حرف به جای واژه‌به‌واژه.',
  },
  text: {
    subEn: 'Sentences and passages that use everything you have learned',
    subFa: 'جمله‌ها و متن‌هایی که همهٔ آموخته‌ها را به کار می‌برند',
    whyEn: 'Real text mixes letters, spaces and punctuation the way daily writing does.',
    whyFa: 'متن واقعی حروف، فاصله و علائم را همان‌گونه که در نوشتن روزمره هست درهم می‌آمیزد.',
    errEn: 'Stopping at punctuation or capitals. Keep the rhythm going.',
    errFa: 'توقف در علائم نگارشی یا حروف بزرگ. ریتم را ادامه دهید.',
  },
  review: {
    subEn: 'Consolidate the stage before moving on',
    subFa: 'تثبیت مرحله پیش از رفتن به مرحلهٔ بعد',
    whyEn: 'Review is where short-term practice becomes long-term skill.',
    whyFa: 'مرور جایی است که تمرین کوتاه‌مدت به مهارت بلندمدت تبدیل می‌شود.',
    errEn: 'Skipping review because it feels easy. Easy is the goal.',
    errFa: 'رد کردن مرور چون آسان به نظر می‌رسد. آسان بودن همان هدف است.',
  },
  exam: {
    subEn: 'Prove the stage: reach the speed and accuracy goal',
    subFa: 'اثبات تسلط بر مرحله: رسیدن به هدف سرعت و دقت',
    whyEn: 'An exam shows whether the skill is truly yours — without hints, without the keyboard.',
    whyFa: 'آزمون نشان می‌دهد که مهارت واقعاً از آنِ شماست — بدون راهنما و بدون صفحه‌کلید.',
    errEn: 'Panicking after one error. Keep going; one slip costs less than stopping.',
    errFa: 'هول شدن پس از یک خطا. ادامه دهید؛ یک لغزش از توقف ارزان‌تر است.',
  },
};
