// --- STATE MANAGEMENT ---
let activeVocabulary = []; // Dynamic vocabulary list (default + custom)

let appState = {
  currentScreen: 'home',
  selectedLevel: 'ALL',
  selectedCategory: 'ALL',
  
  // Flashcard session state
  flashcards: [],
  currentFlashcardIndex: 0,
  isCardFlipped: false,

  // Quiz session state
  quizWords: [],
  quizQuestions: [],
  currentQuestionIndex: 0,
  quizCorrectAnswers: 0,
  isAnswerChecked: false,
  wrongAnswersList: [], // Track words missed in the current quiz
  
  // User Stats (synced with localStorage)
  stats: {
    streak: 0,
    lastActiveDate: null,
    masteredWords: [], // List of word IDs marked as mastered
    totalCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
    points: 0, // Initial point balance
    inventory: {
      bubble_tea: 0,
      rice_paper: 0,
      takoyaki: 0,
      ramen: 0,
      ice_cream: 0
    },
    freeGames: 0
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  updateVocabularySource();
  initStats();
  initTheme();
  createCherryBlossoms();
  renderCategories();
  setupEventListeners();
  updateStatsUI();
  checkCustomLevelVisibility();
  renderCustomVocabList();
  
  // Select default filters
  selectLevel('ALL');
  selectCategory('ALL');
});

// --- THEME SWITCHER ---
function initTheme() {
  const isLight = localStorage.getItem('theme-light') === 'true';
  if (isLight) {
    document.body.classList.add('light-mode');
    document.getElementById('theme-sun').style.display = 'none';
    document.getElementById('theme-moon').style.display = 'block';
  } else {
    document.body.classList.remove('light-mode');
    document.getElementById('theme-sun').style.display = 'block';
    document.getElementById('theme-moon').style.display = 'none';
  }
}

function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-mode');
  localStorage.setItem('theme-light', isLight);
  
  const sunIcon = document.getElementById('theme-sun');
  const moonIcon = document.getElementById('theme-moon');
  
  if (isLight) {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

// --- LOCAL STORAGE & STATS ---
function initStats() {
  const storedStats = localStorage.getItem('sakura_quiz_stats');
  if (storedStats) {
    try {
      appState.stats = JSON.parse(storedStats);
      // Safeguard for new fields
      if (appState.stats.points === undefined) appState.stats.points = 0;
      if (appState.stats.freeGames === undefined) appState.stats.freeGames = 0;
      if (!appState.stats.inventory) {
        appState.stats.inventory = {
          bubble_tea: 0,
          rice_paper: 0,
          takoyaki: 0,
          ramen: 0,
          ice_cream: 0
        };
      }
    } catch (e) {
      console.error('Error parsing stats, resetting...', e);
    }
  }
  updateStreak();
}

function saveStats() {
  localStorage.setItem('sakura_quiz_stats', JSON.stringify(appState.stats));
}

function updateStreak() {
  const todayStr = new Date().toDateString();
  const lastActive = appState.stats.lastActiveDate;
  
  if (!lastActive) {
    appState.stats.streak = 1;
  } else {
    const lastDate = new Date(lastActive);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate.toDateString() === todayStr) {
      // Already active today, maintain streak
    } else if (lastDate.toDateString() === yesterday.toDateString()) {
      // Active yesterday, increment streak
      appState.stats.streak += 1;
    } else {
      // Gap in activity, reset streak
      appState.stats.streak = 1;
    }
  }
  
  appState.stats.lastActiveDate = todayStr;
  saveStats();
}

function updateStatsUI() {
  document.getElementById('stat-streak').textContent = appState.stats.streak;
  document.getElementById('stat-words-learned').textContent = appState.stats.masteredWords.length;
  
  const total = appState.stats.totalQuestionsAnswered;
  const correct = appState.stats.totalCorrectAnswers;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  document.getElementById('stat-accuracy').textContent = `${accuracy}%`;
  
  const pointsEl = document.getElementById('rewards-points-balance');
  if (pointsEl) {
    pointsEl.textContent = appState.stats.points;
  }
}

// --- CHERRY BLOSSOM ANIMATION ---
function createCherryBlossoms() {
  const container = document.getElementById('cherry-blossoms');
  const petalCount = 25;
  
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Randomize initial positions, sizes and animation settings
    const size = Math.random() * 8 + 6; // 6px - 14px
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.2}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    
    const delay = Math.random() * 10;
    const duration = Math.random() * 8 + 8; // 8s - 16s
    petal.style.animationDelay = `${-delay}s`; // Start immediately at random progress
    petal.style.animationDuration = `${duration}s`;
    
    container.appendChild(petal);
  }
}

// --- RENDER DYNAMIC DOM ELEMENTS ---
function renderCategories() {
  const categories = ['ALL', ...new Set(activeVocabulary.map(w => w.category))];
  const listContainer = document.getElementById('category-list');
  listContainer.innerHTML = '';
  
  categories.forEach(cat => {
    const count = cat === 'ALL' 
      ? activeVocabulary.length 
      : activeVocabulary.filter(w => w.category === cat).length;
      
    const card = document.createElement('div');
    card.className = `select-card ${cat === 'ALL' ? 'selected' : ''}`;
    card.setAttribute('data-category', cat);
    card.innerHTML = `
      <div class="card-title">${cat === 'ALL' ? 'Tất cả chủ đề' : cat}</div>
      <div class="card-desc">${count} từ vựng</div>
    `;
    
    card.addEventListener('click', () => selectCategory(cat));
    listContainer.appendChild(card);
  });
}

function selectLevel(level) {
  appState.selectedLevel = level;
  document.querySelectorAll('[data-level]').forEach(el => {
    if (el.getAttribute('data-level') === level) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });
}

function selectCategory(category) {
  appState.selectedCategory = category;
  document.querySelectorAll('[data-category]').forEach(el => {
    if (el.getAttribute('data-category') === category) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });
}

// --- SCREEN ROUTING ---
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  // Show target screen
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add('active');
    appState.currentScreen = screenId;
    
    // Screen-specific loading logic
    if (screenId === 'home') {
      updateStatsUI();
    } else if (screenId === 'dictionary') {
      renderDictionary();
    } else if (screenId === 'manage-custom') {
      renderDashboard();
    } else if (screenId === 'rewards') {
      initRewardsScreen();
    }
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- TEXT TO SPEECH (TTS) ---
function speakJapanese(text) {
  if (!text) return;
  
  // Clean text for natural Japanese speech
  // 1. If it contains a slash, take the reading (usually the first part)
  // 2. Remove parenthetical descriptions e.g. (ひがし)
  let cleanText = text.split('/')[0].trim();
  cleanText = cleanText.replace(/\(.*?\)/g, '').replace(/（.*?）/g, '').trim();
  
  if (!cleanText) cleanText = text;

  if ('speechSynthesis' in window) {
    // Cancel any active speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85; // Slightly slower for language learning clarity
    
    // Attempt to locate a Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(voice => voice.lang.includes('ja-JP'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
}

// Ensure voices are loaded (Chrome/Safari async issue)
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

// --- FLASHCARD MODULE ---
function startFlashcards() {
  // Filter vocabulary
  let filtered = activeVocabulary;
  if (appState.selectedLevel !== 'ALL') {
    filtered = filtered.filter(w => w.level === appState.selectedLevel);
  }
  if (appState.selectedCategory !== 'ALL') {
    filtered = filtered.filter(w => w.category === appState.selectedCategory);
  }
  
  if (filtered.length === 0) {
    alert('Không tìm thấy từ vựng nào phù hợp với bộ lọc đã chọn.');
    return;
  }
  
  appState.flashcards = [...filtered];
  appState.currentFlashcardIndex = 0;
  appState.isCardFlipped = false;
  
  showScreen('flashcard');
  renderFlashcard();
}

function renderFlashcard() {
  const word = appState.flashcards[appState.currentFlashcardIndex];
  if (!word) return;
  
  // Reset card state (unflipped)
  const card = document.getElementById('active-flashcard');
  card.classList.remove('flipped');
  appState.isCardFlipped = false;
  
  // Populate Card Front
  document.getElementById('fc-kanji').textContent = word.kanji;
  document.getElementById('fc-kana').textContent = word.kana;
  
  const romajiEl = document.getElementById('fc-romaji');
  if (word.romaji) {
    romajiEl.textContent = word.romaji;
    romajiEl.style.display = 'block';
  } else {
    romajiEl.style.display = 'none';
  }
  document.getElementById('fc-badge-level').textContent = word.level;
  document.getElementById('fc-badge-cat').textContent = word.category;
  
  // Populate Card Back
  document.getElementById('fc-meaning').textContent = word.vietnamese;
  document.getElementById('fc-back-level').textContent = word.level;
  
  // Example sentence setup
  if (word.example) {
    document.getElementById('fc-example-box').style.display = 'block';
    document.getElementById('fc-example-jp').textContent = word.example;
    document.getElementById('fc-example-vn').textContent = word.example_meaning;
  } else {
    document.getElementById('fc-example-box').style.display = 'none';
  }
  
  // Progress text
  document.getElementById('fc-current-idx').textContent = appState.currentFlashcardIndex + 1;
  document.getElementById('fc-total-count').textContent = appState.flashcards.length;
  
  // Update mastered button state
  const isMastered = appState.stats.masteredWords.includes(word.id);
  const masteredBtn = document.getElementById('btn-fc-mastered');
  if (isMastered) {
    masteredBtn.classList.remove('btn-primary');
    masteredBtn.classList.add('btn-secondary');
    masteredBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Đã thuộc (Bỏ đánh dấu)
    `;
  } else {
    masteredBtn.classList.remove('btn-secondary');
    masteredBtn.classList.add('btn-primary');
    masteredBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Đã thuộc từ này
    `;
  }
}

function flipFlashcard() {
  const card = document.getElementById('active-flashcard');
  appState.isCardFlipped = !appState.isCardFlipped;
  card.classList.toggle('flipped', appState.isCardFlipped);
  
  if (appState.isCardFlipped) {
    // Speak automatically on flip (nice micro-interaction)
    const word = appState.flashcards[appState.currentFlashcardIndex];
    speakJapanese(word.kanji || word.kana);
  }
}

function navigateFlashcard(direction) {
  if (direction === 'next') {
    appState.currentFlashcardIndex = (appState.currentFlashcardIndex + 1) % appState.flashcards.length;
  } else {
    appState.currentFlashcardIndex = (appState.currentFlashcardIndex - 1 + appState.flashcards.length) % appState.flashcards.length;
  }
  renderFlashcard();
}

function toggleMasteredWord() {
  const word = appState.flashcards[appState.currentFlashcardIndex];
  if (!word) return;
  
  const index = appState.stats.masteredWords.indexOf(word.id);
  if (index > -1) {
    appState.stats.masteredWords.splice(index, 1);
  } else {
    appState.stats.masteredWords.push(word.id);
    appState.stats.points += 5; // Award 5 points
  }
  saveStats();
  renderFlashcard();
  updateStatsUI();
}

// --- QUIZ GAME ENGINE ---
function startQuiz(wordsList = null) {
  let sourceWords = [];
  
  if (wordsList) {
    // Review session for specific words (e.g. wrong answers)
    sourceWords = wordsList;
  } else {
    // Normal session: filter matching words
    let filtered = activeVocabulary;
    if (appState.selectedLevel !== 'ALL') {
      filtered = filtered.filter(w => w.level === appState.selectedLevel);
    }
    if (appState.selectedCategory !== 'ALL') {
      filtered = filtered.filter(w => w.category === appState.selectedCategory);
    }
    sourceWords = filtered;
  }
  
  if (sourceWords.length === 0) {
    alert('Không tìm thấy từ vựng nào để tạo Quiz.');
    return;
  }
  
  // Select up to 10 questions randomly
  appState.quizWords = shuffleArray([...sourceWords]).slice(0, 10);
  appState.quizQuestions = appState.quizWords.map(word => generateQuestion(word));
  appState.currentQuestionIndex = 0;
  appState.quizCorrectAnswers = 0;
  appState.isAnswerChecked = false;
  appState.wrongAnswersList = [];
  
  showScreen('quiz');
  renderQuizQuestion();
}

/**
 * Generate a multiple-choice question object for a target word.
 */
function generateQuestion(word) {
  // Question Types:
  // 0: Kanji/Kana -> Choose Vietnamese meaning
  // 1: Vietnamese meaning -> Choose Japanese (Kanji/Kana)
  // 2: Kana (Reading) -> Choose Kanji
  let qType = Math.floor(Math.random() * 3);
  
  // Fallback to type 0/1 if the word has no Kanji
  if (qType === 2 && word.kanji === word.kana) {
    qType = Math.floor(Math.random() * 2);
  }
  
  let qText = '';
  let qReadingHint = '';
  let qHint = '';
  let isLatinText = false;
  let correctOption = '';
  
  switch(qType) {
    case 0:
      qText = word.kanji;
      qReadingHint = word.kanji !== word.kana ? word.kana : '';
      qHint = 'Chọn Nghĩa Tiếng Việt chính xác:';
      correctOption = word.vietnamese;
      break;
    case 1:
      qText = word.vietnamese;
      qHint = 'Chọn từ Tiếng Nhật tương ứng:';
      isLatinText = true;
      correctOption = word.kanji + (word.kanji !== word.kana ? ` (${word.kana})` : '');
      break;
    case 2:
      qText = word.kana;
      qHint = 'Chọn chữ Hán (Kanji) tương ứng:';
      correctOption = word.kanji;
      break;
  }
  
  // Generate distractors (wrong options)
  const distractors = [];
  const allPotentialDistractors = activeVocabulary.filter(w => w.id !== word.id);
  const shuffledDistractors = shuffleArray(allPotentialDistractors);
  
  for (let dWord of shuffledDistractors) {
    let optionText = '';
    
    switch(qType) {
      case 0:
        optionText = dWord.vietnamese;
        break;
      case 1:
        optionText = dWord.kanji + (dWord.kanji !== dWord.kana ? ` (${dWord.kana})` : '');
        break;
      case 2:
        optionText = dWord.kanji;
        break;
    }
    
    if (optionText && optionText !== correctOption && !distractors.includes(optionText)) {
      distractors.push(optionText);
    }
    
    if (distractors.length >= 3) break;
  }
  
  // Fallbacks if not enough unique distractors are found
  while (distractors.length < 3) {
    distractors.push('Không có phương án phù hợp');
  }
  
  // Combine correct answer and distractors, then shuffle
  const options = shuffleArray([correctOption, ...distractors]);
  const correctIdx = options.indexOf(correctOption);
  
  return {
    word: word,
    type: qType,
    text: qText,
    readingHint: qReadingHint,
    hint: qHint,
    isLatinText: isLatinText,
    options: options,
    correctIndex: correctIdx
  };
}

function renderQuizQuestion() {
  const q = appState.quizQuestions[appState.currentQuestionIndex];
  if (!q) return;
  
  appState.isAnswerChecked = false;
  
  // Setup HTML elements
  const qTextEl = document.getElementById('quiz-q-text');
  qTextEl.textContent = q.text;
  if (q.isLatinText) {
    qTextEl.classList.add('latin');
  } else {
    qTextEl.classList.remove('latin');
  }
  
  document.getElementById('quiz-q-hint').textContent = q.hint;
  document.getElementById('quiz-q-reading-hint').textContent = q.readingHint;
  
  // Update level and category badges
  const levelBadge = document.getElementById('quiz-badge-level');
  const catBadge = document.getElementById('quiz-badge-cat');
  if (levelBadge) {
    levelBadge.textContent = q.word.level || 'Custom';
  }
  if (catBadge) {
    catBadge.textContent = `Chủ đề: ${q.word.category || 'Chưa phân mục'}`;
  }
  
  // Speak word if Japanese is the question prompt
  if (q.type === 0 || q.type === 2) {
    speakJapanese(q.text);
  }
  
  // Render choices
  const choicesGrid = document.getElementById('quiz-choices');
  choicesGrid.innerHTML = '';
  
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `
      <span class="choice-text">${opt}</span>
      <span class="choice-shortcut">${idx + 1}</span>
    `;
    btn.addEventListener('click', () => checkQuizAnswer(idx));
    choicesGrid.appendChild(btn);
  });
  
  // Update footer and progress
  document.getElementById('btn-quiz-next').style.display = 'none';
  document.getElementById('quiz-progress-text').textContent = `Câu hỏi ${appState.currentQuestionIndex + 1}/${appState.quizQuestions.length}`;
  document.getElementById('quiz-live-correct').textContent = appState.quizCorrectAnswers;
  document.getElementById('quiz-live-total').textContent = appState.currentQuestionIndex;
  
  const percentage = (appState.currentQuestionIndex / appState.quizQuestions.length) * 100;
  document.getElementById('quiz-progress-bar').style.width = `${percentage}%`;
}

