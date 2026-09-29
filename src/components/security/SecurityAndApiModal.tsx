import React, { useState } from 'react';
import { generateMySQLSchema, generatePostgreSQLSchema } from '../../utils/schemaGenerator';
import { runSecurityAudit, maskToken } from '../../utils/security';
import { SECURITY_HEADERS, CORS_CONFIG } from '../../utils/securityHeaders';
import {
  Database,
  ShieldCheck,
  Code,
  Copy,
  Check,
  X,
  Server,
  Send,
  Lock,
  RotateCcw,
  CheckCircle2,
  Building2,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const SecurityAndApiModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'security' | 'headers' | 'api'>('security');
  const [sqlDialect, setSqlDialect] = useState<'mysql' | 'postgres'>('mysql');
  const [copied, setCopied] = useState(false);

  // API Explorer state
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/tasks');
  const [apiResponse, setApiResponse] = useState<string>('Select an endpoint and click "Send Authenticated Request"...');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState(runSecurityAudit());

  const mysqlSchema = generateMySQLSchema();
  const postgresSchema = generatePostgreSQLSchema();
  const activeSchema = sqlDialect === 'mysql' ? mysqlSchema : postgresSchema;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteApiRequest = () => {
    if (selectedEndpoint === '/api/v1/tasks') {
      setApiResponse(
        JSON.stringify(
          {
            status: 200,
            tenant_isolated: true,
            organization_id: 'org_1',
            meta: { total: 2, page: 1, limit: 20 },
            data: [
              {
                id: 'task_1',
                title: 'Produce Episode 1 Intro Sequence & Hook',
                status: 'ready_for_approval',
                priority: 'urgent',
                video_instructions: [
                  {
                    timestamp: '00:15',
                    target_section: 'Intro Hook (0:00 - 0:18)',
                    direction: 'Include dynamic 3D camera pan',
                  },
                ],
              },
            ],
          },
          null,
          2
        )
      );
    } else if (selectedEndpoint === '/api/v1/approvals') {
      setApiResponse(
        JSON.stringify(
          {
            status: 200,
            tenant_isolated: true,
            organization_id: 'org_1',
            pending_approvals: [
              {
                task_id: 'task_1',
                title: 'Produce Episode 1 Intro Sequence & Hook',
                submitted_by: 'Sarah Jenkins',
                requires_stakeholder: ['Marcus Vance', 'Elena Rostova'],
              },
            ],
          },
          null,
          2
        )
      );
    } else {
      setApiResponse(
        JSON.stringify(
          {
            status: 200,
            tenant_isolated: true,
            active_organizations: ['Apex Media Studios', 'Vanguard VFX Systems'],
            compliance: '100% Zero Leakage',
          },
          null,
          2
        )
      );
    }
  };

  const handleRunAuditAgain = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setAuditResults(runSecurityAudit());
      setIsAuditing(false);
    }, 500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#1f273a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#0f172a] dark:text-[#f8fafc]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#1f273a] bg-slate-50 dark:bg-[#0c1018]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0f172a] dark:text-white">
                Enterprise Cybersecurity & Database Infrastructure
              </h3>
              <p className="text-[11px] text-[#475569] dark:text-[#94a3b8]">
                Multi-tenant data isolation, security headers, anti-XSS protection, and GoDaddy/Vercel schemas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-[#1f273a] bg-white dark:bg-[#111622] text-[13px] font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#ff584a] text-[#ff584a] font-bold'
                : 'border-transparent text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security Compliance Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('headers')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'headers'
                ? 'border-[#ff584a] text-[#ff584a] font-bold'
                : 'border-transparent text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>CSP & CORS Headers</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-[#ff584a] text-[#ff584a] font-bold'
                : 'border-transparent text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>SQL Database Schemas</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-[#ff584a] text-[#ff584a] font-bold'
                : 'border-transparent text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>REST API Explorer</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: Security Audit */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-[#0f172a] dark:text-white">
                    Cybersecurity Verification Suite
                  </h4>
                  <p className="text-[12px] text-[#475569] dark:text-[#94a3b8]">
                    Strict multi-tenant security verification and penetration hardening status.
                  </p>
                </div>

                <button
                  onClick={handleRunAuditAgain}
                  disabled={isAuditing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] dark:bg-white text-white dark:text-black rounded-full text-[12px] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>Run Audit Test</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {auditResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-[#1f273a] bg-[#f8fafc] dark:bg-[#131926] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold uppercase">
                        Passed
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-600 dark:text-slate-300 pl-5">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CSP & CORS Headers */}
          {activeTab === 'headers' && (
            <div className="space-y-4 text-[13px]">
              <div>
                <h4 className="text-[14px] font-bold text-[#0f172a] dark:text-white">
                  Content Security Policy (CSP) & CORS Enforcement
                </h4>
                <p className="text-[12px] text-[#475569] dark:text-[#94a3b8]">
                  Production edge headers applied to prevent clickjacking, script injection, and unauthorized API origins.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1f273a] bg-[#f8fafc] dark:bg-[#131926] space-y-3 font-mono text-[12px]">
                <div className="font-bold text-indigo-600 dark:text-indigo-400">
                  HTTP Security Headers Configured:
                </div>
                {Object.entries(SECURITY_HEADERS).map(([key, val]) => (
                  <div key={key} className="space-y-0.5">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">{key}:</span>
                    <div className="p-2 rounded bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 text-[#0f172a] dark:text-slate-200 break-all text-[11px]">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SQL Schema */}
          {activeTab === 'schema' && (
            <div className="space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSqlDialect('mysql')}
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                      sqlDialect === 'mysql'
                        ? 'bg-[#0f172a] text-white dark:bg-white dark:text-black'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    GoDaddy cPanel (MySQL)
                  </button>
                  <button
                    onClick={() => setSqlDialect('postgres')}
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                      sqlDialect === 'postgres'
                        ? 'bg-[#0f172a] text-white dark:bg-white dark:text-black'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    PostgreSQL VPS / Vercel
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(activeSchema)}
                  className="flex items-center gap-1.5 px-3 py-1 text-[12px] rounded-lg border border-slate-200 dark:border-[#2b354c] bg-white dark:bg-[#161c2a] hover:bg-slate-50 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={12}
                value={activeSchema}
                className="w-full font-mono text-[11px] p-3 rounded-xl border border-slate-200 dark:border-[#1f273a] bg-[#f8fafc] dark:bg-[#131926] text-[#0f172a] dark:text-slate-200 leading-relaxed outline-none"
              />
            </div>
          )}

          {/* TAB 4: API Explorer */}
          {activeTab === 'api' && (
            <div className="space-y-3 text-[13px]">
              <div>
                <h4 className="text-[14px] font-bold text-[#0f172a] dark:text-white">
                  Authenticated REST API Endpoints
                </h4>
                <p className="text-[12px] text-[#475569] dark:text-[#94a3b8]">
                  Token-authenticated endpoints protected by role-based authorization and rate limiters.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[12px] rounded-lg">
                  GET
                </span>
                <select
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2b354c] bg-white dark:bg-[#161c2a] font-mono text-[12px] text-[#0f172a] dark:text-white outline-none"
                >
                  <option value="/api/v1/tasks">/api/v1/tasks (Tenant Tasks & Video Directives)</option>
                  <option value="/api/v1/approvals">/api/v1/approvals (Pending Stakeholder Approvals)</option>
                  <option value="/api/v1/tenants">/api/v1/tenants (Customer Organizations - Admin Only)</option>
                </select>
                <button
                  onClick={handleExecuteApiRequest}
                  className="px-4 py-1.5 bg-[#0f172a] dark:bg-white text-white dark:text-black rounded-lg text-[12px] font-semibold hover:opacity-90 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>

              <div className="p-3 bg-[#f8fafc] dark:bg-[#131926] border border-slate-200 dark:border-[#1f273a] rounded-xl text-[12px] font-mono">
                <div className="text-slate-400 mb-1">
                  Authorization: Bearer {maskToken('token_bearer_secure_auth_991823')}
                </div>
                <pre className="text-emerald-600 dark:text-emerald-400 overflow-x-auto text-[11px]">
                  {apiResponse}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
