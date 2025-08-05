// src/pages/CreateCampaign.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCampaigns } from "../features/campaign/campaignSlice";
import { fetchLists } from "../features/list/listThunks";
import { fetchTemplates } from "../features/template/templateThunks";
import axios from "../api/axios";
import { toast } from "react-toastify";

const CHANNELS = [
  { label: "WhatsApp", value: "whatsapp" },
  { label: "SMS", value: "sms" },
  { label: "Email", value: "email" },
];

const REPEAT_FREQUENCIES = ["Day", "Week", "Month"];

const STEPS = [
  "Select Channels",
  "Campaign Details",
  "Select Audience",
  "Recipients",
  "Template",
  "Repeat Settings",
];

const CreateCampaign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lists } = useSelector((state) => state.list);
  const { templates } = useSelector((state) => state.template);
  const { page, limit, nameFilter } = useSelector((state) => state.campaign);

  // Step state
  const [step, setStep] = useState(1);

  // Form states
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startHour, setStartHour] = useState("00");
  const [startMinute, setStartMinute] = useState("00");
  const [emailFrom, setEmailFrom] = useState("");
  const [repeat, setRepeat] = useState(false);

  const [selectedAudience, setSelectedAudience] = useState(null);

  const [recipientsTo, setRecipientsTo] = useState([]);
  const [recipientsCc, setRecipientsCc] = useState([]);
  const [recipientsBcc, setRecipientsBcc] = useState([]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [repeatFrequency, setRepeatFrequency] = useState("Day");
  const [repeatEndsOn, setRepeatEndsOn] = useState("never");
  const [repeatEndDate, setRepeatEndDate] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchLists({ page: 1, limit: 100 }));
    dispatch(fetchTemplates({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Friendly email parsing utility
  const sanitizeEmails = (input) =>
    input
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

  const toggleChannel = (channel) => {
    setSelectedChannels((val) =>
      val.includes(channel)
        ? val.filter((c) => c !== channel)
        : [...val, channel]
    );
  };

  const handleNext = () => {
    switch (step) {
      case 1:
        if (!selectedChannels.length) {
          toast.warn("Please select at least one channel");
          return;
        }
        break;
      case 2:
        if (!campaignName.trim()) {
          toast.warn("Campaign name is required");
          return;
        }
        if (selectedChannels.includes("email") && !emailFrom.trim()) {
          toast.warn("Email 'From' is required");
          return;
        }
        if (!startDate) {
          toast.warn("Start date is required");
          return;
        }
        break;
      case 3:
        if (!selectedAudience) {
          toast.warn("Please select an audience list");
          return;
        }
        break;
      case 4:
        if (!recipientsTo.length) {
          toast.warn("Please add at least one 'To' recipient");
          return;
        }
        break;
      case 5:
        if (!selectedTemplate) {
          toast.warn("Please select a template");
          return;
        }
        break;
      case 6:
        if (repeat && repeatEndsOn === "on" && !repeatEndDate) {
          toast.warn("Please select a repeat end date or choose 'Never'");
          return;
        }
        break;
      default:
        break;
    }

    if (step === 5 && !repeat) {
      saveCampaign("Published");
    } else {
      setStep((s) => Math.min(s + 1, repeat ? 6 : 5));
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/campaigns");
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const saveCampaign = async (status) => {
    setSaving(true);
    try {
      const datetime = new Date(
        `${startDate}T${startHour.padStart(2, "0")}:${startMinute.padStart(2, "0")}:00`
      );

      const payload = {
        name: campaignName.trim(),
        channel: selectedChannels.join(","),
        status,
        startDate: datetime.toISOString(),
        repeat,
        audienceListId: selectedAudience ? selectedAudience.id : null,
        recipients: {
          to: recipientsTo,
          cc: recipientsCc,
          bcc: recipientsBcc,
        },
        templateId: selectedTemplate ? selectedTemplate.id : null,
        repeatFrequency: repeat ? repeatFrequency : null,
        repeatEndsOn: repeat ? repeatEndsOn : null,
        repeatEndDate: repeat && repeatEndsOn === "on" ? repeatEndDate : null,
        emailFrom: emailFrom.trim(),
      };

      await axios.post("/campaign/create", payload);

      toast.success(`Campaign ${status === "Published" ? "published" : "saved as draft"} successfully.`);
      dispatch(fetchCampaigns({ page, limit, name: nameFilter }));
      navigate("/campaigns");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save campaign");
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = () => saveCampaign("Draft");

  const StepSidebar = () => (
    <nav aria-label="Progress" className="w-48 border-r border-gray-300 pr-6 sticky top-20 self-start">
      <h2 className="font-semibold mb-4 text-gray-700 text-lg">Steps</h2>
      <ol className="list-decimal list-inside space-y-3 text-sm">
        {STEPS.map((stepLabel, idx) => {
          let state = "upcoming";
          if (idx + 1 < step) state = "completed";
          else if (idx + 1 === step) state = "current";

          return (
            <li
              key={stepLabel}
              className={
                state === "completed"
                  ? "text-green-600 font-semibold"
                  : state === "current"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-400"
              }
              aria-current={state === "current" ? "step" : undefined}
            >
              {stepLabel} {state === "completed" ? "✓" : ""}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <div className="min-h-screen bg-white p-8 max-w-7xl mx-auto rounded shadow flex gap-8">
      <StepSidebar />
      <main className="flex-grow overflow-auto max-h-[90vh]" tabIndex={-1}>
        <header className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 border-b border-gray-200 py-4">
          <h1 className="text-2xl font-semibold">Create Campaign - Step {step} of {repeat ? 6 : 5}</h1>
          <button
            onClick={() => navigate("/campaigns")}
            className="text-blue-600 hover:underline"
            aria-label="Back to campaigns"
          >
            ← Back to campaigns
          </button>
        </header>

        {/* Step 1 - Channels */}
        {step === 1 && (
          <section>
            <p className="mb-4 font-semibold">Select Channels</p>
            <div className="flex flex-wrap gap-4">
              {CHANNELS.map(({ label, value }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 px-4 py-2 border rounded cursor-pointer select-none ${
                    selectedChannels.includes(value)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:border-blue-600"
                  }`}
                >
                  <input
                    className="hidden"
                    type="checkbox"
                    checked={selectedChannels.includes(value)}
                    onChange={() => toggleChannel(value)}
                    aria-checked={selectedChannels.includes(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>
        )}

        {/* Step 2 - Campaign Details */}
        {step === 2 && (
          <section className="space-y-6 max-w-lg">
            <label>
              <span className="block font-semibold mb-1">Campaign Name <span className="text-red-600">*</span></span>
              <input
                className="input input-bordered w-full"
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                maxLength={255}
                required
                autoFocus
              />
            </label>

            <label>
              <span className="block font-semibold mb-1">Start Date <span className="text-red-600">*</span></span>
              <input
                className="input input-bordered w-full"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>

            <div className="flex gap-4">
              <label className="flex-grow">
                <span className="block font-semibold mb-1">Hour</span>
                <select
                  className="select select-bordered w-full"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  aria-label="Select hour"
                >
                  {[...Array(24)].map((num) => {
                    const val = num.toString().padStart(2, "0");
                    return (
                      <option key={num} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label className="flex-grow">
                <span className="block font-semibold mb-1">Minute</span>
                <select
                  className="select select-bordered w-full"
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  aria-label="Select minute"
                >
                  {[...Array(60)].map((num) => {
                    const val = num.toString().padStart(2, "0");
                    return (
                      <option key={num} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            {selectedChannels.includes("email") && (
              <label>
                <span className="block font-semibold mb-1">Email From <span className="text-red-600">*</span></span>
                <input
                  className="input input-bordered w-full"
                  type="email"
                  value={emailFrom}
                  onChange={(e) => setEmailFrom(e.target.value)}
                  required
                />
              </label>
            )}

            <label className="flex items-center gap-2">
              <input
                className="checkbox"
                type="checkbox"
                checked={repeat}
                onChange={(e) => setRepeat(e.target.checked)}
              />
              Repeat campaign
            </label>
          </section>
        )}

        {/* Step 3 - Audience */}
        {step === 3 && (
          <section>
            <p className="mb-4 font-semibold">Select Audience List</p>
            {lists.length === 0 ? (
              <p>No audience lists found.</p>
            ) : (
              <select
                className="select select-bordered w-full max-w-lg"
                value={selectedAudience ? selectedAudience.id : ""}
                onChange={(e) =>
                  setSelectedAudience(
                    lists.find((list) => list.id === Number(e.target.value))
                  )
                }
                aria-label="Select Audience List"
              >
                <option value="">-- Select Audience List --</option>
                {lists.map(({ id, name, audienceCount }) => (
                  <option key={id} value={id}>
                    {name} ({audienceCount})
                  </option>
                ))}
              </select>
            )}
            <button
              className="btn btn-sm mt-2"
              onClick={() => navigate("/list/create")}
            >
              + Add New List
            </button>
          </section>
        )}

        {/* Step 4 - Recipients */}
        {step === 4 && (
          <section className="space-y-4 max-w-lg">
            <label>
              <span className="block font-semibold mb-1">Recipients - To <span className="text-red-600">*</span></span>
              <input
                className="input input-bordered w-full"
                type="text"
                value={recipientsTo.join(", ")}
                onChange={(e) => setRecipientsTo(sanitizeEmails(e.target.value))}
                required
              />
            </label>
            <label>
              <span className="block font-semibold mb-1">Recipients - CC</span>
              <input
                className="input input-bordered w-full"
                type="text"
                value={recipientsCc.join(", ")}
                onChange={(e) => setRecipientsCc(sanitizeEmails(e.target.value))}
              />
            </label>
            <label>
              <span className="block font-semibold mb-1">Recipients - BCC</span>
              <input
                className="input input-bordered w-full"
                type="text"
                value={recipientsBcc.join(", ")}
                onChange={(e) => setRecipientsBcc(sanitizeEmails(e.target.value))}
              />
            </label>

            <div className="flex gap-4">
              <button
                className="btn btn-secondary flex-grow"
                onClick={saveDraft}
                disabled={saving}
              >
                {saving ? "Saving draft..." : "Save Draft"}
              </button>
              <button
                className="btn btn-primary flex-grow"
                onClick={handleNext}
                disabled={saving}
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {/* Step 5 - Template */}
        {step === 5 && (
          <section>
            <p className="mb-4 font-semibold">Select Template</p>
            {templates.length === 0 ? (
              <p>No templates found.</p>
            ) : (
              <select
                className="select select-bordered w-full max-w-lg"
                value={selectedTemplate ? selectedTemplate.id : ""}
                onChange={(e) =>
                  setSelectedTemplate(
                    templates.find((tpl) => tpl.id === Number(e.target.value))
                  )
                }
              >
                <option value="">-- Select Template --</option>
                {templates.map(({ id, title, status }) => (
                  <option key={id} value={id}>
                    {title} ({status})
                  </option>
                ))}
              </select>
            )}
            <button
              className="btn btn-sm mt-2"
              onClick={() => navigate("/template/create")}
            >
              + Add New Template
            </button>

            <div className="flex gap-4 mt-4">
              <button
                className="btn btn-secondary flex-grow"
                onClick={saveDraft}
                disabled={saving}
              >
                {saving ? "Saving draft..." : "Save Draft"}
              </button>
              <button
                className="btn btn-primary flex-grow"
                onClick={() => (repeat ? setStep(6) : saveCampaign("Published"))}
                disabled={saving}
              >
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </section>
        )}

        {/* Step 6 - Repeat Config */}
        {step === 6 && repeat && (
          <section className="space-y-4 max-w-lg">
            <label>
              <span className="block font-semibold mb-1">Repeat every</span>
              <select
                className="select select-bordered w-full"
                value={repeatFrequency}
                onChange={(e) => setRepeatFrequency(e.target.value)}
              >
                {REPEAT_FREQUENCIES.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="space-y-2">
              <legend className="font-semibold text-sm">Ends</legend>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="repeatEnds"
                  value="never"
                  checked={repeatEndsOn === "never"}
                  onChange={() => setRepeatEndsOn("never")}
                />
                <span>Never</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="repeatEnds"
                  value="on"
                  checked={repeatEndsOn === "on"}
                  onChange={() => setRepeatEndsOn("on")}
                />
                <span>On</span>
              </label>
              {repeatEndsOn === "on" && (
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={repeatEndDate}
                  onChange={(e) => setRepeatEndDate(e.target.value)}
                />
              )}
            </fieldset>

            <div className="flex justify-end gap-4 pt-4">
              <button className="btn btn-secondary" onClick={handleBack} disabled={saving}>
                Previous
              </button>
              <button className="btn btn-primary" onClick={() => saveCampaign("Published")} disabled={saving}>
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CreateCampaign;