function checkQuizAnswer(selectedIdx) {
  if (appState.isAnswerChecked) return;
  
  const q = appState.quizQuestions[appState.currentQuestionIndex];
  const choiceButtons = document.querySelectorAll('#quiz-choices .choice-btn');
  
  appState.isAnswerChecked = true;
  appState.stats.totalQuestionsAnswered += 1;
  
  // Speak the correct Japanese word for feedback
  speakJapanese(q.word.kanji || q.word.kana);
  
  if (selectedIdx === q.correctIndex) {
    // Correct!
    appState.quizCorrectAnswers += 1;
    appState.stats.totalCorrectAnswers += 1;
    appState.stats.points += 10; // Award 10 points
    choiceButtons[selectedIdx].classList.add('correct');
  } else {
    // Incorrect!
    appState.wrongAnswersList.push(q.word);
    choiceButtons[selectedIdx].classList.add('incorrect');
    choiceButtons[q.correctIndex].classList.add('correct'); // Highlight the correct one
  }
  
  // Fade out other choices
  choiceButtons.forEach((btn, idx) => {
    btn.classList.add('disabled');
    if (idx !== selectedIdx && idx !== q.correctIndex) {
      btn.classList.add('fade-out');
    }
  });
  
  saveStats();
  
  // Show next button
  document.getElementById('btn-quiz-next').style.display = 'inline-flex';
}

function advanceQuiz() {
  appState.currentQuestionIndex += 1;
  
  if (appState.currentQuestionIndex >= appState.quizQuestions.length) {
    showQuizResults();
  } else {
    renderQuizQuestion();
  }
}

// --- RESULT SCREEN MODULE ---
function showQuizResults() {
  const total = appState.quizQuestions.length;
  const correct = appState.quizCorrectAnswers;
  const accuracy = Math.round((correct / total) * 100);
  
  // Award completion and rank points
  let earnedPoints = 0;
  if (accuracy >= 60) {
    earnedPoints += 30; // Passed quiz reward
  }
  if (accuracy === 100) {
    earnedPoints += 50; // Perfect S-rank reward
  }
  if (earnedPoints > 0) {
    appState.stats.points += earnedPoints;
  }
  saveStats();
  updateStatsUI();
  
  showScreen('result');
  
  // Stats Display
  document.getElementById('res-total-qs').textContent = total;
  document.getElementById('res-corrects').textContent = correct;
  document.getElementById('res-accuracy').textContent = `${accuracy}%`;
  
  // Determine Grade & Message
  let rank = 'C';
  let title = 'Cố gắng lên nhé!';
  let message = 'Bạn cần ôn luyện thêm một chút nữa. Hãy xem lại danh sách các câu trả lời sai ở dưới nhé.';
  
  if (accuracy === 100) {
    rank = 'S';
    title = 'Hoàn hảo! 満点!';
    message = 'Bạn đạt điểm tối đa! Thật kinh ngạc, hãy tiếp tục học từ mới nhé!';
  } else if (accuracy >= 80) {
    rank = 'A';
    title = 'Rất xuất sắc! 大変良い!';
    message = 'Bạn đã làm chủ phần lớn từ vựng ngày hôm nay. Làm rất tốt!';
  } else if (accuracy >= 60) {
    rank = 'B';
    title = 'Khá tốt! 良い!';
    message = 'Kết quả rất khả quan. Hãy luyện tập thêm để lên hạng A/S nhé.';
  }
  
  const rankBadge = document.getElementById('result-rank');
  rankBadge.textContent = rank;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-message').textContent = message;
  
  // Review List rendering
  const reviewContainer = document.getElementById('res-review-container');
  const reviewList = document.getElementById('res-review-list');
  
  if (appState.wrongAnswersList.length > 0) {
    reviewContainer.style.display = 'block';
    reviewList.innerHTML = '';
    
    appState.wrongAnswersList.forEach(word => {
      const item = document.createElement('div');
      item.className = 'review-item glass-card';
      item.innerHTML = `
        <div class="review-jp-col">
          <span class="review-kanji">${word.kanji}</span>
          <span class="review-kana">${word.kana} (${word.romaji})</span>
        </div>
        <span class="review-meaning">${word.vietnamese}</span>
      `;
      
      // Let user click review items to hear pronunciation
      item.addEventListener('click', () => speakJapanese(word.kanji || word.kana));
      reviewList.appendChild(item);
    });
  } else {
    reviewContainer.style.display = 'none';
  }
}

function retryQuiz() {
  if (appState.wrongAnswersList.length > 0) {
    // Nice feature: retry with words missed!
    if (confirm('Bạn có muốn ôn luyện lại riêng các từ đã trả lời sai không?')) {
      startQuiz(appState.wrongAnswersList);
      return;
    }
  }
  // Otherwise restart full quiz
  startQuiz();
}

