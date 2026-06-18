"use client";

import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Check,
  ClipboardCheck,
  ClipboardCopy,
  Download,
  FileCheck2,
  FileHeart,
  FileText,
  HeartHandshake,
  HeartPulse,
  LifeBuoy,
  LockKeyhole,
  MessageSquareText,
  Route,
  SearchCheck,
  Send,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

type WorkflowId = "death-claim" | "disability-inquiry" | "beneficiary-update";
type Tone = "info" | "success" | "warning" | "critical";

type Detail = {
  label: string;
  value: string;
};

type ChecklistItem = {
  label: string;
  status: "Received" | "Missing" | "Review";
};

type Workflow = {
  id: WorkflowId;
  label: string;
  owner: string;
  channel: string;
  queue: string;
  customer: string;
  product: string;
  policy: string;
  caseType: string;
  lifeEvent: string;
  urgency: string;
  sensitivity: number;
  confidence: number;
  sourceText: string;
  summary: string;
  nextBestAction: string;
  route: string;
  draft: string;
  extracted: Detail[];
  documents: ChecklistItem[];
  riskFlags: string[];
  guardrails: string[];
  evidence: Detail[];
  doNotSay: string[];
};

type TimelineEvent = {
  label: string;
  detail: string;
  tone: Tone;
  time: string;
};

