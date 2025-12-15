# Workspace Overlay (GNOME Extension)

A lightweight GNOME Shell extension that displays a macOS-style overlay showing the current workspace name/number when switching workspaces.

Designed for **GNOME 45/46** (Ubuntu 24.04+), using the **new ES module extension API**.

---

## Features

-   Shows **workspace name/number** as an on-screen overlay
-   Smooth fade-in / fade-out animation
-   Modern **GNOME ESM-based** extension
-   **Zero** dependencies
-   Completely native look and feel
-   Works on **Wayland** and **X11**

### ✨ New in v1.1.1 ✨

-   **Unlimited workspace renaming** via preferences
-   Add or remove workspace names dynamically
-   Custom names persist using **GSettings**
-   Overlay automatically falls back to `Workspace N` when no custom name is set
-   Improved, GNOME-style preferences UI

---

## ⚙️ Preferences

You can rename workspaces from the extension’s preferences window.
Changes apply instantly — no restart required.

### Open Preferences

-   Open the **Extensions** app → find **Workspace Overlay** → click **Settings**
-   Or run in terminal:
    ```bash
    gnome-extensions prefs workspace-overlay@adesh
    ```

---

## Preview

A small label appears at the top-center of the screen for ~1.5 seconds whenever you switch workspaces similar to **macOS Mission Control’s desktop name overlay**.

---

## Installation (Manual)

1. Clone the repo:

    ```bash
    git clone <this-repo-url>
    cd gnome-workspace-overlay
    ```

2. Create the extension directory:

    ```bash
    mkdir -p ~/.local/share/gnome-shell/extensions/workspace-overlay@adesh
    ```

3. Copy the files:

    ```bash
    cp -r * ~/.local/share/gnome-shell/extensions/workspace-overlay@adesh/
    ```

4. Enable the extension:

    ```bash
    gnome-extensions enable workspace-overlay@adesh
    ```

Log out & log back in (Wayland)
or press Alt + F2, type r, and press Enter (X11).

---

## GNOME Compatibility

| GNOME Version | Status                             |
| ------------- | ---------------------------------- |
| 46.x          | Working                            |
| 45.x          | Working                            |
| 44 and below  | ❌ Not supported (uses legacy API) |

---

## Roadmap / Future Features

-   Preferences window (position, duration, font size, opacity)
-   Bottom-center overlay option
-   Animated scale-in effect
-   Workspace name editing
-   Blurred background (macOS-style)
-   Packaging for [extensions.gnome.org](https://extensions.gnome.org/)

---

## License

MIT License.
