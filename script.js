/* =========================================
   MockedAI — Interview Simulator
   script.js
   ========================================= */

'use strict';

// ── DATA ──────────────────────────────────────────────────────────────────────

const QUESTIONS = {
  dsa: [
    {
      text: "Given an array of integers, return indices of the two numbers that add up to a specific target. You may assume each input would have exactly one solution, and you may not use the same element twice.",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Map", "Two Pointers"]
    },
    {
      text: "Given a string s, find the length of the longest substring without repeating characters. Explain your approach and the time/space complexity of your solution.",
      difficulty: "Medium",
      tags: ["Sliding Window", "String", "Hash Set"]
    },
    {
      text: "Given a binary tree, return the level-order traversal of its nodes' values (i.e., from left to right, level by level). What data structure would you use and why?",
      difficulty: "Medium",
      tags: ["BFS", "Tree", "Queue"]
    },
    {
      text: "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount. If it's impossible, return -1.",
      difficulty: "Medium",
      tags: ["Dynamic Programming", "Memoization", "Greedy"]
    },
    {
      text: "Given a linked list, detect if it has a cycle in it. Can you do it in O(1) extra space? Explain the Floyd's Tortoise and Hare algorithm.",
      difficulty: "Easy",
      tags: ["Linked List", "Two Pointers", "Floyd's Algorithm"]
    }
  ],
  frontend: [
    {
      text: "Explain the difference between == and === in JavaScript. When would you use one over the other, and what are the type coercion rules JavaScript applies?",
      difficulty: "Easy",
      tags: ["JavaScript", "Type System", "Fundamentals"]
    },
    {
      text: "What is the CSS Box Model? Explain the difference between content-box and border-box box-sizing. Write the CSS to make a div exactly 200px wide including its padding and border.",
      difficulty: "Easy",
      tags: ["CSS", "Box Model", "Layout"]
    },
    {
      text: "Implement a debounce function in JavaScript. Explain where you'd use it in a real app, and what the difference between debounce and throttle is.",
      difficulty: "Medium",
      tags: ["JavaScript", "Performance", "Closures"]
    },
    {
      text: "Explain the JavaScript event loop. What is the difference between the call stack, the task queue, and the microtask queue? In what order do Promise callbacks execute vs setTimeout?",
      difficulty: "Hard",
      tags: ["Event Loop", "Async", "Promises"]
    },
    {
      text: "What are CSS custom properties (variables) and how do they differ from preprocessor variables like SASS/LESS? Write an example implementing a dark/light theme toggle.",
      difficulty: "Medium",
      tags: ["CSS", "Variables", "Theming"]
    }
  ],
  system: [
    {
      text: "Design a URL shortener like bit.ly. What are the core components? How would you handle 100 million URL shortenings per day? Discuss your choice of database.",
      difficulty: "Medium",
      tags: ["System Design", "Database", "Hashing", "Scale"]
    },
    {
      text: "Design a rate limiter for an API. Explain at least two algorithms you could use (e.g., sliding window, token bucket). How would you make it work across multiple servers?",
      difficulty: "Medium",
      tags: ["Rate Limiting", "Distributed Systems", "Redis"]
    },
    {
      text: "Design a notification system (push, email, SMS) that can send 10 million notifications per day. How do you handle delivery failures, retries, and user preferences?",
      difficulty: "Hard",
      tags: ["Queues", "Microservices", "Reliability"]
    },
    {
      text: "Design a key-value store like Redis. What data structures would you use internally? How would you handle expiration, persistence, and high availability?",
      difficulty: "Hard",
      tags: ["Storage", "Data Structures", "Consistency"]
    },
    {
      text: "Design a simple content delivery network (CDN). How do you determine which edge server to route traffic to? How does cache invalidation work?",
      difficulty: "Medium",
      tags: ["CDN", "Caching", "DNS", "Geo-routing"]
    }
  ]
};

const SARCASTIC_MSGS = {
  idle: [
    "Take your time... I have nowhere to be.",
    "No pressure. Except, you know, your career.",
    "I'm sure you know this one.",
    "Interesting choice — staring at the screen.",
    "The cursor is blinking. So is your future.",
  ],
  slow: [
    "Hmm… took you long enough.",
    "Did you Google that in your head?",
    "I've seen glaciers move faster. Impressive.",
    "Were you… thinking? Bold strategy.",
    "My grandma codes faster. She's deceased.",
  ],
  typing: [
    "Oh, you're actually typing. Respect.",
    "Look at those fingers go. Suspicious.",
    "Something's happening. Maybe.",
    "Are you guessing or thinking?",
    "Confidence is key. You have neither, but still.",
  ],
  empty: [
    "The answer is definitely not nothing.",
    "Blank answers are for people who also fold under pressure. Are you one?",
    "Fascinating. A completely empty response. Original.",
    "This is either Zen or panic. I suspect panic.",
  ],
  submitted: [
    "Interesting… but also wrong.",
    "Bold. Very bold. Inaccurate, but bold.",
    "Sure. Let's go with that.",
    "I've seen worse. Not often.",
    "We'll revisit this in the debrief.",
  ]
};

