        const commands = [//d9s
            {
                name: "blue",
                action: () => changeColor("dodgerblue", "Blue"),
            },
            {//d10s
                name: "red",
                action: () => changeColor("darkred", "Red"),
                description: "changes the box red",
                active: true,
            },//d10e
            {
                name: "green",
                action: () => changeColor("darkseagreen", "Green"),
            },
            {
                name: "clear",
                action: () => changeColor("white", ""),
            },
        ];//d9e