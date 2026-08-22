import React, { useEffect, useState } from 'react';
import { fetchSuperAdminUsers, deleteSuperAdminUser } from '@/lib/api';
import { ShieldCheck, User, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadUsers = () => {
    fetchSuperAdminUsers()
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
        setMsg({ type: 'error', text: 'Failed to load user accounts. Super Admin access required.' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Are you sure you want to permanently delete user '${username}' and all associated portfolio data?`)) {
      return;
    }

    try {
      await deleteSuperAdminUser(id);
      setMsg({ type: 'success', text: `User '${username}' and all associated data deleted successfully.` });
      loadUsers();
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: `Failed to delete user '${username}'.` });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Super Admin Control Center
        </div>
        <h1 className="text-3xl font-extrabold text-white">Registered Users & Portfolio Management</h1>
        <p className="text-sm text-gray-400 mt-1">Super Admin global view: Review, manage, or remove any portfolio user account.</p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500 text-sm">Loading registered portfolio users...</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No registered user accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/80 border-b border-gray-800 text-xs uppercase text-gray-400 font-semibold">
                <tr>
                  <th className="py-4 px-6">User ID</th>
                  <th className="py-4 px-6">Username / Slug</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">System Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-400">#{u.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 text-xs">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{u.username}</p>
                          <a href={`/u/${u.username}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 hover:underline">
                            /u/{u.username}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-xs">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        u.role === 'ROLE_SUPER_ADMIN'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.role !== 'ROLE_SUPER_ADMIN' ? (
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500 font-semibold italic">Protected Super Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
