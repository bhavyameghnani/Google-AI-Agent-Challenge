import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

const AudioPlayer = ({ title, language, audioFile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [canPlay, setCanPlay] = useState(false);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onCanPlay = () => setCanPlay(true);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      console.warn("Audio error", audio.error);
      setCanPlay(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    setCanPlay(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioFile]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!canPlay) return console.warn("Audio not ready to play");

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Play failed:", err);
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-4 sm:p-6 shadow-card animate-scale-in">
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base sm:text-lg break-words">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{language} Audio</p>
        </div>
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
          language === "English" 
            ? "bg-primary/10 text-primary" 
            : "bg-accent/10 text-accent"
        }`}>
          {language}
        </div>
      </div>

      <audio ref={audioRef} src={audioFile} preload="metadata" />

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            size="lg"
            onClick={togglePlay}
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 shadow-elevated hover:scale-110 transition-transform flex-shrink-0"
          >
            {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />}
          </Button>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            <Button variant="ghost" size="sm" onClick={toggleMute} className="rounded-full p-1.5 sm:p-2 flex-shrink-0">
              {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="w-16 sm:w-24 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayer;