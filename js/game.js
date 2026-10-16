// ==========================================================================
// KOTOBA FLIP - ARCADE ENGINE
// Gameplay mechanics, state handling, speech synthesis, Title Menu & stage loop
// ==========================================================================

class KotobaFlipGame {
  constructor() {
    this.currentView = 'title'; // 'title' or 'play'
    this.currentDeckKey = 'katakana';
    this.matrixMode = 'hard'; // 'normal' (4x3 = 12 cards) or 'hard' (5x6 = 30 cards)
    this.isTimeAttack = false;
    
    this.cards = [];
    this.flippedCards = [];
    this.isLocked = false;
    this.isPaused = false;
    
    this.score = 0;
    this.combo = 1;
    this.maxCombo = 1;
    this.turns = 0;
    this.matchedPairs = 0;
    this.totalPairs = 15;
    
    this.timeLeft = 120;
    this.totalTime = 120;
    this.timerInterval = null;
    
    this.hintsLeft = 2;
    this.credits = 9;
    this.kotobaLog = [];
    
    this.dom = {};
  }

  init() {
    this.cacheDom();
    this.bindEvents();
    this.loadLeaderboard();
    // Start on Title Menu
    this.switchView('title');
  }

  cacheDom() {
    // Screens
    this.dom.viewTitleMenu = document.getElementById('viewTitleMenu');
    this.dom.viewPlayStage = document.getElementById('viewPlayStage');

    // Title Menu Controls
    this.dom.btnMainPlay = document.getElementById('btnMainPlay');
    this.dom.modeCardN5 = document.getElementById('modeCardN5');
    this.dom.modeCardTimeAttack = document.getElementById('modeCardTimeAttack');
    this.dom.modeCardGallery = document.getElementById('modeCardGallery');
    this.dom.modeCardGuide = document.getElementById('modeCardGuide');
    this.dom.titleCrtToggleBtn = document.getElementById('titleCrtToggleBtn');
    this.dom.titleCrtText = document.getElementById('titleCrtText');
    this.dom.titleBgmToggleBtn = document.getElementById('titleBgmToggleBtn');
    this.dom.titleBgmText = document.getElementById('titleBgmText');
    this.dom.btnBackToTitle = document.getElementById('btnBackToTitle');
    this.dom.brandLogoHome = document.getElementById('brandLogoHome');

    // Play Stage Elements
    this.dom.cardGrid = document.getElementById('cardGrid');
    this.dom.timerValue = document.getElementById('timerValue');
    this.dom.timerGaugeBar = document.getElementById('timerGaugeBar');
    this.dom.turnsValue = document.getElementById('turnsValue');
    this.dom.comboBadge = document.getElementById('comboBadge');
    this.dom.comboValue = document.getElementById('comboValue');
    this.dom.scoreValue = document.getElementById('scoreValue');
    this.dom.hintBtn = document.getElementById('hintBtn');
    this.dom.hintCount = document.getElementById('hintCount');
    this.dom.pauseBtn = document.getElementById('pauseBtn');
    this.dom.pauseBtnIcon = document.getElementById('pauseBtnIcon');
    
    this.dom.remainingBlocks = document.getElementById('remainingBlocks');
    this.dom.totalBlocks = document.getElementById('totalBlocks');
    this.dom.blockSegments = document.getElementById('blockSegments');
    this.dom.matchedPairsCount = document.getElementById('matchedPairsCount');
    this.dom.totalPairsCount = document.getElementById('totalPairsCount');
    this.dom.logTicker = document.getElementById('logTicker');
    
    this.dom.headerCredits = document.getElementById('headerCredits');
    this.dom.footerCredits = document.getElementById('footerCredits');
    this.dom.comboStreakStatus = document.getElementById('comboStreakStatus');
    this.dom.hudDeckName = document.getElementById('hudDeckName');
    this.dom.hudDeckSub = document.getElementById('hudDeckSub');
    this.dom.currentDeckBadge = document.getElementById('currentDeckBadge');
    
    this.dom.matrixModeBtn = document.getElementById('matrixModeBtn');
    this.dom.matrixModeLabel = document.getElementById('matrixModeLabel');
    this.dom.matrixOptions = document.getElementById('matrixOptions');
    
    this.dom.crtToggleBtn = document.getElementById('crtToggleBtn');
    this.dom.crtStateText = document.getElementById('crtStateText');
    this.dom.bgmToggleBtn = document.getElementById('bgmToggleBtn');
    this.dom.bgmStateText = document.getElementById('bgmStateText');
    this.dom.voiceToggleBtn = document.getElementById('voiceToggleBtn');
    this.dom.voiceStateText = document.getElementById('voiceStateText');
    
    this.dom.coinInsertBtn = document.getElementById('coinInsertBtn');
    this.dom.toastContainer = document.getElementById('toastContainer');
    
    // Tabs & Modals
    this.dom.tabTitleMenu = document.getElementById('tabTitleMenu');
    this.dom.tabPlayStage = document.getElementById('tabPlayStage');
    this.dom.tabDeckGallery = document.getElementById('tabDeckGallery');
    this.dom.tabHallOfFame = document.getElementById('tabHallOfFame');
    
    this.dom.modalDeckGallery = document.getElementById('modalDeckGallery');
    this.dom.modalHallOfFame = document.getElementById('modalHallOfFame');
    this.dom.modalGuide = document.getElementById('modalGuide');
    this.dom.modalResult = document.getElementById('modalResult');
    
    this.dom.galleryGrid = document.getElementById('galleryGrid');
    this.dom.scoreboardBody = document.getElementById('scoreboardBody');
    
    this.dom.shuffleBtn = document.getElementById('shuffleBtn');
    this.dom.guideBtn = document.getElementById('guideBtn');
    this.dom.restartBtn = document.getElementById('restartBtn');
    this.dom.btnNextStage = document.getElementById('btnNextStage');
    this.dom.btnPlaySelectedDeck = document.getElementById('btnPlaySelectedDeck');
  }