const FEEDBACK_POOL = {
  positive: [
    "Good approach and solid problem decomposition.",
    "Clean reasoning — your solution scales reasonably.",
    "Identified the key constraint correctly.",
    "The core logic is sound, if a bit verbose.",
    "Good instinct on the data structure choice.",
  ],
  neutral: [
    "The approach works, but there are edge cases you haven't addressed.",
    "Time complexity could be improved with a different data structure.",
    "This solves the happy path. Real interviews have unhappy paths.",
    "Acceptable solution. Not memorable, but not a disaster.",
    "You've solved part of the problem. The harder part is still unsolved.",
  ],
  negative: [
    "This solution would fail on an empty input — a classic oversight.",
    "O(n²) is… a choice. Not always the best one.",
    "The logic breaks when you consider null or undefined edge cases.",
    "Missing error handling, which would get flagged immediately.",
    "The interviewer would ask a follow-up and this would unravel.",
  ]
};

const VERDICTS = {
  high: [
    "Hire this person immediately",
    "Suspiciously competent",
    "Actually impressive",
    "Did you cheat? We can't tell.",
  ],
  mid: [
    "You survived… barely",
    "Technically passing",
    "B+ energy, C+ execution",
    "Could be worse. Has been.",
  ],
  low: [
    "Google might ghost you",
    "Back to LeetCode, champ",
    "Maybe try UI design",
    "The bar was underground. You found it.",
  ]
};

const CLOSING_MSGS = {
  high: [
    '"Honestly? Not bad. We\'ll be in touch. No promises."',
    '"You surprised me. I don\'t like being surprised."',
    '"Strong performance. Don\'t let it go to your head."',
  ],
  mid: [
    '"Interesting performance. We\'ll be in touch. Or not."',
    '"You got some things right. Some things... not so much."',
    '"You held it together. Mostly. Good enough? We\'ll see."',
  ],
  low: [
    '"We appreciate your time. We really do. We just appreciate other candidates more."',
    '"The bar is high. You... were not above it."',
    '"Bold performance. Very bold. We\'ll send an email."',
  ]
};

// ── STATE ─────────────────────────────────────────────────────────────────────

const state = {
  currentScreen: 'intro',
  selectedRole: null,
  questions: [],
  currentQuestionIndex: 0,
  timerInterval: null,
  timerSeconds: 90,
  timerMax: 90,
  typingTimeout: null,
  typedChars: 0,
  keystrokeCount: 0,
  totalScore: 0,
  perQScores: [],
  timeStarted: null,
  sounds: {}
};

// ── DOM REFS ──────────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);
const screens = {
  intro: $('screen-intro'),
  role: $('screen-role'),
  countdown: $('screen-countdown'),
  question: $('screen-question'),
  evaluating: $('screen-evaluating'),
  feedback: $('screen-feedback'),
  results: $('screen-results')
};

// ── SCREEN TRANSITIONS ────────────────────────────────────────────────────────

function goTo(screenId, delay = 0) {
  setTimeout(() => {
    const current = document.querySelector('.screen.active');
    if (current) {
      current.classList.remove('active');
      current.classList.add('exit');
      setTimeout(() => current.classList.remove('exit'), 500);
    }
    const next = screens[screenId];
    if (next) {
      next.classList.add('active');
      state.currentScreen = screenId;
    }
  }, delay);
}

// ── UTILS ─────────────────────────────────────────────────────────────────────

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── SOUND ENGINE (Web Audio API) ──────────────────────────────────────────────

let audioCtx = null;

function getAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  return audioCtx;
}

function playClick() {
  const ctx = getAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 800;
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
}

function playTick() {
  const ctx = getAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 440;
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
}

function playBuzz() {
  const ctx = getAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.value = 120;
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

function playSuccess() {
  const ctx = getAudio();
  if (!ctx) return;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.start(t);
    osc.stop(t + 0.25);
  });
}

// ── TIMER ─────────────────────────────────────────────────────────────────────

