"use strict";

/*
 * Paste the full Spotify playlist share link between the quotation marks.
 * Example: https://open.spotify.com/playlist/PLAYLIST_ID
 */
const SPOTIFY_PLAYLIST_URL = "";

function getSpotifyPlaylistId(value) {
  const input = value.trim();

  if (!input) {
    return "";
  }

  const uriMatch = input.match(/^spotify:playlist:([a-zA-Z0-9]+)$/);
  if (uriMatch) {
    return uriMatch[1];
  }

  try {
    const url = new URL(input);
    const pathMatch = url.pathname.match(/\/(?:embed\/)?playlist\/([a-zA-Z0-9]+)/);
    return pathMatch ? pathMatch[1] : "";
  } catch {
    return "";
  }
}

function addSpotifyPlaylist(playlistUrl) {
  const playlistId = getSpotifyPlaylistId(playlistUrl);
  const slot = document.querySelector("#spotify-slot");

  if (!playlistId || !slot) {
    return;
  }

  const player = document.createElement("iframe");
  player.className = "spotify-embed";
  player.title = "Zerginox Spotify playlist";
  player.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
  player.loading = "lazy";
  player.allow =
    "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  player.setAttribute("allowfullscreen", "");

  slot.replaceWith(player);
}

document.addEventListener("DOMContentLoaded", () => {
  addSpotifyPlaylist(SPOTIFY_PLAYLIST_URL);

  const heroVideo = document.querySelector(".video-wrap video");
  if (heroVideo) {
    heroVideo.play().catch(() => {
      /* Muted autoplay is widely supported; the poster remains if it is blocked. */
    });
  }
});