// --- DICTIONARY SCREEN MODULE ---
function renderDictionary() {
  const listContainer = document.getElementById('dict-list');
  const searchVal = document.getElementById('dict-search').value.toLowerCase().trim();
  const filterLevel = document.querySelector('.dict-filters .filter-btn.active').getAttribute('data-filter');
  
  // Filter vocabulary list
  let filtered = activeVocabulary.filter(word => {
    // Level check
    if (filterLevel !== 'ALL' && word.level !== filterLevel) {
      return false;
    }
    
    // Search query check
    if (searchVal) {
      const matchKanji = word.kanji.toLowerCase().includes(searchVal);
      const matchKana = word.kana.toLowerCase().includes(searchVal);
      const matchRomaji = word.romaji.toLowerCase().includes(searchVal);
      const matchMeaning = word.vietnamese.toLowerCase().includes(searchVal);
      return matchKanji || matchKana || matchRomaji || matchMeaning;
    }
    
    return true;
  });
  
  listContainer.innerHTML = '';
  
  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <p>Không tìm thấy từ vựng nào khớp với bộ lọc.</p>
      </div>
    `;
    return;
  }
  
  filtered.forEach(word => {
    const card = document.createElement('div');
    card.className = 'glass-card dict-card';
    card.innerHTML = `
      <div class="dict-jp">
        <span class="dict-kanji">${word.kanji}</span>
        <span class="dict-kana">${word.kana}</span>
      </div>
      <div class="dict-info">
        <span class="dict-meaning">${word.vietnamese}</span>
        <div class="dict-tags">
          <span class="dict-tag">${word.level}</span>
          <span class="dict-tag">${word.category}</span>
        </div>
      </div>
    `;
    
    card.addEventListener('click', () => {
      speakJapanese(word.kanji || word.kana);
      
      // Flash card briefly on speak
      card.style.borderColor = 'var(--sakura-pink)';
      setTimeout(() => {
        card.style.borderColor = 'var(--border)';
      }, 300);
    });
    
    listContainer.appendChild(card);
  });
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Navigation Links
  document.getElementById('logo-home').addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('home');
  });
  
  document.getElementById('btn-dictionary').addEventListener('click', () => {
    if (appState.currentScreen === 'dictionary') {
      showScreen('home');
    } else {
      showScreen('dictionary');
    }
  });
  
  document.getElementById('btn-theme-toggle').addEventListener('click', toggleTheme);
  
  // Home Actions
  document.getElementById('btn-start-flashcard').addEventListener('click', startFlashcards);
  document.getElementById('btn-start-quiz').addEventListener('click', () => startQuiz());
  
  // Level selection click handlers
  document.querySelectorAll('[data-level]').forEach(card => {
    card.addEventListener('click', () => {
      selectLevel(card.getAttribute('data-level'));
    });
  });
  
  // Flashcard controls
  document.getElementById('fc-back').addEventListener('click', () => showScreen('home'));
  document.getElementById('active-flashcard').addEventListener('click', flipFlashcard);
  document.getElementById('btn-speak-fc').addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid flipping the card
    const word = appState.flashcards[appState.currentFlashcardIndex];
    speakJapanese(word.kanji || word.kana);
  });
  document.getElementById('btn-fc-prev').addEventListener('click', () => navigateFlashcard('prev'));
  document.getElementById('btn-fc-next').addEventListener('click', () => navigateFlashcard('next'));
  document.getElementById('btn-fc-mastered').addEventListener('click', toggleMasteredWord);
  
  // Quiz controls
  document.getElementById('quiz-back').addEventListener('click', () => {
    if (confirm('Bạn có thực sự muốn thoát Quiz hiện tại? Tiến trình thi sẽ bị hủy.')) {
      showScreen('home');
    }
  });
  document.getElementById('btn-speak-q').addEventListener('click', () => {
    const q = appState.quizQuestions[appState.currentQuestionIndex];
    speakJapanese(q.text);
  });
  document.getElementById('btn-quiz-next').addEventListener('click', advanceQuiz);
  
  // Result screen actions
  document.getElementById('btn-res-home').addEventListener('click', () => showScreen('home'));
  document.getElementById('btn-res-retry').addEventListener('click', retryQuiz);
  
  // Dictionary controls
  document.getElementById('dict-back').addEventListener('click', () => showScreen('home'));
  document.getElementById('dict-search').addEventListener('input', renderDictionary);
  
  document.querySelectorAll('.dict-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dict-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDictionary();
    });
  });

  // Import panel controls
  document.getElementById('btn-import-custom').addEventListener('click', handleImportVocab);
  document.getElementById('btn-clear-custom').addEventListener('click', clearCustomVocab);

  document.getElementById('btn-manage-custom').addEventListener('click', () => {
    if (appState.currentScreen === 'manage-custom') {
      showScreen('home');
    } else {
      showScreen('manage-custom');
    }
  });
  document.getElementById('manage-custom-back').addEventListener('click', () => showScreen('home'));
  document.getElementById('btn-rewards').addEventListener('click', () => {
    if (appState.currentScreen === 'rewards') {
      showScreen('home');
    } else {
      showScreen('rewards');
    }
  });
  document.getElementById('rewards-back').addEventListener('click', () => showScreen('home'));
  document.getElementById('dash-search').addEventListener('input', renderDashboard);
  const rightFilterCat = document.getElementById('right-filter-category');
  if (rightFilterCat) {
    rightFilterCat.addEventListener('change', renderDashboard);
  }
  document.getElementById('btn-dash-clear-all').addEventListener('click', clearCustomVocab);

  const addWordBtn = document.getElementById('btn-dash-add-word');
  if (addWordBtn) addWordBtn.addEventListener('click', () => openVocabModal(''));
  
  const closeVocabModalBtn = document.getElementById('btn-close-vocab-modal');
  if (closeVocabModalBtn) closeVocabModalBtn.addEventListener('click', closeVocabModal);
  
  const cancelVocabModalBtn = document.getElementById('btn-cancel-vocab-modal');
  if (cancelVocabModalBtn) cancelVocabModalBtn.addEventListener('click', closeVocabModal);
  
  const saveVocabBtn = document.getElementById('btn-save-vocab');
  if (saveVocabBtn) saveVocabBtn.addEventListener('click', saveVocab);

  const vocabCategorySelect = document.getElementById('vocab-category-select');
  if (vocabCategorySelect) {
    vocabCategorySelect.addEventListener('change', (e) => {
      if (e.target.value === '__NEW_CAT__') {
        const inputName = prompt('Nhập tên bài học / nhóm mới:');
        if (inputName && inputName.trim()) {
          const newCat = inputName.trim();
          const newOption = document.createElement('option');
          newOption.value = newCat;
          newOption.textContent = newCat;
          newOption.selected = true;
          vocabCategorySelect.insertBefore(newOption, vocabCategorySelect.lastElementChild);
        } else {
          vocabCategorySelect.value = 'Của tôi';
        }
      }
    });
  }

  // Left Column select all listener
  const leftSelectAllCb = document.getElementById('left-select-all-cb');
  if (leftSelectAllCb) {
    leftSelectAllCb.addEventListener('change', (e) => {
      const cbs = document.querySelectorAll('.left-row-checkbox');
      cbs.forEach(cb => cb.checked = e.target.checked);
      updateLeftSelectedCount();
    });
  }
  const leftSelectAllBtn = document.getElementById('btn-left-select-all');
  if (leftSelectAllBtn) {
    leftSelectAllBtn.addEventListener('click', () => {
      const cbs = document.querySelectorAll('.left-row-checkbox');
      if (cbs.length === 0) return;
      const allChecked = Array.from(cbs).every(cb => cb.checked);
      cbs.forEach(cb => cb.checked = !allChecked);
      if (leftSelectAllCb) leftSelectAllCb.checked = !allChecked;
      updateLeftSelectedCount();
    });
  }
  
  // Left Column bulk actions listeners
  const btnLeftBulkMove = document.getElementById('btn-left-bulk-move');
  if (btnLeftBulkMove) btnLeftBulkMove.addEventListener('click', handleLeftBulkMove);
  
  const btnLeftBulkDelete = document.getElementById('btn-left-bulk-delete');
  if (btnLeftBulkDelete) btnLeftBulkDelete.addEventListener('click', handleLeftBulkDelete);

  // Right Column select all listener
  const rightSelectAllCb = document.getElementById('right-select-all-cb');
  if (rightSelectAllCb) {
    rightSelectAllCb.addEventListener('change', (e) => {
      const cbs = document.querySelectorAll('.right-row-checkbox');
      cbs.forEach(cb => cb.checked = e.target.checked);
      updateRightSelectedCount();
    });
  }
  const rightSelectAllBtn = document.getElementById('btn-right-select-all');
  if (rightSelectAllBtn) {
    rightSelectAllBtn.addEventListener('click', () => {
      const cbs = document.querySelectorAll('.right-row-checkbox');
      if (cbs.length === 0) return;
      const allChecked = Array.from(cbs).every(cb => cb.checked);
      cbs.forEach(cb => cb.checked = !allChecked);
      if (rightSelectAllCb) rightSelectAllCb.checked = !allChecked;
      updateRightSelectedCount();
    });
  }
  
  // Right Column bulk actions listeners
  const btnRightBulkMove = document.getElementById('btn-right-bulk-move');
  if (btnRightBulkMove) btnRightBulkMove.addEventListener('click', handleRightBulkMove);
  
  const btnRightBulkDelete = document.getElementById('btn-right-bulk-delete');
  if (btnRightBulkDelete) btnRightBulkDelete.addEventListener('click', handleRightBulkDelete);

  // --- KEYBOARD SHORTCUTS INTERACTION ---
  window.addEventListener('keydown', (e) => {
    // Avoid triggering shortcuts when writing in search inputs or import textareas
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    
    if (appState.currentScreen === 'flashcard') {
      switch(e.key) {
        case ' ':
          e.preventDefault();
          flipFlashcard();
          break;
        case 'ArrowLeft':
          navigateFlashcard('prev');
          break;
        case 'ArrowRight':
          navigateFlashcard('next');
          break;
        case 'Enter':
          toggleMasteredWord();
          break;
      }
    } 
    else if (appState.currentScreen === 'quiz') {
      const keyVal = parseInt(e.key);
      
      // Shortcuts 1, 2, 3, 4 for multiple choice
      if (keyVal >= 1 && keyVal <= 4) {
        e.preventDefault();
        checkQuizAnswer(keyVal - 1);
      } 
      // Space or Enter to trigger next question when choice selected
      else if ((e.key === ' ' || e.key === 'Enter') && appState.isAnswerChecked) {
        e.preventDefault();
        advanceQuiz();
      }
    }
  });
}

// --- CUSTOM VOCABULARY IMPORTER LOGIC ---
function updateVocabularySource() {
  let customVocab = [];
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  if (stored) {
    try {
      customVocab = JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing custom vocabulary:', e);
    }
  }
  activeVocabulary = [...vocabularyData, ...customVocab];
}

function checkCustomLevelVisibility() {
  const customCard = document.getElementById('card-level-custom');
  const dictCustomBtn = document.getElementById('dict-filter-custom');
  
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  let hasCustom = false;
  if (stored) {
    try {
      const list = JSON.parse(stored);
      hasCustom = list.length > 0;
    } catch(e) {}
  }
  
  if (hasCustom) {
    if (customCard) customCard.style.display = 'block';
    if (dictCustomBtn) dictCustomBtn.style.display = 'block';
  } else {
    if (customCard) customCard.style.display = 'none';
    if (dictCustomBtn) dictCustomBtn.style.display = 'none';
    // If Custom was selected but is now empty/hidden, revert to ALL
    if (appState.selectedLevel === 'Custom') {
      selectLevel('ALL');
    }
  }
}

function handleImportVocab() {
  const textarea = document.getElementById('import-textarea');
  const categoryInput = document.getElementById('import-category-input');
  const statusEl = document.getElementById('import-status');
  const text = textarea.value;
  
  if (!text.trim()) {
    statusEl.style.display = 'block';
    statusEl.style.color = 'var(--incorrect)';
    statusEl.textContent = 'Vui lòng nhập từ vựng trước khi bấm Import.';
    return;
  }
  
  let categoryName = categoryInput ? (categoryInput.value.trim() || "Của tôi") : "Của tôi";
  
  const lines = text.split('\n');
  const newWords = [];
  let errorCount = 0;
  
  let firstLineChecked = false;
  const linesToParse = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (!firstLineChecked) {
      firstLineChecked = true;
      const hasSeparator = trimmed.includes(':') || trimmed.includes('：') || 
                            trimmed.includes('(') || trimmed.includes('（');
      if (!hasSeparator) {
        categoryName = trimmed;
        continue;
      }
    }
    linesToParse.push(trimmed);
  }
  
  linesToParse.forEach((trimmed, index) => {
    let japanese = '';
    let vietnamese = '';
    
    // Check Case A: Separated by colon
    let separatorIndex = trimmed.indexOf(':');
    if (separatorIndex === -1) {
      separatorIndex = trimmed.indexOf('：');
    }
    
    if (separatorIndex > -1) {
      japanese = trimmed.substring(0, separatorIndex).trim();
      vietnamese = trimmed.substring(separatorIndex + 1).trim();
    } else {
      // Check Case B: Separated by parentheses e.g., "きた (Bắc)"
      let parenIndex = trimmed.indexOf('(');
      if (parenIndex === -1) {
        parenIndex = trimmed.indexOf('（');
      }
      
      if (parenIndex > -1) {
        japanese = trimmed.substring(0, parenIndex).trim();
        let rightPart = trimmed.substring(parenIndex + 1).trim();
        if (rightPart.endsWith(')') || rightPart.endsWith('）')) {
          vietnamese = rightPart.substring(0, rightPart.length - 1).trim();
        } else {
          vietnamese = rightPart;
        }
      }
    }
    
    if (!japanese || !vietnamese) {
      errorCount++;
      return;
    }
    
    newWords.push({
      id: `custom_${Date.now()}_${index}_${Math.floor(Math.random() * 1000)}`,
      kanji: japanese,
      kana: japanese,
      romaji: "", // Hide Romaji since it is imported custom hiragana/katakana
      vietnamese: vietnamese,
      example: "",
      example_meaning: "",
      level: "Custom",
      category: categoryName
    });
  });
  
  if (newWords.length === 0) {
    statusEl.style.display = 'block';
    statusEl.style.color = 'var(--incorrect)';
    statusEl.textContent = `Không có từ nào đúng định dạng. Đã bỏ qua ${errorCount} dòng lỗi.`;
    return;
  }
  
  // Load existing custom words
  let existingCustom = [];
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  if (stored) {
    try {
      existingCustom = JSON.parse(stored);
    } catch(e) {}
  }
  
  // Append new words
  const updatedCustom = [...existingCustom, ...newWords];
  localStorage.setItem('sakura_quiz_custom_vocab', JSON.stringify(updatedCustom));
  
  // Reset textarea & category input
  textarea.value = '';
  if (categoryInput) categoryInput.value = '';
  
  // Show success message
  statusEl.style.display = 'block';
  statusEl.style.color = 'var(--correct)';
  statusEl.textContent = `Đã import thành công ${newWords.length} từ vựng!${errorCount > 0 ? ` (Bỏ qua ${errorCount} dòng lỗi)` : ''}`;
  
  // Refresh vocabulary data source and UI elements
  updateVocabularySource();
  renderCategories();
  checkCustomLevelVisibility();
  renderCustomVocabList();
  
  // Auto-select Custom level to let user study their words immediately!
  selectLevel('Custom');
}

function renderCustomVocabList() {
  const wrapper = document.getElementById('custom-vocab-list-wrapper');
  const listContainer = document.getElementById('custom-vocab-list');
  const countEl = document.getElementById('custom-vocab-count');
  
  if (!wrapper || !listContainer || !countEl) return;
  
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  let customVocab = [];
  if (stored) {
    try {
      customVocab = JSON.parse(stored);
    } catch(e) {}
  }
  
  if (customVocab.length > 0) {
    wrapper.style.display = 'block';
    countEl.textContent = customVocab.length;
    listContainer.innerHTML = '';
    
    // Get unique categories list for dropdown
    const categoriesList = [...new Set(customVocab.map(w => w.category))];
    if (!categoriesList.includes("Của tôi")) {
      categoriesList.push("Của tôi");
    }
    
    customVocab.forEach(word => {
      const item = document.createElement('div');
      item.className = 'custom-vocab-item';
      
      // Build options HTML for categories selector
      let optionsHtml = '';
      categoriesList.forEach(cat => {
        const isSelected = word.category === cat ? 'selected' : '';
        optionsHtml += `<option value="${cat}" ${isSelected}>${cat}</option>`;
      });
      optionsHtml += `<option value="__NEW_CAT__">+ Tạo mục mới...</option>`;

      item.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.25rem; text-align: left; flex: 1;">
          <div>
            <strong style="font-family: var(--font-jp); font-size: 0.95rem; color: var(--sakura-pink);">${word.kana}</strong>
            <span style="color: var(--text-muted); margin: 0 0.5rem;">—</span>
            <span>${word.vietnamese}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.15rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Mục:</span>
            <select class="category-select" data-id="${word.id}">
              ${optionsHtml}
            </select>
          </div>
        </div>
        <button class="delete-single-btn" data-id="${word.id}" title="Xóa từ này" style="margin-left: 0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      `;
      
      // Category selection change listener
      const selectEl = item.querySelector('.category-select');
      selectEl.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid playing speech on select click
      });
      selectEl.addEventListener('change', (e) => {
        changeWordCategory(word.id, e.target.value);
      });

      // Delete button listener
      item.querySelector('.delete-single-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSingleCustomWord(word.id);
      });
      
      // Sound pronunciation listener
      item.addEventListener('click', () => {
        speakJapanese(word.kana);
      });
      
      listContainer.appendChild(item);
    });
  } else {
    wrapper.style.display = 'none';
    listContainer.innerHTML = '';
  }
}

