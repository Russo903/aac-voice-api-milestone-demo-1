import './App.css';
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSplotch } from '@fortawesome/free-solid-svg-icons'
import { AACVoiceAPI } from "aac-voice-api";

function App() {
    const [color, setColor] = useState<string>("white")
    const [colorText, setColorText] = useState<string>("")
    const [isListening, setIsListening] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [log, setLog] = useState<string[]>([])
    const [mode, setMode] = useState<'offline' | 'online'>('offline');
    const [useSeparation, setUseSeparation] = useState<boolean>(false);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true)

    const voiceApi = useRef<AACVoiceAPI | null>(null);
    const wasInitiated = useRef<boolean>(false);
    const lastTranscriptionCount = useRef<number>(0);
    const modelUrl = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin';
    const appendLog = (message: string) => {
        setLog((prev) => [...prev, message]);
    }

    const initVoice = async () => {//d1s
        try {//call initiate here
            if (!voiceApi.current) {
                voiceApi.current = new AACVoiceAPI()
            }
            if (mode === 'offline') {
                // Offline mode              
                await voiceApi.current.initiate({//d2s
                    mode: 'offline',
                    modelUrl: modelUrl,
                    language: 'en',
                    usePhoneticMatching: true,
                    confidenceThreshold: 0.9,
                    logConfidenceScores: false,
                });
                appendLog("[System] Offline mode initialized (local Whisper)");//d2e
            } 
            else {
                await voiceApi.current.initiate({//d4s
                    mode: 'online',
                    modelUrl: 'http://localhost:8000',
                    useSpeakerSeparation: useSeparation,
                    usePhoneticMatching: true,
                    confidenceThreshold: 0.9,
                    logConfidenceScores: false,

                });//d4e
                const sepText = useSeparation ? ' with speaker separation' : ' (single speaker)';
                appendLog(`[System] Online mode initialized${sepText}`);
            }

            setIsButtonDisabled(true);
            wasInitiated.current = true;
            setupVoiceCommands();





        } catch (e) {
            appendLog('[Error] Init failed: ' + e);
        }
    }//d1e

    const startListening = async () => {//d5s
        try {
            voiceApi.current?.start();//d20s
            setIsListening(true);
            appendLog('[System] Started listening...\n');

        } catch (e) {
            appendLog('[Error] Start failed: ' + e + '\n');
        }
    }//d5e

    const stopListening = async () => {//d6s
        try {
            voiceApi.current?.stop();//d21
            setIsListening(false);
            appendLog('[System] Stopped listening...\n');

        } catch (e) {
            appendLog('[Error] Stop failed: ' + e + '\n');
        }
    }//d6e

    const toggleSeparation = () => {
        if (!wasInitiated.current || mode !== 'online') {
            appendLog('[Error] Must be in online mode to toggle separation');
            return;
        }

        try {
            voiceApi.current?.toggleSpeakerMode();
            const newState = voiceApi.current?.isUsingSpeakerSeparation();
            setUseSeparation(newState ?? false);
            appendLog(`[System] ✓ Switched to ${newState ? 'multi' : 'single'}-speaker mode`);
        } catch (e) {
            appendLog('[Error] Toggle failed: ' + e);
        }
    }

    const showCommandHistory = () => {//d7s
        try {
            voiceApi.current?.displayCommandHistory();//d7e
        
        } catch (e) {
            appendLog("[Error] Display popup failed: " + e);
        }
    };

    const downloadLogs = () => {
        try{
            voiceApi.current?.downloadLogsAsJSON();//d22
        }
        catch(e){
            appendLog('[Error] downloading logs to file '+ e);
        }
        
    }

    const changeColor = (color: string, colorText: string) => {
        setColor(color);
        setColorText(colorText);
    }

    const setupVoiceCommands = () => {
        if (!voiceApi.current) return;

        const commands = [//d9s
            {
                name: "blue",
                action: () => changeColor("dodgerblue", "Blue"),
                options:{
                    description: "changes color to blue",
                    fetchSynonyms: true,
                }
            },
            {//d10s
                name: "red",
                action: () => changeColor("darkred", "Red"),
                options:{
                    description: "changes color to red",
                    fetchSynonyms: true,
                }
            },
            {
                name: "green",
                action: () => changeColor("darkseagreen", "Green"),
                options:{
                    description: "changes color to green",
                    fetchSynonyms: false,
                }                
            },//d10e
            {
                name: "clear",
                action: () => changeColor("white", ""),
                options:{
                    fetchSynonyms: false,
                }                
            },
        ];//d9e

        commands.forEach(async cmd => {//d12s
            const added =  await voiceApi.current?.addVoiceCommand(cmd.name, cmd.action, cmd.options);//d12e
            if (added?.success) appendLog(`[System] Command added: ${added.commandName} with synonyms ${added.synonymsMapped}`);
        });
    };

    useEffect(() => {
        if (!isListening) return;

        const intervalId = setInterval(() => {
            const transcribed = voiceApi.current?.getTranscriptionLogs();//d15s

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

    return (
        <>
            <h1>Click{isVoiceEnabled && (<> or Say</>)} colors to change me!</h1>
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

            <div className='box-container-square'>
                <div
                    className="border"
                    style={{
                        backgroundColor: color,
                    }}>
                    <p>{colorText}</p>
                </div>

                {isVoiceEnabled && (<>
                {/* ✅ NEW: Mode Selection Panel */}
                {!wasInitiated.current && (
                    <div className="mode-selection">
                        <h3>🎤 Choose Mode:</h3>
                        <div className="mode-options">
                            <label className={mode === 'offline' ? 'selected' : ''}>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="offline"
                                    checked={mode === 'offline'}
                                    onChange={(e) => setMode(e.target.value as 'offline')}
                                />
                                <span>
                                    <strong>Offline</strong> (Local Whisper)
                                </span>
                            </label>

                            <label className={mode === 'online' ? 'selected' : ''}>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="online"
                                    checked={mode === 'online'}
                                    onChange={(e) => setMode(e.target.value as 'online')}
                                />
                                <span>
                                    <strong>Online</strong> (Python Backend)
                                    <br />
                                    <small>✓ Better accuracy • Speaker separation</small>
                                </span>
                            </label>
                        </div>

                        {mode === 'online' && (
                            <div className="separation-toggle">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={useSeparation}
                                        onChange={(e) => setUseSeparation(e.target.checked)}
                                    />
                                    Enable Multi-Speaker Mode
                                </label>
                            </div>
                        )}
                    </div>
                )}

                <div className="voice-controls">
                    {isButtonDisabled ? (
                        <button disabled={true}>Initiate</button>
                    ) : (
                        <button onClick={initVoice}>Initiate</button>
                    )}

                    {wasInitiated.current && !isListening ? (
                        <button onClick={startListening}>Start</button>
                    ) : (
                        <button disabled={true}>Start</button>
                    )}

                    {isListening ? (
                        <button onClick={stopListening}>Stop</button>
                    ) : (
                        <button disabled={true}>Stop</button>
                    )}

                    {mode === 'online' && wasInitiated.current && (
                        <button
                            onClick={toggleSeparation}
                            className={useSeparation ? 'active' : ''}
                        >
                            {useSeparation ? '👥 Multi' : '👤 Single'} Speaker
                        </button>
                    )}

                    <button onClick={showCommandHistory}>Show History</button>
                    <button onClick={() => changeColor("white", "")}>Clear</button>
                    <button onClick={() => downloadLogs()}>Download Logs</button>
                </div>

                {wasInitiated.current && (
                    <div className="status-bar">
                        Mode: <strong>{mode === 'offline' ? 'Offline' : 'Online'}</strong>
                        {mode === 'online' && (
                            <> • {useSeparation ? '👥 Multi-Speaker' : '👤 Single-Speaker'}</>
                        )}
                    </div>
                )}

                <pre className="log-box">
                    {log.map((l, i) => (
                        <div key={i}>{l}</div>
                    ))}
                </pre>
                </>)}
            </div>
        </>
    )
}

export default App