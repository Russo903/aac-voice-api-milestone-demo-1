            else {
                await voiceApi.current.initiate({//d4s
                    mode: 'online',
                    useSpeakerSeparation: useSeparation
                });//d4e
                const sepText = useSeparation ? ' with speaker separation' : ' (single speaker)';
                appendLog(`[System] Online mode initialized${sepText}`);
            }
