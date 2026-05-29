<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { useReducedMotion } from '@core/composables'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Width */
    width?: number
    /** Height */
    height?: number
    /** Number of particles */
    count?: number
    /** Whether the animation is active */
    active?: boolean
    /** Particle speed multiplier */
    speed?: number
    /** Whether new particles continuously spawn */
    continuous?: boolean
  }>(),
  {
    width: 500,
    height: 400,
    count: 50,
    active: true,
    speed: 1,
    continuous: true,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const particles = ref<Particle[]>([])
const prefersReducedMotion = useReducedMotion()
let animFrameId: number | null = null

function createParticle(): Particle {
  return {
    x: Math.random() * props.width,
    y: Math.random() * props.height,
    vx: (Math.random() - 0.5) * 2 * props.speed,
    vy: (Math.random() - 0.5) * 2 * props.speed,
    size: Math.random() * 3 + 1,
    life: Math.random() * 100,
    maxLife: 100 + Math.random() * 100,
  }
}

function initParticles() {
  particles.value = Array.from({ length: props.count }, createParticle)
}

function updateParticles() {
  particles.value = particles.value
    .map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      life: p.life + 1,
    }))
    .filter((p) => p.life < p.maxLife)

  if (props.continuous) {
    while (particles.value.length < props.count) {
      particles.value.push(createParticle())
    }
  }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, props.width, props.height)

  for (const p of particles.value) {
    const alpha = Math.max(0, 1 - p.life / p.maxLife)
    ctx.globalAlpha = alpha * 0.8
    ctx.fillStyle = p.color ?? (getComputedStyle(canvas).color || '#888')
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
}

function tick() {
  if (!props.active) return
  updateParticles()
  draw()
  // Respect prefers-reduced-motion: render one static frame instead of looping
  if (prefersReducedMotion.value) return
  animFrameId = requestAnimationFrame(tick)
}

function start() {
  if (animFrameId) return
  tick()
}

function stop() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
}

watch(
  () => props.active,
  (val) => {
    if (val) start()
    else stop()
  },
)

onMounted(() => {
  initParticles()
  if (props.active) start()
})

onBeforeUnmount(() => stop())
</script>

<template>
  <div
    data-rig-particle-field
    :data-active="active || undefined"
    :style="{ width: `${width}px`, height: `${height}px` }"
    role="presentation"
    aria-hidden="true"
    tabindex="-1"
    @keydown.stop
  >
    <canvas ref="canvasRef" data-rig-particle-field-canvas :width="width" :height="height" />
  </div>
</template>
