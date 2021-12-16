import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Slider } from '@mui/material';
import { usePlayer } from './PlayerContext';

export default function PlayerInternals() {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const {
    playing: globalPlaying,
    status,
    play,
    id,
    title,
  } = usePlayer();

  const mediaElement = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    if (status === 'playing') mediaElement.current?.play();
    if (status === 'paused') mediaElement.current?.pause();
  }, [status, id]);

  const onPlay = () => {
    if (!globalPlaying) return;
    mediaElement?.current?.play();
    play((prev) => ({ ...prev, status: 'playing' }));
  };

  const pause = () => {
    mediaElement?.current?.pause();
    play((prev) => ({ ...prev, status: 'paused' }));
  };

  const onPause = () => {
    setPlaying(false);
  };

  const onPlaying = () => {
    setPlaying(true);
  };

  const onDurationChange = () => {
    const currentDuration = mediaElement?.current?.duration;
    if (currentDuration) {
      setDuration(currentDuration);
    }
  };

  const onTimeUpdate = () => {
    const currentTime = mediaElement?.current?.currentTime;
    if (currentTime) {
      setCurrentTime(currentTime);
    }
  };

  const onError = (e: SyntheticEvent) => {
    play((prev) => ({ ...prev, status: 'error', playing: '' }));
    console.log(e);
  };

  const onTrackValueChange = (e: Event, value: number | number[]) => {
    if (mediaElement.current && typeof value === 'number') {
      setCurrentTime(value);
      mediaElement.current.currentTime = value;
    }
  };

  const onVolumeValueChange = (
    e: Event,
    value: number | number[]
  ) => {
    if (mediaElement.current && typeof value === 'number') {
      setVolume(value);
      mediaElement.current.volume = value;
    }
  };

  const onSeeking = () => {
    setSeeking(true);
  };

  const onSeeked = () => {
    setSeeking(false);
  };

  const onPlayOrPause = () => {
    playing ? pause() : onPlay();
  };

  const onSkipFowards = () => {
    if (!mediaElement.current) return;
    const futureTime = mediaElement?.current?.currentTime + 15;
    if (futureTime <= duration) {
      mediaElement.current.currentTime = futureTime;
    } else {
      mediaElement.current.currentTime = duration;
    }
  };

  const onSkipBackwards = () => {
    if (!mediaElement.current) return;
    const pastTime = mediaElement?.current?.currentTime - 15;
    if (pastTime >= 0) {
      mediaElement.current.currentTime = pastTime;
    } else {
      mediaElement.current.currentTime = 0;
    }
  };

  const onVolumeChange = () => {
    setVolume(mediaElement?.current?.volume as number);
  };

  const onLoadStart = () => {
    setLoaded(false);
  };

  const onLoadedData = () => {
    setLoaded(true);
  };

  return (
    <div className="flex justify-center items-center text-white ">
      <audio
        className="hidden"
        ref={mediaElement}
        src={globalPlaying}
        onTimeUpdate={onTimeUpdate}
        onDurationChange={onDurationChange}
        onPlaying={onPlaying}
        onPause={onPause}
        onError={onError}
        onSeeking={onSeeking}
        onSeeked={onSeeked}
        onVolumeChange={onVolumeChange}
        onLoadStart={onLoadStart}
        onLoadedData={onLoadedData}
      ></audio>
      <div className="w-72">
        <div className="w-56   overflow-hidden mx-auto">
          <p className="title text-xs text-white whitespace-nowrap ">
            {title}
          </p>
        </div>
        <div>
          <div>
            <Slider
              size="small"
              step={1}
              onChange={onTrackValueChange}
              max={duration}
              value={currentTime}
              sx={{
                color: '#fff',
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs`}>
              {formatDuration(currentTime)}
            </span>
            <span className="text-xs">
              -{formatDuration(duration - currentTime)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-evenly w-full">
          <button onClick={onSkipBackwards}>
            <img
              className="w-6"
              src="/skip-15-seconds-back.png"
              alt="skip 15 seconds back"
              width={30}
              height={30}
            />
          </button>
          <button
            className={`${
              (seeking || (!loaded && globalPlaying)) &&
              status !== 'error'
                ? 'animate-pulse'
                : ''
            } rounded-full w-12 h-12 flex items-center justify-center border border-white`}
            onClick={onPlayOrPause}
          >
            <img
              className="w-6"
              src={`${
                playing
                  ? '/pause-front-clay.png'
                  : '/play-front-clay.png'
              }`}
              alt="play"
              width={30}
              height={30}
            />
          </button>
          <button onClick={onSkipFowards}>
            <img
              className="w-6 "
              src="/skip-ahead-15-seconds.png"
              alt="skip 15 seconds back"
              width={30}
              height={30}
            />
          </button>
        </div>
        <div className="flex items-center mt-4">
          <img
            className="w-6"
            src="/low-volume.png"
            alt="volume down"
            width={30}
            height={30}
          />
          <Slider
            step={0.1}
            size="small"
            max={1}
            min={0}
            value={volume}
            onChange={onVolumeValueChange}
            sx={{ color: '#fff' }}
          ></Slider>
          <img
            className="w-6 ml-2"
            src="/high-volume.png"
            alt="volume up"
            width={30}
            height={30}
          />
        </div>
      </div>
    </div>
  );
}

function formatDuration(value: number) {
  const minute = Math.floor(value / 60);
  const secondLeft = value - minute * 60;
  return `${minute}:${
    secondLeft < 9
      ? `0${Math.floor(secondLeft)}`
      : Math.floor(secondLeft)
  }`;
}