function startTimer(seconds, onTick, onEnd) {
  state.timerSeconds = seconds;
  state.timerMax = seconds;
  updateTimerUI(seconds, seconds);

  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerUI(state.timerSeconds, state.timerMax);

    if (state.timerSeconds <= 10) playTick();
    if (onTick) onTick(state.timerSeconds);

    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      if (onEnd) onEnd();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
}

function updateTimerUI(current, max) {
  const timerText = $('timerText');
  const timerProgress = $('timerProgress');
  const circumference = 150.8;

  const fraction = current / max;
  const offset = circumference * (1 - fraction);

  timerProgress.style.strokeDashoffset = offset;
  timerText.textContent = current;

  const bgPulse = $('bgPulse');

  if (current <= 10) {
    timerProgress.classList.add('danger');
    timerText.classList.add('danger');
    bgPulse.classList.add('active');
    if (current % 2 === 0) triggerShake();
  } else if (current <= 25) {
    timerProgress.classList.add('warning');
    timerProgress.classList.remove('danger');
    timerText.classList.remove('danger');
    bgPulse.classList.remove('active');
  } else {
    timerProgress.classList.remove('warning', 'danger');
    timerText.classList.remove('danger');
    bgPulse.classList.remove('active');
  }
}

function triggerShake() {
  const layout = document.querySelector('.question-layout');
  if (!layout) return;
  layout.classList.remove('shake');
  void layout.offsetWidth;
  layout.classList.add('shake');
  setTimeout(() => layout.classList.remove('shake'), 600);
}

// ── INTRO SCREEN ──────────────────────────────────────────────────────────────

$('btnStart').addEventListener('click', () => {
  getAudio(); // unlock audio context
  playClick();
  goTo('role');
});

// ── ROLE SELECT ───────────────────────────────────────────────────────────────

document.querySelectorAll('.role-card').forEach(card => {
  card.addEventListener('click', () => {
    playClick();
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.selectedRole = card.dataset.role;

    setTimeout(() => {
      state.questions = shuffle(QUESTIONS[state.selectedRole]).slice(0, 5);
      state.currentQuestionIndex = 0;
      state.perQScores = [];
      state.totalScore = 0;
      goTo('countdown');
      runCountdown();
    }, 400);
  });
});

// ── COUNTDOWN ─────────────────────────────────────────────────────────────────

const countdownSubs = [
  "Breathe. Or don't.",
  "Remember everything. Forget nothing.",
  "It's just a simulation. Mostly.",
  "Go."
];

function runCountdown() {
  let count = 3;
  $('countdownNum').textContent = count;
  $('countdownSub').textContent = countdownSubs[0];

  playTick();

  const interval = setInterval(() => {
    count--;
    const el = $('countdownNum');
    el.style.transform = 'scale(1.3)';
    el.style.opacity = '0.5';
    setTimeout(() => {
      el.textContent = count === 0 ? '!' : count;
      el.style.transform = 'scale(1)';
      el.style.opacity = '1';
      $('countdownSub').textContent = countdownSubs[3 - count] || 'Go.';
    }, 150);

    playTick();

    if (count <= 0) {
      clearInterval(interval);
      setTimeout(() => startQuestion(), 500);
    }
  }, 900);
}

// ── QUESTION SCREEN ───────────────────────────────────────────────────────────

function startQuestion() {
  const q = state.questions[state.currentQuestionIndex];
  const roleLabel = { dsa: 'DSA', frontend: 'Frontend', system: 'System Design' }[state.selectedRole];

  $('qLabel').textContent = `Q${state.currentQuestionIndex + 1} / ${state.questions.length}`;
  $('qRoleBadge').textContent = roleLabel;
  $('qDifficulty').textContent = q.difficulty;
  $('questionText').textContent = q.text;

  const tagsEl = $('questionTags');
  tagsEl.innerHTML = q.tags.map(t => `<span class="q-tag">${t}</span>`).join('');

  $('answerInput').value = '';
  $('charCount').textContent = '0 chars';
  $('typingIndicator').classList.remove('visible');
  $('interviewerMsg').textContent = rand(SARCASTIC_MSGS.idle);

  // Reset timer styles
  $('timerProgress').classList.remove('warning', 'danger');
  $('timerText').classList.remove('danger');
  $('bgPulse').classList.remove('active');

  state.keystrokeCount = 0;
  state.timeStarted = Date.now();

  goTo('question');

  let idleMsgShown = false;
  let typingMsgShown = false;

  startTimer(90,
    (remaining) => {
      // Change message based on time
      if (remaining === 70 && !idleMsgShown) {
        idleMsgShown = true;
        if ($('answerInput').value.trim().length < 10) {
          setInterviewerMsg(rand(SARCASTIC_MSGS.idle));
        }
      }
      if (remaining === 45 && !typingMsgShown) {
        typingMsgShown = true;
        const hasText = $('answerInput').value.trim().length > 0;
        setInterviewerMsg(hasText ? rand(SARCASTIC_MSGS.typing) : rand(SARCASTIC_MSGS.idle));
      }
      if (remaining === 20) {
        setInterviewerMsg(rand(SARCASTIC_MSGS.slow));
      }
      if (remaining === 10) {
        playBuzz();
      }
    },
    () => {
      // Time up — auto submit
      setInterviewerMsg("Time's up. Bold silence strategy. Let's see how that worked out.");
      setTimeout(() => autoSubmit(), 800);
    }
  );
}

