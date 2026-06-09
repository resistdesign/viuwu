import { mockGuide } from '@viuwu/core';

import './style.css';

const guide = document.querySelector<HTMLDivElement>('#mini-guide');

if (guide) {
  guide.innerHTML = mockGuide.rows
    .slice(0, 3)
    .map(
      (row, rowIndex) => `
        <div class="mini-row">
          <div class="mini-channel" style="--row-accent: ${row.channel.accent}">
            <span>${row.channel.callSign}</span>
            <strong>${row.search.name}</strong>
          </div>
          ${row.videos
            .slice(0, 3)
            .map(
              (video, videoIndex) => `
                <div
                  class="mini-card motif-${video.artwork.motif} ${rowIndex === 0 && videoIndex === 0 ? 'is-focused' : ''}"
                  style="--art: ${video.artwork.background}"
                >
                  <div class="mini-art"></div>
                  <div>
                    <strong>${video.title}</strong>
                    <span>${video.duration}</span>
                  </div>
                </div>
              `,
            )
            .join('')}
        </div>
      `,
    )
    .join('');
}
