        const commands = [//d9s
            {//d10s
                name: "blue",
                action: () => changeColor("dodgerblue", "Blue"),
                options:{
                    description: "changes color to blue",
                    fetchSynonyms: true,
                    numberOfSynonyms:5,
                }
            },
            {
                name: "red",
                action: () => changeColor("darkred", "Red"),
                options:{
                    description: "changes color to red",
                    fetchSynonyms: true,
                    numberOfSynonyms:3,
                }
            },//d10e
            {
                name: "green",
                action: () => changeColor("darkseagreen", "Green"),
                options:{
                    description: "changes color to green",
                    fetchSynonyms: false,
                }                
            },
            {
                name: "clear",
                action: () => changeColor("white", ""),
                options:{
                    fetchSynonyms: false,
                }                
            },
        ];//d9e