function setInterviewerMsg(msg) {
  const el = $('interviewerMsg');
  el.style.opacity = '0';
  el.style.transform = 'translateY(4px)';
  setTimeout(() => {
    el.textContent = msg;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 200);
}

// Answer input events
$('answerInput').addEventListener('input', (e) => {
  const val = e.target.value;
  $('charCount').textContent = `${val.length} chars`;
  state.keystrokeCount++;
  $('typingIndicator').classList.add('visible');
  playClick();

  clearTimeout(state.typingTimeout);
  state.typingTimeout = setTimeout(() => {
    $('typingIndicator').classList.remove('visible');
  }, 1200);
});

$('btnSubmit').addEventListener('click', () => {
  const answer = $('answerInput').value.trim();
  if (answer.length === 0) {
    setInterviewerMsg(rand(SARCASTIC_MSGS.empty));
    triggerShake();
    playBuzz();
    return;
  }
  submitAnswer();
});

function autoSubmit() {
  stopTimer();
  goToEvaluation();
}

function submitAnswer() {
  stopTimer();
  setInterviewerMsg(rand(SARCASTIC_MSGS.submitted));
  playClick();

  setTimeout(() => goToEvaluation(), 600);
}

// ── EVALUATION ────────────────────────────────────────────────────────────────

const evalMessages = [
  ["Analyzing your answer...", "Looking for things to criticize."],
  ["Running syntax check...", "Judging your whitespace choices."],
  ["Consulting 47 senior engineers...", "They all disagree."],
  ["Comparing to ideal solution...", "The gap is... noted."],
  ["Calculating vibe score...", "Vibes are essential to our process."],
];

function goToEvaluation() {
  const msgPair = rand(evalMessages);
  $('evalTitle').textContent = msgPair[0];
  $('evalSub').textContent = msgPair[1];
  goTo('evaluating');

  setTimeout(() => showFeedback(), randInt(1800, 2800));
}

// ── FEEDBACK ──────────────────────────────────────────────────────────────────

function showFeedback() {
  const timeTaken = Math.round((Date.now() - state.timeStarted) / 1000);
  const answer = $('answerInput').value.trim();
  const charLen = answer.length;

  // Fake scoring
  const speedScore = Math.max(10, Math.min(100, Math.round(100 - (timeTaken / 90) * 60 + randInt(-10, 15))));
  const confScore = Math.max(10, Math.min(100, Math.round((charLen / 3) + state.keystrokeCount * 0.5 + randInt(-10, 20))));
  const vibeScore = randInt(35, 95);
  const totalQ = Math.round((speedScore * 0.3 + confScore * 0.4 + vibeScore * 0.3));

  state.perQScores.push({ speed: speedScore, conf: confScore, vibe: vibeScore, total: totalQ });

  // Feedback lines
  const posLine = rand(FEEDBACK_POOL.positive);
  const neuLine = rand(FEEDBACK_POOL.neutral);
  const negLine = rand(FEEDBACK_POOL.negative);

  const verdict = totalQ >= 70
    ? rand(["Solid attempt.", "Decent approach.", "Reasonable effort."])
    : totalQ >= 45
      ? rand(["Not bad. Not good either.", "Acceptable. Barely.", "Room for improvement."])
      : rand(["This needs work.", "Let's call it a draft.", "Intriguing attempt."]);

  $('fbQLabel').textContent = `Q${state.currentQuestionIndex + 1} of ${state.questions.length}`;
  $('fbScoreBadge').textContent = totalQ;
  $('fbVerdictText').textContent = verdict;
  $('fbText1').textContent = posLine;
  $('fbText2').textContent = neuLine;
  $('fbText3').textContent = negLine;

  const isLast = state.currentQuestionIndex >= state.questions.length - 1;
  $('btnNextText').textContent = isLast ? 'See Results' : 'Next Question';

  goTo('feedback');

  // Animate bars after transition
  setTimeout(() => {
    animateBar('speedBar', 'speedVal', speedScore);
    animateBar('confBar', 'confVal', confScore);
    animateBar('vibeBar', 'vibeVal', vibeScore);
    playSuccess();
  }, 300);
}

function animateBar(barId, valId, value) {
  const bar = $(barId);
  const val = $(valId);
  bar.style.width = value + '%';
  val.textContent = value;
}

$('btnNext').addEventListener('click', () => {
  playClick();
  state.currentQuestionIndex++;

  if (state.currentQuestionIndex >= state.questions.length) {
    showResults();
  } else {
    goTo('countdown');
    runCountdown();
  }
});

// ── RESULTS ───────────────────────────────────────────────────────────────────

function showResults() {
  const scores = state.perQScores;
  const avg = arr => Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);

  const avgSpeed = avg(scores.map(s => s.speed));
  const avgConf = avg(scores.map(s => s.conf));
  const avgVibe = avg(scores.map(s => s.vibe));
  const avgTotal = avg(scores.map(s => s.total));

  $('totalScoreNum').textContent = avgTotal;

  let tier, verdictList, closingList;
  if (avgTotal >= 70) {
    tier = 'high';
    verdictList = VERDICTS.high;
    closingList = CLOSING_MSGS.high;
  } else if (avgTotal >= 45) {
    tier = 'mid';
    verdictList = VERDICTS.mid;
    closingList = CLOSING_MSGS.mid;
  } else {
    tier = 'low';
    verdictList = VERDICTS.low;
    closingList = CLOSING_MSGS.low;
  }

  $('finalVerdictBadge').textContent = rand(verdictList);
  $('closingMsg').textContent = rand(closingList);

  goTo('results');

  setTimeout(() => {
    animateBreakdownBar('resSpeedBar', 'resSpeedVal', avgSpeed);
    animateBreakdownBar('resConfBar', 'resConfVal', avgConf);
    animateBreakdownBar('resVibeBar', 'resVibeVal', avgVibe);
    animateBreakdownBar('resOverallBar', 'resOverallVal', avgTotal);
    playSuccess();
  }, 400);
}

