import React, { useEffect, useRef } from "react";

// MapJourney.jsx
// Shows an embedded OpenStreetMap focused on Kakuma and a video player
// Usage: copy the video file `Journey to Kakuma Refugee Camp-render-1.mp4`
// into `public/videos/` so it is served at
// `/videos/Journey to Kakuma Refugee Camp-render-1.mp4`.

export default function MapJourney() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {
            video.muted = true;
          });
        } else {
          video.pause();
        }
      },
      {
        root: null,
        threshold: 0.5,
      },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold mb-4">Journey to Kakuma</h2>

        <div className="space-y-6">
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              title="Kakuma Refugee Camp map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=34.77%2C3.78%2C35.00%2C3.92&layer=mapnik&marker=3.86%2C34.89"
              loading="lazy"
              className="w-full h-[420px]"
              style={{ border: 0 }}
            />
            <div className="bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold">Kakuma Refugee Camp</p>
              <p className="mt-1">
                Click the map to open the location in OpenStreetMap.
              </p>
              <a
                href="https://www.openstreetmap.org/?mlat=3.86&mlon=34.89#map=12/3.8600/34.8900"
                target="_blank"
                rel="noreferrer"
                className="text-[#0F2942] hover:text-[#D4AF37] font-semibold"
              >
                View on OpenStreetMap
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="bg-[#071827] px-6 py-5">
              <h3 className="text-lg font-semibold text-white">
                Journey video
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                The video will autoplay when it becomes visible and fill the
                full width of its container.
              </p>
            </div>
            <div className="bg-black">
              <video
                ref={videoRef}
                controls
                muted
                playsInline
                loop
                preload="metadata"
                className="w-full h-full min-h-[320px] bg-black"
                src="/videos/Journey to Kakuma Refugee Camp-render-1.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Place the file at{" "}
              <code>
                public/videos/Journey to Kakuma Refugee Camp-render-1.mp4
              </code>
              .
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
