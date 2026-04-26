import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Database,
  Search,
  Play,
  Download,
  Plus,
  ChevronDown,
  Key,
  Layers,
  Activity,
  Hash,
  LayoutGrid,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DB_NAMES = ["production_db", "staging_db", "analytics_dw", "test_db"];

const TABLES = [
  {
    name: "users",
    icon: "👤",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    count: "1.2k",
    badge: "bg-blue-400/15 text-blue-400",
  },
  {
    name: "orders",
    icon: "📦",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    count: "8.4k",
    badge: "bg-violet-400/15 text-violet-400",
  },
  {
    name: "products",
    icon: "🏷️",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    count: "342",
    badge: "bg-emerald-400/15 text-emerald-400",
  },
  {
    name: "sessions",
    icon: "🔑",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    count: "22k",
    badge: "bg-amber-400/15 text-amber-400",
  },
  {
    name: "audit_logs",
    icon: "📋",
    color: "text-red-400",
    bg: "bg-red-400/10",
    count: "91k",
    badge: "bg-red-400/15 text-red-400",
  },
  {
    name: "categories",
    icon: "🗂️",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    count: "18",
    badge: "bg-blue-400/15 text-blue-400",
  },
  {
    name: "payments",
    icon: "💳",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    count: "6.1k",
    badge: "bg-emerald-400/15 text-emerald-400",
  },
];

const TABLE_DATA = {
  users: {
    columns: [
      "id",
      "username",
      "email",
      "role",
      "is_active",
      "created_at",
      "score",
    ],
    types: ["INT", "VARCHAR", "TEXT", "ENUM", "BOOL", "TIMESTAMP", "FLOAT"],
    rows: [
      [
        1,
        "alice_w",
        "alice@example.com",
        "admin",
        true,
        "2024-01-14 09:23",
        97.4,
      ],
      [2, "bob_jones", "bob@domain.io", "user", true, "2024-02-03 14:11", 43.1],
      [
        3,
        "charlie99",
        "charlie@mail.net",
        "user",
        false,
        "2024-02-17 08:05",
        null,
      ],
      [
        4,
        "diana_k",
        "diana@corp.com",
        "moderator",
        true,
        "2024-03-01 19:44",
        88.0,
      ],
      [5, "eve_dev", "eve@dev.io", "user", true, "2024-03-22 11:30", 62.7],
      [6, "frank_t", "frank@old.net", "user", false, "2024-04-05 07:12", null],
      [7, "grace_h", "grace@mail.com", "admin", true, "2024-04-19 16:00", 99.9],
      [8, "henry_m", "henry@biz.co", "user", true, "2024-05-02 10:45", 55.3],
    ],
    schema: [
      { pk: true, name: "id", type: "SERIAL", nullable: false },
      { pk: false, name: "username", type: "VARCHAR(64)", nullable: false },
      { pk: false, name: "email", type: "TEXT", nullable: false },
      {
        pk: false,
        name: "role",
        type: "ENUM('admin','user','mod')",
        nullable: false,
      },
      { pk: false, name: "is_active", type: "BOOLEAN", nullable: false },
      { pk: false, name: "created_at", type: "TIMESTAMP", nullable: false },
      { pk: false, name: "score", type: "FLOAT8", nullable: true },
    ],
  },
  orders: {
    columns: [
      "id",
      "customer_id",
      "product_id",
      "status",
      "total",
      "order_date",
      "refunded",
    ],
    types: ["INT", "INT", "INT", "VARCHAR", "DECIMAL", "DATE", "BOOL"],
    rows: [
      [1, 101, 3, "pending", 129.99, "2024-05-01", null],
      [2, 102, 1, "shipped", 449.0, "2024-05-02", null],
      [3, 103, 2, "delivered", 18.5, "2024-05-03", true],
      [4, 101, 5, "cancelled", 79.99, "2024-05-04", null],
      [5, 104, 3, "pending", 320.0, "2024-05-05", null],
    ],
    schema: [
      { pk: true, name: "id", type: "SERIAL", nullable: false },
      { pk: false, name: "customer_id", type: "INT", nullable: false },
      { pk: false, name: "product_id", type: "INT", nullable: false },
      { pk: false, name: "status", type: "VARCHAR", nullable: false },
      { pk: false, name: "total", type: "DECIMAL", nullable: false },
      { pk: false, name: "order_date", type: "DATE", nullable: false },
      { pk: false, name: "refunded", type: "BOOLEAN", nullable: true },
    ],
  },
  products: {
    columns: [
      "id",
      "name",
      "category",
      "price",
      "in_stock",
      "stock_count",
      "notes",
    ],
    types: ["INT", "VARCHAR", "TEXT", "DECIMAL", "BOOL", "INT", "TEXT"],
    rows: [
      [1, "Wireless Mouse", "Electronics", 29.99, true, 342, null],
      [2, "Mechanical Keyboard", "Electronics", 89.99, true, 158, null],
      [3, "USB-C Hub", "Accessories", 49.99, false, 0, "Discontinued"],
      [4, "Monitor Stand", "Furniture", 39.99, true, 74, null],
    ],
    schema: [
      { pk: true, name: "id", type: "SERIAL", nullable: false },
      { pk: false, name: "name", type: "VARCHAR", nullable: false },
      { pk: false, name: "category", type: "TEXT", nullable: false },
      { pk: false, name: "price", type: "DECIMAL", nullable: false },
      { pk: false, name: "in_stock", type: "BOOLEAN", nullable: false },
      { pk: false, name: "stock_count", type: "INT", nullable: false },
      { pk: false, name: "notes", type: "TEXT", nullable: true },
    ],
  },
};