function animateBreakdownBar(barId, valId, value) {
  const bar = $(barId);
  const val = $(valId);
  bar.style.width = value + '%';
  val.textContent = value;
}

// ── RESTART ───────────────────────────────────────────────────────────────────

$('btnRetry').addEventListener('click', () => {
  playClick();
  $('bgPulse').classList.remove('active');
  stopTimer();
  state.selectedRole = null;
  state.currentQuestionIndex = 0;
  state.perQScores = [];
  state.totalScore = 0;
  state.keystrokeCount = 0;

  // Reset role card selection
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));

  // Reset breakdown bars
  ['resSpeedBar','resConfBar','resVibeBar','resOverallBar'].forEach(id => {
    const el = $(id);
    if (el) el.style.width = '0';
  });

  goTo('role');
});

$('btnShare').addEventListener('click', () => {
  playClick();
  const score = $('totalScoreNum').textContent;
  const verdict = $('finalVerdictBadge').textContent;
  const text = `I just got ${score}/100 on MockedAI's fake interview simulator. Verdict: "${verdict}". Try it yourself!`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = $('btnShare');
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    });
  } else {
    alert(text);
  }
});

// ── EASTER EGG: Konami Code ───────────────────────────────────────────────────

const KONAMI = [38,38,40,40,37,39,37,39,66,65];
let konamiIndex = 0;
document.addEventListener('keydown', e => {
  if (e.keyCode === KONAMI[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === KONAMI.length) {
      konamiIndex = 0;
      document.title = '🎮 Cheat activated — still unemployed';
      setInterviewerMsg("I saw that. The Konami code won't help your O(n²) solution.");
      playSuccess();
    }
  } else {
    konamiIndex = 0;
  }
});

// ── INIT ──────────────────────────────────────────────────────────────────────

(function init() {
  // Stagger intro text animation
  const headline = document.querySelector('.headline');
  const subline = document.querySelector('.subline');
  const btnStart = $('btnStart');
  const disclaimer = document.querySelector('.disclaimer');

  [headline, subline, btnStart, disclaimer].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      el.style.opacity = '';
      el.style.transform = '';
    }, 300 + i * 120);
  });
})();
