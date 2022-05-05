import * as MODULE from "../../MaterialPlane.js";
import { downloadUtility } from "./misc.js";

export const registerSettings = function() {
    game.settings.register(MODULE.moduleName,'baseSetup', {
        scope: "world",
        config: false,
        type: Array,
        default: []
    });

    game.settings.register(MODULE.moduleName,'remoteSetup', {
        scope: "world",
        config: false,
        type: Array,
        default: []
    });

    /**
     * Download utility (button)
     */
    game.settings.registerMenu(MODULE.moduleName, 'downloadUtility',{
        name: "MaterialPlane.DownloadUtility.Title",
        label: "MaterialPlane.DownloadUtility.Title",
        type: downloadUtility,
        restricted: false
    });

    /**
     * Select device
     */
     game.settings.register(MODULE.moduleName,'device', {
        name: "MaterialPlane.Sett.Device",
        hint: "MaterialPlane.Sett.Device_Hint",
        scope: "world",
        config: true,
        default: 0,
        type: String,
        choices: ["MaterialPlane.Sett.Device_Sensor", "MaterialPlane.Sett.Device_Touch"],
        onChange: x => window.location.reload()
    });

    game.settings.register(MODULE.moduleName,'tapMode', {
        name: "Tap Mode",
        hint: "Sets the tap mode",
        scope: "world",
        config: true,
        default: 0,
        type: String,
        choices: ["Disable", "Tap Timeout", "Raise Mini"]
    });

    /**
     * Touch timeout
     */
    game.settings.register(MODULE.moduleName, 'touchTimeout', {
        name: "MaterialPlane.Sett.TouchTimeout",
        hint: "MaterialPlane.Sett.TouchTimeout_Hint",
        default: 1000,
        type: Number,
        scope: 'world',
        range: { min: 500, max: 5000, step: 100 },
        config: true
        
    });

    game.settings.register(MODULE.moduleName, 'tapTimeout', {
        name: "Tap Timeout",
        hint: `(Touch frame only) Tap Mode: Tap Timeout => Sets the timeout (in ms) to detect a tap. Any touch shorter than this will be considered a tap.
        Tap Mode: Raise Mini => Sets the timeout (in ms) to detect a mini raise. If a touch end is detected in the viscinity of a touch start within this timeout, it will consider the touch to be from a mini, otherwise it'll be considered a tap.`,
        default: 500,
        type: Number,
        scope: 'world',
        range: { min: 100, max: 5000, step: 100 },
        config: true
        
    });

    /**
     * Sets the movement method
     */
    game.settings.register(MODULE.moduleName,'movementMethod', {
        name: "MaterialPlane.Sett.MovementMethod",
        hint: "MaterialPlane.Sett.MovementMethod_Hint",
        scope: "world",
        config: true,
        type:Number,
        default:1,
        choices:["MaterialPlane.Sett.MovementMethod_Default","MaterialPlane.Sett.MovementMethod_Live","MaterialPlane.Sett.MovementMethod_SbS"]
    });


    /**
     * Release the token after dropping
     */
    game.settings.register(MODULE.moduleName,'deselect', {
        name: "MaterialPlane.Sett.Deselect",
        hint: "MaterialPlane.Sett.Deselect_Hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    /**
     * Draw movement marker
     */
     game.settings.register(MODULE.moduleName,'movementMarker', {
        name: "MaterialPlane.Sett.MovementMarker",
        hint: "MaterialPlane.Sett.MovementMarker_Hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    /**
     * Sets if the target client is allowed to move non-owned tokens
     */
    game.settings.register(MODULE.moduleName,'EnNonOwned', {
        name: "MaterialPlane.Sett.NonownedMovement",
        hint: "MaterialPlane.Sett.NonownedMovement_Hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    /**
     * Sets if the target client is allowed to move non-owned tokens
     */
     game.settings.register(MODULE.moduleName,'collisionPrevention', {
        name: "MaterialPlane.Sett.CollisionPrevention",
        hint: "MaterialPlane.Sett.CollisionPrevention_Hint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    /**
     * Hides all elements on the target client, if that client is not a GM
     */
    game.settings.register(MODULE.moduleName,'HideElements', {
        name: "MaterialPlane.Sett.HideDisplay",
        hint: "MaterialPlane.Sett.HideDisplay_Hint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });

    game.settings.register(MODULE.moduleName, 'MenuSize', {
        name: "MaterialPlane.Sett.MenuSize",
        hint: "MaterialPlane.Sett.MenuSizeHint",
        default: 2.5,
        type: Number,
        scope: 'world',
        range: { min: 0, max: 5, step: 0.1 },
        config: true
        
    });

    
    /**
     * Sets the name of the target client (who has the TV connected)
     */
     game.settings.register(MODULE.moduleName,'TargetName', {
        name: "MaterialPlane.Sett.TargetName",
        hint: "MaterialPlane.Sett.TargetName_Hint",
        scope: "world",
        config: true,
        default: "Observer",
        type: String,
        onChange: x => window.location.reload()
    });

    /**
     * Let this client connect to the sensor
     */
     game.settings.register(MODULE.moduleName,'Enable', {
        name: "MaterialPlane.Sett.Conn",
        hint: "MaterialPlane.Sett.Conn_Hint",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        onChange: x => window.location.reload()
    });

    /**
     * Sets the IP address and port of the sensor
     */
    game.settings.register(MODULE.moduleName,'IP', {
        name: "MaterialPlane.Sett.SensorIP",
        hint: "MaterialPlane.Sett.SensorIP_Hint",
        scope: "world",
        config: true,
        default: "materialsensor.local:3000",
        type: String,
        onChange: x => window.location.reload()
    });

    /**
     * Use Material Server
     */
     game.settings.register(MODULE.moduleName,'EnMaterialServer', {
        name: "MaterialPlane.Sett.EnMaterialServer",
        hint: "MaterialPlane.Sett.EnMaterialServer_Hint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });

    /**
     * Sets the IP address and port of Material Server
     */
     game.settings.register(MODULE.moduleName,'MaterialServerIP', {
        name: "MaterialPlane.Sett.MaterialServerIP",
        hint: "MaterialPlane.Sett.MaterialServerIP_Hint",
        scope: "client",
        config: true,
        default: "localhost:3001",
        type: String,
        onChange: x => window.location.reload()
    });

    //invisible settings
    game.settings.register(MODULE.moduleName,'menuOpen', {
        name: "Menu Open",
        hint: "Menu open on GM side",
        scope: "client",
        config: false,
        default: false,
        type: Boolean
    });


}