function changeWordCategory(wordId, newCategory) {
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  if (!stored) return;
  
  try {
    let customVocab = JSON.parse(stored);
    let targetCategory = newCategory;
    
    if (newCategory === '__NEW_CAT__') {
      const inputName = prompt('Nhập tên bài học / nhóm mới:');
      if (inputName && inputName.trim()) {
        targetCategory = inputName.trim();
      } else {
        // Re-render list to reset selected option
        renderCustomVocabList();
        return;
      }
    }
    
    // Update category for the specific word
    customVocab = customVocab.map(word => {
      if (word.id === wordId) {
        return { ...word, category: targetCategory };
      }
      return word;
    });
    
    localStorage.setItem('sakura_quiz_custom_vocab', JSON.stringify(customVocab));
    
    // Refresh database & UI
    updateVocabularySource();
    renderCategories();
    checkCustomLevelVisibility();
    renderCustomVocabList();
    if (appState.currentScreen === 'manage-custom') renderDashboard();
  } catch(e) {
    console.error(e);
  }
}

function deleteSingleCustomWord(id) {
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  if (!stored) return;
  
  try {
    let customVocab = JSON.parse(stored);
    const updated = customVocab.filter(word => word.id !== id);
    
    if (updated.length > 0) {
      localStorage.setItem('sakura_quiz_custom_vocab', JSON.stringify(updated));
    } else {
      localStorage.removeItem('sakura_quiz_custom_vocab');
    }
    
    // Refresh vocabulary database and DOM elements
    updateVocabularySource();
    renderCategories();
    checkCustomLevelVisibility();
    renderCustomVocabList();
    if (appState.currentScreen === 'manage-custom') renderDashboard();
  } catch(e) {
    console.error(e);
  }
}

function openVocabModal(wordId = '') {
  const modal = document.getElementById('vocab-modal');
  const modalTitle = document.getElementById('modal-title');
  const editIdInput = document.getElementById('vocab-edit-id');
  const wordInput = document.getElementById('vocab-word-input');
  const readingInput = document.getElementById('vocab-reading-input');
  const meaningInput = document.getElementById('vocab-meaning-input');
  const categorySelect = document.getElementById('vocab-category-select');
  
  if (!modal || !modalTitle || !editIdInput || !wordInput || !readingInput || !meaningInput || !categorySelect) return;
  
  // Populate category dropdown with current unique categories
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  let customVocab = [];
  if (stored) {
    try {
      customVocab = JSON.parse(stored);
    } catch(e) {}
  }
  const uniqueCategories = [...new Set(customVocab.map(w => w.category))];
  
  categorySelect.innerHTML = '';
  // Default unassigned option
  const defOpt = document.createElement('option');
  defOpt.value = 'Của tôi';
  defOpt.textContent = 'Chưa phân mục (Của tôi)';
  categorySelect.appendChild(defOpt);
  
  uniqueCategories.forEach(cat => {
    if (cat !== 'Của tôi') {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    }
  });
  
  const newCatOpt = document.createElement('option');
  newCatOpt.value = '__NEW_CAT__';
  newCatOpt.textContent = '+ Tạo mục mới...';
  categorySelect.appendChild(newCatOpt);
  
  if (wordId) {
    // Edit mode
    modalTitle.textContent = 'Chỉnh sửa từ vựng';
    editIdInput.value = wordId;
    
    const wordObj = customVocab.find(w => w.id === wordId);
    if (wordObj) {
      wordInput.value = wordObj.kanji;
      readingInput.value = wordObj.kana;
      meaningInput.value = wordObj.vietnamese;
      categorySelect.value = wordObj.category;
    }
  } else {
    // Add mode
    modalTitle.textContent = 'Thêm Từ Vựng Mới';
    editIdInput.value = '';
    wordInput.value = '';
    readingInput.value = '';
    meaningInput.value = '';
    categorySelect.value = 'Của tôi';
  }
  
  modal.style.display = 'flex';
}

function closeVocabModal() {
  const modal = document.getElementById('vocab-modal');
  if (modal) modal.style.display = 'none';
}

