        commands.forEach(cmd => {//d12s
            const added = voiceApi.current?.addVoiceCommand(cmd.name, cmd.action);//d12e
            if (added.success) appendLog(`[System] Command added: ${added.commandName} with synonyms ${synonymsMapped}`);
        });