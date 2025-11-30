"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, Calendar, MapPin, Wifi, Coffee, Wind, Waves, Plane, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Property } from "@/lib/data";

interface VillaDetailPageProps {
  property: Property;
  onBack: () => void;
  onProceedToCheckout: (booking: {
    selectedDates: Date[];
    guests: number;
    totalPrice: number;
  }) => void;
}

export function VillaDetailPage({ property, onBack, onProceedToCheckout }: VillaDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10)); // November 2025
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [guests, setGuests] = useState(2);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const isDateSelected = (date: Date | null) => {
    if (!date) return false;
    return selectedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  const toggleDate = (date: Date | null) => {
    if (!date) return;
    
    if (isDateSelected(date)) {
      setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const totalNights = selectedDates.length;
  const totalPrice = totalNights * property.pricePerNight;
  const serviceFee = totalPrice * 0.12;
  const grandTotal = totalPrice + serviceFee;

  const handleProceedToCheckout = () => {
    if (selectedDates.length > 0) {
      onProceedToCheckout({
        selectedDates,
        guests,
        totalPrice: grandTotal,
      });
    }
  };

  const amenityIcons: { [key: string]: any } = {
    "High-Speed WiFi": Wifi,
    "Coffee Machine": Coffee,
    "Air Conditioning": Wind,
    "Infinity Pool": Waves,
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-8 md:px-16 py-4 sm:py-6 md:py-8">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="uppercase tracking-widest">ヴィラ一覧に戻る</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left: Villa Details */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-12">
          {/* Image Gallery */}
          <div className="mb-12">
            <div className="relative border border-border overflow-hidden mb-4">
              <ImageWithFallback
                src={property.images[currentImageIndex]}
                alt={property.name}
                className="w-full aspect-[16/10] object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentImageIndex((currentImageIndex - 1 + property.images.length) % property.images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 border border-white/20 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((currentImageIndex + 1) % property.images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 border border-white/20 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 text-white tracking-wider">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border overflow-hidden transition-all ${
                    index === currentImageIndex ? "border-white" : "border-white/20 hover:border-white/60"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${property.name} ${index + 1}`}
                    className="w-full aspect-video object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Villa Info */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-white uppercase tracking-[0.3em] mb-2">{property.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="tracking-wide">{property.location}</span>
                </div>
              </div>
              <div className={`px-4 py-2 uppercase tracking-widest ${
                property.status === "Available" ? "bg-white text-black" :
                property.status === "Reserved" ? "bg-yellow-500 text-black" :
                "bg-green-500 text-black"
              }`}>
                {property.status}
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 border border-border">
              <div>
                <div className="text-white mb-1">{property.capacity}</div>
                <div className="text-muted-foreground tracking-wide">ゲスト</div>
              </div>
              <div>
                <div className="text-white mb-1">{property.bedrooms}</div>
                <div className="text-muted-foreground tracking-wide">ベッドルーム</div>
              </div>
              <div>
                <div className="text-white mb-1">{property.bathrooms}</div>
                <div className="text-muted-foreground tracking-wide">バスルーム</div>
              </div>
              <div>
                <div className="text-white mb-1">¥{property.pricePerNight.toLocaleString()}</div>
                <div className="text-muted-foreground tracking-wide">1泊あたり</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-white uppercase tracking-[0.2em] mb-4">物件について</h2>
              <p className="text-muted-foreground tracking-wide leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Access Information */}
            {(property.address || property.nearestAirport || property.accessInfo) && (
              <div className="mb-8">
                <h2 className="text-white uppercase tracking-[0.2em] mb-4">アクセス情報</h2>
                <div className="space-y-4 p-6 border border-border">
                  {property.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white tracking-wide mb-1">住所</div>
                        <div className="text-muted-foreground tracking-wide">{property.address}</div>
                      </div>
                    </div>
                  )}
                  {property.nearestAirport && (
                    <div className="flex items-start gap-3">
                      <Plane className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white tracking-wide mb-1">最寄り空港</div>
                        <div className="text-muted-foreground tracking-wide">{property.nearestAirport}</div>
                        {property.airportDistance && (
                          <div className="text-muted-foreground tracking-wide text-sm mt-1">距離: {property.airportDistance}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {property.airportTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white tracking-wide mb-1">アクセス時間</div>
                        <div className="text-muted-foreground tracking-wide">{property.airportTime}</div>
                      </div>
                    </div>
                  )}
                  {property.accessInfo && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-muted-foreground tracking-wide leading-relaxed text-sm">
                        {property.accessInfo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <h2 className="text-white uppercase tracking-[0.2em] mb-4">アメニティ</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || Wifi;
                  return (
                    <div key={index} className="flex items-center gap-3 p-4 border border-border">
                      <Icon className="w-5 h-5 text-white" />
                      <span className="text-white tracking-wide">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Panel */}
        <div className="w-full lg:w-[480px] border-t lg:border-t-0 lg:border-l border-border p-6 sm:p-8 md:p-12 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="flex flex-col h-full">
            <h2 className="text-white uppercase tracking-[0.2em] mb-8">予約する</h2>

            {/* Guest Selection */}
            <div className="mb-8 p-6 border border-border">
              <label className="text-white uppercase tracking-widest opacity-60 mb-4 block">
                人数
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-12 h-12 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                >
                  −
                </button>
                <div className="flex items-center gap-3 px-6">
                  <Users className="w-5 h-5 text-white" />
                  <span className="text-white tracking-wider">{guests}名</span>
                </div>
                <button
                  onClick={() => setGuests(Math.min(property.capacity, guests + 1))}
                  className="w-12 h-12 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="border border-border p-6 mb-8">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-white uppercase tracking-wider">
                  {currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </h3>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center py-1 text-muted-foreground uppercase tracking-wider"
                    style={{ fontSize: '10px' }}
                  >
                    {day.slice(0, 1)}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleDate(day)}
                    disabled={!day}
                    className={`aspect-square flex items-center justify-center border transition-all text-sm ${
                      !day
                        ? "border-transparent"
                        : isDateSelected(day)
                        ? "bg-white text-black border-white"
                        : "border-white/20 text-white hover:border-white hover:bg-white/10"
                    }`}
                  >
                    {day && day.getDate()}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            {selectedDates.length > 0 && (
              <>
                <div className="flex-1 space-y-4 mb-8 pb-8 border-b border-border">
                  <div className="flex justify-between text-white">
                    <span className="tracking-wide">
                      ¥{property.pricePerNight.toLocaleString()} × {totalNights}泊
                    </span>
                    <span className="tracking-wide">¥{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="tracking-wide">サービス料 (12%)</span>
                    <span className="tracking-wide">¥{serviceFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-white uppercase tracking-[0.2em]">合計</span>
                    <span className="text-white uppercase tracking-wider">
                      ¥{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-white text-black py-4 hover:bg-white/90 transition-colors uppercase tracking-[0.3em]"
                >
                  決済に進む
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}