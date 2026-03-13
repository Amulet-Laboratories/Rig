<script setup lang="ts">
/**
 * Character Quiz — Linear wizard flow showcase
 * Theme: Obsidian | Exercises: core, extras
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import Badge from '@core/primitives/Badge.vue'
import Progress from '@core/primitives/Progress.vue'

// ---- Mock Data ----
import { quiz, tallyScores, calculateResult, type QuizResult } from './fixtures/quiz-data'

// ---------------------------------------------------------------------------
// Quiz state
// ---------------------------------------------------------------------------
type Phase = 'start' | 'question' | 'result'

const phase = ref<Phase>('start')
const currentIndex = ref(0)
const selectedAnswers = ref<Map<string, number>>(new Map())
const result = ref<QuizResult | null>(null)
const transitioning = ref(false)
const selectedOption = ref<number | null>(null)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const totalQuestions = quiz.questions.length

const currentQuestion = computed(() => quiz.questions[currentIndex.value])

const progressPercent = computed(() =>
  phase.value === 'result' ? 100 : Math.round((currentIndex.value / totalQuestions) * 100),
)

const progressLabel = computed(() => {
  if (phase.value === 'start') return ''
  if (phase.value === 'result') return 'Complete'
  return `${currentIndex.value + 1} of ${totalQuestions}`
})

// Static variant data
const demoQuestion = quiz.questions[4]!
const demoResult = quiz.results[0]!

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function startQuiz() {
  phase.value = 'question'
  currentIndex.value = 0
  selectedAnswers.value.clear()
  result.value = null
  selectedOption.value = null
}

function selectAnswer(optionIndex: number) {
  if (transitioning.value) return
  selectedOption.value = optionIndex
  selectedAnswers.value.set(currentQuestion.value!.id, optionIndex)

  // Brief delay, then advance
  transitioning.value = true
  setTimeout(() => {
    if (currentIndex.value < totalQuestions - 1) {
      currentIndex.value++
      selectedOption.value = null
    } else {
      // Calculate result
      const scores = tallyScores(selectedAnswers.value, quiz.questions)
      result.value = calculateResult(scores)
      phase.value = 'result'
    }
    transitioning.value = false
  }, 400)
}

function retake() {
  phase.value = 'start'
  currentIndex.value = 0
  selectedAnswers.value.clear()
  result.value = null
  selectedOption.value = null
}
</script>

<template>
  <Story title="Character Quiz" icon="codicon:question" group="showcase">
    <Variant title="Full Flow">
      <div class="quiz-shell" data-theme="obsidian">
        <!-- Progress bar (hidden on start) -->
        <div v-if="phase !== 'start'" class="quiz-progress-bar">
          <Progress :value="progressPercent" />
          <span class="progress-label">{{ progressLabel }}</span>
        </div>

        <div class="quiz-container">
          <!-- ============ START SCREEN ============ -->
          <Transition name="quiz-fade" mode="out-in">
            <div v-if="phase === 'start'" key="start" class="quiz-start">
              <div class="quiz-hero">
                <Icon icon="codicon:beaker" size="xl" />
                <h1 class="quiz-title">{{ quiz.title }}</h1>
                <p class="quiz-description">{{ quiz.description }}</p>
                <div class="quiz-meta">
                  <Badge variant="muted">{{ totalQuestions }} questions</Badge>
                  <Badge variant="muted">{{ quiz.results.length }} results</Badge>
                </div>
                <Button variant="primary" size="lg" @click="startQuiz">
                  Begin
                  <Icon icon="codicon:arrow-right" size="sm" />
                </Button>
              </div>
            </div>

            <!-- ============ QUESTION SCREEN ============ -->
            <div v-else-if="phase === 'question'" :key="`q-${currentIndex}`" class="quiz-question">
              <div class="question-header">
                <Badge variant="muted" size="sm">
                  Question {{ currentIndex + 1 }}
                </Badge>
              </div>

              <h2 class="question-text">{{ currentQuestion!.text }}</h2>

              <div class="question-options">
                <Card
                  v-for="(option, idx) in currentQuestion!.options"
                  :key="idx"
                  interactive
                  :class="{
                    'option-selected': selectedOption === idx,
                    'option-disabled': transitioning && selectedOption !== idx,
                  }"
                  @click="selectAnswer(idx)"
                >
                  <div class="option-content">
                    <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
                    <span class="option-text">{{ option.text }}</span>
                  </div>
                </Card>
              </div>
            </div>

            <!-- ============ RESULT SCREEN ============ -->
            <div v-else-if="phase === 'result' && result" key="result" class="quiz-result">
              <Card class="result-card" :style="{ '--result-accent': result.color }">
                <div class="result-content">
                  <div class="result-icon" :style="{ color: result.color }">
                    <Icon icon="codicon:person" size="xl" />
                  </div>
                  <h2 class="result-title" :style="{ color: result.color }">
                    {{ result.title }}
                  </h2>
                  <p class="result-description">{{ result.description }}</p>
                  <div class="result-traits">
                    <Badge
                      v-for="trait in result.traits"
                      :key="trait"
                      :style="{
                        borderColor: result.color,
                        color: result.color,
                      }"
                    >
                      {{ trait }}
                    </Badge>
                  </div>
                </div>
              </Card>

              <div class="result-actions">
                <Button variant="primary" @click="retake">
                  <Icon icon="codicon:refresh" size="sm" />
                  Retake Quiz
                </Button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Variant>

    <Variant title="Start Screen">
      <div class="quiz-shell" data-theme="obsidian">
        <div class="quiz-container">
          <div class="quiz-start">
            <div class="quiz-hero">
              <Icon icon="codicon:beaker" size="xl" />
              <h1 class="quiz-title">{{ quiz.title }}</h1>
              <p class="quiz-description">{{ quiz.description }}</p>
              <div class="quiz-meta">
                <Badge variant="muted">{{ totalQuestions }} questions</Badge>
                <Badge variant="muted">{{ quiz.results.length }} results</Badge>
              </div>
              <Button variant="primary" size="lg">
                Begin
                <Icon icon="codicon:arrow-right" size="sm" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Mid-Question">
      <div class="quiz-shell" data-theme="obsidian">
        <div class="quiz-progress-bar">
          <Progress :value="50" />
          <span class="progress-label">5 of {{ totalQuestions }}</span>
        </div>
        <div class="quiz-container">
          <div class="quiz-question">
            <div class="question-header">
              <Badge variant="muted" size="sm">Question 5</Badge>
            </div>
            <h2 class="question-text">{{ demoQuestion.text }}</h2>
            <div class="question-options">
              <Card
                v-for="(option, idx) in demoQuestion.options"
                :key="idx"
                interactive
                :class="{ 'option-selected': idx === 1 }"
              >
                <div class="option-content">
                  <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
                  <span class="option-text">{{ option.text }}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Result Reveal">
      <div class="quiz-shell" data-theme="obsidian">
        <div class="quiz-progress-bar">
          <Progress :value="100" />
          <span class="progress-label">Complete</span>
        </div>
        <div class="quiz-container">
          <div class="quiz-result">
            <Card class="result-card" :style="{ '--result-accent': demoResult.color }">
              <div class="result-content">
                <div class="result-icon" :style="{ color: demoResult.color }">
                  <Icon icon="codicon:person" size="xl" />
                </div>
                <h2 class="result-title" :style="{ color: demoResult.color }">
                  {{ demoResult.title }}
                </h2>
                <p class="result-description">{{ demoResult.description }}</p>
                <div class="result-traits">
                  <Badge
                    v-for="trait in demoResult.traits"
                    :key="trait"
                    :style="{ borderColor: demoResult.color, color: demoResult.color }"
                  >
                    {{ trait }}
                  </Badge>
                </div>
              </div>
            </Card>
            <div class="result-actions">
              <Button variant="primary">
                <Icon icon="codicon:refresh" size="sm" />
                Retake Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.quiz-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #000);
  color: var(--color-foreground, #f0f0f0);
  font-family: var(--font-sans, Inter, sans-serif);
}

/* ---- Progress ---- */
.quiz-progress-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-border, #222);
}

