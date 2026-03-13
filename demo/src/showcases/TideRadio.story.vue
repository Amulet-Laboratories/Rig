<script setup lang="ts">
/**
 * Tide Radio — Music player interface
 * Theme: Obsidian | Exercises: core, nav, layout, lists, extras
 *
 * Showcase #15 — Playlist browser, now playing, track list,
 * equalizer visualisation, volume control, player controls.
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Icon from '@core/primitives/Icon.vue'
import IconButton from '@core/primitives/IconButton.vue'
import Input from '@core/primitives/Input.vue'
import Avatar from '@core/primitives/Avatar.vue'
import Tabs from '@nav/Tabs.vue'
import StatusBar from '@nav/StatusBar.vue'
import SplitView from '@layout/SplitView.vue'
import ScrollArea from '@layout/ScrollArea.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  tracks,
  playlists,
  artists,
  eqBands,
  formatTime,
  getTrackById,
  getPlaylistTracks,
  defaultPlayerState,
  type Track,
  type Playlist,
  type PlayerState,
} from './fixtures/tide-radio-data'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const player = ref<PlayerState>({ ...defaultPlayerState })
const activePlaylistId = ref('pl-all')
const sidebarTab = ref('playlists')
const searchQuery = ref('')
const showEq = ref(false)
const eqGains = ref(eqBands.map((b) => b.gain))

const sidebarTabs = [
  { id: 'playlists', label: 'Playlists', icon: 'codicon:list-unordered' },
  { id: 'artists', label: 'Artists', icon: 'codicon:person' },
]

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const activePlaylist = computed(
  () => playlists.find((p) => p.id === activePlaylistId.value) ?? playlists[0],
)

const playlistTracks = computed(() => {
  if (!activePlaylist.value) return []
  let items = getPlaylistTracks(activePlaylist.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q),
    )
  }
  return items
})

const currentTrack = computed(() =>
  player.value.currentTrackId
    ? getTrackById(player.value.currentTrackId)
    : undefined,
)

const currentTime = computed(() =>
  currentTrack.value
    ? formatTime(currentTrack.value.duration * player.value.progress)
    : '0:00',
)

const totalTime = computed(() =>
  currentTrack.value ? formatTime(currentTrack.value.duration) : '0:00',
)

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function playTrack(track: Track) {
  player.value.currentTrackId = track.id
  player.value.isPlaying = true
  player.value.progress = 0
}

function togglePlay() {
  player.value.isPlaying = !player.value.isPlaying
}

function nextTrack() {
  const list = playlistTracks.value
  const idx = list.findIndex((t) => t.id === player.value.currentTrackId)
  const next = list[(idx + 1) % list.length]
  if (next) playTrack(next)
}

function prevTrack() {
  const list = playlistTracks.value
  const idx = list.findIndex((t) => t.id === player.value.currentTrackId)
  const prev = list[(idx - 1 + list.length) % list.length]
  if (prev) playTrack(prev)
}

function toggleShuffle() {
  player.value.shuffle = !player.value.shuffle
  toast.add({
    message: player.value.shuffle ? 'Shuffle on' : 'Shuffle off',
    variant: 'info',
  })
}

function cycleRepeat() {
  const modes: PlayerState['repeat'][] = ['off', 'all', 'one']
  const idx = modes.indexOf(player.value.repeat)
  player.value.repeat = modes[(idx + 1) % modes.length]!
  toast.add({
    message: `Repeat: ${player.value.repeat}`,
    variant: 'info',
  })
}

function toggleLike(track: Track) {
  track.liked = !track.liked
  toast.add({
    message: track.liked ? `Added "${track.title}" to favorites` : `Removed "${track.title}"`,
    variant: 'success',
  })
}

function selectPlaylist(pl: Playlist) {
  activePlaylistId.value = pl.id
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = computed(() => [
  { id: 'app', content: 'Tide Radio', priority: 1, align: 'left' as const },
  {
    id: 'now',
    content: currentTrack.value
      ? `${currentTrack.value.artist} — ${currentTrack.value.title}`
      : 'No track',
    priority: 2,
    align: 'left' as const,
  },
  { id: 'vol', content: `Vol ${player.value.volume}%`, priority: 3, align: 'right' as const },
  {
    id: 'tracks',
    content: `${playlistTracks.value.length} tracks`,
    priority: 4,
    align: 'right' as const,
  },
])
</script>

<template>
  <Story title="Tide Radio" icon="codicon:unmute" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="tr-shell" data-theme="obsidian">
        <SplitView>
          <!-- Sidebar -->
          <template #secondary>
            <div class="tr-sidebar">
              <Tabs v-model="sidebarTab" :tabs="sidebarTabs" size="xs" />

              <!-- Playlists -->
              <div v-if="sidebarTab === 'playlists'" class="tr-sidebar-list">
                <button
                  v-for="pl in playlists"
                  :key="pl.id"
                  class="tr-playlist-item"
                  :data-active="pl.id === activePlaylistId || undefined"
                  @click="selectPlaylist(pl)"
                >
                  <Icon :icon="pl.icon" size="sm" />
                  <div class="tr-pl-info">
                    <span class="tr-pl-name">{{ pl.name }}</span>
                    <span class="tr-pl-count">{{ pl.trackIds.length }} tracks</span>
                  </div>
                </button>
              </div>

              <!-- Artists -->
              <div v-else class="tr-sidebar-list">
                <div
                  v-for="artist in artists"
                  :key="artist.id"
                  class="tr-artist-item"
                >
                  <Avatar :name="artist.name" :color="artist.color" size="sm" />
                  <div class="tr-pl-info">
                    <span class="tr-pl-name">{{ artist.name }}</span>
                    <span class="tr-pl-count">{{ artist.trackCount }} tracks · {{ artist.genre }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Main content -->
          <template #primary>
            <div class="tr-main">
              <!-- Playlist header -->
              <header class="tr-header">
                <div class="tr-header-info">
                  <h2 class="tr-title">
                    <Icon v-if="activePlaylist" :icon="activePlaylist.icon" size="sm" />
                    {{ activePlaylist?.name ?? 'Tracks' }}
                  </h2>
                  <p v-if="activePlaylist" class="tr-desc">{{ activePlaylist.description }}</p>
                </div>
                <div class="tr-header-actions">
                  <Input
                    v-model="searchQuery"
                    placeholder="Search tracks..."
                    clearable
                    :debounce="150"
                  >
                    <template #leading>
                      <Icon icon="codicon:search" size="sm" />
                    </template>
                  </Input>
                </div>
              </header>

              <!-- Track list -->
              <ScrollArea class="tr-track-scroll">
                <div v-if="playlistTracks.length" class="tr-track-list">
                  <button
                    v-for="(track, idx) in playlistTracks"
                    :key="track.id"
                    class="tr-track"
                    :data-playing="track.id === player.currentTrackId || undefined"
                    @click="playTrack(track)"
                  >
                    <span class="tr-track-num">
                      <Icon
                        v-if="track.id === player.currentTrackId && player.isPlaying"
                        icon="codicon:play"
                        size="xs"
                        class="tr-playing-icon"
                      />
                      <span v-else>{{ idx + 1 }}</span>
                    </span>
                    <div
                      class="tr-track-cover"
                      :style="{ background: track.coverColor }"
                    />
                    <div class="tr-track-info">
                      <span class="tr-track-title">{{ track.title }}</span>
                      <span class="tr-track-artist">{{ track.artist }} · {{ track.album }}</span>
                    </div>
                    <Badge variant="muted" size="xs">{{ track.genre }}</Badge>
                    <IconButton
                      :ariaLabel="track.liked ? 'Unlike' : 'Like'"
                      size="sm"
                      @click.stop="toggleLike(track)"
                    >
                      <Icon
                        :icon="track.liked ? 'codicon:heart-filled' : 'codicon:heart'"
                        size="xs"
                        :class="{ 'tr-liked': track.liked }"
                      />
                    </IconButton>
                    <span class="tr-track-dur">{{ formatTime(track.duration) }}</span>
                  </button>
                </div>
                <div v-else class="tr-empty">
                  <EmptyState
                    title="No matching tracks"
                    description="Try a different search term."
                    icon="codicon:search"
                  />
                </div>
              </ScrollArea>
            </div>
          </template>
        </SplitView>

        <!-- Player bar -->
        <div class="tr-player">
          <!-- Now playing -->
          <div class="tr-now-playing">
            <div
              v-if="currentTrack"
              class="tr-now-cover"
              :style="{ background: currentTrack.coverColor }"
            />
            <div v-if="currentTrack" class="tr-now-info">
              <span class="tr-now-title">{{ currentTrack.title }}</span>
              <span class="tr-now-artist">{{ currentTrack.artist }}</span>
            </div>
            <IconButton
              v-if="currentTrack"
              :ariaLabel="currentTrack.liked ? 'Unlike' : 'Like'"
              size="sm"
              @click="toggleLike(currentTrack)"
            >
              <Icon
                :icon="currentTrack.liked ? 'codicon:heart-filled' : 'codicon:heart'"
                size="xs"
                :class="{ 'tr-liked': currentTrack.liked }"
              />
            </IconButton>
          </div>

          <!-- Controls -->
          <div class="tr-controls">
            <div class="tr-control-buttons">
              <IconButton
                ariaLabel="Shuffle"
                title="Shuffle"
                size="sm"
                :class="{ 'tr-active-control': player.shuffle }"
                @click="toggleShuffle"
              >
                <Icon icon="codicon:arrow-swap" size="sm" />
              </IconButton>
              <IconButton ariaLabel="Previous" size="sm" @click="prevTrack">
                <Icon icon="codicon:debug-reverse-continue" size="sm" />
              </IconButton>
              <button class="tr-play-btn" :aria-label="player.isPlaying ? 'Pause' : 'Play'" @click="togglePlay">
                <Icon
                  :icon="player.isPlaying ? 'codicon:debug-pause' : 'codicon:play'"
                  size="lg"
                />
              </button>
              <IconButton ariaLabel="Next" size="sm" @click="nextTrack">
                <Icon icon="codicon:debug-continue" size="sm" />
              </IconButton>
              <IconButton
                ariaLabel="Repeat"
                :title="`Repeat: ${player.repeat}`"
                size="sm"
                :class="{ 'tr-active-control': player.repeat !== 'off' }"
                @click="cycleRepeat"
              >
                <Icon
                  :icon="player.repeat === 'one' ? 'codicon:debug-step-into' : 'codicon:sync'"
                  size="sm"
                />
              </IconButton>
            </div>
            <div class="tr-progress-row">
              <span class="tr-time">{{ currentTime }}</span>
              <div class="tr-progress-bar">
                <div
                  class="tr-progress-fill"
                  :style="{ width: `${player.progress * 100}%` }"
                />
              </div>
              <span class="tr-time">{{ totalTime }}</span>
            </div>
          </div>

          <!-- Volume / EQ -->
          <div class="tr-player-right">
            <IconButton
              ariaLabel="Equalizer"
              title="Equalizer"
              size="sm"
              :class="{ 'tr-active-control': showEq }"
              @click="showEq = !showEq"
            >
              <Icon icon="codicon:settings-gear" size="sm" />
            </IconButton>
            <div class="tr-volume">
              <Icon
                :icon="player.volume === 0 ? 'codicon:mute' : player.volume < 50 ? 'codicon:unmute' : 'codicon:unmute'"
                size="sm"
              />
              <div class="tr-vol-bar">
                <div class="tr-vol-fill" :style="{ width: `${player.volume}%` }" />
              </div>
            </div>
          </div>
        </div>

        <!-- EQ overlay -->
        <div v-if="showEq" class="tr-eq-overlay">
          <div class="tr-eq-panel">
            <div class="tr-eq-header">
              <h3 class="tr-eq-title">Equalizer</h3>
              <IconButton ariaLabel="Close equalizer" size="sm" @click="showEq = false">
                <Icon icon="codicon:close" size="sm" />
              </IconButton>
            </div>
            <div class="tr-eq-bands">
              <div v-for="(band, i) in eqBands" :key="band.id" class="tr-eq-band">
                <div class="tr-eq-slider">
                  <div class="tr-eq-track">
                    <div
                      class="tr-eq-fill"
                      :style="{
                        height: `${((eqGains[i]! + 12) / 24) * 100}%`,
                      }"
                    />
                  </div>
                </div>
                <span class="tr-eq-label">{{ band.label }}</span>
                <span class="tr-eq-gain">{{ eqGains[i]! > 0 ? '+' : '' }}{{ eqGains[i] }}dB</span>
              </div>
            </div>
          </div>
        </div>

        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: NOW PLAYING ================== -->
    <Variant title="Now Playing">
      <div class="tr-shell" data-theme="obsidian">
        <div class="tr-now-view">
          <div v-if="currentTrack" class="tr-now-large">
            <div
              class="tr-now-art"
              :style="{ background: `linear-gradient(135deg, ${currentTrack.coverColor}, color-mix(in srgb, ${currentTrack.coverColor} 40%, var(--color-background, #000)))` }"
            >
              <Icon icon="codicon:unmute" size="lg" :style="{ color: `color-mix(in srgb, var(--color-foreground, #fff) 40%, transparent)` }" />
            </div>
            <h2 class="tr-now-lg-title">{{ currentTrack.title }}</h2>
            <p class="tr-now-lg-artist">{{ currentTrack.artist }} · {{ currentTrack.album }}</p>
            <div class="tr-now-badges">
              <Badge variant="primary" size="sm">{{ currentTrack.genre }}</Badge>
              <Badge variant="muted" size="sm">{{ formatTime(currentTrack.duration) }}</Badge>
            </div>

            <!-- Progress -->
            <div class="tr-now-progress">
              <span class="tr-time">{{ currentTime }}</span>
              <div class="tr-progress-bar tr-progress-lg">
                <div class="tr-progress-fill" :style="{ width: `${player.progress * 100}%` }" />
              </div>
              <span class="tr-time">{{ totalTime }}</span>
            </div>

            <!-- Controls -->
            <div class="tr-now-controls">
              <IconButton ariaLabel="Shuffle" size="sm" @click="toggleShuffle">
                <Icon icon="codicon:arrow-swap" size="sm" />
              </IconButton>
              <IconButton ariaLabel="Previous" size="sm" @click="prevTrack">
                <Icon icon="codicon:debug-reverse-continue" size="lg" />
              </IconButton>
              <button class="tr-play-btn tr-play-lg" :aria-label="player.isPlaying ? 'Pause' : 'Play'" @click="togglePlay">
                <Icon :icon="player.isPlaying ? 'codicon:debug-pause' : 'codicon:play'" size="lg" />
              </button>
              <IconButton ariaLabel="Next" size="sm" @click="nextTrack">
                <Icon icon="codicon:debug-continue" size="lg" />
              </IconButton>
              <IconButton ariaLabel="Repeat" size="sm" @click="cycleRepeat">
                <Icon icon="codicon:sync" size="sm" />
              </IconButton>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: QUEUE ================== -->
    <Variant title="Up Next">
      <div class="tr-shell" data-theme="obsidian">
        <div class="tr-queue-view">
          <header class="tr-header">
            <h2 class="tr-title">
              <Icon icon="codicon:list-ordered" size="sm" />
              Up Next
              <Badge variant="primary" size="xs">{{ tracks.length }}</Badge>
            </h2>
          </header>
          <div class="tr-track-list">
            <div
              v-for="(track, idx) in tracks"
              :key="track.id"
              class="tr-track"
              :data-playing="track.id === player.currentTrackId || undefined"
            >
              <span class="tr-track-num">{{ idx + 1 }}</span>
              <div class="tr-track-cover" :style="{ background: track.coverColor }" />
              <div class="tr-track-info">
                <span class="tr-track-title">{{ track.title }}</span>
                <span class="tr-track-artist">{{ track.artist }}</span>
              </div>
              <span class="tr-track-dur">{{ formatTime(track.duration) }}</span>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY ================== -->
    <Variant title="Empty Library">
      <div class="tr-shell" data-theme="obsidian">
        <div class="tr-empty-center">
          <EmptyState
            title="No music yet"
            description="Add tracks to your library to start listening."
            icon="codicon:unmute"
          >
            <template #action>
              <Button variant="primary" size="sm">
                <Icon icon="codicon:add" size="sm" />
                Add Music
              </Button>
            </template>
          </EmptyState>
        </div>
        <StatusBar :items="[{ id: 'status', content: 'Library empty', priority: 1, align: 'left' }]" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.tr-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 650px;
  background: var(--color-background, #000);
  color: var(--color-foreground, #fff);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
  position: relative;
}

/* ---- Sidebar ---- */
.tr-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  height: 100%;
  overflow-y: auto;
}

