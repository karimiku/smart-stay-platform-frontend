"use client";

import { Key, Lightbulb, Thermometer, Lock, Unlock, Calendar, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

export function OwnerDashboard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [temperature, setTemperature] = useState(22);

  return (
    <div className="min-h-screen md:pl-20 pb-16 md:pb-0">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-white uppercase tracking-[0.3em] mb-2 text-xl sm:text-2xl md:text-3xl">Owner Portal</h1>
            <p className="text-muted-foreground tracking-wide text-sm sm:text-base">Villa Serenity · Bali, Indonesia</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 border border-white/20 text-sm sm:text-base">
            <Calendar className="w-5 h-5 text-white" />
            <span className="text-white tracking-wide">Check-in Available</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Digital Key Section */}
          <div className="mb-12">
            <h2 className="text-white uppercase tracking-[0.2em] mb-4 sm:mb-6 text-lg sm:text-xl md:text-2xl">Digital Access</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Main Digital Key */}
              <div className="col-span-1 lg:col-span-2 border border-border p-6 sm:p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-white uppercase tracking-[0.25em] mb-2">
                        Room 505 · Master Suite
                      </h3>
                      <p className="text-muted-foreground tracking-wide">November 28 - December 5, 2025</p>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 uppercase tracking-wider">
                      Active
                    </div>
                  </div>

                  {/* Key Visual */}
                  <div className="flex items-center justify-center py-6 sm:py-8 md:py-12 mb-6 sm:mb-8">
                    <button
                      onClick={() => setIsUnlocked(!isUnlocked)}
                      className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-4 flex items-center justify-center transition-all duration-500 ${
                        isUnlocked
                          ? "border-green-500 bg-green-500/10 rotate-0"
                          : "border-white/40 bg-white/5 rotate-180"
                      }`}
                    >
                      {isUnlocked ? (
                        <Unlock className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-green-500" />
                      ) : (
                        <Lock className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setIsUnlocked(!isUnlocked)}
                    className={`w-full py-5 transition-all uppercase tracking-[0.3em] ${
                      isUnlocked
                        ? "bg-green-500 hover:bg-green-600 text-black"
                        : "bg-white hover:bg-white/90 text-black"
                    }`}
                  >
                    {isUnlocked ? "Lock Door" : "Unlock Door"}
                  </button>
                </div>
              </div>

              {/* Additional Access Points */}
              <div className="border border-border p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-white" />
                  <h4 className="text-white uppercase tracking-wider">Main Entrance</h4>
                </div>
                <p className="text-muted-foreground tracking-wide mb-4">Ground Floor</p>
                <button className="w-full py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
                  Unlock
                </button>
              </div>

              <div className="border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-white" />
                  <h4 className="text-white uppercase tracking-wider">Pool Area</h4>
                </div>
                <p className="text-muted-foreground tracking-wide mb-4">West Wing</p>
                <button className="w-full py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
                  Unlock
                </button>
              </div>
            </div>
          </div>

          {/* Smart Home Controls */}
          <div>
            <h2 className="text-white uppercase tracking-[0.2em] mb-4 sm:mb-6 text-lg sm:text-xl md:text-2xl">Smart Controls</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Lighting Control */}
              <div className="border border-border p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className={`w-6 h-6 ${lightsOn ? "text-yellow-400" : "text-white"}`} />
                  <h3 className="text-white uppercase tracking-wider">Lighting</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground tracking-wide">Master Bedroom</span>
                    <button
                      onClick={() => setLightsOn(!lightsOn)}
                      className={`w-14 h-8 border transition-colors ${
                        lightsOn ? "bg-white border-white" : "bg-transparent border-white/20"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-black transition-transform ${
                          lightsOn ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground tracking-wide">Living Room</span>
                    <button className="w-14 h-8 border border-white/20 bg-transparent">
                      <div className="w-6 h-6 bg-black translate-x-1" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground tracking-wide">Kitchen</span>
                    <button className="w-14 h-8 border border-white/20 bg-transparent">
                      <div className="w-6 h-6 bg-black translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Climate Control */}
              <div className="border border-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Thermometer className="w-6 h-6 text-white" />
                  <h3 className="text-white uppercase tracking-wider">Climate</h3>
                </div>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-white mb-4 tracking-wider">{temperature}°C</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTemperature(Math.max(16, temperature - 1))}
                        className="flex-1 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                      >
                        −
                      </button>
                      <button
                        onClick={() => setTemperature(Math.min(30, temperature + 1))}
                        className="flex-1 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span className="tracking-wide">Mode</span>
                      <span className="tracking-wide">Cool</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span className="tracking-wide">Status</span>
                      <span className="tracking-wide text-green-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="border border-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-white" />
                  <h3 className="text-white uppercase tracking-wider">Location</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-white tracking-wide mb-1">Villa Serenity</p>
                    <p className="text-muted-foreground tracking-wide">Jl. Raya Ubud No.88</p>
                    <p className="text-muted-foreground tracking-wide">Bali 80571, Indonesia</p>
                  </div>
                  <button className="w-full py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Property Image */}
          <div className="mt-12 border border-border overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1612965607446-25e1332775ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwaW50ZXJpb3IlMjBsdXh1cnl8ZW58MXx8fHwxNzY0MDQxNTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Villa Interior"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