const workflows: Workflow[] = [
  {
    id: "death-claim",
    label: "Death claim intake",
    owner: "Claims intake",
    channel: "Email",
    queue: "Life Claims Intake",
    customer: "Elena Morris",
    product: "Individual life insurance",
    policy: "MLI-4821-7749",
    caseType: "Death claim inquiry",
    lifeEvent: "Bereavement",
    urgency: "High",
    sensitivity: 94,
    confidence: 91,
    sourceText:
      "My husband recently passed away. I found a MetLife policy in his documents and I am not sure what to do next. I have never filed a claim before.",
    summary:
      "The customer appears to be the spouse of the deceased insured and needs first-time guidance on starting a life insurance claim. The case requires careful bereavement tone, identity validation, beneficiary confirmation, and a simple document checklist.",
    nextBestAction:
      "Confirm claimant identity and policy match, send the compassionate claim checklist, then route the case to life claims intake for human review within 24 hours.",
    route: "Life Claims Intake -> Bereavement Support",
    draft:
      "Thank you for reaching out, and I am very sorry for your loss. I can help guide you through the next steps. To begin the claim review, we will need a completed claim form, a certified copy of the death certificate, and your identification. Once those are received, a claims specialist can review the information and keep you updated along the way.",
    extracted: [
      { label: "Insured person", value: "Spouse, name not confirmed" },
      { label: "Claimant relationship", value: "Likely surviving spouse" },
      { label: "Policy indicator", value: "Found policy documents" },
      { label: "Emotional context", value: "Recent death, first claim" },
    ],
    documents: [
      { label: "Certified death certificate", status: "Missing" },
      { label: "Claim form", status: "Missing" },
      { label: "Claimant identification", status: "Missing" },
      { label: "Beneficiary confirmation", status: "Review" },
    ],
    riskFlags: [
      "Beneficiary has not been confirmed.",
      "Employee should avoid confirming payable benefits before eligibility review.",
      "Human review required before claim decision language is sent.",
    ],
    guardrails: [
      "Use compassionate, calm, plain-language phrasing.",
      "Do not promise payment amount, timing, or approval.",
      "Keep document requests specific and limited to the claim stage.",
    ],
    evidence: [
      { label: "Source basis", value: "Customer email, policy mention, bereavement language" },
      { label: "Workflow rule", value: "Life claim intake requires identity, claim form, and death certificate review" },
      { label: "Approval", value: "Human approval required before send" },
    ],
    doNotSay: ["Your claim is approved.", "This is easy.", "Just upload the paperwork."],
  },
  {
    id: "disability-inquiry",
    label: "Disability inquiry",
    owner: "Benefits support",
    channel: "Call transcript",
    queue: "Disability and Absence",
    customer: "Marcus Lee",
    product: "Employer-sponsored disability",
    policy: "GDI-1099-2240",
    caseType: "Disability claim inquiry",
    lifeEvent: "Illness or absence",
    urgency: "Medium-high",
    sensitivity: 78,
    confidence: 88,
    sourceText:
      "I have been out of work for three weeks after surgery. My manager said I may have disability coverage through work, but I do not understand what forms I need or whether I am eligible.",
    summary:
      "The customer is trying to understand disability coverage after surgery and may be eligible through an employer-sponsored plan. The representative should explain process steps without making an eligibility determination, identify missing medical and employer information, and route to disability intake.",
    nextBestAction:
      "Explain the intake process in plain language, request employer plan context and physician statement, then open a disability intake task for benefits review.",
    route: "Benefits Support -> Disability Intake",
    draft:
      "I am sorry you are dealing with this while recovering. I can help outline the next steps. Disability claims usually require basic employee information, employer plan details, and medical documentation from a treating provider. We can start by confirming your coverage source and then provide the forms needed for review.",
    extracted: [
      { label: "Absence length", value: "Three weeks" },
      { label: "Triggering event", value: "Surgery recovery" },
      { label: "Coverage source", value: "Potential employer-sponsored plan" },
      { label: "Customer need", value: "Eligibility and form guidance" },
    ],
    documents: [
      { label: "Employer plan details", status: "Missing" },
      { label: "Physician statement", status: "Missing" },
      { label: "Employee authorization", status: "Review" },
      { label: "Absence dates", status: "Received" },
    ],
    riskFlags: [
      "Customer is asking about eligibility.",
      "Medical information may be sensitive.",
      "Response should not become medical or legal advice.",
    ],
    guardrails: [
      "Explain the process, not a claim outcome.",
      "Ask only for required medical documentation.",
      "Escalate plan-specific eligibility questions to benefits support.",
    ],
    evidence: [
      { label: "Source basis", value: "Call transcript, surgery reference, employer coverage mention" },
      { label: "Workflow rule", value: "Disability intake requires plan confirmation and provider documentation" },
      { label: "Approval", value: "Employee review recommended before send" },
    ],
    doNotSay: ["You are definitely eligible.", "Your surgery will be covered.", "Send all medical records."],
  },
  {
    id: "beneficiary-update",
    label: "Beneficiary update",
    owner: "Policy service",
    channel: "Secure message",
    queue: "Policy Administration",
    customer: "Priya Shah",
    product: "Group life benefits",
    policy: "GLB-7714-0081",
    caseType: "Beneficiary change support",
    lifeEvent: "Family status change",
    urgency: "Medium",
    sensitivity: 66,
    confidence: 86,
    sourceText:
      "I recently got divorced and need to update my beneficiary. I am worried my old information is still on the policy. I am not sure which form applies because my coverage is through my employer.",
    summary:
      "The customer is requesting beneficiary update support after a divorce and is uncertain about employer-sponsored coverage rules. The case should validate account access, identify the correct employer plan path, request the appropriate signed form, and route to policy administration.",
    nextBestAction:
      "Confirm identity and coverage source, provide the employer benefits beneficiary change path, and route the completed request to policy administration.",
    route: "Policy Service -> Employer Benefits Administration",
    draft:
      "Thank you for letting us know. I can help you find the right path to update your beneficiary information. Because your coverage appears to be through your employer, the next step is to confirm the plan source and provide the correct beneficiary change process. We will also need to make sure the required signatures and verification steps are complete before the update is processed.",
    extracted: [
      { label: "Life event", value: "Divorce" },
      { label: "Requested change", value: "Beneficiary update" },
      { label: "Coverage source", value: "Employer-sponsored group life" },
      { label: "Customer concern", value: "Old beneficiary still listed" },
    ],
    documents: [
      { label: "Beneficiary change form", status: "Missing" },
      { label: "Customer identity validation", status: "Review" },
      { label: "Employer plan path", status: "Missing" },
      { label: "Signature confirmation", status: "Missing" },
    ],
    riskFlags: [
      "Beneficiary information is sensitive.",
      "Incorrect routing may delay update.",
      "Change should not be processed without validation.",
    ],
    guardrails: [
      "Do not disclose existing beneficiary details without validation.",
      "Confirm the employer plan process before giving form instructions.",
      "Require signed authorization for updates.",
    ],
    evidence: [
      { label: "Source basis", value: "Secure message, divorce reference, employer plan mention" },
      { label: "Workflow rule", value: "Beneficiary changes require identity validation and signed authorization" },
      { label: "Approval", value: "Policy service review required before update" },
    ],
    doNotSay: ["Your old beneficiary was removed.", "No validation is needed.", "The change is complete."],
  },
];

