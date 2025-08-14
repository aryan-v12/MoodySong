import "./MoodSongs.css";
import { useState, useEffect } from "react";

const MoodSongs = ({ Songs, currentMood }) => {
  const [isPlaying, setIsPlaying] = useState(null);
  const [audioObjects, setAudioObjects] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [songDurations, setSongDurations] = useState({});

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatMoodName = (mood) => {
    if (!mood) return "Music";
    return mood.charAt(0).toUpperCase() + mood.slice(1);
  };

  const handlePlayPause = (index) => {
    const songKey = `song_${index}`;

    if (isPlaying === index) {
      // Pause current song
      if (audioObjects[songKey]) {
        audioObjects[songKey].pause();
        setIsPlaying(null);
      }
    } else {
      // Pause any currently playing song
      if (isPlaying !== null && audioObjects[`song_${isPlaying}`]) {
        audioObjects[`song_${isPlaying}`].pause();
      }

      // Check if audio object already exists for this song
      if (audioObjects[songKey]) {
        // Resume existing audio
        audioObjects[songKey].play();
        setIsPlaying(index);
      } else {
        // Create new audio object
        setIsLoading(true);
        const audio = new Audio(Songs[index].audio);

        audio.onloadeddata = () => {
          setIsLoading(false);
          audio.play();
          setIsPlaying(index);

          // Store the duration
          setSongDurations((prev) => ({
            ...prev,
            [songKey]: audio.duration,
          }));
        };

        audio.onended = () => {
          setIsPlaying(null);
        };

        audio.onerror = () => {
          setIsLoading(false);
          console.error("Error loading audio");
        };

        // Store the audio object
        setAudioObjects((prev) => ({
          ...prev,
          [songKey]: audio,
        }));
      }
    }
  };

  const handleLike = (index) => {
    const newLikedSongs = new Set(likedSongs);
    if (likedSongs.has(index)) {
      newLikedSongs.delete(index);
    } else {
      newLikedSongs.add(index);
    }
    setLikedSongs(newLikedSongs);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "MoodDetect Music",
        text: `Check out this mood-based music recommendation from MoodDetect!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Check out this mood-based music from MoodDetect - ${window.location.href}`
      );
      alert("Music link copied to clipboard!");
    }
  };

  useEffect(() => {
    if (isPlaying !== null && audioObjects[`song_${isPlaying}`]) {
      audioObjects[`song_${isPlaying}`].pause();
    }

    setIsPlaying(null);
    setAudioObjects({});
    setSongDurations({});
    setLikedSongs(new Set());

    Songs.forEach((song, index) => {
      const songKey = `song_${index}`;

      if (song.audio) {
        const audio = new Audio(song.audio);
        audio.onloadedmetadata = () => {
          setSongDurations((prev) => ({
            ...prev,
            [songKey]: audio.duration,
          }));
        };
      }
    });
  }, [Songs]);

  useEffect(() => {
    return () => {
      Object.values(audioObjects).forEach((audio) => {
        if (audio) {
          audio.pause();
        }
      });
    };
  }, [audioObjects]);

  return (
    <div className="mood-songs">
      <div className="songs-header">
        <div className="header-text">
          <h1>Recommended Songs</h1>
          <p>Music curated based on your detected mood</p>
        </div>
        {Songs.length > 0 && (
          <div className="songs-count">
            <span>{Songs.length} songs</span>
          </div>
        )}
      </div>

      {Songs.length === 0 ? (
        <div className="empty-state">
          <h3>No songs yet</h3>
          <p>Detect your mood to get personalized music recommendations</p>
        </div>
      ) : (
        <div className="songs-grid">
          {Songs.map((_, index) => (
            <div
              className={`song-card ${isPlaying === index ? "playing" : ""}`}
              key={index}
            >
              <div className="song-artwork">
                <div className="artwork-placeholder">♪</div>
                <div className="play-overlay">
                  <button
                    onClick={() => handlePlayPause(index)}
                    className="play-button"
                    disabled={isLoading}
                  >
                    {isLoading && isPlaying === index ? (
                      <div className="loading-spinner"></div>
                    ) : isPlaying === index ? (
                      "⏸"
                    ) : (
                      "▶"
                    )}
                  </button>
                </div>
              </div>

              <div className="song-info">
                <div className="song-meta">
                  <span className="song-mood-title">
                    {formatMoodName(currentMood)} Music {index + 1}
                  </span>
                  <span className="song-duration">
                    {songDurations[`song_${index}`]
                      ? formatTime(songDurations[`song_${index}`])
                      : "--:--"}
                  </span>
                </div>
                {isPlaying === index && (
                  <div className="audio-visualizer-side">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                )}
              </div>

              <div className="song-actions">
                <button
                  className={`action-button favorite ${
                    likedSongs.has(index) ? "liked" : ""
                  }`}
                  data-tooltip={likedSongs.has(index) ? "Unlike" : "Like"}
                  onClick={() => handleLike(index)}
                >
                  {likedSongs.has(index) ? "♥" : "♡"}
                </button>
                <button
                  className="action-button share"
                  data-tooltip="Share"
                  onClick={handleShare}
                >
                  ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodSongs;
