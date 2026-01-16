/**
 * Orchestrating Community - Interactive Concert Quiz
 * Main Application Logic
 */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION
    // ==========================================================================
    
    const CONFIG = {
        // Idle timeout (ms) - return to welcome screen after inactivity
        IDLE_TIMEOUT: 120000, // 2 minutes
        
        // Enable idle timeout reset (always recommended for public kiosks)
        IDLE_RESET_ENABLED: true,
        
        // Auto-advance delay after selecting an answer (ms)
        ANSWER_DELAY: 600,
        
        // Enable/disable idle attract screen for kiosk mode
        // When true, shows a special attract screen; when false, just resets to welcome
        KIOSK_MODE: false,
        
        // Enable sound effects (placeholder for future)
        SOUND_ENABLED: false
    };

    // ==========================================================================
    // STATE
    // ==========================================================================
    
    const state = {
        currentScreen: 'welcome',
        currentQuestionIndex: 0,
        userAnswers: [],
        idleTimer: null,
        isTransitioning: false
    };

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    
    const elements = {
        app: document.getElementById('app'),
        screens: {
            welcome: document.getElementById('welcome-screen'),
            question: document.getElementById('question-screen'),
            result: document.getElementById('result-screen'),
            idle: document.getElementById('idle-screen')
        },
        // Welcome
        startBtn: document.getElementById('start-btn'),
        
        // Question
        progressFill: document.getElementById('progress-fill'),
        progressText: document.getElementById('progress-text'),
        questionText: document.getElementById('question-text'),
        answersGrid: document.getElementById('answers-grid'),
        backBtn: document.getElementById('back-btn'),
        startOverBtn: document.getElementById('start-over-btn'),
        
        // Result
        resultTitle: document.getElementById('result-title'),
        resultImage: document.getElementById('result-image'),
        resultDescription: document.getElementById('result-description'),
        resultCard: document.getElementById('result-card'),
        restartBtn: document.getElementById('restart-btn')
    };

    // ==========================================================================
    // SCREEN MANAGEMENT
    // ==========================================================================
    
    /**
     * Switch to a different screen with animation
     * @param {string} screenName - Name of screen to show
     */
    function showScreen(screenName) {
        if (state.isTransitioning) return;
        state.isTransitioning = true;

        const currentScreenEl = elements.screens[state.currentScreen];
        const nextScreenEl = elements.screens[screenName];

        // Exit current screen
        if (currentScreenEl) {
            currentScreenEl.classList.add('exiting');
            currentScreenEl.classList.remove('active');
        }

        // Enter new screen after brief delay
        setTimeout(() => {
            if (currentScreenEl) {
                currentScreenEl.classList.remove('exiting');
            }
            
            nextScreenEl.classList.add('active');
            state.currentScreen = screenName;
            state.isTransitioning = false;
            
            // Reset idle timer
            resetIdleTimer();
        }, 300);
    }

    // ==========================================================================
    // QUIZ LOGIC
    // ==========================================================================
    
    /**
     * Start the quiz from the beginning
     */
    function startQuiz() {
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        showScreen('question');
        renderQuestion();
    }

    /**
     * Render the current question and answers
     */
    function renderQuestion() {
        const question = QuizData.QUESTIONS[state.currentQuestionIndex];
        const totalQuestions = QuizData.QUESTIONS.length;

        // Update progress
        const progress = ((state.currentQuestionIndex + 1) / totalQuestions) * 100;
        elements.progressFill.style.width = `${progress}%`;
        elements.progressText.textContent = `${state.currentQuestionIndex + 1} of ${totalQuestions}`;

        // Update question text with animation reset
        elements.questionText.style.animation = 'none';
        elements.questionText.offsetHeight; // Trigger reflow
        elements.questionText.style.animation = '';
        elements.questionText.textContent = question.question;

        // Render answer buttons
        elements.answersGrid.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer.text;
            btn.dataset.answerId = answer.id;
            btn.style.animationDelay = `${0.1 + (index * 0.1)}s`;
            
            // Check if this answer was previously selected
            const previousAnswer = state.userAnswers.find(
                a => a.questionId === question.id
            );
            if (previousAnswer && previousAnswer.answerId === answer.id) {
                btn.classList.add('selected');
            }

            btn.addEventListener('click', (e) => handleAnswerSelect(e, answer.id));
            btn.addEventListener('touchstart', handleTouchStart, { passive: true });
            
            elements.answersGrid.appendChild(btn);
        });

        // Show/hide back button
        if (state.currentQuestionIndex > 0) {
            elements.backBtn.classList.add('visible');
        } else {
            elements.backBtn.classList.remove('visible');
        }
    }

    /**
     * Handle answer selection
     * @param {Event} e - Click event
     * @param {string} answerId - Selected answer ID
     */
    function handleAnswerSelect(e, answerId) {
        const question = QuizData.QUESTIONS[state.currentQuestionIndex];
        
        // Add ripple effect
        createRipple(e);
        
        // Update selection visually
        const buttons = elements.answersGrid.querySelectorAll('.answer-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        e.currentTarget.classList.add('selected');

        // Store answer (replace if already answered this question)
        const existingIndex = state.userAnswers.findIndex(
            a => a.questionId === question.id
        );
        
        const answerData = {
            questionId: question.id,
            answerId: answerId
        };

        if (existingIndex >= 0) {
            state.userAnswers[existingIndex] = answerData;
        } else {
            state.userAnswers.push(answerData);
        }

        // Auto-advance after delay
        setTimeout(() => {
            if (state.currentQuestionIndex < QuizData.QUESTIONS.length - 1) {
                state.currentQuestionIndex++;
                renderQuestion();
            } else {
                showResult();
            }
        }, CONFIG.ANSWER_DELAY);
    }

    /**
     * Go back to previous question
     */
    function goBack() {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            renderQuestion();
        }
    }

    /**
     * Calculate and show the result
     */
    function showResult() {
        const result = QuizData.calculateResult(state.userAnswers);
        
        // Set result-specific styling
        elements.screens.result.dataset.result = result.result.id;
        
        // Update result content
        elements.resultTitle.textContent = result.result.title;
        elements.resultDescription.textContent = result.result.description;
        
        // Update placeholder icon based on result
        const placeholder = elements.resultImage.querySelector('.placeholder-icon');
        if (placeholder) {
            placeholder.textContent = result.result.icon;
        }

        showScreen('result');
        
        // Log result for analytics (placeholder)
        console.log('Quiz Result:', {
            result: result.result.title,
            scores: result.scores
        });
    }

    /**
     * Restart the quiz
     */
    function restartQuiz() {
        showScreen('welcome');
    }

    // ==========================================================================
    // TOUCH & INTERACTION HELPERS
    // ==========================================================================
    
    /**
     * Create ripple effect on touch/click
     * @param {Event} e - Touch/click event
     */
    function createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top;
        
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Handle touch start for better touch feedback
     * @param {TouchEvent} e - Touch event
     */
    function handleTouchStart(e) {
        // Prevents delay on touch devices
        e.currentTarget.focus();
    }

    // ==========================================================================
    // IDLE / KIOSK MODE
    // ==========================================================================
    
    /**
     * Reset the idle timer - resets quiz after period of inactivity
     */
    function resetIdleTimer() {
        if (!CONFIG.IDLE_RESET_ENABLED) return;
        
        clearTimeout(state.idleTimer);
        
        // Only set timer if not already on welcome screen
        if (state.currentScreen !== 'welcome') {
            state.idleTimer = setTimeout(() => {
                if (state.currentScreen !== 'welcome') {
                    // In kiosk mode, show attract screen; otherwise just reset to welcome
                    if (CONFIG.KIOSK_MODE) {
                        showScreen('idle');
                    } else {
                        resetToStart();
                    }
                }
            }, CONFIG.IDLE_TIMEOUT);
        }
    }

    /**
     * Reset quiz to start (welcome screen) and clear state
     */
    function resetToStart() {
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        showScreen('welcome');
    }

    /**
     * Handle any interaction to reset idle timer and exit idle mode
     */
    function handleInteraction() {
        resetIdleTimer();
        
        if (state.currentScreen === 'idle') {
            showScreen('welcome');
        }
    }

    // ==========================================================================
    // EVENT LISTENERS
    // ==========================================================================
    
    function initEventListeners() {
        // Welcome screen - start quiz
        elements.startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startQuiz();
        });
        elements.startBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            startQuiz();
        });
        elements.screens.welcome.addEventListener('click', (e) => {
            if (e.target !== elements.startBtn && !elements.startBtn.contains(e.target)) {
                startQuiz();
            }
        });
        elements.screens.welcome.addEventListener('touchend', (e) => {
            if (e.target !== elements.startBtn && !elements.startBtn.contains(e.target)) {
                e.preventDefault();
                startQuiz();
            }
        });

        // Question screen - back button
        elements.backBtn.addEventListener('click', goBack);
        elements.backBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            goBack();
        });
        
        // Question screen - start over button
        if (elements.startOverBtn) {
            elements.startOverBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                resetToStart();
            });
            elements.startOverBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                resetToStart();
            });
        } else {
            console.warn('Start Over button not found');
        }

        // Result screen - restart
        elements.restartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            restartQuiz();
        });
        elements.restartBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            restartQuiz();
        });

        // Idle screen - tap to start
        elements.screens.idle.addEventListener('click', () => {
            showScreen('welcome');
        });

        // Global interaction tracking for idle timeout (always active when enabled)
        if (CONFIG.IDLE_RESET_ENABLED) {
            document.addEventListener('touchstart', handleInteraction, { passive: true });
            document.addEventListener('click', handleInteraction);
            document.addEventListener('keydown', handleInteraction);
        }

        // Prevent context menu on long press (kiosk security)
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        // Keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (state.currentScreen === 'question') {
                    resetToStart();
                } else if (state.currentScreen === 'result') {
                    resetToStart();
                }
            }
        });
    }

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    function init() {
        console.log('🎵 Orchestrating Community Quiz initialized');
        console.log(`📊 ${QuizData.QUESTIONS.length} questions loaded`);
        console.log(`🎭 ${Object.keys(QuizData.RESULTS).length} result types available`);
        console.log(`⏱️ Idle timeout: ${CONFIG.IDLE_TIMEOUT / 1000}s (${CONFIG.IDLE_RESET_ENABLED ? 'enabled' : 'disabled'})`);
        
        initEventListeners();
        
        // Idle timer will start when user leaves welcome screen
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
