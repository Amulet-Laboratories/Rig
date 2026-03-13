<script setup lang="ts">
/**
 * Recipe Builder — Step-by-step cooking wizard
 * Theme: Calcite | Exercises: core, layout, lists, extras
 *
 * Showcase #11 — Recipe cards, ingredient lists by category,
 * step-by-step wizard with timers, nutritional info.
 */
import { ref, computed, onUnmounted } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import IconButton from '@core/primitives/IconButton.vue'
import StatusBar from '@nav/StatusBar.vue'
import Breadcrumbs from '@nav/Breadcrumbs.vue'
import Modal from '@layout/Modal.vue'
import Collapsible from '@layout/Collapsible.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  recipes,
  categoryConfig,
  difficultyConfig,
  getTotalTime,
  formatDuration,
  getIngredientsByCategory,
  getDailyPercent,
  type Recipe,
  type Step,
} from './fixtures/recipe-data'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const selectedRecipeId = ref<string | null>(null)
const activeStepIndex = ref(0)
const completedSteps = ref<Set<string>>(new Set())
const showNutritionModal = ref(false)
const checkedIngredients = ref<Set<string>>(new Set())
const view = ref<'browse' | 'cook'>('browse')

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const selectedRecipe = computed(
  () => recipes.find((r) => r.id === selectedRecipeId.value) ?? null,
)

const activeStep = computed(
  () => selectedRecipe.value?.steps[activeStepIndex.value] ?? null,
)

const progressPercent = computed(() => {
  if (!selectedRecipe.value) return 0
  return Math.round(
    (completedSteps.value.size / selectedRecipe.value.steps.length) * 100,
  )
})

const breadcrumbItems = computed(() => {
  const items = [
    { id: 'home', label: 'Recipes', icon: 'codicon:book' },
  ]
  if (selectedRecipe.value) {
    items.push({ id: 'recipe', label: selectedRecipe.value.title, icon: selectedRecipe.value.imageIcon })
  }
  if (view.value === 'cook' && activeStep.value) {
    items.push({ id: 'step', label: `Step ${activeStepIndex.value + 1}`, icon: 'codicon:play' })
  }
  return items
})

// ---------------------------------------------------------------------------
// Timer
// ---------------------------------------------------------------------------
const timerRunning = ref(false)
const timerSeconds = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

function startTimer(minutes: number) {
  stopTimer()
  timerSeconds.value = minutes * 60
  timerRunning.value = true
  timerInterval = setInterval(() => {
    timerSeconds.value--
    if (timerSeconds.value <= 0) {
      stopTimer()
      toast.add({ message: 'Timer complete!', variant: 'success' })
    }
  }, 1000)
}

