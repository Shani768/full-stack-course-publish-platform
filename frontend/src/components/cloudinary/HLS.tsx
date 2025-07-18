import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Settings, Volume2, Maximize2, Pause, Play } from 'lucide-react';
import type { Level } from "hls.js";

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);

  const [selectedLevel, setSelectedLevel] = useState<number>(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      setHlsInstance(hls);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels);
      });

      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateTime);
    };
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = parseInt(e.target.value);
    setSelectedLevel(level);
    if (hlsInstance) hlsInstance.currentLevel = level;
    setShowDropdown(false);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleFullScreen = () => {
    const player = videoRef.current?.parentElement;
    if (!player) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = parseFloat(e.target.value);
  };

  return (
<div className="relative w-full h-[200px] md:h-[350px] lg:h-[700px] bg-black rounded overflow-hidden">

      <video ref={videoRef} className="w-full h-full" autoPlay playsInline />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 pb-3 pt-2 z-50 pointer-events-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Time + Seekbar */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-white text-sm whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              step="0.1"
              className="flex-1 accent-red-500"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-end space-x-4 text-white">
            <button onClick={togglePlayPause}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div className="relative">
              <button onClick={toggleDropdown} className="hover:text-gray-300">
                <Settings size={20} />
              </button>
              {showDropdown && (
                <div className="absolute bottom-8 right-0 bg-gray-800 rounded p-1 z-20">
                  <select
                    className="bg-gray-800 text-white text-sm"
                    onChange={handleQualityChange}
                    value={selectedLevel}
                  >
                    <option value={-1}>Auto</option>
                    {levels.map((level, index) => (
                      <option key={index} value={index}>
                        {level.height}p
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button className="hover:text-gray-300">
              <Volume2 size={20} />
            </button>
            <button onClick={toggleFullScreen} className="hover:text-gray-300">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CustomVideoPlayer;
