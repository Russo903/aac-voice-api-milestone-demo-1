            if (mode === 'offline') {
                // Offline mode              
                await voiceApi.current.initiate({//d2s
                    mode: 'offline',
                    modelUrl: modelUrl,
                    language: 'en'
                });
                appendLog("[System] Offline mode initialized (local Whisper)");//d2e
            } 
            //d3s