function stopTimer() {
  timerRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onUnmounted(stopTimer)

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function selectRecipe(recipe: Recipe) {
  selectedRecipeId.value = recipe.id
  activeStepIndex.value = 0
  completedSteps.value.clear()
  checkedIngredients.value.clear()
  stopTimer()
  view.value = 'browse'
}

function startCooking() {
  view.value = 'cook'
  activeStepIndex.value = 0
}

function completeStep(step: Step) {
  completedSteps.value.add(step.id)
  stopTimer()
  if (selectedRecipe.value && activeStepIndex.value < selectedRecipe.value.steps.length - 1) {
    activeStepIndex.value++
  } else {
    toast.add({ message: 'All steps completed! Enjoy your meal.', variant: 'success' })
  }
}

function goBack() {
  if (view.value === 'cook') {
    view.value = 'browse'
    stopTimer()
  } else if (selectedRecipeId.value) {
    selectedRecipeId.value = null
  }
}

function toggleIngredient(id: string) {
  if (checkedIngredients.value.has(id)) {
    checkedIngredients.value.delete(id)
  } else {
    checkedIngredients.value.add(id)
  }
}

// ---------------------------------------------------------------------------
// Stars helper
// ---------------------------------------------------------------------------
function getStars(rating: number): string[] {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return [
    ...Array.from<string>({ length: full }).fill('codicon:star-full'),
    ...Array.from<string>({ length: half }).fill('codicon:star-half'),
    ...Array.from<string>({ length: empty }).fill('codicon:star-empty'),
  ]
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = computed(() => {
  const items: { id: string; content: string; priority: number; align: 'left' | 'right' }[] = [
    { id: 'app', content: 'Recipe Builder', priority: 1, align: 'left' },
  ]
  if (selectedRecipe.value) {
    items.push({
      id: 'recipe',
      content: selectedRecipe.value.title,
      priority: 2,
      align: 'left',
    })
    if (view.value === 'cook') {
      items.push({
        id: 'progress',
        content: `${progressPercent.value}% complete`,
        priority: 3,
        align: 'right',
      })
    }
  }
  items.push({
    id: 'count',
    content: `${recipes.length} recipes`,
    priority: 4,
    align: 'right',
  })
  return items
})
</script>

<template>
  <Story title="Recipe Builder" icon="codicon:beaker" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="rb-shell" data-theme="calcite">
        <!-- Breadcrumbs -->
        <Breadcrumbs :items="breadcrumbItems" @navigate="goBack" />

        <main class="rb-main">
          <!-- .... Browse: Recipe grid .... -->
          <template v-if="!selectedRecipeId">
            <header class="rb-header">
              <h1 class="rb-title">
                <Icon icon="codicon:book" size="lg" />
                Recipe Collection
              </h1>
              <p class="rb-subtitle">{{ recipes.length }} recipes to explore</p>
            </header>

            <div class="rb-grid">
              <Card
                v-for="recipe in recipes"
                :key="recipe.id"
                interactive
                @click="selectRecipe(recipe)"
              >
                <template #header>
                  <div class="rb-card-header">
                    <Icon :icon="recipe.imageIcon" size="lg" class="rb-card-icon" />
                    <div>
                      <h3 class="rb-card-title">{{ recipe.title }}</h3>
                      <div class="rb-card-meta">
                        <Badge :variant="(difficultyConfig[recipe.difficulty].variant as 'success' | 'warning' | 'danger')" size="xs">
                          {{ difficultyConfig[recipe.difficulty].label }}
                        </Badge>
                        <span class="rb-meta-time">
                          <Icon icon="codicon:clock" size="xs" />
                          {{ formatDuration(getTotalTime(recipe)) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <p class="rb-card-desc">{{ recipe.description }}</p>
                <template #footer>
                  <div class="rb-card-footer">
                    <div class="rb-stars">
                      <Icon v-for="(star, idx) in getStars(recipe.rating)" :key="idx" :icon="star" size="xs" class="rb-star" />
                      <span class="rb-rating-num">{{ recipe.rating }}</span>
                    </div>
                    <div class="rb-card-tags">
                      <Badge v-for="tag in recipe.tags.slice(0, 2)" :key="tag" variant="muted" size="xs">
                        {{ tag }}
                      </Badge>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </template>

          <!-- .... Browse: Recipe detail .... -->
          <template v-else-if="selectedRecipe && view === 'browse'">
            <div class="rb-detail">
              <!-- Back + title -->
              <header class="rb-detail-header">
                <IconButton ariaLabel="Back to recipes" @click="goBack">
                  <Icon icon="codicon:arrow-left" size="sm" />
                </IconButton>
                <div>
                  <h2 class="rb-detail-title">{{ selectedRecipe.title }}</h2>
                  <p class="rb-detail-desc">{{ selectedRecipe.description }}</p>
                </div>
              </header>

              <!-- Info bar -->
              <div class="rb-info-bar">
                <div class="rb-info-item">
                  <Icon icon="codicon:clock" size="sm" />
                  <span>
                    <strong>Prep:</strong> {{ formatDuration(selectedRecipe.prepTime) }}
                  </span>
                </div>
                <div class="rb-info-item">
                  <Icon icon="codicon:flame" size="sm" />
                  <span>
                    <strong>Cook:</strong> {{ formatDuration(selectedRecipe.cookTime) }}
                  </span>
                </div>
                <div class="rb-info-item">
                  <Icon icon="codicon:person" size="sm" />
                  <span>{{ selectedRecipe.servings }} servings</span>
                </div>
                <Badge :variant="(difficultyConfig[selectedRecipe.difficulty].variant as 'success' | 'warning' | 'danger')" size="sm">
                  <Icon :icon="difficultyConfig[selectedRecipe.difficulty].icon" size="xs" />
                  {{ difficultyConfig[selectedRecipe.difficulty].label }}
                </Badge>
                <Button variant="ghost" size="sm" @click="showNutritionModal = true">
                  <Icon icon="codicon:pie-chart" size="sm" />
                  Nutrition
                </Button>
              </div>

              <!-- Ingredients by category -->
              <section class="rb-ingredients">
                <h3 class="rb-section-title">
                  <Icon icon="codicon:list-unordered" size="sm" />
                  Ingredients
                </h3>
                <Collapsible
                  v-for="[cat, items] in getIngredientsByCategory(selectedRecipe)"
                  :key="cat"
                  defaultOpen
                >
                  <template #trigger="{ triggerProps }">
                    <span v-bind="triggerProps" class="rb-cat-label">
                      <Icon :icon="categoryConfig[cat].icon" size="sm" :style="{ color: categoryConfig[cat].color }" />
                      {{ categoryConfig[cat].label }}
                      <Badge variant="muted" size="xs">{{ items.length }}</Badge>
                    </span>
                  </template>
                  <ul class="rb-ingredient-list">
                    <li
                      v-for="ing in items"
                      :key="ing.id"
                      class="rb-ingredient"
                      :data-checked="checkedIngredients.has(ing.id) || undefined"
                      @click="toggleIngredient(ing.id)"
                    >
                      <span class="rb-checkbox">
                        <Icon :icon="checkedIngredients.has(ing.id) ? 'codicon:check' : 'codicon:circle-outline'" size="sm" />
                      </span>
                      <span class="rb-ing-amount">{{ ing.amount }} {{ ing.unit }}</span>
                      <span class="rb-ing-name">{{ ing.name }}</span>
                      <Badge v-if="ing.optional" variant="muted" size="xs">optional</Badge>
                    </li>
                  </ul>
                </Collapsible>
              </section>

              <!-- Steps overview -->
              <section class="rb-steps-overview">
                <h3 class="rb-section-title">
                  <Icon icon="codicon:list-ordered" size="sm" />
                  Steps
                  <Badge variant="muted" size="xs">{{ selectedRecipe.steps.length }}</Badge>
                </h3>
                <div class="rb-step-list">
                  <div v-for="step in selectedRecipe.steps" :key="step.id" class="rb-step-card">
                    <span class="rb-step-number">{{ step.order }}</span>
                    <div class="rb-step-info">
                      <strong>{{ step.title }}</strong>
                      <span v-if="step.duration" class="rb-step-dur">
                        <Icon icon="codicon:clock" size="xs" />
                        {{ formatDuration(step.duration) }}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Start cooking -->
              <div class="rb-action-bar">
                <Button variant="primary" @click="startCooking">
                  <Icon icon="codicon:play" size="sm" />
                  Start Cooking
                </Button>
              </div>
            </div>
          </template>

          <!-- .... Cook mode: Step wizard .... -->
          <template v-else-if="selectedRecipe && view === 'cook' && activeStep">
            <div class="rb-cook">
              <!-- Progress bar -->
              <div class="rb-progress-outer">
                <div class="rb-progress-bar" :style="{ width: `${progressPercent}%` }" />
              </div>

              <!-- Step timeline -->
              <div class="rb-timeline">
                <button
                  v-for="(step, idx) in selectedRecipe.steps"
                  :key="step.id"
                  class="rb-timeline-dot"
                  :data-active="idx === activeStepIndex || undefined"
                  :data-done="completedSteps.has(step.id) || undefined"
                  @click="activeStepIndex = idx"
                >
                  <span class="rb-dot-num">{{ step.order }}</span>
                </button>
              </div>

              <!-- Active step card -->
              <Card size="lg">
                <template #header>
                  <div class="rb-cook-header">
                    <Badge variant="primary" size="sm">Step {{ activeStep.order }} of {{ selectedRecipe.steps.length }}</Badge>
                    <h2 class="rb-cook-title">{{ activeStep.title }}</h2>
                  </div>
                </template>

                <p class="rb-cook-desc">{{ activeStep.description }}</p>

                <!-- Tip -->
                <div v-if="activeStep.tip" class="rb-cook-tip">
                  <Icon icon="codicon:lightbulb" size="sm" />
                  <span>{{ activeStep.tip }}</span>
                </div>

                <!-- Timer -->
                <div v-if="activeStep.duration > 0" class="rb-timer-section">
                  <div class="rb-timer-display">
                    <span class="rb-timer-time">
                      {{ timerRunning ? formatTimer(timerSeconds) : formatDuration(activeStep.duration) }}
                    </span>
                  </div>
                  <div class="rb-timer-actions">
                    <Button
                      v-if="!timerRunning"
                      variant="primary"
                      size="sm"
                      @click="startTimer(activeStep.duration)"
                    >
                      <Icon icon="codicon:play" size="sm" />
                      Start Timer
                    </Button>
                    <Button v-else variant="danger" size="sm" @click="stopTimer">
                      <Icon icon="codicon:debug-stop" size="sm" />
                      Stop
                    </Button>
                  </div>
                </div>

                <template #footer>
                  <div class="rb-cook-footer">
                    <Button
                      variant="ghost"
                      size="sm"
                      :disabled="activeStepIndex === 0"
                      @click="activeStepIndex--; stopTimer()"
                    >
                      <Icon icon="codicon:arrow-left" size="sm" />
                      Previous
                    </Button>
                    <Button
                      variant="primary"
                      @click="completeStep(activeStep)"
                    >
                      {{ activeStepIndex === selectedRecipe.steps.length - 1 ? 'Finish' : 'Complete Step' }}
                      <Icon icon="codicon:check" size="sm" />
                    </Button>
                  </div>
                </template>
              </Card>
            </div>
          </template>
        </main>

        <!-- Nutrition modal -->
        <Modal
          v-if="selectedRecipe"
          :open="showNutritionModal"
          ariaLabel="Nutrition Information"
          @update:open="showNutritionModal = $event"
        >
          <div class="rb-nutrition">
            <h3 class="rb-nutrition-title">
              <Icon icon="codicon:pie-chart" size="sm" />
              Nutrition per Serving
            </h3>
            <div class="rb-nutrition-grid">
              <div class="rb-nutrition-item rb-nutrition-cal">
                <span class="rb-nutr-val">{{ selectedRecipe.nutrition.calories }}</span>
                <span class="rb-nutr-label">Calories</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ selectedRecipe.nutrition.protein }}g</span>
                <span class="rb-nutr-label">Protein</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('protein', selectedRecipe.nutrition.protein)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('protein', selectedRecipe.nutrition.protein) }}%</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ selectedRecipe.nutrition.carbs }}g</span>
                <span class="rb-nutr-label">Carbs</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('carbs', selectedRecipe.nutrition.carbs)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('carbs', selectedRecipe.nutrition.carbs) }}%</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ selectedRecipe.nutrition.fat }}g</span>
                <span class="rb-nutr-label">Fat</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('fat', selectedRecipe.nutrition.fat)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('fat', selectedRecipe.nutrition.fat) }}%</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ selectedRecipe.nutrition.fiber }}g</span>
                <span class="rb-nutr-label">Fiber</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('fiber', selectedRecipe.nutrition.fiber)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('fiber', selectedRecipe.nutrition.fiber) }}%</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ selectedRecipe.nutrition.sodium }}mg</span>
                <span class="rb-nutr-label">Sodium</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('sodium', selectedRecipe.nutrition.sodium)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('sodium', selectedRecipe.nutrition.sodium) }}%</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" @click="showNutritionModal = false">Close</Button>
          </div>
        </Modal>

        <!-- Status bar -->
        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: INGREDIENT CHECKLIST ================== -->
    <Variant title="Ingredient Checklist">
      <div class="rb-shell" data-theme="calcite">
        <main class="rb-main rb-padded">
          <header class="rb-detail-header">
            <Icon :icon="recipes[0]!.imageIcon" size="lg" />
            <div>
              <h2 class="rb-detail-title">{{ recipes[0]!.title }}</h2>
              <p class="rb-detail-desc">Shopping checklist</p>
            </div>
          </header>

          <section class="rb-ingredients">
            <Collapsible
              v-for="[cat, items] in getIngredientsByCategory(recipes[0]!)"
              :key="cat"
              defaultOpen
            >
              <template #trigger="{ triggerProps }">
                <span v-bind="triggerProps" class="rb-cat-label">
                  <Icon :icon="categoryConfig[cat].icon" size="sm" :style="{ color: categoryConfig[cat].color }" />
                  {{ categoryConfig[cat].label }}
                  <Badge variant="muted" size="xs">{{ items.length }}</Badge>
                </span>
              </template>
              <ul class="rb-ingredient-list">
                <li
                  v-for="ing in items"
                  :key="ing.id"
                  class="rb-ingredient"
                  :data-checked="checkedIngredients.has(ing.id) || undefined"
                  @click="toggleIngredient(ing.id)"
                >
                  <span class="rb-checkbox">
                    <Icon :icon="checkedIngredients.has(ing.id) ? 'codicon:check' : 'codicon:circle-outline'" size="sm" />
                  </span>
                  <span class="rb-ing-amount">{{ ing.amount }} {{ ing.unit }}</span>
                  <span class="rb-ing-name">{{ ing.name }}</span>
                  <Badge v-if="ing.optional" variant="muted" size="xs">optional</Badge>
                </li>
              </ul>
            </Collapsible>
          </section>
        </main>
        <StatusBar :items="[{ id: 'checked', content: `${checkedIngredients.size} / ${recipes[0]!.ingredients.length} checked`, priority: 1, align: 'left' }]" />
      </div>
    </Variant>

    <!-- ================== VARIANT: STEP WIZARD ================== -->
    <Variant title="Step Wizard">
      <div class="rb-shell" data-theme="calcite">
        <main class="rb-main rb-padded">
          <div class="rb-cook">
            <div class="rb-progress-outer">
              <div class="rb-progress-bar" :style="{ width: '42%' }" />
            </div>

            <div class="rb-timeline">
              <button
                v-for="(step, idx) in recipes[0]!.steps"
                :key="step.id"
                class="rb-timeline-dot"
                :data-active="idx === 3 || undefined"
                :data-done="idx < 3 || undefined"
              >
                <span class="rb-dot-num">{{ step.order }}</span>
              </button>
            </div>

            <Card size="lg">
              <template #header>
                <div class="rb-cook-header">
                  <Badge variant="primary" size="sm">Step 4 of {{ recipes[0]!.steps.length }}</Badge>
                  <h2 class="rb-cook-title">{{ recipes[0]!.steps[3]!.title }}</h2>
                </div>
              </template>
              <p class="rb-cook-desc">{{ recipes[0]!.steps[3]!.description }}</p>
              <div v-if="recipes[0]!.steps[3]!.tip" class="rb-cook-tip">
                <Icon icon="codicon:lightbulb" size="sm" />
                <span>{{ recipes[0]!.steps[3]!.tip }}</span>
              </div>
              <div v-if="recipes[0]!.steps[3]!.duration > 0" class="rb-timer-section">
                <div class="rb-timer-display">
                  <span class="rb-timer-time">{{ formatDuration(recipes[0]!.steps[3]!.duration) }}</span>
                </div>
                <Button variant="primary" size="sm">
                  <Icon icon="codicon:play" size="sm" />
                  Start Timer
                </Button>
              </div>
              <template #footer>
                <div class="rb-cook-footer">
                  <Button variant="ghost" size="sm">
                    <Icon icon="codicon:arrow-left" size="sm" />
                    Previous
                  </Button>
                  <Button variant="primary">
                    Complete Step
                    <Icon icon="codicon:check" size="sm" />
                  </Button>
                </div>
              </template>
            </Card>
          </div>
        </main>
        <StatusBar :items="[{ id: 'step', content: 'Step 4 of 7', priority: 1, align: 'left' }, { id: 'progress', content: '42% complete', priority: 2, align: 'right' }]" />
      </div>
    </Variant>

    <!-- ================== VARIANT: NUTRITION INFO ================== -->
    <Variant title="Nutrition Info">
      <div class="rb-shell" data-theme="calcite">
        <main class="rb-main rb-padded">
          <div class="rb-nutrition rb-nutrition-standalone">
            <h3 class="rb-nutrition-title">
              <Icon icon="codicon:pie-chart" size="sm" />
              {{ recipes[0]!.title }} — Nutrition per Serving
            </h3>
            <div class="rb-nutrition-grid">
              <div class="rb-nutrition-item rb-nutrition-cal">
                <span class="rb-nutr-val">{{ recipes[0]!.nutrition.calories }}</span>
                <span class="rb-nutr-label">Calories</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ recipes[0]!.nutrition.protein }}g</span>
                <span class="rb-nutr-label">Protein</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('protein', recipes[0]!.nutrition.protein)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('protein', recipes[0]!.nutrition.protein) }}% DV</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ recipes[0]!.nutrition.carbs }}g</span>
                <span class="rb-nutr-label">Carbs</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('carbs', recipes[0]!.nutrition.carbs)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('carbs', recipes[0]!.nutrition.carbs) }}% DV</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ recipes[0]!.nutrition.fat }}g</span>
                <span class="rb-nutr-label">Fat</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('fat', recipes[0]!.nutrition.fat)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('fat', recipes[0]!.nutrition.fat) }}% DV</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ recipes[0]!.nutrition.fiber }}g</span>
                <span class="rb-nutr-label">Fiber</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('fiber', recipes[0]!.nutrition.fiber)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('fiber', recipes[0]!.nutrition.fiber) }}% DV</span>
              </div>
              <div class="rb-nutrition-item">
                <span class="rb-nutr-val">{{ recipes[0]!.nutrition.sodium }}mg</span>
                <span class="rb-nutr-label">Sodium</span>
                <div class="rb-nutr-bar">
                  <div class="rb-nutr-fill" :style="{ width: `${getDailyPercent('sodium', recipes[0]!.nutrition.sodium)}%` }" />
                </div>
                <span class="rb-nutr-pct">{{ getDailyPercent('sodium', recipes[0]!.nutrition.sodium) }}% DV</span>
              </div>
            </div>
          </div>
        </main>
        <StatusBar :items="[]" />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY STATE ================== -->
    <Variant title="Empty Collection">
      <div class="rb-shell" data-theme="calcite">
        <main class="rb-main">
          <div class="rb-empty-center">
            <EmptyState
              title="No recipes yet"
              description="Create your first recipe to get started with your collection."
              icon="codicon:beaker"
            >
              <template #action>
                <Button variant="primary">
                  <Icon icon="codicon:add" size="sm" />
                  Create Recipe
                </Button>
              </template>
            </EmptyState>
          </div>
        </main>
        <StatusBar :items="[{ id: 'app', content: 'Recipe Builder', priority: 1, align: 'left' }]" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.rb-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #faf8f5);
  color: var(--color-foreground, #1a1a1a);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
}

