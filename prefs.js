import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import Gio from "gi://Gio";

export default function init() {}

export function fillPreferencesWindow(window) {
    const settings = new Gio.Settings({
        schema_id: "org.gnome.shell.extensions.workspace-overlay",
    });

    const group = new Adw.PreferencesGroup({
        title: "Workspace Names",
        description: "Set custom names for your workspaces",
    });

    const wm = global.workspace_manager;
    const count = wm.get_n_workspaces();

    let names = settings.get_strv("workspace-names");

    // Ensure array length
    if (names.length < count) {
        const extended = names.slice();
        while (extended.length < count) extended.push("");
        settings.set_strv("workspace-names", extended);
        names = extended;
    }

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
