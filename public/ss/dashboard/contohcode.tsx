import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Users,
  FileText,
  Settings,
  Search,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  TrendingUp,
  Menu,
  X,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Toaster, toast } from "sonner";

// --- INITIAL MOCK DATA ---
const initialChartData = [
  { name: "Jan", total: 12000000 },
  { name: "Feb", total: 15000000 },
  { name: "Mar", total: 18000000 },
  { name: "Apr", total: 14000000 },
  { name: "Mei", total: 22000000 },
  { name: "Jun", total: 28000000 },
];

const initialTransactions = [
  {
    id: "TRX-001",
    name: "Hamba Allah",
    amount: 500000,
    date: "12 Jun 2024",
    status: "Berhasil",
    type: "Zakat",
  },
  {
    id: "TRX-002",
    name: "Budi Santoso",
    amount: 1500000,
    date: "12 Jun 2024",
    status: "Berhasil",
    type: "Infaq",
  },
  {
    id: "TRX-003",
    name: "Siti Aminah",
    amount: 300000,
    date: "11 Jun 2024",
    status: "Tertunda",
    type: "Sedekah",
  },
  {
    id: "TRX-004",
    name: "Alumni Angkatan 2010",
    amount: 5000000,
    date: "10 Jun 2024",
    status: "Berhasil",
    type: "Wakaf",
  },
  {
    id: "TRX-005",
    name: "Ahmad Dahlan",
    amount: 1000000,
    date: "09 Jun 2024",
    status: "Berhasil",
    type: "Infaq",
  },
];

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dasbor");

  // State for interactivity
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartYear, setChartYear] = useState("2024");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "Infaq",
  });

  // Handlers
  const handleDownloadReport = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: "Menyiapkan laporan...",
      success: "Laporan berhasil diunduh!",
      error: "Gagal mengunduh laporan",
    });
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    const newTrx = {
      id: `TRX-00${transactions.length + 1}`,
      name: formData.name,
      amount: parseInt(formData.amount.replace(/[^0-9]/g, "")),
      date: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Berhasil",
      type: formData.type,
    };

    setTransactions([newTrx, ...transactions]);
    setIsModalOpen(false);
    setFormData({ name: "", amount: "", type: "Infaq" });
    toast.success("Dana berhasil dicatat!");

    // Switch to transaction tab to show the new data if not already there
    setActiveTab("transaksi");
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f1f5f9] font-sans text-slate-800">
      <Toaster position="top-right" richColors />

      {/* Decorative Background Blobs for Glassmorphism Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-300/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-300/20 blur-[80px] pointer-events-none" />

      <div className="flex h-screen relative z-10">
        {/* SIDEBAR */}
        <aside
          className={`
            ${isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"} 
            transition-all duration-300 ease-in-out flex flex-col
            bg-white/40 backdrop-blur-2xl border-r border-white/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
            fixed lg:relative z-50 h-full
          `}
        >
          <div className="p-6 flex items-center justify-between">
            <div
              className={`flex items-center gap-3 ${!isSidebarOpen && "lg:hidden"}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <Wallet className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg leading-tight text-slate-900 whitespace-nowrap overflow-hidden">
                Pondok
                <br />
                Dana
              </span>
            </div>
            {/* Mobile close button */}
            <button
              className="lg:hidden p-1 rounded-md text-slate-500 hover:bg-white/50"
              onClick={() => setIsSidebarOpen(false)}
            >
              {isSidebarOpen && <X size={20} />}
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Dasbor"
              active={activeTab === "dasbor"}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab("dasbor")}
            />
            <SidebarItem
              icon={<Wallet size={20} />}
              label="Transaksi"
              active={activeTab === "transaksi"}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab("transaksi")}
            />
            <SidebarItem
              icon={<Users size={20} />}
              label="Donatur"
              active={activeTab === "donatur"}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab("donatur")}
            />
            <SidebarItem
              icon={<FileText size={20} />}
              label="Laporan"
              active={activeTab === "laporan"}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab("laporan")}
            />
            <div className="pt-8 pb-2">
              <p
                className={`text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 transition-opacity ${!isSidebarOpen ? "opacity-0 lg:hidden" : "opacity-100"}`}
              >
                Lainnya
              </p>
            </div>
            <SidebarItem
              icon={<Settings size={20} />}
              label="Pengaturan"
              active={activeTab === "pengaturan"}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab("pengaturan")}
            />
          </nav>

          <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-white/50 backdrop-blur-md transition-all">
            <div
              className={`flex flex-col items-center text-center ${!isSidebarOpen && "lg:hidden"}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 shrink-0">
                <TrendingUp className="text-primary w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1 whitespace-nowrap">
                Target Tahunan
              </h4>
              <p className="text-xs text-slate-500 mb-3 whitespace-nowrap">
                Rp 500 Juta tercapai
              </p>
              <div className="w-full bg-white/50 rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full w-1/2" />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
          {/* HEADER */}
          <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-white/30 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40 shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors text-slate-600"
              >
                <Menu size={20} />
              </button>
              <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (
                      activeTab !== "transaksi" &&
                      e.target.value.length > 0
                    ) {
                      setActiveTab("transaksi");
                    }
                  }}
                  placeholder="Cari transaksi atau donatur..."
                  className="w-64 lg:w-80 pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 focus:border-primary/50 focus:bg-white/80 rounded-xl outline-none text-sm transition-all shadow-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => toast.info("Tidak ada notifikasi baru")}
                className="relative p-2.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors border border-white/60 text-slate-600"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <div
                className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-white/40 transition-colors"
                onClick={() => setActiveTab("pengaturan")}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    Admin Pesantren
                  </p>
                  <p className="text-xs text-slate-500">Bendahara</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=32&h=32&q=80"
                  alt="Profile"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm object-cover shrink-0"
                />
              </div>
            </div>
          </header>

          {/* SCROLLABLE CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8 pb-10">
              {/* PAGE TITLE & ACTIONS */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    {activeTab === "dasbor" && "Assalamu'alaikum, Admin 👋"}
                    {activeTab === "transaksi" && "Data Transaksi"}
                    {activeTab === "donatur" && "Daftar Donatur"}
                    {activeTab === "laporan" && "Laporan Keuangan"}
                    {activeTab === "pengaturan" && "Pengaturan Sistem"}
                  </h1>
                  <p className="text-slate-500 text-sm">
                    {activeTab === "dasbor" &&
                      "Berikut adalah ringkasan penerimaan dana pesantren hari ini."}
                    {activeTab !== "dasbor" &&
                      `Kelola ${activeTab} pesantren Anda dari halaman ini.`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 hover:bg-white/80 border border-white/80 text-slate-700 text-sm font-medium transition-colors shadow-sm flex-1 sm:flex-none"
                  >
                    <Download size={18} />
                    Unduh
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-primary/30 flex-1 sm:flex-none"
                  >
                    <Plus size={18} />
                    Terima Dana
                  </button>
                </div>
              </div>

              {/* DYNAMIC VIEW BASED ON TAB */}
              {activeTab === "dasbor" && (
                <>
                  {/* STAT CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                      title="Total Dana (Bulan Ini)"
                      value={formatIDR(125400000)}
                      trend="+12.5%"
                      trendUp={true}
                      icon={<Wallet size={24} />}
                      color="purple"
                    />
                    <StatCard
                      title="Jumlah Donatur Aktif"
                      value="3,240"
                      trend="+5.2%"
                      trendUp={true}
                      icon={<Users size={24} />}
                      color="teal"
                      onClick={() => setActiveTab("donatur")}
                    />
                    <StatCard
                      title="Total Transaksi"
                      value={transactions.length.toString()}
                      trend="+2 Hari Ini"
                      trendUp={true}
                      icon={<FileText size={24} />}
                      color="blue"
                      onClick={() => setActiveTab("transaksi")}
                    />
                    <StatCard
                      title="Pembangunan Masjid"
                      value="65%"
                      subtitle="Terkumpul Rp 3.2M dari 5M"
                      icon={<TrendingUp size={24} />}
                      color="amber"
                      progress={65}
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                    {/* CHART */}
                    <div className="xl:col-span-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            Grafik Penerimaan Dana
                          </h2>
                          <p className="text-sm text-slate-500">
                            Statistik 6 bulan terakhir
                          </p>
                        </div>
                        <select
                          value={chartYear}
                          onChange={(e) => {
                            setChartYear(e.target.value);
                            toast.success(
                              `Menampilkan data tahun ${e.target.value}`,
                            );
                          }}
                          className="bg-white/50 border border-white/60 text-sm rounded-lg px-3 py-2 outline-none focus:border-primary cursor-pointer text-slate-700 w-full sm:w-auto"
                        >
                          <option value="2024">Tahun 2024</option>
                          <option value="2023">Tahun 2023</option>
                        </select>
                      </div>
                      <div className="h-[250px] md:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={initialChartData}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -20,
                              bottom: 0,
                            }}
                          >
                            <defs>
                              <linearGradient
                                id="colorTotal"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#7c3aed"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#7c3aed"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="rgba(0,0,0,0.05)"
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#64748b", fontSize: 12 }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#64748b", fontSize: 12 }}
                              tickFormatter={(value) =>
                                `Rp ${value / 1000000}M`
                              }
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderRadius: "12px",
                                border: "1px solid rgba(255,255,255,0.5)",
                                boxShadow:
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                backdropFilter: "blur(8px)",
                              }}
                              formatter={(value: number) => [
                                formatIDR(value),
                                "Total",
                              ]}
                            />
                            <Area
                              type="monotone"
                              dataKey="total"
                              stroke="#7c3aed"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorTotal)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* RECENT TRANSACTIONS WIDGET */}
                    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[400px] xl:h-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">
                          Transaksi Terbaru
                        </h2>
                        <button
                          onClick={() => setActiveTab("transaksi")}
                          className="text-primary text-sm font-medium hover:underline px-2 py-1 rounded-md hover:bg-primary/5 transition-colors"
                        >
                          Lihat Semua
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {transactions.slice(0, 5).map((trx) => (
                          <div
                            key={trx.id}
                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/60 transition-colors group cursor-pointer border border-transparent hover:border-white/80"
                            onClick={() => setActiveTab("transaksi")}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                  trx.status === "Berhasil"
                                    ? "bg-teal-50 text-teal-600"
                                    : "bg-amber-50 text-amber-600"
                                }`}
                              >
                                {trx.status === "Berhasil" ? (
                                  <CheckCircle2 size={18} />
                                ) : (
                                  <Clock size={18} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
                                  {trx.name}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">
                                  {trx.type} • {trx.date}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <p className="text-sm font-bold text-slate-900">
                                {formatIDR(trx.amount)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TRANSACTIONS VIEW */}
              {activeTab === "transaksi" && (
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                      Semua Transaksi
                    </h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 border border-white/60 text-sm text-slate-600 hover:bg-white/80 transition-colors flex-1 justify-center">
                        <Filter size={16} /> Filter
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/50">
                          <th className="py-3 px-4 text-sm font-semibold text-slate-500">
                            ID Transaksi
                          </th>
                          <th className="py-3 px-4 text-sm font-semibold text-slate-500">
                            Donatur
                          </th>
                          <th className="py-3 px-4 text-sm font-semibold text-slate-500">
                            Jenis
                          </th>
                          <th className="py-3 px-4 text-sm font-semibold text-slate-500">
                            Tanggal
                          </th>
                          <th className="py-3 px-4 text-sm font-semibold text-slate-500 text-right">
                            Jumlah
                          </th>
                          <th className="py-3 px-4 text-sm font-semibold text-slate-500 text-center">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-8 text-center text-slate-500"
                            >
                              Tidak ada transaksi ditemukan.
                            </td>
                          </tr>
                        ) : (
                          filteredTransactions.map((trx) => (
                            <tr
                              key={trx.id}
                              className="border-b border-slate-200/20 hover:bg-white/30 transition-colors"
                            >
                              <td className="py-3 px-4 text-sm font-medium text-slate-700">
                                {trx.id}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-900 font-medium">
                                {trx.name}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-600">
                                <span className="px-2.5 py-1 bg-slate-100/50 rounded-md text-xs border border-slate-200/50">
                                  {trx.type}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-600">
                                {trx.date}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-900 font-bold text-right">
                                {formatIDR(trx.amount)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full ${
                                    trx.status === "Berhasil"
                                      ? "bg-teal-100/50 text-teal-700 border border-teal-200/50"
                                      : "bg-amber-100/50 text-amber-700 border border-amber-200/50"
                                  }`}
                                >
                                  {trx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* OTHER PLACEHOLDER VIEWS */}
              {["donatur", "laporan", "pengaturan"].includes(activeTab) && (
                <div className="h-64 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary border border-primary/20">
                    {activeTab === "donatur" && <Users size={32} />}
                    {activeTab === "laporan" && <FileText size={32} />}
                    {activeTab === "pengaturan" && <Settings size={32} />}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 capitalize">
                    Fitur {activeTab}
                  </h2>
                  <p className="text-slate-500 max-w-md">
                    Halaman ini sedang dalam tahap pengembangan. Fitur detail
                    akan segera tersedia pada rilis pembaruan berikutnya.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MODAL "TERIMA DANA" */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Catat Penerimaan Dana
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Donatur
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
                  placeholder="Contoh: Hamba Allah"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Jumlah Nominal (Rp)
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => {
                    // Only allow numbers
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    // Format as number with dots
                    const formatted = val
                      ? new Intl.NumberFormat("id-ID").format(parseInt(val))
                      : "";
                    setFormData({ ...formData, amount: formatted });
                  }}
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Jenis Dana
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm cursor-pointer"
                >
                  <option value="Zakat">Zakat</option>
                  <option value="Infaq">Infaq</option>
                  <option value="Sedekah">Sedekah</option>
                  <option value="Wakaf">Wakaf Pembangunan</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/80 bg-white/50 hover:bg-white/80 text-slate-700 font-medium text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-colors shadow-lg shadow-primary/30"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUBCOMPONENTS ---

function SidebarItem({
  icon,
  label,
  active,
  isOpen,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isOpen: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${
          active
            ? "bg-white/60 text-primary shadow-sm border border-white/80 font-medium"
            : "text-slate-600 hover:bg-white/40 hover:text-slate-900"
        }
      `}
    >
      <div className={`${active ? "text-primary" : "text-slate-500"} shrink-0`}>
        {icon}
      </div>
      <span
        className={`text-sm whitespace-nowrap transition-opacity duration-200 ${!isOpen ? "opacity-0 lg:hidden w-0" : "opacity-100 w-auto"}`}
      >
        {label}
      </span>
      {active && isOpen && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      )}
    </button>
  );
}

function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon,
  color,
  subtitle,
  progress,
  onClick,
}: {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  color: "purple" | "teal" | "blue" | "amber";
  subtitle?: string;
  progress?: number;
  onClick?: () => void;
}) {
  const colorMap = {
    purple: "bg-primary/10 text-primary border-primary/20",
    teal: "bg-secondary/10 text-secondary border-secondary/20",
    blue: "bg-accent/10 text-accent border-accent/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  const bgMap = {
    purple: "bg-primary",
    teal: "bg-secondary",
    blue: "bg-accent",
    amber: "bg-amber-500",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:bg-white/60 transition-all ${onClick ? "cursor-pointer hover:-translate-y-1" : ""}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border shrink-0 ${colorMap[color]}`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-lg bg-white/50 border border-white/60 ${trendUp ? "text-teal-600" : "text-rose-500"}`}
          >
            {trendUp ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {trend}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-slate-500 text-xs md:text-sm font-medium mb-1 truncate">
          {title}
        </h3>
        <div className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
          {value}
        </div>
        {subtitle && (
          <p className="text-[10px] md:text-xs text-slate-500 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-4 w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full ${bgMap[color]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
