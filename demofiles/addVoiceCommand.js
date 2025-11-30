        commands.forEach(async cmd => {//d12s
            const added =  await voiceApi.current?.addVoiceCommand(cmd.name, cmd.action);//d12e
            if (added?.success) appendLog(`[System] Command added: ${added.commandName} with synonyms ${added.synonymsMapped}`);
        });