.rb-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.rb-main.rb-padded {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* ---- Header ---- */
.rb-header {
  margin-bottom: 24px;
}

.rb-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.rb-subtitle {
  margin: 4px 0 0;
  color: var(--color-muted-foreground, #888);
  font-size: 14px;
}

/* ---- Recipe grid ---- */
.rb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.rb-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rb-card-icon {
  font-size: 28px;
  color: var(--color-primary, #6366f1);
}

.rb-card-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.rb-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.rb-meta-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}

.rb-card-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-muted-foreground, #666);
}

.rb-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rb-stars {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rb-star {
  color: var(--color-warning, #ffc107);
}

.rb-rating-num {
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
  color: var(--color-muted-foreground, #888);
}

.rb-card-tags {
  display: flex;
  gap: 4px;
}

/* ---- Recipe detail ---- */
.rb-detail {
  max-width: 800px;
  margin: 0 auto;
}

.rb-detail-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.rb-detail-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.rb-detail-desc {
  margin: 4px 0 0;
  color: var(--color-muted-foreground, #888);
  font-size: 14px;
}

/* ---- Info bar ---- */
.rb-info-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-foreground, #000) 4%, transparent);
  margin-bottom: 24px;
}

.rb-info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

/* ---- Ingredients ---- */
.rb-ingredients {
  margin-bottom: 24px;
}

.rb-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 12px;
}

.rb-cat-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.rb-ingredient-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rb-ingredient {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  transition: background 0.1s;
}

.rb-ingredient:hover {
  background: color-mix(in srgb, var(--color-foreground, #000) 4%, transparent);
}

.rb-ingredient[data-checked] .rb-ing-name,
.rb-ingredient[data-checked] .rb-ing-amount {
  text-decoration: line-through;
  color: var(--color-muted-foreground, #888);
}

.rb-checkbox {
  flex-shrink: 0;
  color: var(--color-primary, #6366f1);
}

.rb-ing-amount {
  font-weight: 600;
  min-width: 60px;
}

.rb-ing-name {
  flex: 1;
}

/* ---- Steps overview ---- */
.rb-steps-overview {
  margin-bottom: 24px;
}

.rb-step-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rb-step-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-foreground, #000) 3%, transparent);
}

.rb-step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary, #6366f1);
  color: var(--color-primary-foreground, #fff);
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.rb-step-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.rb-step-dur {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-muted-foreground, #888);
  font-size: 12px;
}

/* ---- Action bar ---- */
.rb-action-bar {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* ---- Cook mode ---- */
.rb-cook {
  max-width: 700px;
  margin: 0 auto;
}

.rb-progress-outer {
  height: 4px;
  background: color-mix(in srgb, var(--color-foreground, #000) 10%, transparent);
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
}

.rb-progress-bar {
  height: 100%;
  background: var(--color-primary, #6366f1);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ---- Timeline ---- */
.rb-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.rb-timeline-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--color-foreground, #000) 15%, transparent);
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  transition: all 0.15s;
}

.rb-timeline-dot[data-active] {
  border-color: var(--color-primary, #6366f1);
  background: var(--color-primary, #6366f1);
  color: var(--color-primary-foreground, #fff);
}

.rb-timeline-dot[data-done] {
  border-color: var(--color-success, #4caf50);
  background: var(--color-success, #4caf50);
  color: var(--color-primary-foreground, #fff);
}

.rb-dot-num {
  line-height: 1;
}

/* ---- Cook content ---- */
.rb-cook-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rb-cook-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.rb-cook-desc {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.rb-cook-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-warning, #ffc107) 10%, transparent);
  border-left: 3px solid var(--color-warning, #ffc107);
  margin-top: 12px;
  font-size: 13px;
}

/* ---- Timer ---- */
.rb-timer-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-foreground, #000) 4%, transparent);
}

.rb-timer-display {
  display: flex;
  align-items: center;
}

.rb-timer-time {
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.rb-timer-actions {
  display: flex;
  gap: 8px;
}

.rb-cook-footer {
  display: flex;
  justify-content: space-between;
}

/* ---- Nutrition ---- */
.rb-nutrition {
  padding: 20px;
}

.rb-nutrition-standalone {
  max-width: 600px;
  margin: 0 auto;
}

.rb-nutrition-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px;
}

.rb-nutrition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.rb-nutrition-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rb-nutrition-cal {
  grid-column: 1 / -1;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border, #ddd);
  margin-bottom: 4px;
}

.rb-nutr-val {
  font-size: 20px;
  font-weight: 700;
}

.rb-nutrition-cal .rb-nutr-val {
  font-size: 36px;
}

.rb-nutr-label {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}

.rb-nutr-bar {
  height: 4px;
  background: color-mix(in srgb, var(--color-foreground, #000) 10%, transparent);
  border-radius: 2px;
  overflow: hidden;
}

.rb-nutr-fill {
  height: 100%;
  background: var(--color-primary, #6366f1);
  border-radius: 2px;
}

.rb-nutr-pct {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Empty ---- */
.rb-empty-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
