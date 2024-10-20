function MovaAPI(config) {
    if (!config) return "no config object"

    let context;
    if (!config.context || config.context === null) {
        if (document.getElementById("html5Iframe")) {
            context = document.getElementById("html5Iframe").contentWindow
        } else {
            throw new Error("config.context invalid")
        }
    } else {
        context = config.context;
    }

    let subject;
    try {
        subject = context.src.split("/")[4];
    } catch (error) {
        subject = html5Iframe.src.split("/")[4];
    }

    const webpack = context[Object.keys(context).find(key => key.includes("webpack"))];
    const require = webpack.push([[Symbol()], {}, MovaOntop => MovaOntop]); // only works for a specific version of webpack

    // cache hook
    const sym = Symbol();
    context.Object.defineProperty(context.Object.prototype, sym, {
        get() {
            require.c = this // set cache
            return {
                exports: {mova:"ontop"} // return fake exports so no crash
            };
        },
        set() {}, // again, so no crash
        configurable: true,
    });
    require(sym); // require the identficator which is hooked, so when webpack attempts to get the content, the cache will be set to require.c
    delete context.Object.prototype[sym]; // remove traces of the hook

    // start return funcs

    function scan(...args) {
        if (!require || !require.c) {
            console.warn("webpack cache is not available");
            return null;
        }

        const queue = Object.values(require.c).map(module => module.exports);

        while (queue.length > 0) {
            const item = queue.shift();

            if (typeof item === 'object' && item !== null) {
                if (item.hasOwnProperty(args[0])) { // check for first keyword
                    let obj = item[args[0]];
                    let found = true;

                    for (let i = 1; i < args.length - 1; i++) { // check for next keywords
                        if (!obj || typeof obj !== 'object' || !obj.hasOwnProperty(args[i])) {
                            found = false;
                            break;
                        }
                        obj = obj[args[i]];
                    }

                    const lastKey = args[args.length - 1];
                    if (found && obj && typeof obj === 'object' && obj.hasOwnProperty(lastKey) && typeof obj[lastKey] === 'function') {
                        return item; // return parent item
                    }
                }

                for (const key in item) {
                    if (item.hasOwnProperty(key) && typeof item[key] === 'object' && item[key] !== null) {
                        queue.push(item[key]); // add nested objects
                    }
                }
            }
        }

        console.warn("not found");
        return null;
    }

    function find(obj = require.c, keyword) {
        const foundFunctions = [];
        const queue = [obj]; // queue is so hot

        while (queue.length > 0) {
            const currentObj = queue.shift(); // :3

            for (const key in currentObj) {
                if (currentObj.hasOwnProperty(key)) {
                    const value = currentObj[key]; // specify value to search

                    // check to see if it matches
                    if (typeof value === 'function' && key === keyword) {
                        foundFunctions.push(value);
                    } else if (typeof value === 'object' && value !== null) {
                        queue.push(value); // add nested objs
                    }
                }
            }
        }

        if (foundFunctions.length === 0) {
            console.warn("not found");
        }

        return foundFunctions;
    }

    return {
        subject,
        config,
        context,
        webpack,
        require,
        scan,
        find
    };
}