.quiz-progress-bar :deep([data-rig-progress]) {
  flex: 1;
}

.progress-label {
  font-size: 12px;
  font-family: var(--font-mono, monospace);
  color: var(--color-muted-foreground, #a3a3a3);
  min-width: 70px;
  text-align: right;
}

/* ---- Container (centered column) ---- */
.quiz-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
}

/* ---- Start screen ---- */
.quiz-start {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.quiz-hero {
  max-width: 520px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.quiz-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.quiz-description {
  font-size: 15px;
  color: var(--color-muted-foreground, #a3a3a3);
  line-height: 1.5;
  margin: 0;
}

.quiz-meta {
  display: flex;
  gap: 8px;
}

/* ---- Question screen ---- */
.quiz-question {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.question-header {
  display: flex;
}

.question-text {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 4px;
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--color-border, #333);
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  color: var(--color-muted-foreground, #a3a3a3);
}

.option-text {
  font-size: 14px;
  line-height: 1.5;
  padding-top: 3px;
}

.option-selected {
  outline: 2px solid var(--color-primary, #60a5fa);
  outline-offset: -2px;
}

.option-selected .option-letter {
  background: var(--color-primary, #60a5fa);
  border-color: var(--color-primary, #60a5fa);
  color: var(--color-primary-foreground, #000);
}

.option-disabled {
  opacity: 0.4;
  pointer-events: none;
}

/* ---- Result screen ---- */
.quiz-result {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.result-card {
  width: 100%;
}

.result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 16px;
}

.result-icon {
  font-size: 48px;
}

.result-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.result-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-muted-foreground, #a3a3a3);
  margin: 0;
  max-width: 420px;
}

.result-traits {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.result-actions {
  display: flex;
  gap: 12px;
}

/* ---- Transitions ---- */
.quiz-fade-enter-active,
.quiz-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.quiz-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.quiz-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