const initialEvents: TimelineEvent[] = [
  {
    label: "Human moment detected",
    detail: "Bereavement language flagged for high-sensitivity handling.",
    tone: "critical",
    time: "09:42 AM",
  },
  {
    label: "Compliance guardrail loaded",
    detail: "Outcome promises and benefit approval language are restricted.",
    tone: "warning",
    time: "09:41 AM",
  },
  {
    label: "Case intake opened",
    detail: "New customer message entered the LifeBridge AI workspace.",
    tone: "info",
    time: "09:40 AM",
  },
];

const workflowIcons: Record<WorkflowId, LucideIcon> = {
  "death-claim": FileHeart,
  "disability-inquiry": HeartPulse,
  "beneficiary-update": UserRoundCheck,
};

const toneClasses: Record<Tone, string> = {
  info: "border-[#bfdbfe] bg-[#eff6ff] text-[#064f8f]",
  success: "border-[#bfe8d0] bg-[#effaf4] text-[#08703f]",
  warning: "border-[#f8df9b] bg-[#fff8e6] text-[#7c5a00]",
  critical: "border-[#f3c3c3] bg-[#fff1f1] text-[#9b1c1c]",
};

const dotClasses: Record<Tone, string> = {
  info: "bg-[#007abc]",
  success: "bg-[#00a65a]",
  warning: "bg-[#f4b000]",
  critical: "bg-[#d12c2c]",
};

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LifeBridgeMark() {
  return (
    <div className="relative h-11 w-11 shrink-0" aria-hidden>
      <div className="absolute left-1 top-1 h-9 w-5 rounded-br-[18px] rounded-tl-[18px] bg-[#007abc]" />
      <div className="absolute right-1 top-1 h-9 w-5 rounded-bl-[18px] rounded-tr-[18px] bg-[#00a65a]" />
      <div className="absolute left-[15px] top-[11px] h-5 w-3 rounded-full bg-white/90" />
    </div>
  );
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  const degrees = Math.round((value / 100) * 360);
  return (
    <div className="flex items-center gap-4">
      <div
        className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
        style={{ background: `conic-gradient(#007abc ${degrees}deg, #e6eef7 ${degrees}deg)` }}
        aria-label={`${label}: ${value}`}
      >
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-center shadow-sm">
          <span className="text-2xl font-semibold text-[#0b1f33]">{value}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#0b1f33]">{label}</p>
        <p className="mt-1 text-sm leading-6 text-[#536171]">
          Human approval required when sensitivity or compliance risk is high.
        </p>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#d7e3ef] bg-white text-[#007abc]">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#007abc]">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-semibold text-[#0b1f33]">{title}</h2>
      </div>
    </div>
  );
}