  bindEvents() {
    // Brand Logo -> Go to Title Menu
    this.dom.brandLogoHome.addEventListener('click', () => {
      this.switchView('title');
    });

    // Back to Title Button
    this.dom.btnBackToTitle.addEventListener('click', () => {
      this.switchView('title');
    });

    // Title Menu Start Button
    this.dom.btnMainPlay.addEventListener('click', () => {
      window.arcadeAudio.playCoin();
      this.isTimeAttack = false;
      this.setupGame('katakana', 'hard');
      this.switchView('play');
    });

    // Keyboard support: Enter or Space on Title Screen
    document.addEventListener('keydown', (e) => {
      if (this.currentView === 'title' && !document.querySelector('.arcade-modal.show')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.dom.btnMainPlay.click();
        }
      }
    });

    // Title Mode Cards
    this.dom.modeCardN5.addEventListener('click', () => {
      window.arcadeAudio.playCoin();
      this.isTimeAttack = false;
      this.setupGame('kanji_n5', 'hard');
      this.switchView('play');
    });

    this.dom.modeCardTimeAttack.addEventListener('click', () => {
      window.arcadeAudio.playCoin();
      this.isTimeAttack = true;
      this.setupGame('katakana', 'normal');
      this.timeLeft = 60;
      this.totalTime = 60;
      this.updateHUD();
      this.switchView('play');
      this.showToast("TIME ATTACK 60s BLITZ! ⚡", "combo");
    });

    this.dom.modeCardGallery.addEventListener('click', () => {
      this.setActiveNavTab(this.dom.tabDeckGallery);
      this.renderDeckGallery(this.currentDeckKey);
      this.openModal(this.dom.modalDeckGallery);
    });

    this.dom.modeCardGuide.addEventListener('click', () => {
      this.openModal(this.dom.modalGuide);
    });

    // Title Screen Toggles
    this.dom.titleCrtToggleBtn.addEventListener('click', () => this.toggleCRT());
    this.dom.titleBgmToggleBtn.addEventListener('click', () => this.toggleBGM());

    // Navigation Tabs
    this.dom.tabTitleMenu.addEventListener('click', () => {
      this.switchView('title');
    });

    this.dom.tabPlayStage.addEventListener('click', () => {
      if (this.cards.length === 0) {
        this.setupGame(this.currentDeckKey, this.matrixMode);
      }
      this.switchView('play');
    });

    this.dom.tabDeckGallery.addEventListener('click', () => {
      this.setActiveNavTab(this.dom.tabDeckGallery);
      this.renderDeckGallery(this.currentDeckKey);
      this.openModal(this.dom.modalDeckGallery);
    });

    this.dom.tabHallOfFame.addEventListener('click', () => {
      this.setActiveNavTab(this.dom.tabHallOfFame);
      this.renderHallOfFame();
      this.openModal(this.dom.modalHallOfFame);
    });

