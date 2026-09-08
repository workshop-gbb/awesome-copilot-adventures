# Extra line icons for flows and diagrams.
# Same system as ICON_SPRITE: 24x24, stroke: currentColor, no fill, round caps.
# Use with ico("name"). Names are namespaced i-<name>.

EXTRA_ICONS = {
    # --- people and teams ---
    "people": '<path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19"/><circle cx="10" cy="8" r="3.2"/><path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4"/><path d="M15.5 5.2a3.2 3.2 0 0 1 0 5.6"/>',
    "person-check": '<path d="M13 19v-1.5A3.5 3.5 0 0 0 9.5 14h-4A3.5 3.5 0 0 0 2 17.5V19"/><circle cx="7.5" cy="8" r="3.2"/><path d="M15 12.5l2.2 2.2L22 10"/>',
    "handoff": '<path d="M3 9h9a3 3 0 0 1 3 3v0a3 3 0 0 0 3 3h4"/><path d="M18 12l4 3-4 3"/><circle cx="4.5" cy="9" r="1.6"/>',
    "review": '<path d="M4 5h11a2 2 0 0 1 2 2v6"/><path d="M4 5v12a2 2 0 0 0 2 2h6"/><circle cx="17.5" cy="17.5" r="3.5"/><path d="M20.2 20.2 22.5 22.5"/>',
    "brain": '<path d="M9.5 4.5A2.5 2.5 0 0 0 7 7v.4A2.6 2.6 0 0 0 5 10a2.6 2.6 0 0 0 1 2 2.6 2.6 0 0 0-1 2 2.6 2.6 0 0 0 2.5 2.6V17a2.5 2.5 0 0 0 4.5 1.5V6a2.5 2.5 0 0 0-2.5-1.5Z"/><path d="M14.5 4.5A2.5 2.5 0 0 1 17 7v.4A2.6 2.6 0 0 1 19 10a2.6 2.6 0 0 1-1 2 2.6 2.6 0 0 1 1 2 2.6 2.6 0 0 1-2.5 2.6V17a2.5 2.5 0 0 1-4.5 1.5"/>',

    # --- data and storage ---
    "database": '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
    "table": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M9 9.5V20M3 15h18"/>',
    "queue": '<rect x="2.5" y="8" width="5" height="8" rx="1.4"/><rect x="9.5" y="8" width="5" height="8" rx="1.4"/><rect x="16.5" y="8" width="5" height="8" rx="1.4"/><path d="M12 4.5V6M19 4.5V6"/>',
    "warehouse": '<path d="M3 10.5 12 5l9 5.5V20H3z"/><path d="M8 20v-6h8v6"/><path d="M8 17h8"/>',
    "pipeline": '<path d="M3 8h5a3 3 0 0 1 3 3v2a3 3 0 0 0 3 3h5"/><circle cx="3" cy="8" r="1.6"/><circle cx="21" cy="16" r="1.6"/><path d="M11 8h3"/>',

    # --- machines and places ---
    "workstation": '<rect x="3" y="4" width="18" height="11" rx="2"/><path d="M8 19h8M12 15v4"/><path d="M7 8.5h4M7 11h6"/>',
    "laptop": '<rect x="4" y="5" width="16" height="10" rx="1.6"/><path d="M2.5 18.5h19"/>',
    "server": '<rect x="3" y="4" width="18" height="6.5" rx="1.6"/><rect x="3" y="13.5" width="18" height="6.5" rx="1.6"/><path d="M6.5 7.2h.01M6.5 16.8h.01"/>',
    "cloud": '<path d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.4 9.2 3.9 3.9 0 0 1 17 18z"/>',
    "network": '<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><path d="M12 7.4v4.2M12 11.6 6.4 17M12 11.6 17.6 17"/>',
    "globe": '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5a13 13 0 0 1 0 17 13 13 0 0 1 0-17z"/>',
    "sandbox": '<rect x="3.5" y="6" width="17" height="14" rx="2" stroke-dasharray="3 2.5"/><path d="M8 6V4.5h8V6"/><path d="M9.5 13.5 12 16l4-4.5"/>',

    # --- signals and money ---
    "chart": '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M7.5 15.5l3.5-4 3 2.5 4.5-6"/>',
    "trend-down": '<path d="M3.5 6.5 10 13l3.5-3 7 7"/><path d="M20.5 12v5h-5"/>',
    "coins": '<ellipse cx="9" cy="7" rx="5.5" ry="2.6"/><path d="M3.5 7v4c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6V7"/><ellipse cx="15" cy="16" rx="5.5" ry="2.6"/><path d="M9.5 16v1.5c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6V16"/>',
    "meter": '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17 16 11"/><circle cx="12" cy="17" r="1.3"/>',
    "alert": '<path d="M12 4.5 21 19.5H3z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
    "stopwatch": '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.2 1.6"/><path d="M9.5 3.5h5M12 3.5v3"/>',

    # --- development ---
    "code": '<path d="M8.5 8 4 12l4.5 4"/><path d="M15.5 8 20 12l-4.5 4"/><path d="M13.5 5.5 10.5 18.5"/>',
    "commit": '<circle cx="12" cy="12" r="3.2"/><path d="M3 12h5.8M15.2 12H21"/>',
    "pr": '<circle cx="6.5" cy="6" r="2.3"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="17.5" cy="18" r="2.3"/><path d="M6.5 8.3v7.4"/><path d="M17.5 15.7V9.5a3 3 0 0 0-3-3h-2.6"/><path d="M14 4.2 11.6 6.5 14 8.8"/>',
    "test": '<path d="M9.5 3.5v6L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3l-4.7-8.5v-6"/><path d="M8 3.5h8"/><path d="M7.4 14.5h9.2"/>',
    "docs": '<path d="M5 4.5h9l5 5V21H5z"/><path d="M14 4.5v5h5"/><path d="M8.5 13h7M8.5 16.5h5"/>',
    "key": '<circle cx="8" cy="14" r="4"/><path d="M11 11.5 20 4"/><path d="M17.5 6.5 19.5 8.5M15.5 8.5 17.5 10.5"/>',
    "sparkle": '<path d="M12 3.5 13.8 9 19.5 10.8 13.8 12.6 12 18.2 10.2 12.6 4.5 10.8 10.2 9z"/><path d="M18.5 16.5 19.3 18.7 21.5 19.5 19.3 20.3 18.5 22.5 17.7 20.3 15.5 19.5 17.7 18.7z"/>',
}


def extra_sprite():
    """Symbols to append to ICON_SPRITE, same stroke system."""
    return "".join(
        f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in EXTRA_ICONS.items()
    )