.tr-sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tr-playlist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s;
}

.tr-playlist-item:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 6%, transparent);
}

.tr-playlist-item[data-active] {
  background: color-mix(in srgb, var(--color-primary, #0af) 15%, transparent);
  color: var(--color-primary, #0af);
}

.tr-artist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
}

.tr-pl-info {
  display: flex;
  flex-direction: column;
}

.tr-pl-name {
  font-weight: 500;
}

.tr-pl-count {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Main ---- */
.tr-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.tr-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border, #333);
}

.tr-header-info {
  flex: 1;
}

.tr-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.tr-desc {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  margin: 4px 0 0;
}

.tr-header-actions {
  min-width: 200px;
}

/* ---- Track list ---- */
.tr-track-scroll {
  flex: 1;
}

.tr-track-list {
  display: flex;
  flex-direction: column;
}

.tr-track {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.1s;
}

.tr-track:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 4%, transparent);
}

.tr-track[data-playing] {
  background: color-mix(in srgb, var(--color-primary, #0af) 8%, transparent);
}

.tr-track[data-playing] .tr-track-title {
  color: var(--color-primary, #0af);
}

.tr-track-num {
  width: 24px;
  text-align: center;
  font-size: 12px;
  color: var(--color-muted-foreground, #666);
  flex-shrink: 0;
}

.tr-playing-icon {
  color: var(--color-primary, #0af);
}

.tr-track-cover {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  flex-shrink: 0;
}

.tr-track-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.tr-track-title {
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tr-track-artist {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tr-liked {
  color: var(--color-destructive, #e91e63);
}

.tr-track-dur {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

/* ---- Player bar ---- */
.tr-player {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  border-top: 1px solid var(--color-border, #333);
  background: color-mix(in srgb, var(--color-background, #000) 90%, var(--color-foreground, #fff));
}

.tr-now-playing {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}

.tr-now-cover {
  width: 42px;
  height: 42px;
  border-radius: 4px;
  flex-shrink: 0;
}

.tr-now-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tr-now-title {
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tr-now-artist {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Controls ---- */
.tr-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  max-width: 600px;
  margin: 0 auto;
}

.tr-control-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tr-play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--color-foreground, #fff);
  color: var(--color-background, #000);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s;
}

.tr-play-btn:hover {
  transform: scale(1.05);
}

.tr-play-lg {
  width: 52px;
  height: 52px;
}

.tr-active-control {
  color: var(--color-primary, #0af) !important;
}

.tr-progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.tr-time {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--color-muted-foreground, #888);
  min-width: 35px;
  text-align: center;
}

.tr-progress-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 12%, transparent);
  overflow: hidden;
  cursor: pointer;
}

.tr-progress-lg {
  height: 6px;
}

.tr-progress-fill {
  height: 100%;
  border-radius: 2px;
  background: var(--color-primary, #0af);
  transition: width 0.1s;
}

/* ---- Volume / EQ ---- */
.tr-player-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 160px;
  justify-content: flex-end;
}

.tr-volume {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tr-vol-bar {
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 12%, transparent);
  overflow: hidden;
}

.tr-vol-fill {
  height: 100%;
  border-radius: 2px;
  background: var(--color-foreground, #fff);
}

/* ---- EQ overlay ---- */
.tr-eq-overlay {
  position: absolute;
  bottom: 90px;
  right: 20px;
  z-index: 50;
}

.tr-eq-panel {
  background: var(--color-card, #111);
  border: 1px solid var(--color-border, #333);
  border-radius: 8px;
  padding: 16px;
  width: 360px;
}

.tr-eq-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tr-eq-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.tr-eq-bands {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}

.tr-eq-band {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tr-eq-slider {
  height: 100px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.tr-eq-track {
  width: 6px;
  height: 100%;
  border-radius: 3px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 10%, transparent);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.tr-eq-fill {
  width: 100%;
  border-radius: 3px;
  background: var(--color-primary, #0af);
  transition: height 0.15s;
}

.tr-eq-label {
  font-size: 10px;
  color: var(--color-muted-foreground, #888);
}

.tr-eq-gain {
  font-size: 9px;
  font-variant-numeric: tabular-nums;
  color: var(--color-muted-foreground, #666);
}

/* ---- Now Playing view ---- */
.tr-now-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tr-now-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
}

.tr-now-art {
  width: 240px;
  height: 240px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px color-mix(in srgb, var(--color-background, #000) 50%, transparent);
}

.tr-now-lg-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.tr-now-lg-artist {
  font-size: 14px;
  color: var(--color-muted-foreground, #888);
  margin: 0;
  text-align: center;
}

.tr-now-badges {
  display: flex;
  gap: 6px;
}

.tr-now-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.tr-now-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ---- Queue view ---- */
.tr-queue-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ---- Empty ---- */
.tr-empty,
.tr-empty-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