function saveVocab() {
  const editId = document.getElementById('vocab-edit-id').value;
  const wordInput = document.getElementById('vocab-word-input').value.trim();
  const readingInput = document.getElementById('vocab-reading-input').value.trim();
  const meaningInput = document.getElementById('vocab-meaning-input').value.trim();
  const categorySelect = document.getElementById('vocab-category-select');
  
  if (!wordInput) {
    alert('Vui lòng nhập từ vựng (Chữ Kanji hoặc Kana).');
    return;
  }
  if (!meaningInput) {
    alert('Vui lòng nhập nghĩa tiếng Việt.');
    return;
  }
  
  let targetCategory = categorySelect.value;
  if (targetCategory === '__NEW_CAT__') {
    const inputName = prompt('Nhập tên bài học / nhóm mới:');
    if (inputName && inputName.trim()) {
      targetCategory = inputName.trim();
    } else {
      categorySelect.value = 'Của tôi';
      targetCategory = 'Của tôi';
    }
  }
  
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  let customVocab = [];
  if (stored) {
    try {
      customVocab = JSON.parse(stored);
    } catch(e) {}
  }
  
  if (editId) {
    // Update existing
    customVocab = customVocab.map(word => {
      if (word.id === editId) {
        return {
          ...word,
          kanji: wordInput,
          kana: readingInput || wordInput,
          vietnamese: meaningInput,
          category: targetCategory
        };
      }
      return word;
    });
  } else {
    // Add new
    const newWord = {
      id: `custom_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      kanji: wordInput,
      kana: readingInput || wordInput,
      romaji: '',
      vietnamese: meaningInput,
      example: '',
      example_meaning: '',
      level: 'Custom',
      category: targetCategory
    };
    customVocab.push(newWord);
  }
  
  localStorage.setItem('sakura_quiz_custom_vocab', JSON.stringify(customVocab));
  
  // Refresh database & UI
  updateVocabularySource();
  renderCategories();
  checkCustomLevelVisibility();
  renderCustomVocabList();
  if (appState.currentScreen === 'manage-custom') renderDashboard();
  
  closeVocabModal();
}

function clearCustomVocab() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ từ vựng đã tự nhập không?')) {
    localStorage.removeItem('sakura_quiz_custom_vocab');
    
    const statusEl = document.getElementById('import-status');
    statusEl.style.display = 'block';
    statusEl.style.color = 'var(--warning)';
    statusEl.textContent = 'Đã xóa toàn bộ từ vựng tự nhập.';
    
    updateVocabularySource();
    renderCategories();
    checkCustomLevelVisibility();
    renderCustomVocabList();
    if (appState.currentScreen === 'manage-custom') renderDashboard();
  }
}

// --- SHUFFLE ARRAY HELPER ---
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- VOCABULARY DASHBOARD SCREEN LOGIC ---
// --- VOCABULARY DASHBOARD SCREEN LOGIC ---
function renderDashboard() {
  const leftTableBody = document.getElementById('left-table-body');
  const rightTableBody = document.getElementById('right-table-body');
  const leftEmptyState = document.getElementById('left-empty-state');
  const rightEmptyState = document.getElementById('right-empty-state');
  
  const totalWordsEl = document.getElementById('dash-total-words');
  const totalCategoriesEl = document.getElementById('dash-total-categories');
  const leftCountEl = document.getElementById('dash-left-count');
  const rightCountEl = document.getElementById('dash-right-count');
  
  const rightFilterSelect = document.getElementById('right-filter-category');
  const searchInput = document.getElementById('dash-search');
  
  const leftBulkMoveSelect = document.getElementById('left-bulk-move-select');
  const rightBulkMoveSelect = document.getElementById('right-bulk-move-select');
  
  const leftSelectAllCb = document.getElementById('left-select-all-cb');
  const rightSelectAllCb = document.getElementById('right-select-all-cb');
  
  if (!leftTableBody || !rightTableBody || !totalWordsEl || !totalCategoriesEl) return;
  
  // Reset select-all checkboxes & bulk bars
  if (leftSelectAllCb) leftSelectAllCb.checked = false;
  if (rightSelectAllCb) rightSelectAllCb.checked = false;
  updateLeftSelectedCount();
  updateRightSelectedCount();
  
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  let customVocab = [];
  if (stored) {
    try {
      customVocab = JSON.parse(stored);
    } catch(e) {}
  }
  
  // Total stats
  totalWordsEl.textContent = customVocab.length;
  const uniqueCategories = [...new Set(customVocab.map(w => w.category))];
  const lessonsCount = uniqueCategories.filter(cat => cat !== "Của tôi").length;
  totalCategoriesEl.textContent = lessonsCount;
  
  // Populate Right Filter Dropdown (keep selected value if possible)
  const currentRightFilter = rightFilterSelect ? rightFilterSelect.value : "ALL";
  if (rightFilterSelect) {
    rightFilterSelect.innerHTML = '<option value="ALL">Tất cả mục</option>';
    uniqueCategories.forEach(cat => {
      if (cat !== "Của tôi") {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        if (cat === currentRightFilter) option.selected = true;
        rightFilterSelect.appendChild(option);
      }
    });
  }
  
  // Populate Bulk Dropdowns
  const targetCategoriesLeft = uniqueCategories.filter(cat => cat !== "Của tôi");
  if (leftBulkMoveSelect) {
    leftBulkMoveSelect.innerHTML = '';
    targetCategoriesLeft.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      leftBulkMoveSelect.appendChild(option);
    });
    const newOption = document.createElement('option');
    newOption.value = '__NEW_CAT__';
    newOption.textContent = '+ Tạo mục mới...';
    leftBulkMoveSelect.appendChild(newOption);
  }
  
  const targetCategoriesRight = ["Của tôi", ...uniqueCategories.filter(cat => cat !== "Của tôi")];
  if (rightBulkMoveSelect) {
    rightBulkMoveSelect.innerHTML = '';
    targetCategoriesRight.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      rightBulkMoveSelect.appendChild(option);
    });
    const newOption = document.createElement('option');
    newOption.value = '__NEW_CAT__';
    newOption.textContent = '+ Tạo mục mới...';
    rightBulkMoveSelect.appendChild(newOption);
  }
  
  // Separate lists
  let unassignedWords = customVocab.filter(w => w.category === "Của tôi");
  let assignedWords = customVocab.filter(w => w.category !== "Của tôi");
  
  // Apply search query filter to both
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
  if (searchQuery) {
    unassignedWords = unassignedWords.filter(word => {
      return word.kana.toLowerCase().includes(searchQuery) || word.vietnamese.toLowerCase().includes(searchQuery);
    });
    assignedWords = assignedWords.filter(word => {
      return word.kana.toLowerCase().includes(searchQuery) || word.vietnamese.toLowerCase().includes(searchQuery);
    });
  }
  
  // Apply category filter to Right column
  const filterCat = rightFilterSelect ? rightFilterSelect.value : "ALL";
  if (filterCat !== "ALL") {
    assignedWords = assignedWords.filter(w => w.category === filterCat);
  }
  
  // Update counts
  if (leftCountEl) leftCountEl.textContent = unassignedWords.length;
  if (rightCountEl) rightCountEl.textContent = assignedWords.length;
  
  // Render Left Column (Unassigned)
  leftTableBody.innerHTML = '';
  if (unassignedWords.length === 0) {
    if (leftEmptyState) leftEmptyState.style.display = 'block';
  } else {
    if (leftEmptyState) leftEmptyState.style.display = 'none';
    
    unassignedWords.forEach(word => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding: 0.6rem 0.8rem; text-align: center;">
          <input type="checkbox" class="left-row-checkbox" data-id="${word.id}" style="cursor: pointer; transform: scale(1.15);">
        </td>
        <td style="padding: 0.6rem 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            <button class="speak-btn" style="padding: 3px;" title="Nghe phát âm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
            <strong style="font-family: var(--font-jp); font-size: 0.95rem; color: var(--text);">${word.kana}</strong>
          </div>
        </td>
        <td style="padding: 0.6rem 0.8rem; color: var(--text); font-weight: 500;">
          ${word.vietnamese}
        </td>
        <td style="padding: 0.6rem 0.8rem; text-align: center; display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
          <button class="btn-edit-row" data-id="${word.id}" title="Sửa từ này">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-delete-row" data-id="${word.id}" title="Xóa từ này">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </td>
      `;
      
      const cb = tr.querySelector('.left-row-checkbox');
      cb.addEventListener('click', (e) => e.stopPropagation());
      cb.addEventListener('change', updateLeftSelectedCount);
      
      tr.querySelector('td:nth-child(2)').addEventListener('click', () => speakJapanese(word.kana));
      
      tr.querySelector('.btn-edit-row').addEventListener('click', (e) => {
        e.stopPropagation();
        openVocabModal(word.id);
      });
      tr.querySelector('.btn-delete-row').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSingleCustomWord(word.id);
      });
      
      leftTableBody.appendChild(tr);
    });
  }
  
  // Render Right Column (Assigned)
  rightTableBody.innerHTML = '';
  if (assignedWords.length === 0) {
    if (rightEmptyState) rightEmptyState.style.display = 'block';
  } else {
    if (rightEmptyState) rightEmptyState.style.display = 'none';
    
    const rowCategoriesList = ["Của tôi", ...uniqueCategories.filter(cat => cat !== "Của tôi")];
    
    assignedWords.forEach(word => {
      const tr = document.createElement('tr');
      
      let optionsHtml = '';
      rowCategoriesList.forEach(cat => {
        const isSelected = word.category === cat ? 'selected' : '';
        optionsHtml += `<option value="${cat}" ${isSelected}>${cat}</option>`;
      });
      optionsHtml += `<option value="__NEW_CAT__">+ Tạo mục mới...</option>`;
      
      tr.innerHTML = `
        <td style="padding: 0.6rem 0.8rem; text-align: center;">
          <input type="checkbox" class="right-row-checkbox" data-id="${word.id}" style="cursor: pointer; transform: scale(1.15);">
        </td>
        <td style="padding: 0.6rem 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            <button class="speak-btn" style="padding: 3px;" title="Nghe phát âm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
            <strong style="font-family: var(--font-jp); font-size: 0.95rem; color: var(--text);">${word.kana}</strong>
          </div>
        </td>
        <td style="padding: 0.6rem 0.8rem; color: var(--text); font-weight: 500;">
          ${word.vietnamese}
        </td>
        <td style="padding: 0.6rem 0.8rem;">
          <select class="category-select" data-id="${word.id}" style="width: 100%;">
            ${optionsHtml}
          </select>
        </td>
        <td style="padding: 0.6rem 0.8rem; text-align: center; display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
          <button class="btn-edit-row" data-id="${word.id}" title="Sửa từ này">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-delete-row" data-id="${word.id}" title="Xóa từ này">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </td>
      `;
      
      const cb = tr.querySelector('.right-row-checkbox');
      cb.addEventListener('click', (e) => e.stopPropagation());
      cb.addEventListener('change', updateRightSelectedCount);
      
      tr.querySelector('td:nth-child(2)').addEventListener('click', () => speakJapanese(word.kana));
      
      const selectEl = tr.querySelector('.category-select');
      selectEl.addEventListener('click', (e) => e.stopPropagation());
      selectEl.addEventListener('change', (e) => {
        changeWordCategory(word.id, e.target.value);
      });
      
      tr.querySelector('.btn-edit-row').addEventListener('click', (e) => {
        e.stopPropagation();
        openVocabModal(word.id);
      });
      tr.querySelector('.btn-delete-row').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSingleCustomWord(word.id);
      });
      
      rightTableBody.appendChild(tr);
    });
  }
}

function updateLeftSelectedCount() {
  const checkboxes = document.querySelectorAll('.left-row-checkbox');
  const checkedBoxes = document.querySelectorAll('.left-row-checkbox:checked');
  const count = checkedBoxes.length;
  
  const bulkBar = document.getElementById('left-bulk-bar');
  const selectAllCb = document.getElementById('left-select-all-cb');
  const btnSelectAll = document.getElementById('btn-left-select-all');
  
  if (bulkBar) {
    bulkBar.style.display = count > 0 ? 'inline-flex' : 'none';
  }
  
  if (selectAllCb && checkboxes.length > 0) {
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    selectAllCb.checked = allChecked;
    if (btnSelectAll) {
      btnSelectAll.textContent = allChecked ? 'Bỏ chọn' : 'Chọn tất cả';
    }
  } else if (selectAllCb) {
    selectAllCb.checked = false;
    if (btnSelectAll) btnSelectAll.textContent = 'Chọn tất cả';
  }
}

function updateRightSelectedCount() {
  const checkboxes = document.querySelectorAll('.right-row-checkbox');
  const checkedBoxes = document.querySelectorAll('.right-row-checkbox:checked');
  const count = checkedBoxes.length;
  
  const bulkBar = document.getElementById('right-bulk-bar');
  const selectAllCb = document.getElementById('right-select-all-cb');
  const btnSelectAll = document.getElementById('btn-right-select-all');
  
  if (bulkBar) {
    bulkBar.style.display = count > 0 ? 'inline-flex' : 'none';
  }
  
  if (selectAllCb && checkboxes.length > 0) {
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    selectAllCb.checked = allChecked;
    if (btnSelectAll) {
      btnSelectAll.textContent = allChecked ? 'Bỏ chọn' : 'Chọn tất cả';
    }
  } else if (selectAllCb) {
    selectAllCb.checked = false;
    if (btnSelectAll) btnSelectAll.textContent = 'Chọn tất cả';
  }
}

function handleLeftBulkMove() {
  const checkboxes = document.querySelectorAll('.left-row-checkbox:checked');
  if (checkboxes.length === 0) return;
  
  const selectEl = document.getElementById('left-bulk-move-select');
  if (!selectEl) return;
  
  let targetCategory = selectEl.value;
  if (targetCategory === '__NEW_CAT__') {
    const inputName = prompt('Nhập tên bài học / nhóm mới cho các từ đã chọn:');
    if (inputName && inputName.trim()) {
      targetCategory = inputName.trim();
    } else {
      return; // cancel
    }
  }
  
  applyBulkCategoryChange(checkboxes, targetCategory);
}

function handleRightBulkMove() {
  const checkboxes = document.querySelectorAll('.right-row-checkbox:checked');
  if (checkboxes.length === 0) return;
  
  const selectEl = document.getElementById('right-bulk-move-select');
  if (!selectEl) return;
  
  let targetCategory = selectEl.value;
  if (targetCategory === '__NEW_CAT__') {
    const inputName = prompt('Nhập tên bài học / nhóm mới cho các từ đã chọn:');
    if (inputName && inputName.trim()) {
      targetCategory = inputName.trim();
    } else {
      return; // cancel
    }
  }
  
  applyBulkCategoryChange(checkboxes, targetCategory);
}

function applyBulkCategoryChange(checkboxes, targetCategory) {
  const stored = localStorage.getItem('sakura_quiz_custom_vocab');
  if (!stored) return;
  
  try {
    let customVocab = JSON.parse(stored);
    const selectedIds = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
    
    customVocab = customVocab.map(word => {
      if (selectedIds.includes(word.id)) {
        return { ...word, category: targetCategory };
      }
      return word;
    });
    
    localStorage.setItem('sakura_quiz_custom_vocab', JSON.stringify(customVocab));
    
    // Refresh database & UI
    updateVocabularySource();
    renderCategories();
    checkCustomLevelVisibility();
    renderCustomVocabList();
    renderDashboard();
  } catch(e) {
    console.error(e);
  }
}