// ─── Cell Renderer ────────────────────────────────────────────────────────────

function CellValue({ value, colIndex }) {
  if (value === null || value === undefined)
    return <span className="text-zinc-600 italic text-[11px]">NULL</span>;
  if (colIndex === 0)
    return (
      <span className="text-violet-400 font-semibold font-mono">{value}</span>
    );
  if (typeof value === "boolean")
    return value ? (
      <Badge className="bg-emerald-400/15 text-emerald-400 border-0 text-[10px] px-1.5 py-0">
        TRUE
      </Badge>
    ) : (
      <Badge className="bg-red-400/15 text-red-400 border-0 text-[10px] px-1.5 py-0">
        FALSE
      </Badge>
    );
  if (typeof value === "number")
    return <span className="text-amber-400 font-mono">{value}</span>;
  return (
    <span className="text-zinc-300 font-mono text-[11px]">{String(value)}</span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DatabaseExplorer() {
  const [dbIndex, setDbIndex] = useState(0);
  const [activeTable, setActiveTable] = useState("users");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 100;");
  const [running, setRunning] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sidebarTab, setSidebarTab] = useState("tables");

  const data = TABLE_DATA[activeTable] || TABLE_DATA.users;

  const filteredTables = useMemo(
    () => TABLES.filter((t) => t.name.includes(search.toLowerCase())),
    [search],
  );

  function handleSelectTable(name) {
    setActiveTable(name);
    setQuery(`SELECT * FROM ${name} LIMIT 100;`);
    setSelectedRows(new Set());
  }

  function handleRunQuery() {
    if (running) return;
    setRunning(true);
    setTimeout(() => setRunning(false), 700);
  }

  function toggleRow(i) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const activeTableMeta = TABLES.find((t) => t.name === activeTable);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-[#0e0f11] text-zinc-100 font-mono overflow-hidden">
        {/* ── TOP BAR ── */}
        <header className="h-12 flex items-center gap-3 px-4 bg-[#15171a] border-b border-zinc-800 shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span
              className="font-black text-sm tracking-widest text-blue-400 uppercase"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              DBStudio
            </span>
          </div>

          <Separator orientation="vertical" className="h-5 bg-zinc-700" />

          {/* DB Switcher */}
          <button
            onClick={() => setDbIndex((i) => (i + 1) % DB_NAMES.length)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800 border border-zinc-700 hover:border-blue-500 transition-colors text-zinc-400 hover:text-zinc-100 text-[11px]"
          >
            <Database size={11} className="text-blue-400" />
            <span>{DB_NAMES[dbIndex]}</span>
            <ChevronDown size={10} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] bg-transparent border-zinc-700 text-zinc-400 hover:border-blue-500 hover:text-zinc-100 font-mono"
            >
              ⌘ K
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] bg-transparent border-zinc-700 text-zinc-400 hover:border-blue-500 hover:text-zinc-100 font-mono"
            >
              Import
            </Button>
            <Button
              size="sm"
              className="h-7 text-[10px] bg-blue-500 hover:bg-blue-400 text-black font-bold font-mono"
            >
              <Plus size={10} className="mr-1" /> New Query
            </Button>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[10px] font-bold cursor-pointer select-none">
              AD
            </div>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── SIDEBAR ── */}
          <aside className="w-[260px] bg-[#15171a] border-r border-zinc-800 flex flex-col shrink-0">
            {/* Sidebar Header */}
            <div className="p-3 border-b border-zinc-800/60 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-800 border border-zinc-700 focus-within:border-blue-500 transition-colors">
                <Search size={11} className="text-zinc-500 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tables…"
                  className="bg-transparent outline-none text-[11px] text-zinc-100 placeholder:text-zinc-600 w-full"
                />
              </div>

              <Tabs value={sidebarTab} onValueChange={setSidebarTab}>
                <TabsList className="w-full h-7 bg-zinc-800 rounded-md p-0.5">
                  <TabsTrigger
                    value="tables"
                    className="flex-1 text-[9px] tracking-widest uppercase h-full data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-500 rounded"
                  >
                    Tables
                  </TabsTrigger>
                  <TabsTrigger
                    value="views"
                    className="flex-1 text-[9px] tracking-widest uppercase h-full data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-500 rounded"
                  >
                    Views
                  </TabsTrigger>
                  <TabsTrigger
                    value="fns"
                    className="flex-1 text-[9px] tracking-widest uppercase h-full data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-500 rounded"
                  >
                    Fns
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Table List */}
            <ScrollArea className="flex-1">
              <div className="py-2">
                <p className="px-3.5 pb-1 pt-1 text-[9px] uppercase tracking-widest text-zinc-600 font-semibold">
                  Public Schema
                </p>
                {filteredTables.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleSelectTable(t.name)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-all border-l-2 ${
                      activeTable === t.name
                        ? "bg-blue-500/10 border-blue-500"
                        : "border-transparent hover:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded flex items-center justify-center text-[10px] shrink-0 ${t.bg}`}
                    >
                      {t.icon}
                    </span>
                    <span
                      className={`text-[11px] flex-1 truncate ${activeTable === t.name ? "text-blue-400" : "text-zinc-300"}`}
                    >
                      {t.name}
                    </span>
                    <Badge
                      className={`text-[9px] px-1.5 py-0 border-0 font-mono ${t.badge}`}
                    >
                      {t.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </ScrollArea>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-zinc-800/60 flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Connected
              </div>
              <span className="ml-auto text-[9px] text-zinc-600">v14.2.1</span>
            </div>
          </aside>

          {/* ── MAIN PANEL ── */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Query Bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800 bg-[#15171a] shrink-0">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                <span className="text-blue-400 text-[11px] font-bold select-none shrink-0">
                  ›_
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'"
                  className="bg-transparent outline-none text-[11px] text-zinc-100 placeholder:text-zinc-600 w-full font-mono"
                />
              </div>
              <Button
                size="sm"
                onClick={handleRunQuery}
                disabled={running}
                className="h-8 px-3 bg-blue-500 hover:bg-blue-400 text-black font-bold font-mono text-[10px] min-w-[80px]"
              >
                {running ? (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Running
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Play size={9} fill="currentColor" /> Run
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[10px] bg-transparent border-zinc-700 text-zinc-400 hover:border-blue-500 hover:text-zinc-100 font-mono"
              >
                Format
              </Button>
            </div>

            {/* Content Tabs */}
            <Tabs
              defaultValue="data"
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="border-b border-zinc-800 px-4 bg-[#15171a] shrink-0">
                <TabsList className="h-9 bg-transparent rounded-none gap-0 p-0">
                  {[
                    {
                      value: "data",
                      label: "Data",
                      dot: "bg-blue-400",
                      icon: <LayoutGrid size={10} />,
                    },
                    {
                      value: "schema",
                      label: "Schema",
                      dot: "bg-violet-400",
                      icon: <Layers size={10} />,
                    },
                    {
                      value: "indexes",
                      label: "Indexes",
                      dot: "bg-emerald-400",
                      icon: <Hash size={10} />,
                    },
                    {
                      value: "relations",
                      label: "Relations",
                      dot: "bg-amber-400",
                      icon: <Activity size={10} />,
                    },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="h-9 px-4 text-[10px] tracking-widest uppercase font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 text-zinc-500 bg-transparent data-[state=active]:bg-transparent flex items-center gap-1.5"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* ── DATA TAB ── */}
              <TabsContent
                value="data"
                className="flex-1 overflow-hidden flex flex-col mt-0"
              >
                {/* Toolbar */}
                <div className="flex items-center gap-4 px-5 py-2.5 border-b border-zinc-800/60 bg-[#15171a] shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    Rows{" "}
                    <span className="text-zinc-300 ml-1">
                      {(data.rows.length * 150).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    Cols{" "}
                    <span className="text-zinc-300 ml-1">
                      {data.columns.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    Size <span className="text-zinc-300 ml-1">2.3 MB</span>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[9px] bg-transparent border-zinc-700 text-zinc-400 hover:border-blue-500 hover:text-zinc-100 font-mono gap-1"
                    >
                      <Download size={9} /> Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[9px] bg-transparent border-zinc-700 text-zinc-400 hover:border-blue-500 hover:text-zinc-100 font-mono gap-1"
                    >
                      <Plus size={9} /> Add Row
                    </Button>
                  </div>
                </div>

                {/* Table */}
                <ScrollArea className="flex-1">
                  <Table>
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="bg-zinc-900 hover:bg-zinc-900 border-zinc-800">
                        <TableHead className="w-10 text-zinc-600 text-[9px] uppercase tracking-widest font-semibold border-r border-zinc-800/60">
                          #
                        </TableHead>
                        {data.columns.map((col, i) => (
                          <TableHead
                            key={col}
                            className="text-[9px] uppercase tracking-widest font-semibold text-zinc-400 border-r border-zinc-800/60 last:border-r-0 cursor-pointer hover:text-zinc-100 hover:bg-zinc-800 transition-colors whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1.5">
                              {col}
                              <span className="px-1 py-0.5 text-[8px] bg-zinc-800 text-zinc-600 border border-zinc-700 rounded font-normal">
                                {data.types[i]}
                              </span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.rows.map((row, ri) => (
                        <TableRow
                          key={ri}
                          onClick={() => toggleRow(ri)}
                          className={`border-zinc-800/40 cursor-pointer transition-colors ${
                            selectedRows.has(ri)
                              ? "bg-blue-500/10 hover:bg-blue-500/15"
                              : "hover:bg-zinc-800/50"
                          }`}
                        >
                          <TableCell className="text-zinc-600 text-[10px] border-r border-zinc-800/40 font-mono">
                            {ri + 1}
                          </TableCell>
                          {row.map((cell, ci) => (
                            <TableCell
                              key={ci}
                              className="border-r border-zinc-800/40 last:border-r-0 py-2"
                            >
                              <CellValue value={cell} colIndex={ci} />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>

              {/* ── SCHEMA TAB ── */}
              <TabsContent
                value="schema"
                className="flex-1 overflow-hidden mt-0"
              >
                <ScrollArea className="h-full">
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
                        Column Definitions —
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${activeTableMeta?.color || "text-blue-400"}`}
                      >
                        {activeTable}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {data.schema.map((col) => (
                        <div
                          key={col.name}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                        >
                          <Tooltip>
                            <TooltipTrigger>
                              <Key
                                size={12}
                                className={
                                  col.pk ? "text-amber-400" : "text-zinc-700"
                                }
                              />
                            </TooltipTrigger>
                            {col.pk && (
                              <TooltipContent>Primary Key</TooltipContent>
                            )}
                          </Tooltip>
                          <span className="flex-1 text-[12px] text-zinc-100 font-mono">
                            {col.name}
                          </span>
                          <Badge className="bg-violet-400/15 text-violet-400 border-0 text-[9px] font-mono">
                            {col.type}
                          </Badge>
                          <Badge
                            className={`text-[9px] border-0 font-mono ${
                              col.nullable
                                ? "bg-zinc-800 text-zinc-500"
                                : "bg-emerald-400/10 text-emerald-400"
                            }`}
                          >
                            {col.nullable ? "NULL" : "NOT NULL"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* ── INDEXES TAB ── */}
              <TabsContent
                value="indexes"
                className="flex-1 overflow-hidden mt-0"
              >
                <ScrollArea className="h-full">
                  <div className="p-5 flex flex-col gap-2">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 pb-3 border-b border-zinc-800">
                      Indexes — {activeTable}
                    </p>
                    {[
                      {
                        name: `${activeTable}_pkey`,
                        cols: ["id"],
                        type: "PRIMARY",
                        unique: true,
                      },
                      {
                        name: `${activeTable}_email_idx`,
                        cols: ["email"],
                        type: "BTREE",
                        unique: true,
                      },
                      {
                        name: `${activeTable}_created_idx`,
                        cols: ["created_at"],
                        type: "BTREE",
                        unique: false,
                      },
                    ].map((idx) => (
                      <div
                        key={idx.name}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800"
                      >
                        <Hash size={12} className="text-emerald-400 shrink-0" />
                        <span className="flex-1 text-[11px] font-mono text-zinc-100">
                          {idx.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {idx.cols.join(", ")}
                        </span>
                        <Badge className="bg-emerald-400/10 text-emerald-400 border-0 text-[9px]">
                          {idx.type}
                        </Badge>
                        {idx.unique && (
                          <Badge className="bg-blue-400/10 text-blue-400 border-0 text-[9px]">
                            UNIQUE
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* ── RELATIONS TAB ── */}
              <TabsContent
                value="relations"
                className="flex-1 overflow-hidden mt-0"
              >
                <ScrollArea className="h-full">
                  <div className="p-5 flex flex-col gap-2">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 pb-3 border-b border-zinc-800">
                      Foreign Keys — {activeTable}
                    </p>
                    {[
                      {
                        from: "customer_id",
                        to: "users.id",
                        action: "CASCADE",
                      },
                      {
                        from: "product_id",
                        to: "products.id",
                        action: "RESTRICT",
                      },
                    ].map((rel, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800"
                      >
                        <Activity
                          size={12}
                          className="text-amber-400 shrink-0"
                        />
                        <span className="text-[11px] font-mono text-violet-400">
                          {rel.from}
                        </span>
                        <span className="text-zinc-600 text-[11px]">→</span>
                        <span className="flex-1 text-[11px] font-mono text-zinc-300">
                          {rel.to}
                        </span>
                        <Badge className="bg-amber-400/10 text-amber-400 border-0 text-[9px]">
                          ON DELETE {rel.action}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {/* ── STATUS BAR ── */}
            <footer className="h-6 flex items-center gap-4 px-4 bg-[#15171a] border-t border-zinc-800 shrink-0 text-[9px] text-zinc-600">
              <span>
                Table <span className="text-zinc-400">{activeTable}</span>
              </span>
              <span>
                Query time <span className="text-zinc-400">12 ms</span>
              </span>
              <span>
                Page <span className="text-zinc-400">1 / 120</span>
              </span>
              <span className="ml-auto">PostgreSQL 14.2 · UTF-8</span>
            </footer>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
