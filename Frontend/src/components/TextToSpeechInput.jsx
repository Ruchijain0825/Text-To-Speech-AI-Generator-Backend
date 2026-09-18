import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

import {
  Copy,
  Sparkles,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Minus,
  Plus,
  Download,
  Trash2,
  Circle,
  Globe,
  Zap,
} from "lucide-react";

import {
  TranslateSpeechGenerator,
  VoiceGenerator,
} from "../apis/TranslateSpeech.jsx";


const TextToSpeechInput = () => {

  const [input, setINput] = useState("");

  const [language, setLanguage] =
    useState("english");

  const [voiceId, setVoiceId] =
    useState("");

  const [voices, setVoices] =
    useState([]);

  /* ============================
     AUDIO STATES
  ============================ */

  const [audioUrl, setAudioUrl] =
    useState(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(70);

  const audioRef = useRef(null);


  /* ============================
     FETCH VOICES
  ============================ */

  useEffect(() => {

    const fetchVoices = async () => {

      try {

        const result =
          await VoiceGenerator();

        console.log(
          "VOICE RESULT:",
          result
        );

        console.log(
          "VOICE DATA:",
          result.voices
        );

        setVoices(
          result.voices || []
        );

      } catch (error) {

        console.error(
          error.message
        );

        toast.error(
          error.message
        );

      }

    };

    fetchVoices();

  }, []);


  /* ============================
     AUDIO EVENTS
  ============================ */

  useEffect(() => {

    const audio =
      audioRef.current;

    if (!audio) return;

    const handleLoadedMetadata = () => {

      setDuration(
        audio.duration || 0
      );

    };


    const handleTimeUpdate = () => {

      setCurrentTime(
        audio.currentTime
      );

    };


    const handleEnded = () => {

      setIsPlaying(false);

      setCurrentTime(0);

    };


    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );


    return () => {

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

    };

  }, [audioUrl]);


  /* ============================
     GENERATE SPEECH
  ============================ */

  const handleGenerate = async () => {

    try {

      if (!input.trim()) {

        toast.error(
          "Please enter some text"
        );

        return;

      }


      if (!voiceId) {

        toast.error(
          "Please select a voice"
        );

        return;

      }


      const data = {

        text: input,

        language: language,

        voiceId: voiceId,

      };


      const audioBlob =
        await TranslateSpeechGenerator(
          data
        );


      /* ============================
         OLD AUDIO CLEANUP
      ============================ */

      if (audioUrl) {

        URL.revokeObjectURL(
          audioUrl
        );

      }


      /* ============================
         CREATE NEW AUDIO URL
      ============================ */

      const newAudioUrl =
        URL.createObjectURL(
          audioBlob
        );


      setAudioUrl(
        newAudioUrl
      );

      setCurrentTime(0);

      setDuration(0);

      setIsPlaying(false);


      toast.success(
        "Audio generated successfully"
      );


    } catch (error) {

      console.error(
        "GENERATE SPEECH ERROR:",
        error
      );

      toast.error(
        error.message ||
        "Failed to generate speech"
      );

    }

  };


  /* ============================
     PLAY / PAUSE
  ============================ */

  const handlePlayPause = async () => {

    const audio =
      audioRef.current;

    if (!audio) return;


    try {

      if (audio.paused) {

        await audio.play();

        setIsPlaying(true);

      } else {

        audio.pause();

        setIsPlaying(false);

      }

    } catch (error) {

      console.error(
        "PLAY ERROR:",
        error
      );

    }

  };


  /* ============================
     RESTART
  ============================ */

  const handleRestart = async () => {

    const audio =
      audioRef.current;

    if (!audio) return;


    audio.currentTime = 0;

    setCurrentTime(0);


    try {

      await audio.play();

      setIsPlaying(true);

    } catch (error) {

      console.error(
        "RESTART ERROR:",
        error
      );

    }

  };


  /* ============================
     PROGRESS
  ============================ */

  const handleProgressChange = (e) => {

    const newTime =
      Number(e.target.value);

    if (!audioRef.current) return;

    audioRef.current.currentTime =
      newTime;

    setCurrentTime(newTime);

  };


  /* ============================
     VOLUME DOWN
  ============================ */

  const handleVolumeDown = () => {

    const newVolume =
      Math.max(
        0,
        volume - 10
      );

    setVolume(newVolume);


    if (audioRef.current) {

      audioRef.current.volume =
        newVolume / 100;

    }

  };


  /* ============================
     VOLUME UP
  ============================ */

  const handleVolumeUp = () => {

    const newVolume =
      Math.min(
        100,
        volume + 10
      );

    setVolume(newVolume);


    if (audioRef.current) {

      audioRef.current.volume =
        newVolume / 100;

    }

  };


  /* ============================
     VOLUME RANGE
  ============================ */

  const handleVolumeChange = (e) => {

    const newVolume =
      Number(e.target.value);

    setVolume(newVolume);


    if (audioRef.current) {

      audioRef.current.volume =
        newVolume / 100;

    }

  };


  /* ============================
     MUTE
  ============================ */

  const handleMute = () => {

    if (!audioRef.current) return;


    if (volume > 0) {

      audioRef.current.dataset.previousVolume =
        volume;

      audioRef.current.volume = 0;

      setVolume(0);

    } else {

      const previousVolume =
        Number(
          audioRef.current.dataset
            .previousVolume
        ) || 70;


      audioRef.current.volume =
        previousVolume / 100;

      setVolume(
        previousVolume
      );

    }

  };


  /* ============================
     DOWNLOAD
  ============================ */

  const handleDownload = async () => {

    try {

      if (!audioUrl) return;


      const response =
        await fetch(audioUrl);


      if (!response.ok) {

        throw new Error(
          "Download failed"
        );

      }


      const blob =
        await response.blob();


      const downloadUrl =
        window.URL.createObjectURL(
          blob
        );


      const link =
        document.createElement("a");


      link.href =
        downloadUrl;

      link.download =
        "generated-audio.mp3";


      document.body.appendChild(
        link
      );

      link.click();

      link.remove();


      window.URL.revokeObjectURL(
        downloadUrl
      );


    } catch (error) {

      console.error(
        "DOWNLOAD ERROR:",
        error
      );

      toast.error(
        "Failed to download audio"
      );

    }

  };


  /* ============================
     DELETE AUDIO
  ============================ */

  const handleDelete = () => {

    if (audioRef.current) {

      audioRef.current.pause();

      audioRef.current.currentTime =
        0;

    }


    if (audioUrl) {

      URL.revokeObjectURL(
        audioUrl
      );

    }


    setAudioUrl(null);

    setCurrentTime(0);

    setDuration(0);

    setIsPlaying(false);

  };


  /* ============================
     FORMAT TIME
  ============================ */

  const formatTime = (time) => {

    if (
      !time ||
      isNaN(time)
    ) {

      return "0:00";

    }


    const minutes =
      Math.floor(time / 60);


    const seconds =
      Math.floor(time % 60)
        .toString()
        .padStart(2, "0");


    return `${minutes}:${seconds}`;

  };


  return (

    <div>

      {/* =================================
          TEXT TO SPEECH INPUT
      ================================= */}

      <div className="
        w-[95%]
        rounded-xl
        shadow-sm
        bg-white
        p-4
      ">

        <div className="
          flex
          items-center
          justify-between
        ">

          <h2 className="
            text-[11px]
            text-gray-700
            font-bold
          ">
          </h2>


          <p className="
            text-[9px]
            font-medium
            text-gray-400
          ">
            {input.length}/500
          </p>

        </div>


        {/* TEXTAREA */}

        <div className="
          relative
          mt-2
        ">

          <textarea
            value={input}
            maxLength={500}
            onChange={(e) =>
              setINput(e.target.value)
            }
            className="
              mt-2
              w-full
              h-20
              rounded-lg
              border
              border-gray-200
              bg-[#f8f9ff]
              p-3
              text-xs
              text-gray-700
              outline-none
              resize-none
            "
            placeholder="
              hello world , how are you?
            "
          />


          {/* COPY */}

          <button
            type="button"
            onClick={() => {

              if (!input) {

                toast.error(
                  "Nothing to copy"
                );

                return;

              }


              navigator.clipboard.writeText(
                input
              );


              toast.success(
                "Copied"
              );

            }}
            className="
              absolute
              right-3
              top-3
              text-gray-400
              hover:text-gray-600
            "
          >

            <Copy size={14} />

          </button>

        </div>


        {/* LANGUAGE + VOICE */}

        <div className="
          grid
          grid-cols-2
          gap-4
          mt-3
        ">

          <div>

            <label className="
              text-[10px]
              font-bold
              text-gray-700
            ">
              language
            </label>


            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
              className="
                mt-1
                h-8
                w-full
                rounded-lg
                border
                border-gray-200
                bg-[#f8f9ff]
                px-2
                text-[10px]
                text-gray-600
                outline-none
              "
            >

              <option value="english">
                🇬🇧 English
              </option>

              <option value="hindi">
                🇮🇳 Hindi
              </option>

              <option value="spanish">
                🇪🇸 Spanish
              </option>

            </select>

          </div>


          <div>

            <label className="
              text-[10px]
              font-bold
              text-gray-700
            ">
              Voice
            </label>


            <select
              value={voiceId}
              onChange={(e) =>
                setVoiceId(
                  e.target.value
                )
              }
              className="
                mt-1
                h-8
                w-full
                rounded-lg
                border
                border-gray-200
                bg-[#f8f9ff]
                px-2
                text-[10px]
                text-gray-600
                outline-none
              "
            >

              <option value="">
                Select voice
              </option>


              {voices.map(
                (voice) => (

                  <option
                    key={
                      voice.voice_id
                    }
                    value={
                      voice.voice_id
                    }
                  >
                    {voice.name}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* GENERATE */}

        <button
          onClick={
            handleGenerate
          }
          className="
            mx-auto
            mt-3
            flex
            h-8
            w-45
            items-center
            justify-center
            gap-1.5
            rounded-lg
            bg-gradient-to-r
            from-indigo-500
            to-purple-600
            text-xs
            font-medium
            text-white
            shadow-sm
          "
        >

          <Sparkles size={12} />

          Generate Speech

        </button>

      </div>


      {/* =================================
          GENERATED AUDIO
      ================================= */}

      {audioUrl && (

        <>

          {/* ACTUAL AUDIO */}

          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
          />


          <div className="
            mt-4
            w-[95%]
            rounded-xl
            shadow-sm
            bg-white
            p-4
          ">

            {/* HEADER */}

            <div className="
              flex
              items-start
              justify-between
            ">

              <div>

                <h2 className="
                  text-[11px]
                  text-gray-700
                  font-bold
                ">
                  Generated Audio
                </h2>


                <p className="
                  mt-1
                  text-[9px]
                  text-gray-400
                ">
                  Listen and control your generated speech
                </p>

              </div>


              <div className="
                flex
                items-center
                gap-2
              ">

                <div className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  bg-green-50
                  px-2
                  py-1
                ">

                  <Circle
                    size={7}
                    className="
                      fill-green-500
                      text-green-500
                    "
                  />


                  <span className="
                    text-[9px]
                    font-medium
                    text-green-600
                  ">
                    Ready
                  </span>

                </div>


                <span className="
                  text-[9px]
                  font-medium
                  text-gray-500
                ">
                  {formatTime(duration)}
                </span>

              </div>

            </div>


            {/* PLAYER */}

            <div className="
              mt-3
              w-full
              rounded-xl
              bg-[#f8f9ff]
              p-3
            ">

              <div className="
                flex
                items-center
                gap-3
              ">


                {/* PLAY / PAUSE */}

                <button
                  onClick={
                    handlePlayPause
                  }
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-indigo-500
                    shadow-sm
                  "
                >

                  {isPlaying ? (

                    <Pause
                      size={16}
                      className="
                        fill-white
                        text-white
                      "
                    />

                  ) : (

                    <Play
                      size={16}
                      className="
                        fill-white
                        text-white
                      "
                    />

                  )}

                </button>


                {/* TIME */}

                <span className="
                  text-[10px]
                  text-gray-500
                  whitespace-nowrap
                ">
                  {formatTime(currentTime)}
                  /
                  {formatTime(duration)}
                </span>


                {/* PROGRESS */}

                <div className="
                  min-w-0
                  flex-1
                ">

                  <input
                    className="
                      w-full
                      accent-indigo-500
                    "
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.01"
                    value={currentTime}
                    onChange={
                      handleProgressChange
                    }
                  />

                </div>

              </div>


              {/* CONTROLS */}

              <div className="
                mt-4
                flex
                items-center
                gap-4
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">


                  {/* RESTART */}

                  <button
                    onClick={
                      handleRestart
                    }
                    className="
                      flex
                      w-25
                      h-8
                      items-center
                      justify-center
                      gap-1
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      text-xs
                      text-gray-600
                      shadow-sm
                    "
                  >

                    <RotateCcw
                      size={12}
                    />

                    Restart

                  </button>


                  {/* VOLUME DOWN */}

                  <button
                    onClick={
                      handleVolumeDown
                    }
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      text-gray-600
                      shadow-sm
                    "
                  >

                    <Minus size={14} />

                  </button>


                  {/* VOLUME */}

                  <button
                    onClick={
                      handleMute
                    }
                    className="
                      flex
                      items-center
                      justify-center
                    "
                  >

                    {volume === 0 ? (

                      <VolumeX
                        size={13}
                        className="
                          text-indigo-500
                        "
                      />

                    ) : (

                      <Volume2
                        size={13}
                        className="
                          text-indigo-500
                        "
                      />

                    )}

                  </button>


                  {/* VOLUME SLIDER */}

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={
                      handleVolumeChange
                    }
                    className="
                      w-28
                      accent-indigo-500
                    "
                  />


                  {/* PLUS */}

                  <button
                    onClick={
                      handleVolumeUp
                    }
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      text-gray-600
                      shadow-sm
                    "
                  >

                    <Plus size={14} />

                  </button>


                  {/* PERCENTAGE */}

                  <button
                    className="
                      flex
                      h-8
                      w-12
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      text-[9px]
                      text-gray-500
                      shadow-sm
                    "
                  >
                    {volume}%
                  </button>

                </div>

              </div>


              {/* DOWNLOAD + DELETE */}

              <div className="
                mt-3
                flex
                items-center
                gap-4
              ">

                {/* DOWNLOAD */}

                <button
                  onClick={
                    handleDownload
                  }
                  className="
                    flex
                    w-55
                    h-8
                    items-center
                    justify-center
                    gap-1
                    rounded-lg
                    border
                    border-green-200
                    bg-white
                    text-xs
                    text-green-600
                    shadow-sm
                  "
                >

                  <Download size={10} />

                  Download Audio

                </button>


                {/* DELETE */}

                <button
                  onClick={
                    handleDelete
                  }
                  className="
                    flex
                    w-55
                    h-8
                    items-center
                    justify-center
                    gap-1
                    rounded-lg
                    border
                    border-red-200
                    bg-white
                    text-xs
                    text-red-600
                    shadow-sm
                  "
                >

                  <Trash2 size={10} />

                  Delete

                </button>

              </div>

            </div>

          </div>


          {/* =================================
              FEATURE CARDS
          ================================= */}

          <div className="
            mt-3
            grid
            w-[95%]
            grid-cols-3
            gap-3
          ">

            {/* MULTIPLE LANGUAGES */}

            <div className="
              flex
              items-start
              gap-3
              rounded-lg
              bg-white
              p-3
              shadow-sm
            ">

              <div className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-50
              ">

                <Globe
                  size={15}
                  className="
                    text-indigo-500
                  "
                />

              </div>


              <div>

                <h3 className="
                  text-[10px]
                  font-bold
                  text-gray-700
                ">
                  Multiple Languages
                </h3>


                <p className="
                  mt-1
                  text-[8px]
                  text-gray-400
                ">
                  Convert text into different languages
                </p>

              </div>

            </div>


            {/* NATURAL VOICES */}

            <div className="
              flex
              items-start
              gap-3
              rounded-lg
              bg-white
              p-3
              shadow-sm
            ">

              <div className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-50
              ">

                <Volume2
                  size={15}
                  className="
                    text-indigo-500
                  "
                />

              </div>


              <div>

                <h3 className="
                  text-[10px]
                  font-bold
                  text-gray-700
                ">
                  Natural Voices
                </h3>


                <p className="
                  mt-1
                  text-[8px]
                  text-gray-400
                ">
                  AI-powered natural speech
                </p>

              </div>

            </div>


            {/* FAST GENERATION */}

            <div className="
              flex
              items-start
              gap-3
              rounded-lg
              bg-white
              p-3
              shadow-sm
            ">

              <div className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-50
              ">

                <Zap
                  size={15}
                  className="
                    text-indigo-500
                  "
                />

              </div>


              <div>

                <h3 className="
                  text-[10px]
                  font-bold
                  text-gray-700
                ">
                  Fast Generation
                </h3>


                <p className="
                  mt-1
                  text-[8px]
                  text-gray-400
                ">
                  Generate audio in seconds
                </p>

              </div>

            </div>

          </div>

        </>

      )}

    </div>

  );

};


export default TextToSpeechInput;