function handleLeftBulkDelete() {
  const checkboxes = document.querySelectorAll('.left-row-checkbox:checked');
  if (checkboxes.length === 0) return;
  applyBulkDelete(checkboxes);
}

function handleRightBulkDelete() {
  const checkboxes = document.querySelectorAll('.right-row-checkbox:checked');
  if (checkboxes.length === 0) return;
  applyBulkDelete(checkboxes);
}

function applyBulkDelete(checkboxes) {
  if (confirm(`Bạn có chắc chắn muốn xóa ${checkboxes.length} từ vựng đã chọn không?`)) {
    const stored = localStorage.getItem('sakura_quiz_custom_vocab');
    if (!stored) return;
    
    try {
      let customVocab = JSON.parse(stored);
      const selectedIds = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
      
      const updated = customVocab.filter(word => !selectedIds.includes(word.id));
      
      if (updated.length > 0) {
        localStorage.setItem('sakura_quiz_custom_vocab', JSON.stringify(updated));
      } else {
        localStorage.removeItem('sakura_quiz_custom_vocab');
      }
      
      // Refresh database & UI
      updateVocabularySource();
      renderCategories();
      checkCustomLevelVisibility();
      renderCustomVocabList();
      renderDashboard();
    } catch(e) {
      console.error(e);
    }
  }
}

// --- REWARDS & ENTERTAINMENT SECTION LOGIC ---
let isRewardsInitialized = false;

function initRewardsScreen() {
  updateStatsUI();
  renderInventory();
  initWheelCanvas();
  
  if (isRewardsInitialized) return;
  isRewardsInitialized = true;
  
  // Tab Switching Logic
  const tabs = document.querySelectorAll('#rewards-tabs .filter-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetTab = tab.getAttribute('data-tab');
      document.querySelectorAll('.rewards-tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      document.getElementById(`tab-content-${targetTab}`).classList.add('active');
      
      // Special actions on tab open
      if (targetTab === 'game') {
        initGameCanvas();
      }
    });
  });
  
  // Lucky Wheel Spin Event
  document.getElementById('btn-spin-wheel').addEventListener('click', spinWheel);
  
  // Shop Purchase Event Listeners
  document.querySelectorAll('.btn-shop-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.shop-item');
      const itemId = itemEl.getAttribute('data-id');
      const itemPrice = parseInt(itemEl.getAttribute('data-price'));
      const itemName = itemEl.querySelector('h4').textContent;
      
      buyFoodItem(itemId, itemPrice, itemName);
    });
  });
  
  // Music Player Events
  initMusicPlayer();
}

// --- LUCKY SPIN WHEEL ---
const wheelWedges = [
  { text: "+100 xu", type: "points", value: 100, color: "#ffccd5" },
  { text: "Chơi Free", type: "free_game", value: 1, color: "#ffb3c1" },
  { text: "Trà sữa thái", type: "food", value: "bubble_tea", color: "#ff8da1" },
  { text: "Chúc may mắn", type: "lose", value: 0, color: "#e2e8f0" },
  { text: "+50 xu", type: "points", value: 50, color: "#ffccd5" },
  { text: "Bánh tráng", type: "food", value: "rice_paper", color: "#ffb3c1" },
  { text: "+20 xu", type: "points", value: 20, color: "#ff8da1" },
  { text: "Mì Ramen", type: "food", value: "ramen", color: "#ffa5ab" }
];

let isSpinning = false;
let currentWheelAngle = 0;

function drawWheel(angle = 0) {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 8;
  const wedgeAngle = (Math.PI * 2) / 8;
  
  ctx.clearRect(0, 0, size, size);
  
  // Draw slices
  for (let i = 0; i < 8; i++) {
    const startAngle = i * wedgeAngle + angle;
    const endAngle = startAngle + wedgeAngle;
    
    // Wedge background
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.fillStyle = wheelWedges[i].color;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.stroke();
    
    // Text drawing
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(startAngle + wedgeAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = wheelWedges[i].type === "lose" ? "#4b5563" : "#bf3b5e";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(wheelWedges[i].text, radius - 15, 4);
    ctx.restore();
  }
  
  // Draw center hub
  ctx.beginPath();
  ctx.arc(center, center, 14, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "var(--sakura-pink)";
  ctx.stroke();
}

function initWheelCanvas() {
  drawWheel(currentWheelAngle);
}

function spinWheel() {
  if (isSpinning) return;
  
  // Check points balance
  if (appState.stats.points < 50) {
    alert("Bạn không đủ xu để quay! Cần 50 xu mỗi lượt quay.");
    return;
  }
  
  // Deduct points
  appState.stats.points -= 50;
  saveStats();
  updateStatsUI();
  
  isSpinning = true;
  const spinBtn = document.getElementById('btn-spin-wheel');
  if (spinBtn) spinBtn.disabled = true;
  
  const resultMsg = document.getElementById('wheel-result-msg');
  if (resultMsg) {
    resultMsg.style.display = 'block';
    resultMsg.style.background = 'rgba(255,117,151,0.05)';
    resultMsg.style.borderColor = 'rgba(255,117,151,0.2)';
    resultMsg.style.color = 'var(--text)';
    resultMsg.textContent = '🎡 Vòng quay đang xoay tít...';
  }
  
  // Pick random sector
  const sectorIndex = Math.floor(Math.random() * 8);
  const wedgeAngle = 360 / 8;
  const targetSectorAngle = 270 - (sectorIndex * wedgeAngle + wedgeAngle / 2);
  const extraSpins = 360 * (4 + Math.floor(Math.random() * 3));
  const finalDegree = extraSpins + targetSectorAngle;
  
  const wheelEl = document.getElementById('lucky-wheel');
  if (wheelEl) {
    wheelEl.style.transform = `rotate(${finalDegree}deg)`;
  }
  
  setTimeout(() => {
    isSpinning = false;
    if (spinBtn) spinBtn.disabled = false;
    
    // Distribute Reward
    const prize = wheelWedges[sectorIndex];
    let message = '';
    
    if (resultMsg) {
      if (prize.type === 'points') {
        appState.stats.points += prize.value;
        resultMsg.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        resultMsg.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        resultMsg.style.color = 'var(--correct)';
        message = `🎉 Chúc mừng bạn trúng thêm +${prize.value} xu thưởng!`;
      } else if (prize.type === 'free_game') {
        appState.stats.freeGames += 1;
        resultMsg.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        resultMsg.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        resultMsg.style.color = 'var(--correct)';
        message = `🎫 Bạn trúng 1 lượt chơi game miễn phí!`;
      } else if (prize.type === 'food') {
        appState.stats.inventory[prize.value] = (appState.stats.inventory[prize.value] || 0) + 1;
        resultMsg.style.backgroundColor = 'rgba(255, 117, 151, 0.1)';
        resultMsg.style.borderColor = 'rgba(255, 117, 151, 0.3)';
        resultMsg.style.color = 'var(--sakura-pink)';
        message = `🍵 Bạn trúng món ăn ảo: ${prize.text}! (Đã cho vào tủ đồ)`;
        renderInventory();
      } else {
        resultMsg.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        resultMsg.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        resultMsg.style.color = 'var(--text-muted)';
        message = `🌟 Tiếc quá, chúc bạn may mắn lần sau nhé!`;
      }
      resultMsg.textContent = message;
    }
    
    // Save Stats
    saveStats();
    updateStatsUI();
  }, 6000); // Animation duration is 6s
}

// --- VIRTUAL FOOD SHOP & INVENTORY ---
function buyFoodItem(itemId, price, name) {
  if (appState.stats.points < price) {
    alert(`Bạn không đủ xu để mua món này! Món này cần ${price} xu.`);
    return;
  }
  
  appState.stats.points -= price;
  appState.stats.inventory[itemId] = (appState.stats.inventory[itemId] || 0) + 1;
  saveStats();
  updateStatsUI();
  renderInventory();
  
  // Purchase Alert & Confetti trigger
  triggerConfetti();
  alert(`🛒 Đã đổi quà thành công! Bạn nhận được 1 phần [${name}]. Vật phẩm đã được lưu trong Tủ trữ đồ ăn.`);
}

function renderInventory() {
  const container = document.getElementById('cabinet-items-container');
  const emptyState = document.getElementById('cabinet-empty-state');
  if (!container || !emptyState) return;
  
  container.innerHTML = '';
  
  const inventory = appState.stats.inventory || {};
  const items = [
    { id: 'bubble_tea', name: 'Trà sữa trân châu', emoji: '🍵' },
    { id: 'rice_paper', name: 'Bánh tráng trộn', emoji: '🍡' },
    { id: 'takoyaki', name: 'Bánh Takoyaki', emoji: '🐙' },
    { id: 'ramen', name: 'Mì Ramen nóng', emoji: '🍜' },
    { id: 'ice_cream', name: 'Kem Sakura mát', emoji: '🍦' }
  ];
  
  let totalCount = 0;
  
  items.forEach(item => {
    const count = inventory[item.id] || 0;
    if (count > 0) {
      totalCount += count;
      const el = document.createElement('div');
      el.className = 'cabinet-item';
      el.innerHTML = `<span>${item.emoji}</span> ${item.name} x${count}`;
      container.appendChild(el);
    }
  });
  
  if (totalCount > 0) {
    emptyState.style.display = 'none';
  } else {
    emptyState.style.display = 'block';
  }
}

// Simple celebration confetti simulation
function triggerConfetti() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '999';
  document.body.appendChild(overlay);
  
  const emojis = ['🌸', '🎉', '✨', '🍵', '🍡', '🐙', '🍜', '🍦'];
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.fontSize = `${Math.random() * 20 + 15}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `-50px`;
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    particle.style.transition = `top ${Math.random() * 2 + 1.5}s ease-in, left ${Math.random() * 2 + 1.5}s ease-out`;
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    overlay.appendChild(particle);
    
    // Trigger animation
    setTimeout(() => {
      particle.style.top = '110vh';
      particle.style.left = `${parseFloat(particle.style.left) + (Math.random() * 40 - 20)}vw`;
    }, 50);
  }
  
  setTimeout(() => {
    overlay.remove();
  }, 4000);
}

// --- AUDIO PLAYER MUSIC STATION ---
let currentTrackIndex = 0;
let isMusicInitialized = false;

const defaultTracks = [
  { title: "Sakura Dreams (Lofi Chill)", artist: "Lofi Library", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", isCustom: false },
  { title: "Japanese Zen Garden Lounge", artist: "Chill Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", isCustom: false },
  { title: "Tokyo Lofi Midnight Walk", artist: "Retro Wave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", isCustom: false }
];

let customTracks = [];
let allTracks = [];

// Load YouTube API script dynamically
if (!window.YT) {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

let ytPlayer = null;
let isYtReady = false;

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '100%',
    width: '100%',
    videoId: '',
    playerVars: {
      'playsinline': 1,
      'controls': 1
    },
    events: {
      'onReady': (e) => {
        isYtReady = true;
        const vol = document.getElementById('music-volume').value;
        ytPlayer.setVolume(vol * 100);
      },
      'onStateChange': (e) => {
        // If track finished playing, auto-advance
        if (e.data === YT.PlayerState.ENDED) {
          if (allTracks.length === 0) return;
          const nextIndex = (currentTrackIndex + 1) % allTracks.length;
          selectTrack(nextIndex);
        }
      }
    }
  });
}

// Fallback init in case script loads before declaration
if (window.YT && window.YT.Player) {
  setTimeout(window.onYouTubeIframeAPIReady, 100);
}

const invidiousInstances = [
  "https://invidious.projectsegfau.lt",
  "https://invidious.flokinet.to",
  "https://invidious.lunar.icu",
  "https://yewtu.to"
];

async function searchYoutubeInvidious(query) {
  for (let instance of invidiousInstances) {
    try {
      const url = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn(`Instance ${instance} failed:`, err);
    }
  }
  return null;
}

function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function loadCustomTracks() {
  try {
    const saved = localStorage.getItem('sakura_custom_tracks');
    if (saved) {
      customTracks = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading custom tracks:", e);
  }
  allTracks = [...defaultTracks, ...customTracks];
}

function initMusicPlayer() {
  if (isMusicInitialized) return;
  isMusicInitialized = true;
  
  loadCustomTracks();
  
  const audio = document.getElementById('rewards-audio');
  const playlistContainer = document.getElementById('playlist-container');
  if (!audio || !playlistContainer) return;
  
  renderPlaylist();
  
  // Play / Pause event
  const playPauseBtn = document.getElementById('btn-music-play-pause');
  playPauseBtn.addEventListener('click', toggleMusicPlay);
  
  // Prev / Next
  document.getElementById('btn-music-prev').addEventListener('click', () => {
    if (allTracks.length === 0) return;
    const nextIndex = (currentTrackIndex - 1 + allTracks.length) % allTracks.length;
    selectTrack(nextIndex);
  });
  document.getElementById('btn-music-next').addEventListener('click', () => {
    if (allTracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % allTracks.length;
    selectTrack(nextIndex);
  });
  
  // Volume adjust
  const volumeSlider = document.getElementById('music-volume');
  volumeSlider.addEventListener('input', (e) => {
    const vol = e.target.value;
    audio.volume = vol;
    if (isYtReady && ytPlayer && ytPlayer.setVolume) {
      ytPlayer.setVolume(vol * 100);
    }
  });
  
  // Audio state change listeners
  audio.addEventListener('ended', () => {
    if (allTracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % allTracks.length;
    selectTrack(nextIndex);
  });
  
  // Custom Music Upload (From Local File)
  const fileInput = document.getElementById('music-file-input');
  const uploadTrigger = document.getElementById('btn-music-upload-trigger');
  if (fileInput && uploadTrigger) {
    uploadTrigger.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      let addedAny = false;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const objectUrl = URL.createObjectURL(file);
        
        customTracks.push({
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Tệp nhạc máy tính",
          url: objectUrl,
          isCustom: true,
          isLocalFile: true
        });
        addedAny = true;
      }
      
      if (addedAny) {
        allTracks = [...defaultTracks, ...customTracks];
        renderPlaylist();
        selectTrack(allTracks.length - files.length);
      }
      fileInput.value = '';
    });
  }
  
  // Custom Music URL Link Add
  const addUrlBtn = document.getElementById('btn-add-music-url');
  const urlInput = document.getElementById('music-url-input');
  if (addUrlBtn && urlInput) {
    addUrlBtn.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (!url) return;
      
      const ytId = getYoutubeId(url);
      if (ytId) {
        // YouTube video link
        const newTrack = {
          title: "Nhạc YouTube",
          artist: "YouTube Link",
          url: url,
          isCustom: true,
          isYt: true,
          ytId: ytId
        };
        customTracks.push(newTrack);
        const persistentTracks = customTracks.filter(t => !t.isLocalFile);
        localStorage.setItem('sakura_custom_tracks', JSON.stringify(persistentTracks));
        
        allTracks = [...defaultTracks, ...customTracks];
        renderPlaylist();
        urlInput.value = '';
        selectTrack(allTracks.length - 1);
        return;
      }
      
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert("Vui lòng nhập đường dẫn liên kết bắt đầu bằng http:// hoặc https://");
        return;
      }
      
      let title = "Liên kết nhạc tự chọn";
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
        if (filename && filename.includes('.')) {
          title = decodeURIComponent(filename).replace(/\.[^/.]+$/, "");
        }
      } catch (err) {}
      
      const newTrack = {
        title: title,
        artist: "Nhạc liên kết",
        url: url,
        isCustom: true
      };
      
      customTracks.push(newTrack);
      
      const persistentTracks = customTracks.filter(t => !t.isLocalFile);
      localStorage.setItem('sakura_custom_tracks', JSON.stringify(persistentTracks));
      
      allTracks = [...defaultTracks, ...customTracks];
      renderPlaylist();
      urlInput.value = '';
      selectTrack(allTracks.length - 1);
    });
    
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addUrlBtn.click();
      }
    });
  }

  // Discord Bot Search Functionality
  const searchInput = document.getElementById('music-search-input');
  const searchBtn = document.getElementById('btn-search-music');
  const resultsContainer = document.getElementById('music-search-results');
  
  if (searchBtn && searchInput && resultsContainer) {
    const triggerSearch = async () => {
      const query = searchInput.value.trim();
      if (!query) return;
      
      resultsContainer.style.display = 'flex';
      resultsContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 0.5rem;">🔍 Đang tìm kiếm bài hát...</div>';
      
      const data = await searchYoutubeInvidious(query);
      
      if (!data || data.length === 0) {
        resultsContainer.innerHTML = '<div style="color: var(--incorrect); text-align: center; padding: 0.5rem;">❌ Không tìm thấy bài hát nào. Vui lòng thử lại!</div>';
        return;
      }
      
      resultsContainer.innerHTML = '';
      // Render top 5 results
      const resultsToRender = data.slice(0, 5);
      resultsToRender.forEach(video => {
        const el = document.createElement('div');
        el.style.display = 'flex';
        el.style.justifyContent = 'space-between';
        el.style.alignItems = 'center';
        el.style.padding = '0.35rem 0.5rem';
        el.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        el.style.cursor = 'pointer';
        el.style.transition = 'var(--transition-smooth)';
        el.style.borderRadius = '4px';
        
        el.innerHTML = `
          <div style="flex: 1; min-width: 0; padding-right: 0.5rem;">
            <strong style="display: block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; color: var(--text);">${video.title}</strong>
            <span style="font-size: 0.65rem; color: var(--text-muted);">${video.author}</span>
          </div>
          <button class="btn btn-primary" style="font-size: 0.65rem; padding: 2px 8px; height: auto; width: auto; flex-shrink: 0; background: var(--correct); border-color: var(--correct);">Phát</button>
        `;
        
        // Hover effects
        el.addEventListener('mouseenter', () => { el.style.background = 'rgba(255,117,151,0.05)'; });
        el.addEventListener('mouseleave', () => { el.style.background = 'transparent'; });
        
        el.addEventListener('click', () => {
          // Add to playlist
          const newTrack = {
            title: video.title,
            artist: video.author || "YouTube",
            url: `https://www.youtube.com/watch?v=${video.videoId}`,
            isCustom: true,
            isYt: true,
            ytId: video.videoId
          };
          
          customTracks.push(newTrack);
          const persistentTracks = customTracks.filter(t => !t.isLocalFile);
          localStorage.setItem('sakura_custom_tracks', JSON.stringify(persistentTracks));
          
          allTracks = [...defaultTracks, ...customTracks];
          renderPlaylist();
          
          // Clear results and inputs
          resultsContainer.style.display = 'none';
          resultsContainer.innerHTML = '';
          searchInput.value = '';
          
          // Select and play it
          selectTrack(allTracks.length - 1);
        });
        
        resultsContainer.appendChild(el);
      });
    };

    searchBtn.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        triggerSearch();
      }
    });
  }
  
  if (allTracks.length > 0) {
    loadTrack(currentTrackIndex);
  }
}

