/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput.models.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */
"use strict";

if (typeof(GameInput) == "undefined") throw "GameInput JS must be included first!";

gi.Models.Specific = [
    new gi.Model(
        gi.Type.Hedgehog,
        "xbox360",
        "Xbox 360 Controller (XInput STANDARD GAMEPAD)",
        "Windows",
        gi.Schema.StardardSchema
    ),
    new gi.Model(
        gi.Type.Plumber,
        "nintendo-generic",
        "0925-8866-SFC/USB Pad",
        "Windows",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            8,
            2,1,4,3,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            5, 6, undefined, undefined
    )),
    new gi.Model(
        gi.Type.Plumber,
        "nintendo-generic",
        "SFC/USB Pad (Vendor: 0925 Product: 8866)",
        "Windows",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            8,
            2,1,4,3,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            5, 6, undefined, undefined
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "xbox360",
        "Xbox 360 Wireless Receiver (Vendor: 0000 Product: 0000)",
        "Linux",
        new gi.Schema.GamePadAPI(
            16,17,14,15,
            10,
            2,1,4,3,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            5,6,7,8
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "xbox360",
        "0000-0000-Xbox 360 Wireless Receiver",
        "Linux",
        new gi.Schema.GamePadAPI(
            16,17,14,15,
            10,
            1,2,3,4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            5,6,7,8
    )),
    new gi.Model(
        gi.Type.Ragdoll4,
        "ds4",
        "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
        "Windows",
        gi.Schema.StardardSchema
    ),
    new gi.Model(
        gi.Type.Ragdoll4,
        "ds4",
        "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
        "Mac OS X",
        gi.Schema.StardardSchema
    ),
    new gi.Model(
        gi.Type.Ragdoll4,
        "ds4",
        "054c-05c4-Wireless Controller",
        "Windows",
        new gi.Schema.GamePadAPI(
            15, 16, 17, 18,
            10,
            2, 3, 1, 4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-6),
            new gi.Schema.AxisButton(6),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            5, 6, 7, 8
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "xbox360",
        "©Microsoft Corporation Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)",
        "Linux",
        gi.Schema.StardardSchema
    ),
    new gi.Model(
        gi.Type.Hedgehog,
        "xbox360",
        "Performance Designed Products Afterglow Gamepad for Xbox 360 (Vendor: 0e6f Product: 0213)",
        "Linux",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-8),
            new gi.Schema.AxisButton(8),
            new gi.Schema.AxisButton(-7),
            new gi.Schema.AxisButton(7),
            8,
            1,2,3,4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-5),
            new gi.Schema.AxisButton(5),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            5,
            6,
            new gi.Schema.AxisButton(3),
            new gi.Schema.AxisButton(6)
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "xbox360",
        "0e6f-0213-Afterglow Gamepad for Xbox 360",
        "Linux",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-8),
            new gi.Schema.AxisButton(8),
            new gi.Schema.AxisButton(-7),
            new gi.Schema.AxisButton(7),
            8,
            1,2,3,4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-5),
            new gi.Schema.AxisButton(5),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            5,
            6,
            new gi.Schema.AxisButton(3),
            new gi.Schema.AxisButton(6)
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "dc",
        "HuiJia  USB GamePad (Vendor: 0e8f Product: 3013)",
        "Linux",
        new gi.Schema.GamePadAPI(
            13, 15, 16, 14,
            10,
            1,2,3,4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            undefined,
            undefined,
            undefined,
            undefined,
            undefined, undefined, 5, 6
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "dc",
        "USB GamePad (Vendor: 0e8f Product: 3013)",
        "Windows",
        new gi.Schema.GamePadAPI(
            13, 15, 16, 14,
            10,
            1,2,3,4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            undefined,
            undefined,
            undefined,
            undefined,
            undefined, undefined, 5, 6
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "dc",
        "USB GamePad (Vendor: 0e8f Product: 3013)",
        "Mac OS X",
        new gi.Schema.GamePadAPI(
        13, 15, 16, 14,
        10,
        1, 2, 3, 4,
        new gi.Schema.AxisButton(-2),
        new gi.Schema.AxisButton(2),
        new gi.Schema.AxisButton(-1),
        new gi.Schema.AxisButton(1),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined, undefined, 5, 6
    )),
    new gi.Model(
        gi.Type.Ragdoll,
        "ds3",
        "Sony PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)",
        "Linux",
        gi.Schema.StardardSchema
    ),
    new gi.Model(
        gi.Type.Ragdoll,
        "ds3",
        "054c-0268-Sony PLAYSTATION(R)3 Controller",
        "Linux",
        new gi.Schema.GamePadAPI(
            5,7,8,6,
            4,
            15, 14, 16, 13,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            11,12,9,10
    )),
    new gi.Model(
        gi.Type.Ragdoll4,
        "ds4",
        "Sony Computer Entertainment Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
        "Linux",
        gi.Schema.StardardSchema
    ),
    new gi.Model(
        gi.Type.Ragdoll4,
        "ds4",
        "054c-05c4-Sony Computer Entertainment Wireless Controller",
        "Linux",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-8),
            new gi.Schema.AxisButton(8),
            new gi.Schema.AxisButton(-7),
            new gi.Schema.AxisButton(7),
            10,
            2,3,1,4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-6),
            new gi.Schema.AxisButton(6),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            5, 6, 7, 8
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "joystick",
        "Mayflash Arcade Stick (Vendor: 0e8f Product: 0003)",
        "Windows",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            10,
            1, 2, 3, 4,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            5, 6, 7, 8
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "joystick",
        "PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)", /* Mayflash Arcade Stick */
        "Mac OS X",
        new gi.Schema.GamePadAPI(
        13, 14, 15, 16,
        10,
        7, 1, 2, 8,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        5, 3, 4, 6
    )),
    new gi.Model(
        gi.Type.Ragdoll,
        "joystick",
        "MY-POWER CO.,LTD. Mayflash Arcade Stick (STANDARD GAMEPAD Vendor: 0e8f Product: 0003)",
        "Linux",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            10,
            4,2,1,3,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            7,8,5,6
    )),
    new gi.Model(
        gi.Type.Ragdoll,
        "joystick",
        "0e8f-0003-MY-POWER CO.,LTD. Mayflash Arcade Stick",
        "Linux",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            10,
            1,2,3,4,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            5,6,7,8
    )),
    new gi.Model(
        gi.Type.Ragdoll,
        "joystick",
        "Logitech Logitech Extreme 3D Pro (Vendor: 046d Product: c215)",
        "Linux",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-6, 0.3),
            new gi.Schema.AxisButton(6, 0.3),
            new gi.Schema.AxisButton(-5, 0.3),
            new gi.Schema.AxisButton(5, 0.3),
            12,
            1,2,3,4,
            new gi.Schema.AxisButton(-2, 0.3),
            new gi.Schema.AxisButton(2, 0.3),
            new gi.Schema.AxisButton(-1, 0.3),
            new gi.Schema.AxisButton(1, 0.3),
            undefined,
            undefined,
            new gi.Schema.AxisButton(-3, 0.3),
            new gi.Schema.AxisButton(3, 0.2),
            5,6,9,11
    )),
    new gi.Model(
        gi.Type.Ragdoll,
        "joystick",
        "046d-c215-Logitech Logitech Extreme 3D Pro",
        "Linux",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-6, 0.3),
            new gi.Schema.AxisButton(6, 0.3),
            new gi.Schema.AxisButton(-5, 0.3),
            new gi.Schema.AxisButton(5, 0.3),
            12,
            1,2,3,4,
            new gi.Schema.AxisButton(-2, 0.3),
            new gi.Schema.AxisButton(2, 0.3),
            new gi.Schema.AxisButton(-1, 0.3),
            new gi.Schema.AxisButton(1, 0.3),
            undefined,
            undefined,
            new gi.Schema.AxisButton(-3, 0.3),
            new gi.Schema.AxisButton(3, 0.2),
            5,6,9,11
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "generic",
        "Microsoft® Microsoft® SideWinder® Game Pad USB (Vendor: 045e Product: 0007)",
        "Linux",
        new gi.Schema.GamePadAPI(
    /* d_up */  new gi.Schema.AxisButton(-2),
    /* d_down */  new gi.Schema.AxisButton(2),
    /* d_left */  new gi.Schema.AxisButton(-1),
    /* d_right */  new gi.Schema.AxisButton(1),
    /* menu */  10,
    /* button0 */  1,
    /* button1 */  2,
    /* button2 */  4,
    /* button3 */  5,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
    /* l_button */  6,
    /* r_button */  3,
    /* l_trigger */  7,
    /* r_trigger */  8
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "generic",
        "045e-0007-Microsoft® Microsoft® SideWinder® Game Pad USB",
        "Linux",
        new gi.Schema.GamePadAPI(
    /* d_up */  new gi.Schema.AxisButton(-2),
    /* d_down */  new gi.Schema.AxisButton(2),
    /* d_left */  new gi.Schema.AxisButton(-1),
    /* d_right */  new gi.Schema.AxisButton(1),
    /* menu */  10,
    /* button0 */  1,
    /* button1 */  2,
    /* button2 */  4,
    /* button3 */  5,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
    /* l_button */  6,
    /* r_button */  3,
    /* l_trigger */  7,
    /* r_trigger */  8
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "generic",
        "ASUS Gamepad",
        "Android",
        new gi.Schema.GamePadAPI(
            undefined,
            undefined,
            undefined,
            undefined,
            12,
            1,2,3,4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            7, 8, 5, 6
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "generic",
        "NYKO PLAYPAD PRO",
        "Android",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-8),
            new gi.Schema.AxisButton(8),
            new gi.Schema.AxisButton(-7),
            new gi.Schema.AxisButton(7),
            10,
            2,3,1,4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-6),
            new gi.Schema.AxisButton(6),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            5, 6, 7, 8
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "generic",
        "Moga 2 HID",
        "Android",
        new gi.Schema.GamePadAPI(
            undefined,
            undefined,
            undefined,
            undefined,
            10,
            1, 2, 3, 4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            undefined,
            undefined,
            undefined,
            undefined,
            7, 8,
            undefined,
            undefined
    )),
    new gi.Model(
        gi.Type.Hedgehog,
        "generic",
        "Moga 2 HID (Vendor: 20d6 Product: 89e5)",
        "Linux",
        new gi.Schema.GamePadAPI(
            new gi.Schema.AxisButton(-8),
            new gi.Schema.AxisButton(8),
            new gi.Schema.AxisButton(-7),
            new gi.Schema.AxisButton(7),
            7,
            1, 2, 3, 4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            5, 6,
            new gi.Schema.AxisButton(6),
            new gi.Schema.AxisButton(5)
    )),
    /* Force to manually configure this multiple-configuration adapter instead of assuming which adapter port you're using "HuiJia  PS/SS/N64 Joypad to USB BOX (Vendor: 0925 Product: 1700)" */
    new gi.Model(
    gi.Type.Plumber,
    "nintendo-generic",
    "(null) usb gamepad            (Vendor: 0810 Product: e501)",
    "Linux",
    new gi.Schema.GamePadAPI(
        /* d_up */  new gi.Schema.AxisButton(-2),
        /* d_down */  new gi.Schema.AxisButton(2),
        /* d_left */  new gi.Schema.AxisButton(-1),
        /* d_right */  new gi.Schema.AxisButton(1),
        /* menu */  10,
        /* button0 */  2,
        /* button1 */  3,
        /* button2 */  1,
        /* button3 */  4,
        /* l_up */  undefined,
        /* l_down */  undefined,
        /* l_left */  undefined,
        /* l_right */  undefined,
        /* r_up */  undefined,
        /* r_down */  undefined,
        /* r_left */  undefined,
        /* r_right */  undefined,
        /* l_button */  5,
        /* r_button */  6,
        /* l_trigger */  undefined,
        /* r_trigger */  undefined
    )),
    new gi.Model(
    gi.Type.Plumber,
    "nintendo-generic",
    "usb gamepad            (Vendor: 0810 Product: e501)",
    "Mac OS X",
    new gi.Schema.GamePadAPI(
        /* d_up */  new gi.Schema.AxisButton(-2),
        /* d_down */  new gi.Schema.AxisButton(2),
        /* d_left */  new gi.Schema.AxisButton(-1),
        /* d_right */  new gi.Schema.AxisButton(1),
        /* menu */  10,
        /* button0 */  2,
        /* button1 */  3,
        /* button2 */  1,
        /* button3 */  4,
        /* l_up */  undefined,
        /* l_down */  undefined,
        /* l_left */  undefined,
        /* l_right */  undefined,
        /* r_up */  undefined,
        /* r_down */  undefined,
        /* r_left */  undefined,
        /* r_right */  undefined,
        /* l_button */  5,
        /* r_button */  6,
        /* l_trigger */  undefined,
        /* r_trigger */  undefined
    )),
    new gi.Model(
    gi.Type.Plumber,
    "nintendo-generic",
    "810-e501-usb gamepad           ",
    "Mac OS X",
    new gi.Schema.GamePadAPI(
        /* d_up */  new gi.Schema.AxisButton(-3),
        /* d_down */  new gi.Schema.AxisButton(3),
        /* d_left */  new gi.Schema.AxisButton(-2),
        /* d_right */  new gi.Schema.AxisButton(2),
        /* menu */  10,
        /* button0 */  2,
        /* button1 */  3,
        /* button2 */  1,
        /* button3 */  4,
        /* l_up */  undefined,
        /* l_down */  undefined,
        /* l_left */  undefined,
        /* l_right */  undefined,
        /* r_up */  undefined,
        /* r_down */  undefined,
        /* r_left */  undefined,
        /* r_right */  undefined,
        /* l_button */  5,
        /* r_button */  6,
        /* l_trigger */  undefined,
        /* r_trigger */  undefined
    ))
];

gi.initialGamePadSetup(); // re-detect gamepads

/**
 * @preserve
 * @license-end
 */
