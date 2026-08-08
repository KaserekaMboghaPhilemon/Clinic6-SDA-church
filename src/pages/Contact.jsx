import React from "react";
import { Link } from "react-router-dom";
import { useT } from "../i18n.jsx";
import MapJourney from "../components/MapJourney.jsx";

export default function Contact() {
  const { t } = useT();

  return (
    <section className="bg-[#F7F4EF] px-6 py-12 text-[#2D3142] sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-[#D4AF37]/45 bg-gradient-to-br from-[#0F2942] via-[#173A5D] to-[#0F2942] p-7 text-white shadow-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {t("contact.eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            {t("contact.title")}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-[#0F2942]/15 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/70">
              {t("contact.channels.title")}
            </p>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-semibold text-[#0F2942]">
                  {t("contact.channels.emailLabel")}
                </p>
                <a
                  href="mailto:clinic6.sda.kakuma@gmail.com"
                  className="text-[#173A5D] hover:text-[#D4AF37] transition-colors"
                >
                  clinic6.sda.kakuma@gmail.com
                </a>
              </div>
              <div>
                <p className="font-semibold text-[#0F2942]">
                  {t("contact.channels.paybillLabel")}
                </p>
                <p className="font-mono text-base">247247</p>
              </div>
              <div>
                <p className="font-semibold text-[#0F2942]">
                  {t("contact.channels.accountLabel")}
                </p>
                <p className="font-mono text-base">105225</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:clinic6.sda.kakuma@gmail.com"
                className="inline-flex items-center rounded-sm bg-[#0F2942] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#173A5D]"
              >
                {t("contact.channels.emailCta")}
              </a>
              <Link
                to="/give"
                className="inline-flex items-center rounded-sm bg-[#D4AF37] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0F2942] transition hover:bg-yellow-400"
              >
                {t("contact.channels.giveCta")}
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-[#0F2942]/15 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/70">
              {t("contact.location.title")}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#2D3142]/90">
              {t("contact.location.body")}
            </p>

            <ol className="mt-6 space-y-3 text-sm text-[#2D3142]/90">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                <div>
                  <p className="font-semibold text-[#0F2942]">
                    SDA Lokichogio District
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/60">
                    {t("footer.tier.localLabel")}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/60">
                    {t("footer.tier.stationLabel")}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                <div>
                  <p className="font-semibold text-[#0F2942]">
                    Rift Valley Field
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/60">
                    {t("footer.tier.fieldLabel")}
                  </p>
                </div>
              </li>
            </ol>
          </article>
        </div>
        <div className="mt-8">
          <MapJourney />
        </div>
      </div>
    </section>
  );
}
