"""
Live Poweramp Music Sync Service (backend/music_service.py)
- Receives inbound playback state webhooks from MacroDroid on Android.
- Tracks live playback status (Currently Playing vs. Last Played).
- Synchronizes in-memory state with the disk cache for multi-process safety.
- Exposes GET /api/music/status for live verification in a browser.
"""

import json
import logging
import os
import tempfile
from datetime import datetime, timezone
from typing import Optional, Union

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

logger = logging.getLogger("uvicorn")

MUSIC_SYNC_TOKEN = os.getenv("MUSIC_SYNC_TOKEN")
MUSIC_CACHE_FILE = os.path.join(tempfile.gettempdir(), "poweramp_live_music.json")

music_router = APIRouter(prefix="/api/music", tags=["Music Sync"])

LIVE_MUSIC_STATE = {
    "title": "Unknown Track",
    "artist": "Unknown Artist",
    "album": "",
    "is_playing": False,
}

_last_cache_mtime = 0.0


def sync_state_from_disk():
    """Hot-reloads state from disk if updated by another worker or process."""
    global _last_cache_mtime
    if not os.path.exists(MUSIC_CACHE_FILE):
        return
    try:
        mtime = os.path.getmtime(MUSIC_CACHE_FILE)
        if mtime > _last_cache_mtime:
            with open(MUSIC_CACHE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                LIVE_MUSIC_STATE.update(data)
                _last_cache_mtime = mtime
    except Exception as e:
        logger.warning(f"Failed to sync music cache from disk: {e}")


# Pre-load existing cache on boot
sync_state_from_disk()


class MusicUpdateRequest(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    paused: Optional[Union[bool, str, int]] = None
    state: Optional[Union[int, str]] = None
    track: Optional[str] = None


def clean_album_name(album_val: Optional[str]) -> str:
    if not album_val:
        return ""
    cleaned = album_val.strip()
    if cleaned.lower() in ("unknown album", "unknown", "none", "null", ""):
        return ""
    return cleaned


def get_live_music_context() -> str:
    sync_state_from_disk()

    title = LIVE_MUSIC_STATE.get("title", "Unknown Track")
    artist = LIVE_MUSIC_STATE.get("artist", "Unknown Artist")

    if title == "Unknown Track" and not LIVE_MUSIC_STATE.get("updated_at"):
        return "Status: No recent playback data recorded yet."

    album = clean_album_name(LIVE_MUSIC_STATE.get("album", ""))
    album_str = f" from the album '{album}'" if album else ""
    is_playing = LIVE_MUSIC_STATE.get("is_playing", False)

    if is_playing:
        return f"Currently Playing on Poweramp: '{title}' by {artist}{album_str}."
    else:
        return f"Not Playing right now. Last Played on Poweramp: '{title}' by {artist}{album_str}."


@music_router.get("/status")
def get_music_status():
    """Public inspector to verify live MacroDroid sync in a browser."""
    sync_state_from_disk()
    return {
        "status": "online",
        "live_state": LIVE_MUSIC_STATE,
        "formatted_prompt_context": get_live_music_context(),
    }


@music_router.post("/update")
async def update_music(
    data: MusicUpdateRequest,
    authorization: Optional[str] = Header(None),
):
    if not MUSIC_SYNC_TOKEN:
        logger.error("MUSIC_SYNC_TOKEN is not configured in server environment!")
        raise HTTPException(
            status_code=500, detail="Server security configuration missing"
        )

    token = authorization.replace("Bearer ", "").strip() if authorization else ""
    if token != MUSIC_SYNC_TOKEN:
        logger.warning("Unauthorized attempt to update music status.")
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid sync token")

    sync_state_from_disk()

    is_playing = False
    if data.state is not None:
        try:
            s = int(data.state)
            is_playing = s in (0, 1)
        except (ValueError, TypeError):
            is_playing = False
    elif data.paused is not None:
        if isinstance(data.paused, bool):
            is_playing = not data.paused
        elif isinstance(data.paused, str):
            is_playing = data.paused.strip().lower() in ("false", "0")
        elif isinstance(data.paused, int):
            is_playing = data.paused == 0

    title = data.title.strip() if data.title else ""
    artist = data.artist.strip() if data.artist else ""
    album = clean_album_name(data.album)

    if (not title or title == "Unknown Track") and data.track:
        title = data.track.strip()

    # Retain existing track details if pause webhook sends empty strings
    if not title or title == "Unknown Track":
        title = LIVE_MUSIC_STATE.get("title", "Unknown Track")
        artist = LIVE_MUSIC_STATE.get("artist", artist or "Unknown Artist")
        album = clean_album_name(LIVE_MUSIC_STATE.get("album", album))

    payload = {
        "title": title or "Unknown Track",
        "artist": artist or "Unknown Artist",
        "album": album,
        "is_playing": is_playing,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    LIVE_MUSIC_STATE.update(payload)

    # Atomic write to OS temp directory
    try:
        temp_file = f"{MUSIC_CACHE_FILE}.tmp.{os.getpid()}"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
        os.replace(temp_file, MUSIC_CACHE_FILE)
        global _last_cache_mtime
        _last_cache_mtime = os.path.getmtime(MUSIC_CACHE_FILE)
    except Exception as e:
        logger.warning(f"Could not persist temp music state: {e}")

    logger.info(
        f"🎵 Music Synced: '{payload['title']}' by {payload['artist']}{f' [{album}]' if album else ''} (Playing: {is_playing})"
    )
    return {"status": "success", "music": payload}