    // Mode selector dropdown in play stage
    this.dom.matrixModeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.matrixOptions.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      this.dom.matrixOptions.classList.remove('show');
    });

    this.dom.matrixOptions.querySelectorAll('.matrix-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        const mode = opt.dataset.mode;
        this.dom.matrixOptions.querySelectorAll('.matrix-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.setMatrixMode(mode);
      });
    });

    // Stage Toggles
    this.dom.crtToggleBtn.addEventListener('click', () => this.toggleCRT());
    this.dom.bgmToggleBtn.addEventListener('click', () => this.toggleBGM());
    this.dom.voiceToggleBtn.addEventListener('click', () => this.toggleVoice());
    this.dom.coinInsertBtn.addEventListener('click', () => this.insertCoin());

    // Gameplay Actions
    this.dom.hintBtn.addEventListener('click', () => this.useHint());
    this.dom.pauseBtn.addEventListener('click', () => this.togglePause());
    this.dom.shuffleBtn.addEventListener('click', () => this.shuffleBoard());
    this.dom.restartBtn.addEventListener('click', () => this.setupGame(this.currentDeckKey, this.matrixMode));
    this.dom.guideBtn.addEventListener('click', () => this.openModal(this.dom.modalGuide));
    this.dom.btnNextStage.addEventListener('click', () => {
      this.closeModal(this.dom.modalResult);
      const deckKeys = Object.keys(window.VOCAB_DECKS);
      const nextIdx = (deckKeys.indexOf(this.currentDeckKey) + 1) % deckKeys.length;
      this.setupGame(deckKeys[nextIdx], this.matrixMode);
    });

    // Modal Close
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) this.closeModal(modal);
        if (this.currentView === 'title') {
          this.setActiveNavTab(this.dom.tabTitleMenu);
        } else {
          this.setActiveNavTab(this.dom.tabPlayStage);
        }
      });
    });

    // Deck chips in gallery
    document.querySelectorAll('.deck-select-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.deck-select-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderDeckGallery(chip.dataset.deck);
      });
    });

    this.dom.btnPlaySelectedDeck.addEventListener('click', () => {
      const activeChip = document.querySelector('.deck-select-chip.active');
      const selectedDeck = activeChip ? activeChip.dataset.deck : 'katakana';
      this.closeModal(this.dom.modalDeckGallery);
      this.setupGame(selectedDeck, this.matrixMode);
      this.switchView('play');
    });

    // Clear scores button
    const clearScoresBtn = document.getElementById('btnClearScores');
    if (clearScoresBtn) {
      clearScoresBtn.addEventListener('click', () => {
        localStorage.removeItem('kotoba_arcade_scores');
        this.renderHallOfFame();
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    this.closeAllModals();

    if (viewName === 'title') {
      this.dom.viewTitleMenu.classList.add('active');
      this.dom.viewPlayStage.classList.remove('active');
      this.setActiveNavTab(this.dom.tabTitleMenu);
      this.stopTimer();
    } else {
      this.dom.viewTitleMenu.classList.remove('active');
      this.dom.viewPlayStage.classList.add('active');
      this.setActiveNavTab(this.dom.tabPlayStage);
      if (this.cards.length === 0) {
        this.setupGame(this.currentDeckKey, this.matrixMode);
      } else if (!this.isPaused && this.timeLeft > 0) {
        this.startTimer();
      }
    }
  }

  setActiveNavTab(activeTab) {
    [this.dom.tabTitleMenu, this.dom.tabPlayStage, this.dom.tabDeckGallery, this.dom.tabHallOfFame].forEach(tab => {
      if (tab) tab.classList.remove('active');
    });
    if (activeTab) activeTab.classList.add('active');
  }

  setMatrixMode(mode) {
    this.matrixMode = mode;
    if (mode === 'normal') {
      this.dom.matrixModeLabel.textContent = 'NORMAL MATRIX [4x3]';
      this.dom.cardGrid.className = 'card-grid normal-grid';
    } else {
      this.dom.matrixModeLabel.textContent = 'HARD MODE MATRIX [5x6]';
      this.dom.cardGrid.className = 'card-grid hard-grid';
    }
    this.setupGame(this.currentDeckKey, this.matrixMode);
  }

  setupGame(deckKey = 'katakana', mode = 'hard') {
    this.stopTimer();
    this.currentDeckKey = deckKey;
    const deck = window.VOCAB_DECKS[deckKey] || window.VOCAB_DECKS.katakana;
    
    this.totalPairs = (mode === 'hard') ? 15 : 6;
    const totalCards = this.totalPairs * 2;
    
    this.totalTime = this.isTimeAttack ? 60 : ((mode === 'hard') ? 120 : 65);
    this.timeLeft = this.totalTime;
    this.score = 0;
    this.combo = 1;
    this.maxCombo = 1;
    this.turns = 0;
    this.matchedPairs = 0;
    this.hintsLeft = 2;
    this.flippedCards = [];
    this.isLocked = false;
    this.isPaused = false;
    this.kotobaLog = [];

    // Update HUD text
    this.dom.hudDeckName.textContent = deck.name.toUpperCase();
    this.dom.hudDeckSub.textContent = deck.subtitle.toUpperCase();
    this.dom.currentDeckBadge.querySelector('.badge-title').textContent = `STAGE • ${deck.name.toUpperCase()}`;

    // Select vocab pairs
    const shuffledPairs = [...deck.pairs].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledPairs.slice(0, this.totalPairs);

    // Twin entities: One Japanese, One Meaning
    const cardEntities = [];
    selectedPairs.forEach(p => {
      cardEntities.push({
        pairId: p.id,
        type: 'japanese',
        kana: p.kana,
        romaji: p.romaji,
        furigana: p.furigana || p.romaji,
        meaning: p.meaning,
        icon: p.icon,
        isFlipped: false,
        isMatched: false
      });
      cardEntities.push({
        pairId: p.id,
        type: 'meaning',
        kana: p.kana,
        romaji: p.romaji,
        furigana: p.furigana || p.romaji,
        meaning: p.meaning,
        icon: p.icon,
        isFlipped: false,
        isMatched: false
      });
    });

    this.cards = cardEntities.sort(() => Math.random() - 0.5);

    this.updateHUD();
    this.renderBoard();
    this.renderBlockSegments(totalCards, totalCards);
    this.startTimer();
    this.showToast("IKUZO! STAGE START", "combo");
  }

  renderBoard() {
    this.dom.cardGrid.innerHTML = '';
    this.cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'matrix-card';
      cardEl.dataset.index = index;
      cardEl.setAttribute('role', 'button');
      cardEl.setAttribute('tabindex', '0');
      cardEl.setAttribute('aria-label', `Balok memori ke-${index + 1}`);

      // Card Back (Vivid Red Token)
      const backFace = document.createElement('div');
      backFace.className = 'card-face card-back';
      backFace.innerHTML = `
        <div class="back-emblem">?</div>
      `;

      // Card Front (Revealed Content)
      const frontFace = document.createElement('div');
      frontFace.className = 'card-face card-front';
      
      if (card.type === 'japanese') {
        frontFace.innerHTML = `
          <span class="card-icon">${card.icon}</span>
          <span class="card-kanji-text">${card.kana}</span>
          <span class="card-kana-sub">(${card.romaji})</span>
        `;
      } else {
        frontFace.innerHTML = `
          <span class="card-icon">${card.icon}</span>
          <span class="card-meaning-text">${card.meaning.split(' ')[0]}</span>
          <span class="card-meaning-sub">${card.meaning.replace(card.meaning.split(' ')[0], '').trim()}</span>
        `;
      }

      cardEl.appendChild(backFace);
      cardEl.appendChild(frontFace);

      cardEl.addEventListener('click', () => this.handleCardClick(cardEl, index));
      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(cardEl, index);
        }
      });

      this.dom.cardGrid.appendChild(cardEl);
    });
  }

  handleCardClick(cardEl, index) {
    if (this.isLocked || this.isPaused) return;
    const card = this.cards[index];
    if (card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    cardEl.classList.add('flipped');
    window.arcadeAudio.playFlip();

    if (card.type === 'japanese') {
      window.arcadeAudio.speakJapanese(card.kana);
    }

    this.flippedCards.push({ card, el: cardEl, index });

    if (this.flippedCards.length === 2) {
      this.turns++;
      this.updateHUD();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [c1, c2] = this.flippedCards;

    if (c1.card.pairId === c2.card.pairId) {
      c1.card.isMatched = true;
      c2.card.isMatched = true;

      this.combo = Math.min(this.combo + 1, 5);
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      const baseScore = 350;
      const roundScore = baseScore * this.combo;
      this.score += roundScore;
      this.matchedPairs++;

      setTimeout(() => {
        c1.el.classList.add('matched');
        c2.el.classList.add('matched');

        const badge1 = document.createElement('div');
        badge1.className = 'matched-pair-pill';
        badge1.innerHTML = '★ PAIR';
        c1.el.querySelector('.card-front').appendChild(badge1);

        const badge2 = document.createElement('div');
        badge2.className = 'matched-pair-pill';
        badge2.innerHTML = '★ PAIR';
        c2.el.querySelector('.card-front').appendChild(badge2);

        window.arcadeAudio.playMatch(this.combo);
        window.arcadeAudio.speakJapanese(c1.card.kana);

        const burstMessages = ["SUGOI! 🔥", "PERFECT! ⭐", "SUBARASHII! ⚡", "IKUZO! 🎌", "DAISUKI! 💖"];
        const randMsg = burstMessages[Math.floor(Math.random() * burstMessages.length)];
        this.showToast(this.combo >= 2 ? `${randMsg} COMBO x${this.combo}` : randMsg, this.combo >= 3 ? "perfect" : "sugoi");

        this.appendKotobaLog(c1.card.kana, c1.card.meaning);

        this.flippedCards = [];
        this.isLocked = false;
        this.updateHUD();

        if (this.matchedPairs === this.totalPairs) {
          this.handleVictory();
        }
      }, 350);

    } else {
      this.combo = 1;
      setTimeout(() => {
        window.arcadeAudio.playMismatch();
        c1.card.isFlipped = false;
        c2.card.isFlipped = false;
        c1.el.classList.remove('flipped');
        c2.el.classList.remove('flipped');

        this.flippedCards = [];
        this.isLocked = false;
        this.updateHUD();
      }, 850);
    }
  }

  useHint() {
    if (this.hintsLeft <= 0 || this.isLocked || this.isPaused) return;
    this.hintsLeft--;
    this.updateHUD();
    window.arcadeAudio.playHint();
    this.showToast("RINGO-CHAN RADAR HINT! 🍎", "combo");

    const unmatched = this.cards
      .map((c, idx) => ({ c, idx }))
      .filter(item => !item.c.isMatched && !item.c.isFlipped);

    const pairGroups = {};
    unmatched.forEach(item => {
      if (!pairGroups[item.c.pairId]) pairGroups[item.c.pairId] = [];
      pairGroups[item.c.pairId].push(item.idx);
    });

    const candidatePairKeys = Object.keys(pairGroups).filter(k => pairGroups[k].length === 2);
    const hintPairs = candidatePairKeys.slice(0, 2);
    const indicesToReveal = [];
    hintPairs.forEach(k => {
      indicesToReveal.push(...pairGroups[k]);
    });

    const cardElements = this.dom.cardGrid.querySelectorAll('.matrix-card');
    indicesToReveal.forEach(idx => {
      const el = cardElements[idx];
      el.classList.add('flipped', 'hint-active');
    });

    setTimeout(() => {
      indicesToReveal.forEach(idx => {
        const el = cardElements[idx];
        el.classList.remove('hint-active');
        if (!this.cards[idx].isMatched && !this.flippedCards.some(f => f.index === idx)) {
          el.classList.remove('flipped');
        }
      });
    }, 1600);
  }

  shuffleBoard() {
    if (this.isLocked || this.isPaused) return;
    window.arcadeAudio.playCoin();
    this.showToast("SHUFFLE MATRIX! 🔀", "sugoi");

    const unmatchedIndices = [];
    const unmatchedData = [];
    this.cards.forEach((card, idx) => {
      if (!card.isMatched) {
        unmatchedIndices.push(idx);
        unmatchedData.push(card);
      }
    });

    const shuffled = unmatchedData.sort(() => Math.random() - 0.5);
    unmatchedIndices.forEach((origIdx, i) => {
      this.cards[origIdx] = shuffled[i];
    });

    this.renderBoard();
    const cardElements = this.dom.cardGrid.querySelectorAll('.matrix-card');
    this.cards.forEach((card, idx) => {
      if (card.isMatched) {
        cardElements[idx].classList.add('flipped', 'matched');
      }
    });
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      this.timeLeft--;
      this.updateHUD();

      if (this.timeLeft <= 0) {
        this.handleGameOver();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.dom.pauseBtnIcon.textContent = '▶';
      this.showToast("PAUSED ⏸", "sugoi");
    } else {
      this.dom.pauseBtnIcon.textContent = '⏸';
      this.showToast("RESUME! 🎌", "combo");
    }
  }

  updateHUD() {
    const mins = Math.floor(Math.max(this.timeLeft, 0) / 60);
    const secs = Math.max(this.timeLeft, 0) % 60;
    this.dom.timerValue.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const pct = Math.max(0, (this.timeLeft / this.totalTime) * 100);
    this.dom.timerGaugeBar.style.width = `${pct}%`;
    if (pct <= 20) {
      this.dom.timerGaugeBar.className = 'timer-gauge-bar critical';
    } else if (pct <= 45) {
      this.dom.timerGaugeBar.className = 'timer-gauge-bar warning';
    } else {
      this.dom.timerGaugeBar.className = 'timer-gauge-bar';
    }

    this.dom.turnsValue.textContent = String(this.turns).padStart(2, '0');
    this.dom.scoreValue.textContent = this.score.toLocaleString();

    this.dom.comboValue.textContent = `COMBO x${this.combo}`;
    if (this.combo >= 2) {
      this.dom.comboBadge.classList.add('high-combo');
      this.dom.comboStreakStatus.textContent = `x${this.combo} AKTIF (BONUS x${this.combo * 0.5 + 0.5})`;
      this.dom.comboStreakStatus.className = 'bonus-value highlight';
    } else {
      this.dom.comboBadge.classList.remove('high-combo');
      this.dom.comboStreakStatus.textContent = 'x1 STANDBY';
      this.dom.comboStreakStatus.className = 'bonus-value';
    }

    this.dom.hintCount.textContent = String(this.hintsLeft).padStart(2, '0');
    this.dom.hintBtn.disabled = (this.hintsLeft <= 0);

    const remaining = (this.totalPairs - this.matchedPairs) * 2;
    const total = this.totalPairs * 2;
    this.dom.remainingBlocks.textContent = remaining;
    this.dom.totalBlocks.textContent = total;
    this.dom.matchedPairsCount.textContent = this.matchedPairs;
    this.dom.totalPairsCount.textContent = this.totalPairs;

    this.renderBlockSegments(remaining, total);
  }

  renderBlockSegments(remaining, total) {
    this.dom.blockSegments.innerHTML = '';
    const segmentCount = Math.min(total, 15);
    const clearedCount = Math.floor(((total - remaining) / total) * segmentCount);
    for (let i = 0; i < segmentCount; i++) {
      const seg = document.createElement('div');
      seg.className = i < clearedCount ? 'block-segment cleared' : 'block-segment';
      this.dom.blockSegments.appendChild(seg);
    }
  }

  appendKotobaLog(kana, meaning) {
    this.kotobaLog.unshift(`${kana} = ${meaning.split(' ')[0]}`);
    if (this.kotobaLog.length > 5) this.kotobaLog.pop();
    this.dom.logTicker.innerHTML = this.kotobaLog.join(' • ');
  }

  handleVictory() {
    this.stopTimer();
    window.arcadeAudio.playVictory();

    const timeBonus = this.timeLeft * 25;
    const finalScore = this.score + timeBonus;

    document.getElementById('resultTitle').textContent = 'STAGE CLEAR!';
    document.getElementById('resultSubtitle').textContent = 'SUGOI! ANDA MENGUASAI KOSAKATA JEPANG DENGAN SEMPURNA!';
    document.getElementById('resFinalScore').textContent = finalScore.toLocaleString();
    
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    document.getElementById('resTimeLeft').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('resTotalTurns').textContent = this.turns;
    document.getElementById('resMaxCombo').textContent = `x${this.maxCombo}`;

    this.saveScore(finalScore, 'CLEAR');
    this.openModal(this.dom.modalResult);
  }

  handleGameOver() {
    this.stopTimer();
    window.arcadeAudio.playGameOver();

    document.getElementById('resultTitle').textContent = 'TIME OVER!';
    document.getElementById('resultSubtitle').textContent = 'WAKTU HABIS! COBA LAGI UNTUK MEMECAHKAN REKOR!';
    document.getElementById('resFinalScore').textContent = this.score.toLocaleString();
    document.getElementById('resTimeLeft').textContent = '00:00';
    document.getElementById('resTotalTurns').textContent = this.turns;
    document.getElementById('resMaxCombo').textContent = `x${this.maxCombo}`;

    this.saveScore(this.score, 'TIME OUT');
    this.openModal(this.dom.modalResult);
  }

  saveScore(score, status) {
    try {
      const scores = JSON.parse(localStorage.getItem('kotoba_arcade_scores') || '[]');
      const mins = Math.floor(this.timeLeft / 60);
      const secs = this.timeLeft % 60;
      scores.push({
        operator: `OPERATOR-${Math.floor(100 + Math.random() * 900)}`,
        mode: this.matrixMode.toUpperCase(),
        turns: this.turns,
        timeLeft: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
        score: score,
        date: new Date().toLocaleDateString('id-ID')
      });
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem('kotoba_arcade_scores', JSON.stringify(scores.slice(0, 10)));
    } catch (e) {
      console.warn("Storage failed", e);
    }
  }

  getDefaultLeaderboard() {
    return [
      { operator: "NAEL", title: "👑 THE CHAMPION (GOAT)", mode: "HARD", turns: 14, timeLeft: "01:45", score: 9850, isChampion: true },
      { operator: "Hikmal", mode: "HARD", turns: 24, timeLeft: "00:41", score: 4420 },
      { operator: "andika rahman", mode: "HARD", turns: 26, timeLeft: "00:34", score: 4150 },
      { operator: "andika pratama", mode: "HARD", turns: 28, timeLeft: "00:29", score: 3920 },
      { operator: "Irham", mode: "HARD", turns: 30, timeLeft: "00:22", score: 3740 },
      { operator: "nafis", mode: "HARD", turns: 31, timeLeft: "00:18", score: 3510 },
      { operator: "Alensa", mode: "NORMAL", turns: 16, timeLeft: "00:35", score: 3360 },
      { operator: "Naila", mode: "NORMAL", turns: 18, timeLeft: "00:28", score: 3180 },
      { operator: "Riki", mode: "HARD", turns: 35, timeLeft: "00:11", score: 2950 },
      { operator: "Husro", mode: "HARD", turns: 37, timeLeft: "00:09", score: 2820 },
      { operator: "anjani", mode: "NORMAL", turns: 20, timeLeft: "00:22", score: 2640 },
      { operator: "nabila", mode: "NORMAL", turns: 21, timeLeft: "00:19", score: 2490 },
      { operator: "Takim", mode: "HARD", turns: 40, timeLeft: "00:06", score: 2310 },
      { operator: "Vena", mode: "NORMAL", turns: 24, timeLeft: "00:15", score: 2150 },
      { operator: "Reva", mode: "NORMAL", turns: 25, timeLeft: "00:12", score: 1980 },
      { operator: "Syello", mode: "NORMAL", turns: 27, timeLeft: "00:10", score: 1840 },
      { operator: "Reyfan", mode: "HARD", turns: 44, timeLeft: "00:03", score: 1720 },
      { operator: "Raihan", mode: "NORMAL", turns: 29, timeLeft: "00:08", score: 1590 },
      { operator: "Putra", mode: "NORMAL", turns: 30, timeLeft: "00:06", score: 1460 },
      { operator: "Bagas", mode: "HARD", turns: 48, timeLeft: "TIME OUT", score: 1320 },
      { operator: "Arya", mode: "NORMAL", turns: 32, timeLeft: "00:04", score: 1180 },
      { operator: "Ednes", mode: "NORMAL", turns: 34, timeLeft: "00:02", score: 1050 },
      { operator: "Made", mode: "HARD", turns: 50, timeLeft: "TIME OUT", score: 890 }
    ];
  }

  saveScore(score, status) {
    try {
      let scores = JSON.parse(localStorage.getItem('kotoba_arcade_scores') || '[]');
      if (scores.length === 0 || !scores.some(s => s.operator === 'NAEL')) {
        scores = this.getDefaultLeaderboard();
      }
      const mins = Math.floor(this.timeLeft / 60);
      const secs = this.timeLeft % 60;
      scores.push({
        operator: `OPERATOR-${Math.floor(100 + Math.random() * 900)}`,
        mode: this.matrixMode.toUpperCase(),
        turns: this.turns,
        timeLeft: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
        score: score,
        date: new Date().toLocaleDateString('id-ID')
      });
      // Sort scores descending
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem('kotoba_arcade_scores', JSON.stringify(scores.slice(0, 30)));
    } catch (e) {
      console.warn("Storage failed", e);
    }
  }

  loadLeaderboard() {
    try {
      const stored = localStorage.getItem('kotoba_arcade_scores');
      if (!stored) {
        localStorage.setItem('kotoba_arcade_scores', JSON.stringify(this.getDefaultLeaderboard()));
      } else {
        const parsed = JSON.parse(stored);
        // If parsed is old version without the 22 names, refresh to requested roster
        if (!parsed.some(s => s.operator === 'Hikmal')) {
          localStorage.setItem('kotoba_arcade_scores', JSON.stringify(this.getDefaultLeaderboard()));
        }
      }
    } catch (e) {
      localStorage.setItem('kotoba_arcade_scores', JSON.stringify(this.getDefaultLeaderboard()));
    }
  }

  renderHallOfFame() {
    let scores = [];
    try {
      scores = JSON.parse(localStorage.getItem('kotoba_arcade_scores') || '[]');
    } catch (e) {}

    if (scores.length === 0) {
      scores = this.getDefaultLeaderboard();
      localStorage.setItem('kotoba_arcade_scores', JSON.stringify(scores));
    }

    this.dom.scoreboardBody.innerHTML = '';
    scores.forEach((s, idx) => {
      const tr = document.createElement('tr');
      const isNael = s.operator.toUpperCase().includes('NAEL') || s.isChampion || idx === 0;
      if (isNael) {
        tr.className = 'champion-row';
      }

      const medal = idx === 0 ? '👑 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`;
      
      const operatorDisplay = isNael 
        ? `<strong>NAEL</strong> <span class="champion-badge-pill">JUARA UTAMA 🏆</span>` 
        : `<strong>${s.operator}</strong>`;

      tr.innerHTML = `
        <td style="font-weight:900; color:${isNael ? 'var(--token-yellow)' : '#94a3b8'};">${medal}</td>
        <td>${operatorDisplay}</td>
        <td><span style="font-size:0.75rem; background:${s.mode === 'HARD' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; padding:2px 6px; border-radius:4px; border:1px solid ${s.mode === 'HARD' ? 'var(--arcade-red)' : 'var(--neon-green)'};">${s.mode}</span></td>
        <td>${s.turns}</td>
        <td style="color:${s.timeLeft === 'TIME OUT' ? 'var(--arcade-red)' : 'var(--electric-cyan)'}; font-weight:700;">${s.timeLeft}</td>
        <td style="font-weight:900; color:${isNael ? 'var(--token-yellow)' : '#dae2fd'}; font-size:${isNael ? '1.25rem' : '1.02rem'}; text-shadow:${isNael ? '0 0 10px rgba(251,191,36,0.7)' : 'none'};">${s.score.toLocaleString()}</td>
      `;
      this.dom.scoreboardBody.appendChild(tr);
    });
  }

  renderDeckGallery(deckKey = 'katakana') {
    const deck = window.VOCAB_DECKS[deckKey] || window.VOCAB_DECKS.katakana;
    this.dom.galleryGrid.innerHTML = '';
    deck.pairs.forEach(p => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <div style="font-size:1.5rem; margin-bottom:4px;">${p.icon}</div>
        <div class="gallery-kanji">${p.kana}</div>
        <div class="gallery-romaji">(${p.romaji})</div>
        <div class="gallery-meaning">${p.meaning}</div>
      `;
      card.addEventListener('click', () => {
        window.arcadeAudio.playFlip();
        window.arcadeAudio.speakJapanese(p.kana);
        this.showToast(`🗣️ ${p.kana} (${p.romaji})`, "sugoi");
      });
      this.dom.galleryGrid.appendChild(card);
    });
  }

  showToast(text, type = "sugoi") {
    const toast = document.createElement('div');
    toast.className = `comic-toast ${type}`;
    toast.textContent = text;
    this.dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 1100);
  }

  insertCoin() {
    this.credits++;
    this.dom.headerCredits.textContent = String(this.credits).padStart(2, '0');
    this.dom.footerCredits.textContent = String(this.credits).padStart(2, '0');
    window.arcadeAudio.playCoin();
    this.showToast("COIN INSERTED! 🪙", "combo");
  }

  toggleCRT() {
    const isEnabled = document.body.classList.toggle('crt-enabled');
    this.dom.crtStateText.textContent = isEnabled ? 'ON' : 'OFF';
    this.dom.titleCrtText.textContent = isEnabled ? 'ON' : 'OFF';
    this.dom.crtToggleBtn.classList.toggle('active', isEnabled);
    this.dom.titleCrtToggleBtn.classList.toggle('active', isEnabled);
    window.arcadeAudio.playFlip();
  }

  toggleBGM() {
    const isPlaying = window.arcadeAudio.toggleBGM();
    this.dom.bgmStateText.textContent = isPlaying ? 'ON' : 'OFF';
    this.dom.titleBgmText.textContent = isPlaying ? 'ACTIVE' : 'INACTIVE';
    this.dom.bgmToggleBtn.classList.toggle('active', isPlaying);
    this.dom.titleBgmToggleBtn.classList.toggle('active', isPlaying);
  }

  toggleVoice() {
    window.arcadeAudio.voiceEnabled = !window.arcadeAudio.voiceEnabled;
    this.dom.voiceStateText.textContent = window.arcadeAudio.voiceEnabled ? 'ON' : 'OFF';
    this.dom.voiceToggleBtn.classList.toggle('active', window.arcadeAudio.voiceEnabled);
    window.arcadeAudio.playFlip();
  }

  openModal(modalEl) {
    if (modalEl) {
      modalEl.classList.add('show');
      modalEl.setAttribute('aria-hidden', 'false');
    }
  }

  closeModal(modalEl) {
    if (modalEl) {
      modalEl.classList.remove('show');
      modalEl.setAttribute('aria-hidden', 'true');
    }
  }

  closeAllModals() {
    document.querySelectorAll('.arcade-modal').forEach(m => {
      this.closeModal(m);
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.kotobaGame = new KotobaFlipGame();
  window.kotobaGame.init();
});
