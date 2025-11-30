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