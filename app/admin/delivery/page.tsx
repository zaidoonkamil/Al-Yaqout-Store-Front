"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type DeliveryZone } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDeliveryPage() {
  const router = useRouter();
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [fees, setFees] = useState<Record<number, string>>({});

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  useEffect(() => {
    if (!token) { router.replace("/admin/login"); return; }
    api.getAllDeliveryZones(token)
      .then((data) => {
        setZones(data);
        const f: Record<number, string> = {};
        data.forEach((z) => { f[z.id] = String(z.fee); });
        setFees(f);
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveFee = async (zone: DeliveryZone) => {
    setSaving(zone.id);
    try {
      const updated = await api.updateDeliveryZone(zone.id, { fee: parseFloat(fees[zone.id] || "0") }, token);
      setZones((prev) => prev.map((z) => z.id === zone.id ? updated : z));
    } catch (err) {
      alert(err instanceof Error ? err.message : "فشل الحفظ");
    } finally {
      setSaving(null);
    }
  };

  const handleToggleActive = async (zone: DeliveryZone) => {
    setSaving(zone.id);
    try {
      const updated = await api.updateDeliveryZone(zone.id, { active: !zone.active }, token);
      setZones((prev) => prev.map((z) => z.id === zone.id ? updated : z));
    } catch (err) {
      alert(err instanceof Error ? err.message : "فشل التحديث");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="md:mr-56">
      <AdminSidebar />

      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6">
        <h1 className="text-yaqut-primary font-black text-xl">رسوم التوصيل</h1>
        <p className="text-yaqut-muted text-sm">حدد رسوم التوصيل لكل محافظة عراقية</p>
      </header>

      <main className="p-4 md:p-6 pb-24 md:pb-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-card animate-pulse h-16" />
            ))}
          </div>
        ) : (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-sm text-amber-800 font-medium">
              💡 رسوم التوصيل = 0 تعني التوصيل مجاني لهذه المحافظة
            </div>

            <div className="space-y-2">
              {zones.map((zone) => (
                <div key={zone.id}
                  className={`bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 transition-opacity ${!zone.active ? "opacity-50" : ""}`}>

                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggleActive(zone)}
                    disabled={saving === zone.id}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors flex-shrink-0 ${zone.active ? "bg-green-500" : "bg-gray-300"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${zone.active ? "translate-x-4" : "translate-x-0"}`} />
                  </button>

                  {/* Governorate name */}
                  <span className="font-bold text-yaqut-primary flex-1 text-sm">{zone.governorate}</span>

                  {/* Fee input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={fees[zone.id] ?? zone.fee}
                      onChange={(e) => setFees((f) => ({ ...f, [zone.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveFee(zone)}
                      min="0"
                      step="500"
                      className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:ring-2 focus:ring-yaqut-purple"
                      placeholder="0"
                    />
                    <span className="text-yaqut-muted text-xs font-medium flex-shrink-0">د.ع</span>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={() => handleSaveFee(zone)}
                    disabled={saving === zone.id}
                    className="bg-yaqut-purple text-white px-3 py-2 rounded-xl text-xs font-bold btn-press disabled:opacity-60 flex-shrink-0"
                  >
                    {saving === zone.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : "حفظ"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