function renderPlaylist() {
  const playlistContainer = document.getElementById('playlist-container');
  if (!playlistContainer) return;
  
  playlistContainer.innerHTML = '';
  
  if (allTracks.length === 0) {
    playlistContainer.innerHTML = '<div class="empty-state" style="padding: 1rem; font-size: 0.8rem;">Album nhạc trống</div>';
    return;
  }
  
  allTracks.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
    item.innerHTML = `
      <div style="text-align: left; flex: 1; min-width: 0;">
        <strong style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${track.title}</strong>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${track.artist}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
        ${track.isCustom ? `<button class="btn-delete-track" style="background: none; border: none; color: var(--incorrect); cursor: pointer; font-size: 0.95rem; padding: 4px; line-height: 1;" title="Xóa nhạc này">❌</button>` : ''}
        <span>🎵</span>
      </div>
    `;
    
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-delete-track')) {
        e.stopPropagation();
        deleteCustomTrack(index);
        return;
      }
      selectTrack(index);
    });
    
    playlistContainer.appendChild(item);
  });
}

function deleteCustomTrack(index) {
  const track = allTracks[index];
  if (!track || !track.isCustom) return;
  
  const customIdx = customTracks.indexOf(track);
  if (customIdx > -1) {
    customTracks.splice(customIdx, 1);
    const persistentTracks = customTracks.filter(t => !t.isLocalFile);
    localStorage.setItem('sakura_custom_tracks', JSON.stringify(persistentTracks));
  }
  
  allTracks = [...defaultTracks, ...customTracks];
  
  if (index === currentTrackIndex) {
    const audio = document.getElementById('rewards-audio');
    const wasPlaying = (audio && !audio.paused) || (isYtReady && ytPlayer && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING);
    
    // Stop current YT playing
    if (isYtReady && ytPlayer && ytPlayer.stopVideo) {
      ytPlayer.stopVideo();
    }
    
    if (allTracks.length > 0) {
      const nextIndex = index % allTracks.length;
      loadTrack(nextIndex);
      if (wasPlaying) playMusic();
    } else {
      pauseMusic();
      document.getElementById('music-track-title').textContent = "Không có nhạc";
      document.getElementById('music-track-artist').textContent = "-";
    }
  } else if (index < currentTrackIndex) {
    currentTrackIndex--;
  }
  
  renderPlaylist();
}

