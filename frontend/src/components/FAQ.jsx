import Reveal from "./Reveal";
import { FAQS } from "../data/faq";

export default function FAQ() {
  return (
    <section id="faq" className="py-32">
      <div className="border-b py-6 last:border-0 hover:bg-slate-100 rounded-xl transition-all duration-500"
>
        <Reveal>
          <h2 className="text-5xl font-black text-center mb-12">
            Engineering Support
          </h2>
        </Reveal>

        <div className="bg-slate-50 rounded-3xl p-10">
          {FAQS.map((f) => (
            <div key={f.q} className="border-b py-6 last:border-0">
              <h4 className="font-black">{f.q}</h4>
              <p className="text-slate-500">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
