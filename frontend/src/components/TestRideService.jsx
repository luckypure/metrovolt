import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ShieldCheck, Clock, Zap } from "lucide-react";

export default function TestRideService() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-white py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">Book a Test Ride</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Experience MetroVolt in person. Choose your model, pick a time, and we’ll guide you
            through every feature.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-white rounded-2xl shadow border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-indigo-600" />
              <h3 className="text-xl font-black">Flexible Scheduling</h3>
            </div>
            <p className="text-slate-600">
              Book any day of the week with convenient time slots that work for you.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-indigo-600" />
              <h3 className="text-xl font-black">Nearby Locations</h3>
            </div>
            <p className="text-slate-600">
              We’ll recommend the closest partner spot for your ride so you can get going quickly.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-indigo-600" />
              <h3 className="text-xl font-black">Guided Experience</h3>
            </div>
            <p className="text-slate-600">
              A product specialist will walk you through safety, performance, and smart features.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-indigo-600" />
              <h3 className="text-xl font-black">Fast Confirmation</h3>
            </div>
            <p className="text-slate-600">
              Instant booking with email confirmation. No long forms or waiting.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            className="px-8 py-4 text-lg inline-flex items-center gap-2"
            onClick={() => {
              // Send user to models so they can pick and book from a scooter card
              navigate("/#models");
            }}
          >
            <Zap size={18} />
            Choose a model & book
          </Button>
        </div>
      </div>
    </section>
  );
}