function StatusPill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      <span className={`h-2 w-2 rounded-full ${dotClasses[tone]}`} />
      {children}
    </span>
  );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<WorkflowId>("death-claim");
  const [notesByCase, setNotesByCase] = useState<Record<WorkflowId, string>>(() =>
    workflows.reduce((acc, workflow) => {
      acc[workflow.id] = workflow.sourceText;
      return acc;
    }, {} as Record<WorkflowId, string>),
  );
  const [toneMode, setToneMode] = useState<"standard" | "compassionate">("compassionate");
  const [requestedDocs, setRequestedDocs] = useState<Record<WorkflowId, boolean>>({
    "death-claim": false,
    "disability-inquiry": false,
    "beneficiary-update": false,
  });
  const [routedCases, setRoutedCases] = useState<Record<WorkflowId, boolean>>({
    "death-claim": false,
    "disability-inquiry": false,
    "beneficiary-update": false,
  });
  const [reviewedCases, setReviewedCases] = useState<Record<WorkflowId, boolean>>({
    "death-claim": false,
    "disability-inquiry": false,
    "beneficiary-update": false,
  });
  const [analysisCount, setAnalysisCount] = useState(1);
  const [notice, setNotice] = useState("LifeBridge AI is ready. Select a life event case or analyze the active customer message.");
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);

  const selected = workflows.find((workflow) => workflow.id === selectedId) ?? workflows[0];
  const selectedNote = notesByCase[selected.id];
  const SelectedIcon = workflowIcons[selected.id];

  const confidence = useMemo(() => Math.min(99, selected.confidence + analysisCount), [selected.confidence, analysisCount]);
  const docProgress = useMemo(() => {
    const requested = requestedDocs[selected.id];
    return selected.documents.map((doc) => ({
      ...doc,
      status: doc.status === "Missing" && requested ? "Requested" : doc.status,
    }));
  }, [requestedDocs, selected]);

  function addEvent(label: string, detail: string, tone: Tone) {
    const timestamp = addMinutes(new Date(), 0);
    setEvents((current) => [{ label, detail, tone, time: timestamp }, ...current].slice(0, 7));
  }

  function selectWorkflow(id: WorkflowId) {
    const next = workflows.find((workflow) => workflow.id === id);
    if (!next) return;
    setSelectedId(id);
    setNotice(`${next.label} loaded for ${next.owner}. LifeBridge refreshed case summary, tone guidance, and routing rules.`);
    addEvent("Workflow changed", `${next.caseType} is now the active operations workflow.`, "info");
  }

  function analyzeCase() {
    setAnalysisCount((count) => count + 1);
    setNotice(`${selected.caseType} analyzed. ${selected.lifeEvent} detected with ${selected.sensitivity}/100 sensitivity and ${confidence}/100 confidence.`);
    addEvent("Case analyzed", `${selected.caseType} classified from ${selected.channel.toLowerCase()} input with audit-ready rationale.`, selected.sensitivity > 85 ? "critical" : "info");
  }

  function applyCompassionateTone() {
    setToneMode("compassionate");
    setNotice(`Compassionate tone applied. Draft language now prioritizes warmth, clarity, and no outcome promises.`);
    addEvent("Tone guardrail applied", `${selected.customer} response draft updated with human moment language.`, "success");
  }

  function requestMissingDocuments() {
    setRequestedDocs((current) => ({ ...current, [selected.id]: true }));
    setNotice(`Document checklist sent for ${selected.customer}. Missing items are marked requested and logged.`);
    addEvent("Documents requested", `${selected.documents.filter((doc) => doc.status === "Missing").length} missing item(s) requested for ${selected.caseType}.`, "warning");
  }

  function routeCase() {
    setRoutedCases((current) => ({ ...current, [selected.id]: true }));
    setNotice(`${selected.customer} routed to ${selected.route}. Queue owner can review the LifeBridge evidence packet.`);
    addEvent("Case routed", `${selected.caseType} routed to ${selected.route}.`, "success");
  }

  function escalateForReview() {
    setReviewedCases((current) => ({ ...current, [selected.id]: true }));
    setNotice(`Human review checkpoint created. Compliance reviewer must approve the response before customer send.`);
    addEvent("Human review required", `${selected.caseType} locked for employee approval and compliance traceability.`, "critical");
  }

  async function copyDraft() {
    try {
      await navigator.clipboard?.writeText(selected.draft);
    } catch {
      // Clipboard can be unavailable in hardened browser contexts; the UI still records the employee action.
    }
    setNotice(`Response draft prepared for ${selected.customer}. Employee can review and send from the case workspace.`);
    addEvent("Draft prepared", `${selected.caseType} response draft copied or staged for employee review.`, "info");
  }

  function exportBrief() {
    const brief = {
      product: "LifeBridge AI",
      domain: "metlife.asion.ai",
      workflow: selected.label,
      customer: selected.customer,
      summary: selected.summary,
      nextBestAction: selected.nextBestAction,
      route: selected.route,
      evidence: selected.evidence,
      guardrails: selected.guardrails,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${selected.id}-lifebridge-case-brief.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice(`Case brief exported for ${selected.customer}.`);
    addEvent("Case brief exported", `${selected.caseType} packet exported with summary, actions, evidence, and guardrails.`, "info");
  }

  function logQaReview() {
    setNotice(`QA review logged. The case is marked ready for service quality sampling.`);
    addEvent("QA review logged", `${selected.owner} quality review recorded for ${selected.caseType}.`, "success");
  }

  return (
    <main className="min-h-screen bg-[#f5f8fb] text-[#0b1f33]">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[linear-gradient(120deg,rgba(0,122,188,0.16),rgba(0,166,90,0.12),transparent_64%)]" />
      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[#d8e3ee] bg-white/70 pb-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <LifeBridgeMark />
            <div>
              <p className="text-sm font-semibold text-[#536171]">metlife.asion.ai</p>
              <h1 className="text-2xl font-semibold tracking-normal text-[#0b1f33] sm:text-3xl">LifeBridge AI</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="success">Human-reviewed workflow</StatusPill>
            <StatusPill tone="info">Audit trail active</StatusPill>
            <span className="rounded-full border border-[#d7e3ef] bg-white px-3 py-1 text-xs font-semibold text-[#536171]">
              Concept demo, not affiliated with MetLife
            </span>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#007abc]">Day 18</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0b1f33]">Life event workflows</h2>
            <p className="mt-2 text-sm leading-6 text-[#536171]">
              Internal agent console for service, claims, benefits, and policy support teams.
            </p>
            <div className="mt-4 space-y-2">
              {workflows.map((workflow) => {
                const Icon = workflowIcons[workflow.id];
                const active = workflow.id === selected.id;
                return (
                  <button
                    key={workflow.id}
                    type="button"
                    data-testid={`workflow-${workflow.id}`}
                    onClick={() => selectWorkflow(workflow.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                      active
                        ? "border-[#007abc] bg-[#eaf6fd] text-[#064f8f]"
                        : "border-[#e2e8f0] bg-white text-[#334155] hover:border-[#9cc9e5] hover:bg-[#f7fbfe]"
                    }`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#007abc] shadow-sm">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{workflow.label}</span>
                      <span className="mt-0.5 block text-xs text-[#64748b]">{workflow.owner}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-[#d7e3ef] bg-[#f8fbfe] p-4">
              <p className="text-sm font-semibold text-[#0b1f33]">Operating thesis</p>
              <p className="mt-2 text-sm leading-6 text-[#536171]">
                Customers need empathy and clarity. Teams need speed, structure, compliance, and an evidence trail.
              </p>
            </div>
          </aside>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
            <section className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#007abc]">Command center</p>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal text-[#0b1f33] sm:text-4xl">
                    Turn sensitive life events into clear next steps.
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[#536171]">
                    LifeBridge AI classifies the customer life event, extracts policy context, recommends the next best action, drafts a compassionate response, and records why the recommendation is compliant.
                  </p>
                </div>
                <div className="grid min-w-48 gap-2 rounded-lg border border-[#d7e3ef] bg-[#f8fbfe] p-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-[#536171]">Open case</span>
                    <span className="font-mono text-sm font-semibold text-[#0b1f33]">{selected.policy}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-[#536171]">Channel</span>
                    <span className="text-sm font-semibold text-[#0b1f33]">{selected.channel}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-[#536171]">Queue</span>
                    <span className="text-sm font-semibold text-[#0b1f33]">{routedCases[selected.id] ? "Routed" : "Pending"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-lg border border-[#d7e3ef] bg-[#fbfdff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#007abc]" aria-hidden />
                      <h3 className="font-semibold text-[#0b1f33]">Customer input</h3>
                    </div>
                    <StatusPill tone={selected.sensitivity > 85 ? "critical" : "warning"}>{selected.urgency} urgency</StatusPill>
                  </div>
                  <textarea
                    data-testid="customer-input"
                    value={selectedNote}
                    onChange={(event) => setNotesByCase((current) => ({ ...current, [selected.id]: event.target.value }))}
                    className="mt-4 min-h-36 w-full resize-none rounded-lg border border-[#cbd8e4] bg-white p-4 text-sm leading-6 text-[#0b1f33] outline-none transition focus:border-[#007abc] focus:ring-4 focus:ring-[#007abc]/15"
                    aria-label="Customer input"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      data-testid="analyze-case"
                      onClick={analyzeCase}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#007abc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005f95]"
                    >
                      <SearchCheck className="h-4 w-4" aria-hidden />
                      Analyze case
                    </button>
                    <button
                      type="button"
                      data-testid="apply-tone"
                      onClick={applyCompassionateTone}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#b9d7ea] bg-white px-4 py-2.5 text-sm font-semibold text-[#064f8f] transition hover:bg-[#eaf6fd]"
                    >
                      <HeartHandshake className="h-4 w-4" aria-hidden />
                      Apply compassionate tone
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-[#d7e3ef] bg-white p-4">
                  <SectionTitle icon={Sparkles} eyebrow="Human moment" title="Sensitivity detection" />
                  <div className="mt-5">
                    <ScoreRing value={selected.sensitivity} label="Emotional sensitivity" />
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#536171]">Case confidence</span>
                      <span className="font-mono text-sm font-semibold text-[#0b1f33]">{confidence}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e6eef7]">
                      <div className="h-2 rounded-full bg-[#00a65a]" style={{ width: `${confidence}%` }} />
                    </div>
                  </div>
                  <div className="mt-5 rounded-lg border border-[#d7e3ef] bg-[#f8fbfe] p-3">
                    <p className="text-sm font-semibold text-[#0b1f33]">Recommended tone</p>
                    <p className="mt-1 text-sm leading-6 text-[#536171]">
                      {toneMode === "compassionate" ? "Compassionate, calm, clear, non-promissory." : "Standard service tone."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle icon={LifeBuoy} eyebrow="AI understanding" title={selected.caseType} />
              <div className="mt-5 flex flex-wrap gap-2">
                <StatusPill tone="info">{selected.lifeEvent}</StatusPill>
                <StatusPill tone={selected.sensitivity > 85 ? "critical" : "warning"}>{selected.urgency}</StatusPill>
                <StatusPill tone="success">{confidence}% confidence</StatusPill>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#536171]">{selected.summary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {selected.extracted.map((item) => (
                  <div key={item.label} className="rounded-lg border border-[#e2e8f0] bg-[#fbfdff] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-[#0b1f33]">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle icon={Route} eyebrow="Recommended actions" title="Move the case forward" />
              <div className="mt-5 rounded-lg border border-[#d7e3ef] bg-[#f8fbfe] p-4">
                <p className="text-sm font-semibold text-[#0b1f33]">Next best action</p>
                <p className="mt-2 text-sm leading-6 text-[#536171]">{selected.nextBestAction}</p>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  data-testid="request-documents"
                  onClick={requestMissingDocuments}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00a65a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#078848]"
                >
                  <FileCheck2 className="h-4 w-4" aria-hidden />
                  Request documents
                </button>
                <button
                  type="button"
                  data-testid="route-case"
                  onClick={routeCase}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#007abc] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#005f95]"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  Route case
                </button>
                <button
                  type="button"
                  data-testid="escalate-review"
                  onClick={escalateForReview}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#f0c7c7] bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#9b1c1c] transition hover:bg-[#ffecec]"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  Escalate review
                </button>
                <button
                  type="button"
                  data-testid="qa-review"
                  onClick={logQaReview}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#b9d7ea] bg-white px-4 py-3 text-sm font-semibold text-[#064f8f] transition hover:bg-[#eaf6fd]"
                >
                  <ClipboardCheck className="h-4 w-4" aria-hidden />
                  Log QA review
                </button>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-[#0b1f33]">Document checklist</p>
                <div className="mt-3 space-y-2">
                  {docProgress.map((doc) => (
                    <div key={doc.label} className="flex items-center justify-between gap-3 rounded-lg border border-[#e2e8f0] bg-[#fbfdff] px-3 py-2">
                      <span className="text-sm text-[#334155]">{doc.label}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${doc.status === "Received" ? "bg-[#e8f7ee] text-[#08703f]" : doc.status === "Review" ? "bg-[#fff8e6] text-[#7c5a00]" : doc.status === "Requested" ? "bg-[#eaf6fd] text-[#064f8f]" : "bg-[#fff1f1] text-[#9b1c1c]"}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle icon={MessageSquareText} eyebrow="Customer response" title="Compassionate draft" />
              <div className="mt-5 rounded-lg border border-[#d7e3ef] bg-[#fbfdff] p-4">
                <p className="text-sm leading-7 text-[#0b1f33]">{selected.draft}</p>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  data-testid="copy-draft"
                  onClick={copyDraft}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#007abc] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#005f95]"
                >
                  <ClipboardCopy className="h-4 w-4" aria-hidden />
                  Copy draft
                </button>
                <button
                  type="button"
                  data-testid="export-brief"
                  onClick={exportBrief}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#b9d7ea] bg-white px-4 py-3 text-sm font-semibold text-[#064f8f] transition hover:bg-[#eaf6fd]"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Export brief
                </button>
              </div>
              <div className="mt-5">
                <p className="text-sm font-semibold text-[#0b1f33]">Do not say</p>
                <div className="mt-3 space-y-2">
                  {selected.doNotSay.map((phrase) => (
                    <div key={phrase} className="flex gap-2 rounded-lg border border-[#f0c7c7] bg-[#fff5f5] px-3 py-2 text-sm text-[#7f1d1d]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      <span>{phrase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
              <SectionTitle icon={LockKeyhole} eyebrow="Compliance and evidence" title="Why LifeBridge recommends this" />
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-[#0b1f33]">Source basis</p>
                  <div className="mt-3 space-y-2">
                    {selected.evidence.map((item) => (
                      <div key={item.label} className="rounded-lg border border-[#e2e8f0] bg-[#fbfdff] p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-[#334155]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0b1f33]">Guardrails</p>
                  <div className="mt-3 space-y-2">
                    {selected.guardrails.map((guardrail) => (
                      <div key={guardrail} className="flex gap-2 rounded-lg border border-[#d7e3ef] bg-[#f8fbfe] px-3 py-2 text-sm leading-6 text-[#334155]">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#00a65a]" aria-hidden />
                        <span>{guardrail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0b1f33]">Risk flags</p>
                  <div className="mt-3 space-y-2">
                    {selected.riskFlags.map((flag) => (
                      <div key={flag} className="flex gap-2 rounded-lg border border-[#f8df9b] bg-[#fff8e6] px-3 py-2 text-sm leading-6 text-[#5f4600]">
                        <AlertTriangle className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle icon={Activity} eyebrow="Case status" title="Operations pulse" />
              <div className="mt-5 grid gap-3">
                <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fbfdff] px-3 py-3">
                  <span className="text-sm text-[#536171]">Route</span>
                  <span className="text-sm font-semibold text-[#0b1f33]">{routedCases[selected.id] ? selected.queue : "Not routed"}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fbfdff] px-3 py-3">
                  <span className="text-sm text-[#536171]">Review</span>
                  <span className="text-sm font-semibold text-[#0b1f33]">{reviewedCases[selected.id] ? "Required" : "Pending"}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fbfdff] px-3 py-3">
                  <span className="text-sm text-[#536171]">Documents</span>
                  <span className="text-sm font-semibold text-[#0b1f33]">{requestedDocs[selected.id] ? "Requested" : "Open"}</span>
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-[#cfe6d9] bg-[#f0faf4] p-4">
                <div className="flex items-center gap-3">
                  <SelectedIcon className="h-5 w-5 text-[#00a65a]" aria-hidden />
                  <p className="font-semibold text-[#0b1f33]">{selected.customer}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#536171]">{selected.product}</p>
              </div>
            </section>

            <section className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle icon={Users} eyebrow="Audit trail" title="Employee-visible rationale" />
              <div className="mt-5 space-y-3">
                {events.map((event, index) => (
                  <div key={`${event.label}-${event.time}-${index}`} className="flex gap-3 rounded-lg border border-[#e2e8f0] bg-[#fbfdff] p-3">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotClasses[event.tone]}`} />
                    <div>
                      <p className="font-mono text-xs text-[#64748b]">{event.time}</p>
                      <p className="mt-1 text-sm font-semibold text-[#0b1f33]">{event.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[#536171]">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="rounded-lg border border-[#d7e3ef] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#007abc]">Workspace notice</p>
              <p data-testid="workspace-notice" className="mt-1 text-sm font-semibold leading-6 text-[#0b1f33]">
                {notice}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#536171]">
              <BadgeCheck className="h-5 w-5 text-[#00a65a]" aria-hidden />
              <span>Employee stays in control. LifeBridge suggests, explains, and records.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
