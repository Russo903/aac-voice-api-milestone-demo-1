import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSplotch } from '@fortawesome/free-solid-svg-icons'
import {AACVoiceAPI} from "aac-voice-api";

import './App.css'

function App() {
    const [color, setColor] = useState<string>("dodgerblue")
    const [colorText, setColorText] = useState<string>("Blue")
    const [isListening, setIsListening] = useState<boolean>(false);
    const [log, setLog] = useState<string[]>([])

    const voiceApi = useRef<AACVoiceAPI | null>(null);
    const lastTranscriptionCount = useRef<number>(0);

    const appendLog = (message: string) => {
        setLog((prev) => [...prev, message]);
    }

    useEffect(() => {
        if (!isListening) return;

        const intervalId = setInterval(() => {
            const transcribed = voiceApi.current?.getTranscribedFull();

            if ((transcribed?.length || 0) > lastTranscriptionCount.current) {
                const newEntries = transcribed?.slice(lastTranscriptionCount.current);
                newEntries?.forEach(entry => {
                    appendLog(entry);
                });

                lastTranscriptionCount.current = transcribed?.length || 0;
            }
        }, 200);

        return () => clearInterval(intervalId);
    }, [isListening]);

    const initVoice = async () => {
        const modelUrl = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin';
        try {
            if (!voiceApi.current) {
                voiceApi.current = new AACVoiceAPI()
            }

            await voiceApi.current.initiate(modelUrl, 'en');
            appendLog("[System] Whisper initialized.\\n");
            setupVoiceCommands();
        } catch (e) {
            appendLog('[Error] Init failed: ' + e + '\\n');
        }
    }

    const startListening = async () => {
        try {
            await voiceApi.current?.start();
            setIsListening(true);
            appendLog('[System] Started listening...\\n');
        } catch (e) {
            appendLog('[Error] Start failed: ' + e + '\n');
        }
    }

    const stopListening = async () => {
        try {
            await voiceApi.current?.stop();
            setIsListening(false);
            appendLog('[System] Stopped listening...\\n');
        } catch (e) {
            appendLog('[Error] Stop failed: ' + e + '\n');
        }
    }

    const showCommandHistory = () => {
        try {
            voiceApi.current?.displayCommandHistory();
        } catch (e: any) {
            appendLog("[Error] Display popup failed: " + e.message);
        }
    };

    const changeColor = (color: string, colorText: string) => {
        setColor(color);
        setColorText(colorText);
    }

    const setupVoiceCommands = () => {
        if (!voiceApi.current) return;

        const commands = [
            {
                name: "blue",
                action: () => changeColor("dodgerblue", "Blue"),
            },
            {
                name: "red",
                action: () => changeColor("darkred", "Red"),
            },
            {
                name: "green",
                action: () => changeColor("darkseagreen", "Green"),
            },
        ];

        commands.forEach(cmd => {
            const added = voiceApi.current?.addVoiceCommand(cmd.name, cmd.action);
            if (added) appendLog(`[System] Command added: ${cmd.name}`);
        });
    };


    return (
    <>
        <h1>Click/Say colors to change me!</h1>
        <div className="row-splotches">
            <FontAwesomeIcon
                className="icon blue"
                size="6x"
                onClick={() => changeColor("dodgerblue", "Blue")}
                icon={faSplotch} />
            <FontAwesomeIcon
                className="icon red"
                size="6x"
                onClick={() => changeColor("darkred", "Red")}
                icon={faSplotch} />
            <FontAwesomeIcon
                className="icon green"
                size="6x"
                onClick={() => changeColor("darkseagreen", "Green")}
                icon={faSplotch} />
        </div>
      <div
          className="border"
          style={{
              backgroundColor: color,
          }}>
          <p>{colorText}</p>
      </div>

        <div className="voice-controls">
            <button onClick={initVoice}>Init</button>
            <button onClick={startListening}>Start</button>
            <button onClick={stopListening}>Stop</button>
            <button onClick={showCommandHistory}>Show History</button>
        </div>

        <pre className="log-box">
        {log.map((l, i) => (
            <div key={i}>{l}</div>
        ))}
      </pre>
    </>
  )
}

export default App
