import { useContext, useRef, useState } from 'react'
import { SongContext } from '../song.context'
import '../../shared/style/player.scss'

const speedOptions = [0.75, 1, 1.25, 1.5, 2]

const formatTime = (value) => {
  if (!Number.isFinite(value)) return '0:00'

  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

const Player = ({ song: providedSong }) => {
  const context = useContext(SongContext)
  const song = providedSong ?? context?.song
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlayback = async () => {
    if (!audioRef.current || !song?.url) return

    if (audioRef.current.paused) {
      await audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }

  const skip = (amount) => {
    if (!audioRef.current) return

    audioRef.current.currentTime = Math.max(
      0,
      Math.min(audioRef.current.currentTime + amount, duration || audioRef.current.duration || 0),
    )
  }

  const changeSpeed = (nextSpeed) => {
    setSpeed(nextSpeed)
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed
  }

  const updateProgress = (event) => {
    const nextTime = Number(event.target.value)
    setCurrentTime(nextTime)
    if (audioRef.current) audioRef.current.currentTime = nextTime
  }

  return (
    <section className="player" aria-label="Music player">
      <div className="player__glow" />
      <div className="player__header">
        <span className="player__eyebrow">Now playing</span>
        <span className="player__status"><i /> Moodify session</span>
      </div>

      <div className="player__main">
        <div className="player__artwork-wrap">
          <div className="player__artwork-placeholder" aria-hidden="true">
            <span>MF</span>
          </div>
          {song?.posterUrl && <img className="player__artwork" src={song.posterUrl} alt={`${song.title} artwork`} />}
          <span className="player__artwork-ring" />
        </div>

        <div className="player__details">
          <p className="player__mood">{song?.mood ? `${song.mood} atmosphere` : 'Your mood, in sound'}</p>
          <h1>{song?.title || 'Find your next feeling'}</h1>
          <p className="player__subtitle">
            {song ? 'A soundtrack selected for the way you feel right now.' : 'Choose a mood to bring your personal soundtrack to life.'}
          </p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={song?.url}
        onLoadStart={() => {
          setIsPlaying(false)
          setCurrentTime(0)
          setDuration(0)
          setSpeed(1)
        }}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="player__timeline">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          onChange={updateProgress}
          disabled={!song?.url}
          aria-label="Song progress"
        />
        <div className="player__time"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
      </div>

      <div className="player__controls">
        <button className="player__skip" type="button" onClick={() => skip(-5)} disabled={!song?.url} aria-label="Back 5 seconds">
          <strong>5</strong><span className="player__arc player__arc--back" />
        </button>
        <button className="player__play" type="button" onClick={togglePlayback} disabled={!song?.url} aria-label={isPlaying ? 'Pause' : 'Play'}>
          <span className={isPlaying ? 'player__pause-icon' : 'player__play-icon'} />
        </button>
        <button className="player__skip" type="button" onClick={() => skip(5)} disabled={!song?.url} aria-label="Forward 5 seconds">
          <strong>5</strong><span className="player__arc player__arc--forward" />
        </button>
      </div>

      <div className="player__footer">
        <span className="player__footer-label">Playback speed</span>
        <div className="player__speeds" role="group" aria-label="Playback speed">
          {speedOptions.map((option) => (
            <button className={speed === option ? 'is-active' : ''} key={option} type="button" onClick={() => changeSpeed(option)}>
              {option}x
            </button>
          ))}
        </div>
        <span className="player__wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
      </div>
      </section>
  )
}

export default Player
