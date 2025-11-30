"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function BookingExperience() {
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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  const pricePerNight = 127500;
  const totalPrice = totalNights * pricePerNight;
  const serviceFee = totalPrice * 0.12;
  const grandTotal = totalPrice + serviceFee;

  return (
    <div className="min-h-screen pl-20 flex">
      {/* Left: Calendar */}
      <div className="flex-1 px-16 py-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-white uppercase tracking-[0.3em] mb-2">Book Your Stay</h1>
            <p className="text-muted-foreground tracking-wide">Villa Serenity · Bali, Indonesia</p>
          </div>

          {/* Property Preview */}
          <div className="mb-12 border border-border">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjB2aWxsYXxlbnwxfHx8fDE3NjQwNDE1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Villa Serenity"
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Guest Selection */}
          <div className="mb-8 p-6 border border-border">
            <label className="text-white uppercase tracking-widest opacity-60 mb-4 block">
              Number of Guests
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
                <span className="text-white tracking-wider">{guests}</span>
              </div>
              <button
                onClick={() => setGuests(Math.min(8, guests + 1))}
                className="w-12 h-12 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="border border-border p-8">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-white uppercase tracking-[0.2em]">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center py-2 text-muted-foreground uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDate(day)}
                  disabled={!day}
                  className={`aspect-square flex items-center justify-center border transition-all ${
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
        </div>
      </div>

      {/* Right: Booking Summary */}
      <div className="w-[440px] border-l border-border p-12 sticky top-0 h-screen overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h2 className="text-white uppercase tracking-[0.2em] mb-6">Booking Summary</h2>
            
            {selectedDates.length > 0 ? (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white">
                  <Calendar className="w-5 h-5" />
                  <span className="tracking-wide">{selectedDates.length} nights selected</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Users className="w-5 h-5" />
                  <span className="tracking-wide">{guests} guests</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground tracking-wide mb-8">
                Select your dates to see pricing
              </p>
            )}
          </div>

          {selectedDates.length > 0 && (
            <>
              {/* Price Breakdown */}
              <div className="flex-1 space-y-4 mb-8 pb-8 border-b border-border">
                <div className="flex justify-between text-white">
                  <span className="tracking-wide">
                    ¥{pricePerNight.toLocaleString()} × {totalNights}泊
                  </span>
                  <span className="tracking-wide">¥{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="tracking-wide">Service fee (12%)</span>
                  <span className="tracking-wide">¥{serviceFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-white uppercase tracking-[0.2em]">Total</span>
                  <span className="text-white uppercase tracking-wider">
                    ¥{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Reserve Button */}
              <button className="w-full bg-white text-black py-4 hover:bg-white/90 transition-colors uppercase tracking-[0.3em]">
                Reserve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
