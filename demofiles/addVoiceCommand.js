        commands.forEach(cmd => {//d12s
            const added = voiceApi.current?.addVoiceCommand(cmd.name, cmd.action);//d12e
            if (added) appendLog(`[System] Command added: ${cmd.name}`);
        });