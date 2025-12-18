"use client";

import { useState, useEffect } from "react";
import StayInspired from "@/components/home/StayInspired";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Plus } from "lucide-react";
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    currentPassword: "", newPassword: "", confirmPassword: ""
  });

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "", newPassword: "", confirmPassword: ""
      });

      const userAddresses = Array.isArray(user.addresses) ? user.addresses : [];
      if (userAddresses.length === 0) {
        setAddresses([{ address: "", pincode: "", city: "", state: "", country: "India", isPrimary: true }]);
      } else {
        setAddresses(userAddresses.map((addr, idx) => ({
          ...addr,
          country: addr.country || "India",
          isPrimary: idx === 0
        })));
      }
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const addNewAddress = () => {
    setAddresses([...addresses, { address: "", pincode: "", city: "", state: "", country: "India", isPrimary: false }]);
  };

  const removeAddress = (index) => {
    if (addresses.length === 1) return toast.error("At least one address is required");
    const updated = addresses.filter((_, i) => i !== index);
    if (!updated.some(a => a.isPrimary)) updated[0].isPrimary = true;
    setAddresses(updated);
  };

  const setAsPrimary = (index) => {
    setAddresses(addresses.map((addr, i) => ({ ...addr, isPrimary: i === index })));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (addresses.some(a => !a.address || !a.pincode || !a.city || !a.state)) {
      toast.error("Please fill all address fields");
      setLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const API = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('token');

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        addresses: addresses.map(a => ({
          address: a.address,
          pincode: a.pincode,
          city: a.city,
          state: a.state,
          country: a.country
        })),
      };

      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const res = await fetch(`${API}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      const updatedUser = {
        ...user,
        firstName: data.customer?.firstName || formData.firstName,
        lastName: data.customer?.lastName || formData.lastName,
        email: data.customer?.email || formData.email,
        phone: data.customer?.phone || formData.phone,
        addresses: payload.addresses,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile updated successfully!");

      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordOnlySubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) return toast.error("Passwords do not match!");
    if (!formData.currentPassword || !formData.newPassword) return toast.error("Please fill all password fields");

    setPassLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('token');

      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: formData.currentPassword, newPassword: formData.newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password change failed");

      toast.success("Password changed successfully!");
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPassLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1E3A8A]" size={40} /></div>;
  if (!user) return null;

  return (
    <>
      <div className="min-h-screen py-4 px-4 lg:px-8 ">
        <div className="mx-auto w-full pb-8">
          <div className="relative inline-block pb-4 mb-8">
            <h1 className="text-5xl text-[#172554]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              My Profile
            </h1>
            <div className="absolute left-0 bottom-0 h-1 bg-[#172554] rounded-full w-full overflow-hidden">
              <div className="absolute inset-0 bg-pink-500 animate-shimmer"></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left Card - Full width on mobile, scrolls internally */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 flex flex-col w-full lg:flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-semibold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                Account Details
              </h2>

              <div className="flex-1 overflow-y-auto pr-4">
                <form onSubmit={handleProfileSubmit} className="space-y-6 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} required disabled={loading}
                        className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                      <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} required disabled={loading}
                        className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email address <span className="text-red-500">*</span></label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required disabled={loading}
                        className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                      <input name="phone" type="text" value={formData.phone} onChange={handleChange} required disabled={loading}
                        className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                    </div>
                  </div>

                  <div className="space-y-6 mt-8">
                    <h3 className="text-xl font-semibold text-gray-800">Delivery Addresses</h3>
                    {addresses.map((addr, index) => (
                      <div key={index} className={`p-6 rounded-xl border-2 relative ${addr.isPrimary ? 'border-[#1E3A8A] bg-blue-50' : 'border-gray-200'}`}>
                        {addr.isPrimary && (
                          <span className="absolute -top-3 left-6 bg-[#1E3A8A] text-white text-xs px-3 py-1 rounded-full">Primary</span>
                        )}
                        <div className="space-y-4">
                          <input type="text" placeholder="Full Address *" value={addr.address} onChange={(e) => handleAddressChange(index, 'address', e.target.value)} required disabled={loading}
                            className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <input placeholder="Pincode *" value={addr.pincode} onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)} required disabled={loading}
                              className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                            <input placeholder="City *" value={addr.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} required disabled={loading}
                              className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                            <input placeholder="State *" value={addr.state} onChange={(e) => handleAddressChange(index, 'state', e.target.value)} required disabled={loading}
                              className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                            <input value="India" disabled className="w-full h-10 px-4 border border-gray-300 rounded-md bg-gray-200" />
                          </div>

                          <div className="flex justify-end gap-4 mt-4">
                            {!addr.isPrimary && (
                              <button type="button" onClick={() => setAsPrimary(index)} className="text-sm text-[#1E3A8A] hover:underline">
                                Set as Primary
                              </button>
                            )}
                            {addresses.length > 1 && (
                              <button type="button" onClick={() => removeAddress(index)} className="text-sm text-red-600 hover:underline flex items-center gap-1">
                                <Trash2 size={16} /> Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button type="button" onClick={addNewAddress}
                      className="w-full border-2 border-dashed border-gray-400 rounded-xl py-3 flex items-center justify-center gap-2 text-gray-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition">
                      <Plus size={22} /> Add New Address
                    </button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold py-4 rounded-xl transition mt-4">
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>

           <div className="bg-gradient-to-br from-[#1E3A8A] to-[#172554] rounded-2xl shadow-xl p-8 lg:p-10 text-white
                w-full lg:w-96 flex flex-col justify-between
                flex-shrink-0 self-start
                lg:sticky lg:top-18 h-fit">
              <div>
                <div className="mb-6">
                  <p className="text-white/90 text-lg leading-relaxed">
                    Secure your account with a new password
                  </p>
                  <p className="text-white/60 text-sm mt-2">
                    Keep your Tanariri account safe and protected
                  </p>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Change Password
                </h2>
              </div>

              <form onSubmit={handlePasswordOnlySubmit} className="space-y-5">
                <input name="currentPassword" type="password" placeholder="Current password" value={formData.currentPassword} onChange={handleChange}
                  className="w-full px-5 py-3 bg-white/20 border border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm" />
                <input name="newPassword" type="password" placeholder="New password" value={formData.newPassword} onChange={handleChange}
                  className="w-full px-5 py-3 bg-white/20 border border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm" />
                <input name="confirmPassword" type="password" placeholder="Confirm new password" value={formData.confirmPassword} onChange={handleChange}
                  className="w-full px-5 py-3 bg-white/20 border border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm" />

                <button type="submit" disabled={passLoading || !formData.newPassword || formData.newPassword !== formData.confirmPassword}
                  className="w-full bg-white text-[#1E3A8A] font-bold py-4 rounded-xl hover:bg-gray-100 transition transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed">
                  {passLoading ? "Updating Password..." : "Update Password"}
                </button>
                <p className="text-center text-white/70 text-sm mt-4">
                  Leave blank if you don't want to change
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <StayInspired />
    </>
  );
}