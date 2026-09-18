export const EVENT = {
  title: 'BELIHULOYA XVI',
  subtitle: 'SABRA ELLE CHAMPIONSHIP',
  fullTitle: 'BELIHULOYA XVI SABRA ELLE CHAMPIONSHIP',
  motto: ['PLAY', 'UNITE', 'RISE'],
  venue: 'Sabaragamuwa University of Sri Lanka',
  city: 'Belihuloya, Sri Lanka',
  /** Light-lettering version for dark backgrounds (original: belihuloya-xvi-logo.png). */
  logo: '/tournament/belihuloya-xvi-logo-light.png',
  breakImage: '/breakimage/break.png',
  intervalMusic: encodeURI('/music loop/Driving.wav'),
  /** Sponsor logo paths (e.g. '/sponsors/acme.png') shown in the NORMAL LIVE footer. Empty = no sponsor strip. */
  sponsors: [] as string[],
};

export type MediaKind = 'animation' | 'image' | 'video';

export interface MediaItem {
  id: string;
  title: string;
  subtitle: string;
  kind: MediaKind;
  /**
   * Upload an MP4 with this exact file name (Upload Media) and it replaces the
   * built-in animated screen automatically.
   */
  videoFile?: string;
}

/** Built-in interval screens. All of them loop until the status leaves INTERVAL. */
export const BUILT_IN_MEDIA: MediaItem[] = [
  {
    id: 'belihuloya-logo',
    title: 'Belihuloya XVI Logo Animation',
    subtitle: 'Light sweep · logo reveal · colour streak',
    kind: 'animation',
    videoFile: 'belihuloya-logo.mp4',
  },
  {
    id: 'susl-logo',
    title: 'SUSL Logo Animation',
    subtitle: 'Host university · Sabaragamuwa',
    kind: 'animation',
    videoFile: 'susl-logo.mp4',
  },
  {
    id: 'back-soon',
    title: "We'll Be Back Soon",
    subtitle: 'Interval break screen',
    kind: 'image',
  },
  {
    id: 'teams-logo',
    title: 'University Logo Animation',
    subtitle: 'Current match universities',
    kind: 'animation',
  },
  {
    id: 'next-match',
    title: 'Next Match',
    subtitle: 'Coming up next',
    kind: 'animation',
  },
  {
    id: 'sponsors',
    title: 'Sponsors',
    subtitle: 'Upload sponsors.mp4',
    kind: 'animation',
    videoFile: 'sponsors.mp4',
  },
  {
    id: 'thank-you',
    title: 'Thank You',
    subtitle: 'Closing screen',
    kind: 'animation',
  },
];

export const DEFAULT_INTERVAL_ID = 'belihuloya-logo';
