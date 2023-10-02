/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput-schema.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */

export default class GameInputSchema {

    static Defaults = {
        d_up: "↑",
        d_down: "↓",
        d_left: "←",
        d_right: "→",
        menu: "▶",
        button0: "button0",
        button1: "button1",
        button2: "button2",
        button3: "button3",
        l_up: "↑",
        l_down: "↓",
        l_left: "←",
        l_right: "→",
        r_up: "↑",
        r_down: "↓",
        r_left: "←",
        r_right: "→",
        l_button: "l_button",
        r_button: "r_button",
        l_trigger: "l_trigger",
        r_trigger: "r_trigger"
    }

    static Hedgehog = new GameInputSchema("Hedgehog", {
            button0     :   "A",
            button1     :   "B",
            button2     :   "X",
            button3     :   "Y",
            l_button    :   "LB",
            r_button    :   "RB",
            l_trigger   :   "LT",
            r_trigger   :   "RT"
    });

    static Plumber = new GameInputSchema("Plumber", {
            button0     :   "A",
            button1     :   "B",
            button2     :   "X",
            button3     :   "Y",
            l_button    :   "LB",
            r_button    :   "RB",
            l_trigger   :   "LT",
            r_trigger   :   "RT"
    });

    static Ragdoll = new GameInputSchema("Ragdoll", {
            button0     :   "x",
            button1     :   "o",
            button2     :   "□",
            button3     :   "△",
            l_button    :   "L1",
            r_button    :   "R1",
            l_trigger   :   "L2",
            r_trigger   :   "R2"
    });

    static Ragdoll4 = new GameInputSchema("Ragdoll", {
            menu        :   "options",
            button0     :   "x",
            button1     :   "o",
            button2     :   "□",
            button3     :   "△",
            l_button    :   "L1",
            r_button    :   "R1",
            l_trigger   :   "L2",
            r_trigger   :   "R2"
    });

    schemaNames = {}

    /**
     * Constructor.
     * @param {string} name schema/theme name
     * @param {object} themeSchemaNames list of overrides for button names to text
     */
    constructor(name, themeSchemaNames) {
        this.name = name;

        for (let i in GameInputSchema.Defaults) {
            this.schemaNames[i] = themeSchemaNames[i] ?? GameInputSchema.Defaults[i];
        }
    }
}

export {GameInputSchema}

/**
 * @preserve
 * @license-end
 */