function loadTrack(index) {
  const audio = document.getElementById('rewards-audio');
  const ytWrapper = document.getElementById('yt-player-wrapper');
  if (allTracks.length === 0) return;
  
  currentTrackIndex = index;
  const track = allTracks[index];
  
  // Update UI metadata
  document.getElementById('music-track-title').textContent = track.title;
  document.getElementById('music-track-artist').textContent = track.artist;
  
  // Reset audio elements
  if (audio) {
    audio.pause();
  }
  
  // Set up depending on source
  if (track.isYt) {
    if (ytWrapper) ytWrapper.style.display = 'block';
    if (isYtReady && ytPlayer && ytPlayer.cueVideoById) {
      ytPlayer.cueVideoById(track.ytId);
    }
  } else {
    if (ytWrapper) ytWrapper.style.display = 'none';
    if (isYtReady && ytPlayer && ytPlayer.stopVideo) {
      ytPlayer.stopVideo();
    }
    if (audio) {
      audio.src = track.url;
      audio.volume = document.getElementById('music-volume').value;
    }
  }
  
  const items = document.querySelectorAll('#playlist-container .playlist-item');
  items.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function selectTrack(index) {
  const audio = document.getElementById('rewards-audio');
  const wasPlaying = (audio && !audio.paused) || (isYtReady && ytPlayer && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING);
  
  loadTrack(index);
  if (wasPlaying) {
    playMusic();
  }
}

function toggleMusicPlay() {
  const audio = document.getElementById('rewards-audio');
  if (allTracks.length === 0) return;
  
  const track = allTracks[currentTrackIndex];
  if (track.isYt) {
    if (isYtReady && ytPlayer && ytPlayer.getPlayerState) {
      const state = ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        pauseMusic();
      } else {
        playMusic();
      }
    } else {
      playMusic();
    }
  } else {
    if (audio.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  }
}

function playMusic() {
  const audio = document.getElementById('rewards-audio');
  const playIcon = document.getElementById('music-play-icon');
  const pauseIcon = document.getElementById('music-pause-icon');
  const vinyl = document.getElementById('music-vinyl');
  const eq = document.getElementById('music-equalizer');
  
  if (allTracks.length === 0) return;
  const track = allTracks[currentTrackIndex];
  
  if (track.isYt) {
    if (audio) audio.pause();
    if (isYtReady && ytPlayer && ytPlayer.playVideo) {
      ytPlayer.playVideo();
    }
  } else {
    if (isYtReady && ytPlayer && ytPlayer.pauseVideo) {
      ytPlayer.pauseVideo();
    }
    if (audio) {
      audio.play().catch(e => console.error("Error playing audio: ", e));
    }
  }
  
  if (playIcon) playIcon.style.display = 'none';
  if (pauseIcon) pauseIcon.style.display = 'block';
  if (vinyl) vinyl.classList.add('playing');
  if (eq) eq.classList.add('active');
}

function pauseMusic() {
  const audio = document.getElementById('rewards-audio');
  const playIcon = document.getElementById('music-play-icon');
  const pauseIcon = document.getElementById('music-pause-icon');
  const vinyl = document.getElementById('music-vinyl');
  const eq = document.getElementById('music-equalizer');
  
  if (allTracks.length === 0) return;
  const track = allTracks[currentTrackIndex];
  
  if (track.isYt) {
    if (isYtReady && ytPlayer && ytPlayer.pauseVideo) {
      ytPlayer.pauseVideo();
    }
  } else {
    if (audio) audio.pause();
  }
  
  if (playIcon) playIcon.style.display = 'block';
  if (pauseIcon) pauseIcon.style.display = 'none';
  if (vinyl) vinyl.classList.remove('playing');
  if (eq) eq.classList.remove('active');
}

// --- SAKURA CATCHER MINI-GAME ---
let gameInterval = null;
let gameTimerInterval = null;
let gameCanvas = null;
let gameCtx = null;
let gameScore = 0;
let gameLives = 3;
let gameTimeLeft = 60;
let isPlayingGame = false;

// Game object definitions
let basket = { x: 150, y: 360, width: 60, height: 20, speed: 8 };
let fallingObjects = [];
let keysPressed = {};

function initGameCanvas() {
  gameCanvas = document.getElementById('game-canvas');
  if (!gameCanvas) return;
  gameCtx = gameCanvas.getContext('2d');
  
  if (!window.hasGameInputListeners) {
    window.hasGameInputListeners = true;
    
    // Key presses
    window.addEventListener('keydown', (e) => {
      if (appState.currentScreen === 'rewards' && isPlayingGame) {
        if (e.key === 'ArrowLeft' || e.key === 'a') keysPressed['left'] = true;
        if (e.key === 'ArrowRight' || e.key === 'd') keysPressed['right'] = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysPressed['left'] = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysPressed['right'] = false;
    });
    
    // Mouse movement inside canvas
    gameCanvas.addEventListener('mousemove', (e) => {
      if (!isPlayingGame) return;
      const rect = gameCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      basket.x = mouseX - basket.width / 2;
      
      // Boundaries check
      if (basket.x < 0) basket.x = 0;
      if (basket.x > gameCanvas.width - basket.width) basket.x = gameCanvas.width - basket.width;
    });
    
    // Touch movement inside canvas
    gameCanvas.addEventListener('touchmove', (e) => {
      if (!isPlayingGame) return;
      e.preventDefault();
      const rect = gameCanvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      basket.x = touchX - basket.width / 2;
      
      if (basket.x < 0) basket.x = 0;
      if (basket.x > gameCanvas.width - basket.width) basket.x = gameCanvas.width - basket.width;
    }, { passive: false });
    
    document.getElementById('btn-start-game').addEventListener('click', startGame);
  }
  
  drawStaticGameScreen();
}

function drawStaticGameScreen() {
  if (isPlayingGame) return;
  
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  // Draw nice initial layout
  gameCtx.fillStyle = "rgba(255,255,255,0.02)";
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  // Draw basket
  drawBasket(150, 360);
}

function drawBasket(x, y) {
  gameCtx.save();
  // Basket styling
  gameCtx.fillStyle = "#8b5a2b";
  gameCtx.strokeStyle = "#5c3a21";
  gameCtx.lineWidth = 2;
  
  // Rounded rectangle basket
  ctxDrawRoundRect(gameCtx, x, y, basket.width, basket.height, 6, true, true);
  
  // Basket pattern lines
  gameCtx.beginPath();
  gameCtx.moveTo(x + 5, y + basket.height / 2);
  gameCtx.lineTo(x + basket.width - 5, y + basket.height / 2);
  gameCtx.strokeStyle = "#a0522d";
  gameCtx.stroke();
  gameCtx.restore();
}

function ctxDrawRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function startGame() {
  if (isPlayingGame) return;
  
  // Cost check
  let hasFree = appState.stats.freeGames > 0;
  if (!hasFree && appState.stats.points < 20) {
    alert("Bạn không đủ xu để chơi! Cần 20 xu mỗi lượt chơi (hoặc 1 lượt quay trúng chơi Free).");
    return;
  }
  
  if (hasFree) {
    appState.stats.freeGames -= 1;
  } else {
    appState.stats.points -= 20;
  }
  
  saveStats();
  updateStatsUI();
  
  // Reset game state
  gameScore = 0;
  gameLives = 3;
  gameTimeLeft = 60;
  fallingObjects = [];
  isPlayingGame = true;
  
  document.getElementById('game-start-overlay').style.display = 'none';
  document.getElementById('game-score-val').textContent = gameScore;
  document.getElementById('game-lives-val').textContent = "❤️❤️❤️";
  document.getElementById('game-timer-val').textContent = "60s";
  
  gameInterval = setInterval(updateGameLoop, 20); // ~50fps
  gameTimerInterval = setInterval(updateGameTimer, 1000);
}

function updateGameTimer() {
  if (!isPlayingGame) return;
  
  gameTimeLeft -= 1;
  document.getElementById('game-timer-val').textContent = `${gameTimeLeft}s`;
  
  if (gameTimeLeft <= 0) {
    endGame(true);
  }
}

function updateGameLoop() {
  // 1. Clear
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  // 2. Background hints
  gameCtx.fillStyle = "rgba(255, 117, 151, 0.01)";
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  // 3. Spawn objects
  if (Math.random() < 0.05) {
    spawnFallingObject();
  }
  
  // 4. Update basket by keys
  if (keysPressed['left']) {
    basket.x -= basket.speed;
    if (basket.x < 0) basket.x = 0;
  }
  if (keysPressed['right']) {
    basket.x += basket.speed;
    if (basket.x > gameCanvas.width - basket.width) basket.x = gameCanvas.width - basket.width;
  }
  
  // 5. Draw Basket
  drawBasket(basket.x, basket.y);
  
  // 6. Update falling items
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    let obj = fallingObjects[i];
    obj.y += obj.speed;
    
    // Check basket collision
    if (obj.y + obj.radius >= basket.y && obj.y <= basket.y + basket.height &&
        obj.x >= basket.x && obj.x <= basket.x + basket.width) {
      
      handleObjectHit(obj);
      fallingObjects.splice(i, 1);
      continue;
    }
    
    // Bottom check
    if (obj.y - obj.radius > gameCanvas.height) {
      fallingObjects.splice(i, 1);
      continue;
    }
    
    // Draw
    drawFallingObject(obj);
  }
}

function spawnFallingObject() {
  const types = [
    { type: 'pink_sakura', emoji: '🌸', speed: 2.2 + Math.random() * 1.5, radius: 10, weight: 70 },
    { type: 'gold_sakura', emoji: '✨', speed: 3.5 + Math.random() * 2, radius: 8, weight: 10 },
    { type: 'pest', emoji: '🐛', speed: 2.5 + Math.random() * 1.5, radius: 12, weight: 20 }
  ];
  
  let totalWeight = types.reduce((acc, t) => acc + t.weight, 0);
  let randomVal = Math.random() * totalWeight;
  let selectedType = types[0];
  let sum = 0;
  
  for (let t of types) {
    sum += t.weight;
    if (randomVal <= sum) {
      selectedType = t;
      break;
    }
  }
  
  fallingObjects.push({
    x: Math.random() * (gameCanvas.width - 30) + 15,
    y: -15,
    emoji: selectedType.emoji,
    type: selectedType.type,
    speed: selectedType.speed,
    radius: selectedType.radius
  });
}

function drawFallingObject(obj) {
  gameCtx.save();
  gameCtx.font = `${obj.radius * 2}px sans-serif`;
  gameCtx.textAlign = 'center';
  gameCtx.textBaseline = 'middle';
  gameCtx.fillText(obj.emoji, obj.x, obj.y);
  gameCtx.restore();
}

function handleObjectHit(obj) {
  if (obj.type === 'pink_sakura') {
    gameScore += 1;
  } else if (obj.type === 'gold_sakura') {
    gameScore += 5;
  } else if (obj.type === 'pest') {
    gameLives -= 1;
    let hearts = '';
    for (let i = 0; i < gameLives; i++) hearts += '❤️';
    document.getElementById('game-lives-val').textContent = hearts || '💀';
    
    if (gameLives <= 0) {
      endGame(false);
    }
  }
  
  document.getElementById('game-score-val').textContent = gameScore;
}

function endGame(timeOut) {
  isPlayingGame = false;
  clearInterval(gameInterval);
  clearInterval(gameTimerInterval);
  
  // Quy đổi điểm
  const earnedCoins = Math.floor(gameScore / 5);
  appState.stats.points += earnedCoins;
  saveStats();
  updateStatsUI();
  
  // Show restart overlay
  const overlay = document.getElementById('game-start-overlay');
  overlay.style.display = 'flex';
  
  overlay.innerHTML = `
    <h3 style="margin: 0; color: var(--sakura-pink); font-size: 1.6rem;">Trò Chơi Kết Thúc</h3>
    <p style="font-size: 1rem; margin: 0; color: #fff; font-weight: 700;">
      Điểm đạt được: ${gameScore} điểm<br>
      🪙 Quy đổi: <span style="color: var(--sakura-pink); font-weight: 800;">+${earnedCoins} xu thưởng</span>!
    </p>
    <p style="font-size: 0.8rem; margin: 0; color: #9ca3af; max-width: 250px; line-height: 1.4;">
      ${timeOut ? 'Hết giờ rồi!' : 'Bạn đã hết mạng sống do va chạm phải sâu hại!'} Hãy tiếp tục tích xu và quay thưởng nhé.
    </p>
    <button class="btn btn-primary" id="btn-restart-game-btn" style="font-size: 0.9rem; padding: 0.5rem 1.5rem; margin-top: 0.5rem;">Chơi lại (-20 xu)</button>
  `;
  
  document.getElementById('btn-restart-game-btn').addEventListener('click', () => {
    overlay.innerHTML = `
      <h3 style="margin: 0; color: var(--sakura-pink); font-size: 1.5rem;">Hứng Hoa Anh Đào</h3>
      <p style="font-size: 0.85rem; margin: 0; line-height: 1.5; color: #d1d5db;">
        Di chuyển chiếc giỏ (di chuột hoặc kéo trên điện thoại) để hứng cánh hoa rơi:<br>
        🌸 <strong>Cánh hoa hồng:</strong> +1 điểm<br>
        ✨ <strong>Cánh hoa vàng:</strong> +5 điểm<br>
        🐛 <strong>Sâu róm hại cây:</strong> Né tránh! Chạm phải mất 1 mạng.<br>
        Bạn có 3 mạng và 60 giây. Cần <strong>20 xu</strong> mỗi lượt chơi.
      </p>
      <button class="btn btn-primary" id="btn-start-game" style="font-size: 0.9rem; padding: 0.5rem 1.5rem;">Bắt đầu (-20 xu)</button>
    `;
    initGameCanvas();
    startGame();
  });
}
