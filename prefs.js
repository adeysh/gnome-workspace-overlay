import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import Gio from "gi://Gio";

export default class WorkspaceOverlayPreferences {
    fillPreferencesWindow(window) {
        const settings = new Gio.Settings({
            schema_id: "org.gnome.shell.extensions.workspace-overlay",
        });

        let names = settings.get_strv("workspace-names");

        // Guarantee at least 10 editable slots (safe default)
        const MAX_SLOTS = 10;
        if (names.length < MAX_SLOTS) {
            const extended = names.slice();
            while (extended.length < MAX_SLOTS) extended.push("");
            settings.set_strv("workspace-names", extended);
            names = extended;
        }

        const group = new Adw.PreferencesGroup({
            title: "Workspace Names",
            description: "Set custom names for your workspaces",
        });

        for (let i = 0; i < MAX_SLOTS; i++) {
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
