import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import Gio from "gi://Gio";

export default class WorkspaceOverlayPreferences {
    fillPreferencesWindow(window) {
        const settings = new Gio.Settings({
            schema_id: "org.gnome.shell.extensions.workspace-overlay",
        });

        let names = settings.get_strv("workspace-names");

        const page = new Adw.PreferencesPage();
        window.add(page);

        let group = null;

        const rebuildGroup = () => {
            // Remove old group if it exists
            if (group) {
                page.remove(group);
            }

            group = new Adw.PreferencesGroup({
                title: "Workspace Names",
                description: "Set custom names for your workspaces",
            });

            // Existing workspace name rows
            names.forEach((value, index) => {
                const row = new Adw.EntryRow({
                    title: `Workspace ${index + 1}`,
                    text: value,
                });

                row.connect("notify::text", () => {
                    names[index] = row.text;
                    settings.set_strv("workspace-names", names);
                });

                // Remove button
                const removeButton = new Gtk.Button({
                    icon_name: "user-trash-symbolic",
                    valign: Gtk.Align.CENTER,
                    css_classes: ["destructive-action"],
                    tooltip_text: "Remove this workspace name",
                });

                removeButton.connect("clicked", () => {
                    // Remove the *current* index safely
                    names.splice(index, 1);
                    settings.set_strv("workspace-names", names);
                    rebuildGroup();
                });

                row.add_suffix(removeButton);
                row.activatable_widget = removeButton;

                group.add(row);
            });

            // Add new workspace name action
            const addRow = new Adw.ActionRow({
                title: "Add workspace name",
            });

            const addButton = new Gtk.Button({
                label: "Add",
                valign: Gtk.Align.CENTER,
            });

            addButton.connect("clicked", () => {
                names.push("");
                settings.set_strv("workspace-names", names);
                rebuildGroup();
            });

            addRow.add_suffix(addButton);
            addRow.activatable_widget = addButton;

            group.add(addRow);

            page.add(group);
        };

        rebuildGroup();
    }
}
