"use client";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import Masonry from "react-responsive-masonry";
import { MapPin, Users, Search, Filter, X, SlidersHorizontal, Calendar } from "lucide-react";
import { Property, properties } from "@/lib/data";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Reservation } from "@/lib/api";

interface DiscoveryDashboardProps {
  onSelectVilla: (property: Property) => void;
  reservations?: Reservation[];
}

export function DiscoveryDashboard({ onSelectVilla, reservations = [] }: DiscoveryDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [minCapacity, setMinCapacity] = useState(0);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-white text-black";
      case "Reserved":
        return "bg-yellow-500 text-black";
      case "Owned":
        return "bg-green-500 text-black";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // フィルタリングロジック
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // 検索クエリでフィルタ
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          property.name.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // ステータスでフィルタ
      if (selectedStatus.length > 0 && !selectedStatus.includes(property.status)) {
        return false;
      }

      // 場所でフィルタ
      if (selectedLocations.length > 0 && !selectedLocations.includes(property.location)) {
        return false;
      }

      // 価格でフィルタ
      if (property.pricePerNight < priceRange[0] || property.pricePerNight > priceRange[1]) {
        return false;
      }

      // ベッドルーム数でフィルタ
      if (property.bedrooms < minBedrooms) {
        return false;
      }

      // ゲスト数でフィルタ
      if (property.capacity < minCapacity) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedStatus, selectedLocations, priceRange, minBedrooms, minCapacity]);

  // プロパティをステータスで分類
  const reservedOrOwned = filteredProperties.filter(p => p.status === "Reserved" || p.status === "Owned");
  const available = filteredProperties.filter(p => p.status === "Available");

  // ユニークな場所を取得
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(properties.map(p => p.location))).sort();
  }, []);

  // 価格の最大値を取得
  const maxPrice = useMemo(() => {
    return Math.max(...properties.map(p => p.pricePerNight), 300000);
  }, []);

  // 初期価格範囲を設定
  useEffect(() => {
    if (priceRange[1] === 0 && maxPrice > 0) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  const handleStatusToggle = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus([]);
    setSelectedLocations([]);
    setPriceRange([0, maxPrice]);
    setMinBedrooms(0);
    setMinCapacity(0);
  };

  const activeFilterCount = selectedStatus.length + selectedLocations.length + 
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (minBedrooms > 0 ? 1 : 0) +
    (minCapacity > 0 ? 1 : 0);

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <div
      onClick={() => onSelectVilla(property)}
      className="group relative overflow-hidden bg-card border border-border hover:border-white/40 transition-all cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ImageWithFallback
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 uppercase tracking-widest ${getStatusColor(property.status)}`}>
          {property.status}
        </div>

        {/* Hover Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 text-white/80 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="tracking-wide">{property.location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Users className="w-4 h-4" />
            <span className="tracking-wide">最大 {property.capacity}名</span>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-6">
        <h3 className="text-white uppercase tracking-[0.2em]">{property.name}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen md:pl-20 pb-16 md:pb-0">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-white uppercase tracking-[0.3em] mb-2 text-xl sm:text-2xl md:text-3xl">Smart Villa Discovery</h1>
              <p className="text-muted-foreground tracking-wide text-sm sm:text-base">世界各地の厳選されたスマートヴィラ</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ヴィラ名、場所、説明で検索..."
                className="w-full bg-transparent border border-white/20 px-12 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`px-4 sm:px-6 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 relative ${
                activeFilterCount > 0 ? "bg-white/10" : ""
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>絞り込み</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 予約情報セクション */}
      {reservations.length > 0 && (
        <div className="border-b border-border px-4 sm:px-8 md:px-16 py-6 sm:py-8">
          <div className="mb-6">
            <h2 className="text-white uppercase tracking-[0.2em] mb-2 text-lg sm:text-xl">My Reservations</h2>
            <p className="text-muted-foreground tracking-wide text-sm">予約済みのヴィラ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.map((reservation) => {
              const property = properties.find((p) => p.id === reservation.room_id.toString());
              return (
                <div
                  key={reservation.id}
                  className="bg-card border border-white/20 p-6 hover:border-white/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white uppercase tracking-[0.2em] mb-1">
                        {property?.name || `Room ${reservation.room_id}`}
                      </h3>
                      <p className="text-muted-foreground text-sm tracking-wide">
                        {property?.location || "Location N/A"}
                      </p>
                    </div>
                    <span className={`px-3 py-1 uppercase tracking-widest text-xs ${
                      reservation.status === "CONFIRMED" 
                        ? "bg-green-500 text-black" 
                        : reservation.status === "PENDING"
                        ? "bg-yellow-500 text-black"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="tracking-wide">
                        {formatDate(reservation.start_date)} - {formatDate(reservation.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-muted-foreground tracking-wide">Total</span>
                      <span className="text-white tracking-wide">
                        ¥{reservation.total_price?.toLocaleString() || "0"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-12">
        {/* Mobile: Reserved/Owned in first column, Available in horizontal scroll */}
        <div className="md:hidden space-y-6">
          {/* Reserved/Owned - First Column */}
          {reservedOrOwned.length > 0 && (
            <div className="space-y-4">
              {reservedOrOwned.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Available - Horizontal Scroll */}
          {available.length > 0 && (
            <div>
              <h2 className="text-white uppercase tracking-[0.2em] mb-4 text-sm">利用可能なヴィラ</h2>
              <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
                  {available.map((property) => (
                    <div key={property.id} className="snap-center" style={{ width: 'min(300px, 75vw)' }}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Masonry Grid */}
        <div className="hidden md:block">
          <Masonry columnsCountBreakPoints={{ 750: 2, 900: 3 }} gutter="16px">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </Masonry>
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white uppercase tracking-[0.2em] text-xl">
              絞り込みオプション
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 mt-4">
            {/* Status Filter */}
            <div>
              <h3 className="text-white uppercase tracking-widest mb-4 text-sm">ステータス</h3>
              <div className="flex flex-wrap gap-3">
                {["Available", "Reserved", "Owned"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={`px-4 py-2 border transition-colors uppercase tracking-widest text-xs ${
                      selectedStatus.includes(status)
                        ? "bg-white text-black border-white"
                        : "border-white/20 text-white hover:border-white/40"
                    }`}
                  >
                    {status === "Available" ? "利用可能" : status === "Reserved" ? "予約済み" : "所有済み"}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="text-white uppercase tracking-widest mb-4 text-sm">場所</h3>
              <div className="flex flex-wrap gap-3">
                {uniqueLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationToggle(location)}
                    className={`px-4 py-2 border transition-colors uppercase tracking-widest text-xs ${
                      selectedLocations.includes(location)
                        ? "bg-white text-black border-white"
                        : "border-white/20 text-white hover:border-white/40"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-white uppercase tracking-widest mb-4 text-sm">
                価格帯 (¥{priceRange[0].toLocaleString()} - ¥{priceRange[1].toLocaleString()})
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">最低価格</label>
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), priceRange[1]);
                        setPriceRange([val, priceRange[1]]);
                      }}
                      className="w-full bg-transparent border border-white/20 px-4 py-2 text-white focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">最高価格</label>
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), priceRange[0]);
                        setPriceRange([priceRange[0], val]);
                      }}
                      className="w-full bg-transparent border border-white/20 px-4 py-2 text-white focus:border-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-widest">最低価格</label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="10000"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), priceRange[1]);
                      setPriceRange([val, priceRange[1]]);
                    }}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <label className="text-white/60 text-xs uppercase tracking-widest">最高価格</label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), priceRange[0]);
                      setPriceRange([priceRange[0], val]);
                    }}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <h3 className="text-white uppercase tracking-widest mb-4 text-sm">
                ベッドルーム数 (最小: {minBedrooms})
              </h3>
              <input
                type="range"
                min="0"
                max={10}
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-white/60 text-xs mt-2">
                <span>0</span>
                <span>10+</span>
              </div>
            </div>

            {/* Capacity Filter */}
            <div>
              <h3 className="text-white uppercase tracking-widest mb-4 text-sm">
                ゲスト数 (最小: {minCapacity})
              </h3>
              <input
                type="range"
                min="0"
                max={15}
                value={minCapacity}
                onChange={(e) => setMinCapacity(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-white/60 text-xs mt-2">
                <span>0</span>
                <span>15+</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-white/20">
              <button
                onClick={resetFilters}
                className="flex-1 px-6 py-3 border border-white/20 text-white hover:bg-white/10 transition-colors uppercase tracking-widest text-sm"
              >
                リセット
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-6 py-3 bg-white text-black hover:bg-white/90 transition-colors uppercase tracking-widest text-sm"
              >
                適用
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}