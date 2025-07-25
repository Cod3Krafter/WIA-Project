import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function JobApplicationModal({ jobId, open, onClose }) {
  const [form, setForm] = useState({
    proposal: "",
    expected_budget: "",
    freelancer_contact: "",
  });

  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/applyToJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important if using session auth
        body: JSON.stringify({ job_id: jobId, ...form }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to apply");

      toast({ title: "Success", description: data.message });
      onClose(); // close modal
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="proposal"
            required
            placeholder="Your proposal"
            className="textarea textarea-bordered w-full"
            value={form.proposal}
            onChange={handleChange}
          />

          <input
            type="number"
            name="expected_budget"
            required
            placeholder="Expected budget"
            className="input input-bordered w-full"
            value={form.expected_budget}
            onChange={handleChange}
          />

          <input
            type="text"
            name="freelancer_contact"
            required
            placeholder="Your contact (e.g. email or WhatsApp)"
            className="input input-bordered w-full"
            value={form.freelancer_contact}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
