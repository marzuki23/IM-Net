"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface RequestItem {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  requestType: string;
  desiredPackage: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: "approve" | "reject") => {
    try {
      setActionLoading(requestId);
      const res = await fetch("/api/admin/requests/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      if (res.ok) {
        // Optimistic update
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId 
                ? { ...r, status: action === "approve" ? "approved" : "rejected" } 
                : r
          )
        );
      } else {
        alert("Failed to process request");
      }
    } catch (error) {
      console.error("Failed to process request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Pengajuan Pemasangan
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Daftar permintaan pemasangan baru atau perubahan paket
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Tidak ada pengajuan pending
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div>
                            <p className="font-medium">{req.user.name}</p>
                            <p className="text-xs text-slate-500">{req.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline">{req.requestType}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-orange-600">
                        {req.desiredPackage}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={req.reason}>
                        {req.reason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            req.status === "approved"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : req.status === "pending"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(req.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {req.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 hover:bg-green-50 text-green-700"
                              onClick={() => handleAction(req.id, "approve")}
                              disabled={actionLoading === req.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Terima
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 hover:bg-red-50 text-red-700"
                              onClick={() => handleAction(req.id, "reject")}
                              disabled={actionLoading === req.id}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Tolak
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
