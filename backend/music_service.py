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

# Store in the OS Temp folder (OUTSIDE the project directory)
MUSIC_CACHE_FILE = os.path.join(tempfile.gettempdir(), "poweramp_live_music.json")

music_router = APIRouter(prefix="/api/music", tags=["Music Sync"])

# Fast In-Memory State Cache
LIVE_MUSIC_STATE = {
    "title": "Unknown Track",
    "artist": "Unknown Artist",
    "album": "",
    "is_playing": False,
}

# Pre-load existing cache on server startup if available
if os.path.exists(MUSIC_CACHE_FILE):
    try:
        with open(MUSIC_CACHE_FILE, "r", encoding="utf-8") as f:
            LIVE_MUSIC_STATE.update(json.load(f))
    except Exception:
        pass


class MusicUpdateRequest(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    paused: Optional[Union[bool, str, int]] = None
    state: Optional[Union[int, str]] = None
    track: Optional[str] = None


def clean_album_name(album_val: Optional[str]) -> str:
    """Removes dummy/fallback album names like 'Unknown Album'."""
    if not album_val:
        return ""
    cleaned = album_val.strip()
    if cleaned.lower() in ("unknown album", "unknown", "none", "null", ""):
        return ""
    return cleaned


def get_live_music_context() -> str:
    """Reads the live music state directly from memory (instantaneous, zero disk lag)."""
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

    logger.info(
        f"📥 MacroDroid Inbound: title='{data.title}', artist='{data.artist}', album='{data.album}', state='{data.state}'"
    )

    # 1. Playback State: 0/1 = Playing, 2/3 = Paused/Stopped
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

    # Fallback to 'track' if title was empty
    if (not title or title == "Unknown Track") and data.track:
        title = data.track.strip()

    # 2. Retain previously known track if a pause event arrives with empty metadata
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

    # Update in-memory state instantly
    LIVE_MUSIC_STATE.update(payload)

    # Persist to OS Temp directory (silent write, no reloads)
    try:
        with open(MUSIC_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
    except Exception as e:
        logger.warning(f"Could not persist temp music state: {e}")

    logger.info(
        f"🎵 Music Synced: '{payload['title']}' by {payload['artist']}{f' [{album}]' if album else ''} (Playing: {is_playing})"
    )
    return {"status": "success", "music": payload}
