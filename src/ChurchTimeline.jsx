import React from "react";
import firstStormVideo from "./assets/first-storm.mp4";
import secondStormImage from "./assets/2nd-storm-wornout-building.png";

const ChurchTimeline = () => {
  return (
    <section className="bg-slate-50 text-slate-800 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Rebuilding Faith Amidst the Storms: Our Journey of Resilience
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-200">
              <video
                className="w-full h-full object-cover"
                controls
                onError={(e) => {
                  e.currentTarget.src = firstStormVideo;
                  e.currentTarget.load();
                }}
              >
                <source src="VID-20260227-WA0016_2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <h3 className="text-xl font-semibold mb-3">The Strength to Begin Again</h3>
            <p className="leading-relaxed">
              When the first severe windstorm swept through our community, the impact was sudden and
              severe. As captured in the documentary footage, powerful gusts ripped the corrugated iron
              sheets (mabati) cleanly from the framework, scattering them across the muddy compound.
              The damage was not isolated to our church alone-the heavy rain and winds affected our
              entire neighborhood. Yet, in the immediate aftermath, our community did not hesitate.
              Hand tools in hand, members immediately began straightening the metal sheets and
              securing what could be saved. This initial phase was defined by quick mending, hope,
              and an unyielding spirit of solidarity.
            </p>
          </article>

          <article className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-200">
              <img
                src="Gemini_Generated_Image_v53ni9v53ni9v53n.png"
                alt="Second storm structural damage"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = secondStormImage;
                }}
              />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              A Cumulative Crisis: Age, Wear, and the Second Storm
            </h3>
            <p className="leading-relaxed">
              True structural resilience, however, requires more than temporary patches. Over time,
              constant exposure to the semi-arid climate, heavy seasonal rains, and internal insect
              degradation silently weakened the building's core timber frame. When the second storm
              struck, it encountered a structure already deeply worn out. Unlike the first event where
              sheets simply detached, this storm forced a severe structural failure. The main framework
              splayed, and the roof system was completely exposed. This perspective reveals a sobering
              reality: the aged timber can no longer support simple repairs. To ensure a safe, permanent
              sanctuary for our community, we must now move past temporary mending toward a complete,
              durable structural reconstruction.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ChurchTimeline;
