import React, { useEffect, useRef, useState } from 'react';
import { MatchSnapshot } from '../../types/match';
import { EVENT } from '../../data/event';
import { HOST_UNIVERSITY } from '../../data/universities';
import { SafeImage } from '../common/SafeImage';
import { TeamLogo } from '../common/TeamLogo';
import { BrandBackdrop, VenueLine } from './BrandBackdrop';

const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

/**
 * Logo intro loop: dark navy → light sweep → logo reveal → green/yellow/red
 * streak → title. One cycle is 10 s and repeats forever.
 */
const LogoReveal: React.FC<{ logo: React.ReactNode; title: string; subtitle: string; tagline?: string }> = ({
  logo,
  title,
  subtitle,
  tagline,
}) => (
  <BrandBackdrop>
    <div className="absolute inset-0 flex flex-col items-center justify-center pb-24">
      <div className="anim-logo relative [filter:drop-shadow(0_0_40px_rgba(160,220,255,0.35))]">{logo}</div>

      <div className="anim-streak mt-10 flex h-[8px] w-[900px] origin-center overflow-hidden rounded-full">
        <div className="flex-1 bg-[#17C978]" />
        <div className="flex-1 bg-[#FFD229]" />
        <div className="flex-1 bg-[#E32636]" />
      </div>

      <div className="anim-title mt-10 text-center">
        <div className="text-[74px] font-black leading-none">{title}</div>
        <div className="mt-4 text-[34px] font-semibold text-[#C8D2E1]">{subtitle}</div>
        {tagline && <div className="mt-8 font-score text-[42px] font-bold italic tracking-[0.3em] text-[#00D9F5]">{tagline}</div>}
      </div>
    </div>

    {/* Light sweep across the whole frame */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="anim-sweep absolute -top-1/4 h-[150%] w-[360px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  </BrandBackdrop>
);

const BackSoon: React.FC = () => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageFailed) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#041126]">
        <img
          src={EVENT.breakImage}
          alt=""
          onError={() => setImageFailed(true)}
          className="anim-kenburns h-full w-full object-cover"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="anim-sweep absolute -top-1/4 h-[150%] w-[300px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <BrandBackdrop>
      <div className="absolute inset-0 flex flex-col items-center justify-center pb-16">
        <SafeImage src={EVENT.logo} alt="" fallbackText="XVI" className="h-[330px] w-[330px] object-contain" />
        <div className="mt-6 bg-gradient-to-b from-white to-[#9fb6d6] bg-clip-text font-score text-[220px] font-extrabold italic leading-none text-transparent">
          INTERVAL
        </div>
        <div className="mt-2 font-score text-[64px] font-bold italic tracking-[0.35em] text-[#8fdcff]">WE&apos;LL BE BACK SOON</div>
        <VenueLine className="mt-10" />
      </div>
    </BrandBackdrop>
  );
};

const TeamsScreen: React.FC<{ state: MatchSnapshot; heading: string; sub: string }> = ({ state, heading, sub }) => (
  <BrandBackdrop>
    <div className="absolute inset-0 flex flex-col items-center justify-center pb-24">
      <div className="anim-title text-center font-score text-[54px] font-bold tracking-[0.3em] text-[#00D9F5]">{heading}</div>
      <div className="mt-12 flex items-center gap-24">
        {(['teamA', 'teamB'] as const).map((side, i) => (
          <React.Fragment key={side}>
            {i === 1 && <div className="anim-logo font-score text-[120px] font-extrabold italic text-[#FFD229]">VS</div>}
            <div className="anim-logo flex w-[520px] flex-col items-center text-center" style={{ animationDelay: `${i * 0.25}s` }}>
              <TeamLogo team={state[side]} size={300} className="shadow-[0_0_80px_rgba(0,217,245,0.35)] ring-8 ring-white/10" />
              <div className="mt-8 font-score text-[96px] font-extrabold leading-none">{state[side].code}</div>
              <div className="mt-3 text-[28px] font-semibold leading-tight text-[#C8D2E1]">{state[side].name}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="mt-12 text-[30px] font-semibold tracking-[0.2em] text-white/80">{sub}</div>
    </div>
  </BrandBackdrop>
);

const BuiltInScreen: React.FC<{ state: MatchSnapshot }> = ({ state }) => {
  switch (state.interval.id) {
    case 'susl-logo':
      return (
        <LogoReveal
          logo={<TeamLogo team={HOST_UNIVERSITY} size={380} className="shadow-[0_0_120px_rgba(255,210,41,0.35)]" />}
          title="SABARAGAMUWA UNIVERSITY"
          subtitle="OF SRI LANKA · HOST UNIVERSITY"
          tagline="BELIHULOYA XVI"
        />
      );
    case 'back-soon':
      return <BackSoon />;
    case 'teams-logo':
      return <TeamsScreen state={state} heading={EVENT.fullTitle} sub={EVENT.venue.toUpperCase()} />;
    case 'next-match':
      return <TeamsScreen state={state} heading="COMING UP NEXT" sub="STAY TUNED · MATCH STARTS SHORTLY" />;
    case 'sponsors':
      return (
        <LogoReveal
          logo={<SafeImage src={EVENT.logo} alt="" fallbackText="XVI" className="h-[380px] w-[380px] object-contain" />}
          title="THANK YOU TO OUR SPONSORS"
          subtitle="Belihuloya XVI Sabra Elle Championship"
        />
      );
    case 'thank-you':
      return (
        <LogoReveal
          logo={<SafeImage src={EVENT.logo} alt="" fallbackText="XVI" className="h-[400px] w-[400px] object-contain" />}
          title="THANK YOU FOR WATCHING"
          subtitle={EVENT.venue}
          tagline="MORE THAN A GAME"
        />
      );
    case 'belihuloya-logo':
    default:
      return (
        <LogoReveal
          logo={<SafeImage src={EVENT.logo} alt="" fallbackText="XVI" className="h-[440px] w-[440px] object-contain" />}
          title={EVENT.title}
          subtitle={EVENT.subtitle}
          tagline="INTERVAL · WE'LL BE BACK SOON"
        />
      );
  }
};

/** Loops an uploaded video. Tries sound first (OBS allows it), falls back to muted autoplay. */
const LoopVideo: React.FC<{ src: string; muted: boolean; onFail: () => void }> = ({ src, muted, onFail }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = muted;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => undefined);
    });
  }, [src, muted]);

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      loop
      autoPlay
      playsInline
      muted={muted}
      onError={onFail}
      className="absolute inset-0 h-full w-full bg-black object-cover"
    />
  );
};

export const IntervalScreen: React.FC<{ state: MatchSnapshot; preview: boolean; onVideoActive?: (active: boolean) => void }> = ({
  state,
  preview,
  onVideoActive,
}) => {
  const url = state.interval.mediaUrl;
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showVideo = !!url && isVideo(url) && failedUrl !== url;
  const showImage = !!url && !isVideo(url) && failedUrl !== url;

  useEffect(() => {
    onVideoActive?.(showVideo);
  }, [showVideo, onVideoActive]);

  if (showVideo) return <LoopVideo src={url} muted={preview} onFail={() => setFailedUrl(url)} />;
  if (showImage) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-black">
        <img src={url} alt="" onError={() => setFailedUrl(url)} className="anim-kenburns h-full w-full object-cover" />
      </div>
    );
  }
  return <BuiltInScreen state={state} />;
};
