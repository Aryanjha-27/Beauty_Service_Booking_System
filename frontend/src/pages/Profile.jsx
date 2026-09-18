import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardNav } from "@/components/DashboardNav";
import { updateProfile } from "@/api/authApi";
import { ErrorMessage } from "@/components/ErrorMessage";

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, refresh } = useAuth();

  const [fullName, setFullName] = useState(user?.profile?.full_name ?? user?.full_name ?? "");
  const [mobile, setMobile] = useState(user?.profile?.mobile ?? user?.mobile ?? "");
  const [address, setAddress] = useState(user?.profile?.address ?? user?.address ?? "");
  const [profileImage, setProfileImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = new FormData();
      payload.append("full_name", fullName);
      payload.append("mobile", mobile);
      payload.append("address", address);
      if (profileImage) payload.append("image", profileImage);
      await updateProfile(payload);
      setSuccess(true);
      setProfileImage(null);
      await refresh();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="gn-container py-12">
      <span className="gn-eyebrow text-primary">Account Settings</span>
      <h1 className="mt-1 font-display text-4xl text-foreground">My Profile</h1>

      <div className="mt-6">
        <DashboardNav />
      </div>

      <div className="mt-8 max-w-xl">
        <form className="gn-card p-8 border border-border space-y-5" onSubmit={handleSubmit}>
          {success ? (
            <div className="rounded-xl bg-emerald-50 p-4 text-emerald-800 text-sm font-semibold border border-emerald-200">
              ✓ Profile updated successfully!
            </div>
          ) : null}

          <div>
            <label className="gn-label block mb-1">Username / Email</label>
            <input
              type="text"
              disabled
              value={user?.username || user?.email || ""}
              className="gn-input w-full opacity-60 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-muted-foreground">Username and email cannot be changed.</p>
          </div>

          <div>
            <label className="gn-label block mb-1" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="gn-input w-full"
            />
          </div>

          <div>
            <label className="gn-label block mb-1" htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="gn-input w-full"
              placeholder="+977 98XXXXXXXX"
            />
          </div>

          <div>
            <label className="gn-label block mb-1" htmlFor="address">Default Address</label>
            <textarea
              id="address"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="gn-input w-full"
              placeholder="Your city, street, or landmark"
            />
          </div>

          <div>
            <label className="gn-label block mb-1" htmlFor="profileImage">Profile Photo</label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
              className="gn-input w-full"
            />
          </div>

          {error ? <ErrorMessage error={error} /> : null}

          <button
            type="submit"
            disabled={busy}
            className="gn-btn gn-btn-primary w-full py-3"
          >
            {busy ? "Saving changes..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
