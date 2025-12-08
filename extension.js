import St from "gi://St";
import GLib from "gi://GLib";
import Clutter from "gi://Clutter";
import Gio from "gi://Gio";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

export default class WorkspaceOverlayExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._overlayLabel = null;
        this._workspaceSignal = null;
        this._fadeTimeoutId = null;

        this._settings = new Gio.Settings({
            schema_id: "org.gnome.shell.extensions.workspace-overlay",
        });
    }

    _showOverlay() {
        const wm = global.workspace_manager;
        const index = wm.get_active_workspace_index();

        // Read saved names from GSettings
        const settings = this._settings;
        const savedNames = settings.get_strv("workspace-names");

        let name = savedNames[index];
        if (!name || name.trim() === "") {
            name = `Workspace ${index + 1}`;
        }

        if (!this._overlayLabel) {
            this._overlayLabel = new St.Label({
                style_class: "workspace-overlay",
                text: name,
                opacity: 0,
                reactive: false,
            });

            Main.layoutManager.addChrome(this._overlayLabel);
        }

        this._overlayLabel.text = name;
        this._overlayLabel.opacity = 0;

        // Position after size is known
        GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
            this._overlayLabel.set_position(
                Math.floor((global.stage.width - this._overlayLabel.width) / 2),
                Math.floor(global.stage.height * 0.1)
            );

            this._overlayLabel.ease({
                opacity: 255,
                duration: 200,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            });

            return GLib.SOURCE_REMOVE;
        });

        // Cancel previous fade-out if still pending
        if (this._fadeTimeoutId) {
            GLib.source_remove(this._fadeTimeoutId);
            this._fadeTimeoutId = null;
        }

        // Schedule fade-out
        this._fadeTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1500, () => {
            if (this._overlayLabel) {
                this._overlayLabel.ease({
                    opacity: 0,
                    duration: 250,
                    mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                });
            }
            this._fadeTimeoutId = null;
            return GLib.SOURCE_REMOVE;
        });
    }

    enable() {
        const wm = global.workspace_manager;
        this._workspaceSignal = wm.connect("active-workspace-changed", () => this._showOverlay());
    }

    disable() {
        const wm = global.workspace_manager;

        if (this._workspaceSignal) {
            wm.disconnect(this._workspaceSignal);
            this._workspaceSignal = null;
        }

        if (this._fadeTimeoutId) {
            GLib.source_remove(this._fadeTimeoutId);
            this._fadeTimeoutId = null;
        }

        if (this._overlayLabel) {
            this._overlayLabel.destroy();
            this._overlayLabel = null;
        }
    }
}
