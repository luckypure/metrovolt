import Reveal from "./Reveal";
import { PRODUCTS } from "../data/products";

export default function Comparison() {
  return (
    <section id="comparison" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="text-5xl font-black text-center mb-10">
            The Matrix
          </h2>
        </Reveal>

        <div className="overflow-auto">
          <table className="w-full bg-white border rounded-3xl shadow-2xl shadow-indigo-100"
>
            <thead>
              <tr className="border-t hover:bg-indigo-50 transition-colors duration-500">
                <th className="p-6 text-left">Attribute</th>
                {PRODUCTS.map((p) => (
                  <th key={p.id} className="p-6 text-left">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Object.keys(PRODUCTS[0].specs).map((k) => (
                <tr key={k} className="border-t">
                  <td className="p-6 font-black">{k}</td>
                  {PRODUCTS.map((p) => (
                    <td key={p.id} className="p-6">
                      {p.specs[k]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
