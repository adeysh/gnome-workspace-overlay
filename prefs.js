import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import { ExtensionPreferences } from "resource:///org/gnome/shell/extensions/extension.js";

export default class WorkspaceOverlayPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const wm = global.workspace_manager;
        const count = wm.get_n_workspaces();

        // Ensure array has at least one slot per workspace
        let names = settings.get_strv("workspace-names");
        if (names.length < count) {
            const extended = names.slice();
            while (extended.length < count) {
                extended.push("");
            }
            settings.set_strv("workspace-names", extended);
            names = extended;
        }

        const group = new Adw.PreferencesGroup({
            title: "Workspace Names",
            description: "Set custom names for each workspace",
        });

        for (let i = 0; i < count; i++) {
            const row = new Adw.EntryRow({
                title: `Workspace ${i + 1}`,
                text: names[i] || "",
            });

            row.connect("notify::text", () => {
                const updated = settings.get_strv("workspace-names");
                updated[i] = row.text;
                settings.set_strv("workspace-names", updated);
            });

            group.add(row);
        }

        const page = new Adw.PreferencesPage();
        page.add(group);
        window.add(page);
    }
}
