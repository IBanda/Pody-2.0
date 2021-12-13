// import { Episode } from 'podcast-api';
import React, { createContext, useContext, useState } from 'react';

interface Context {
  title: string;
  id: string;
  playing: string;
  //   playlist: Episode[];
  status: 'playing' | 'paused' | 'error';
}

interface PlayFn {
  play: React.Dispatch<React.SetStateAction<Context>>;
}

type AppPlayerContext = Context & PlayFn;

const PlayerContext = createContext<AppPlayerContext | null>(null);

type Props = {
  children: React.ReactNode;
};

export function PlayerProvider({ children }: Props) {
  const [playerState, setPlayerState] = useState<Context>({
    id: '',
    playing: '',
    title: '',
    status: 'paused',
  });

  return (
    <PlayerContext.Provider
      value={{ ...playerState, play: setPlayerState }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      'usePlayer must only be used within the PlayerProver'
    );
  }
  return context;
}
