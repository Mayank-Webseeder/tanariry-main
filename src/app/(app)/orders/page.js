"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StayInspired from "@/components/home/StayInspired";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const IMG_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [showReturn, setShowReturn] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnImages, setReturnImages] = useState([]);

  const [tracking, setTracking] = useState({
    loading: false,
    events: [],
    error: null,
  });

  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    fetch("https://api.country.is/")
      .then((res) => res.json())
      .then((data) => {
        const countryCode = data?.country || "IN";
        setIsIndia(countryCode === "IN");
      })
      .catch(() => setIsIndia(true));
  }, []);

  const currencySymbol = isIndia ? "₹" : "$";

  const formatPrice = (amount) => {
    const value = Number(amount || 0);
    return value.toLocaleString(isIndia ? "en-IN" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const requestReturn = async () => {
    if (!returnReason) return toast.error("Please write a reason");
    if (returnImages.length === 0)
      return toast.error("Upload at least one image");

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("reason", returnReason);
    formData.append("reasonCategory", "damaged");

    returnImages.forEach((image) => formData.append("images", image));

    try {
      const res = await fetch(
        `${API_BASE}/api/orders/${selectedOrder._id}/return-request`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (res.ok) {
        toast.success("Return request submitted!");
        setShowReturn(false);
        setReturnReason("");
        setReturnImages([]);
        setSelectedOrder({ ...selectedOrder, returnRequested: true });
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to submit return request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  const getNormalizedStatus = (order) => {
    return (
      order?.orderStatus ||
      order?.status ||
      order?.paymentStatus ||
      "Pending"
    ).toLowerCase();
  };

  useEffect(() => {
    const justPlaced = sessionStorage.getItem("justPlacedOrder");
    if (justPlaced) {
      sessionStorage.removeItem("justPlacedOrder");
      setShowSuccessPopup(true);
      const timer = setTimeout(() => setShowSuccessPopup(false), 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const statusSteps = [
    { status: "pending", label: "Order Placed" },
    { status: "processing", label: "Preparing" },
    { status: "shipped", label: "On the Way" },
    { status: "delivered", label: "Delivered" },
  ];

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(`${API_BASE}/api/orders/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const result = await res.json();
      const finalOrders =
        result?.data?.orders || result?.orders || result?.data || [];

      setOrders(finalOrders);

      if (finalOrders.length === 0) {
        toast.success("No orders found yet");
      } else {
        toast.success(
          `${finalOrders.length} order${finalOrders.length > 1 ? "s" : ""} loaded!`,
        );
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      toast.error("Unable to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [authLoading, user]);

  const fetchTracking = async (waybill) => {
    if (!waybill) {
      setTracking({ loading: false, events: [], error: null });
      return;
    }

    try {
      setTracking((prev) => ({ ...prev, loading: true, error: null }));
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/orders/public/track/${waybill}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch tracking");

      const data = await res.json();

      if (data.success && data.status === "Recently Created") {
        setTracking({
          loading: false,
          events: [
            {
              status: "Parcel has not been picked up yet.",
              message:
                data.message ||
                "Shipment manifested in Delhivery panel. Tracking updates after pickup complete",
              datetime: new Date().toISOString(),
            },
          ],
          error: null,
        });
      } else {
        const events = data?.events || data?.tracking || [data] || [];
        setTracking({ loading: false, events, error: null });
      }
    } catch (err) {
      console.error(err);
      setTracking({
        loading: false,
        events: [],
        error: "Unable to load tracking",
      });
    }
  };

  const openModal = (order) => {
    if (!order) return toast.error("Order data missing");
    setSelectedOrder(order);
    setIsModalOpen(true);
    setShowCancel(false);
    setCancelReason("");
    setRating(0);
    setReview("");
    setShowReturn(false);
    setReturnReason("");
    setReturnImages([]);
    setTracking({ loading: false, events: [], error: null });

    const waybill =
      order.waybill ||
      order.awb ||
      order.trackingId ||
      order.shipmentDetails?.waybill;
    if (waybill) fetchTracking(waybill);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const downloadInvoice = async (order) => {
    const orderId = order._id?.toString() || order.id;
    if (!orderId) return toast.error("Order ID not found");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/orders/${orderId}/invoice`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Tanariri_Invoice_${orderId.slice(-8).toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded!");
    } catch (error) {
      console.error("Invoice download failed:", error);
      toast.error("Failed to download invoice");
    }
  };

  const cancelOrderByCustomer = async () => {
    if (!selectedOrder) return toast.error("Order not found");

    if (getNormalizedStatus(selectedOrder) !== "pending") {
      return toast.error("Only pending orders can be cancelled");
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/orders/${selectedOrder._id}/cancel-by-customer`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Order cancelled successfully!");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === selectedOrder._id
              ? { ...o, orderStatus: "Cancelled" }
              : o,
          ),
        );
        setSelectedOrder({ ...selectedOrder, orderStatus: "Cancelled" });
        setShowCancel(false);
        closeModal();
      } else {
        toast.error(result.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  const copyInvoiceNo = () => {
    const invoiceNo =
      selectedOrder?.invoiceDetails?.[0]?.invoiceNo ||
      selectedOrder?.invoiceNo ||
      `#${selectedOrder?._id?.slice(-6).toUpperCase()}` ||
      "N/A";

    navigator.clipboard.writeText(invoiceNo);
    toast.success("Invoice number copied!");
  };

  const currentIndex = statusSteps.findIndex(
    (step) => step.status === getNormalizedStatus(selectedOrder),
  );

  const SkeletonRow = () => (
    <div className="animate-pulse space-y-4 pb-6 border-b border-gray-200">
      <div className="grid grid-cols-3 gap-4 md:gap-8">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex justify-end">
          <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const EmptyOrdersUI = () => (
    <div className="text-center py-16 px-6">
      <div className="max-w-md mx-auto">
        <div className="mx-auto w-24 h-24 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3
          className="text-2xl font-semibold text-gray-800 mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          No Orders Yet
        </h3>
        <p className="text-gray-500 mb-8">
          Looks like you haven't placed any orders yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white hover:bg-[#172554] px-8 py-3 rounded-md font-medium"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full bg-background flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full space-y-6">
          <div className="relative inline-block pb-6">
            <h1
              className="text-5xl text-[#172554]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
              }}
            >
              My Orders
            </h1>
            <div className="absolute left-0 bottom-0 h-1 bg-[#172554] rounded-full w-full overflow-hidden">
              <div className="absolute inset-0 bg-pink-500 animate-shimmer"></div>
            </div>
          </div>

          <div className="bg-white p-6 lg:p-12 rounded-lg shadow-sm border border-gray-200">
            {authLoading || loading ? (
              <div className="space-y-8">
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : !user ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-6">
                  Please log in to view your orders.
                </p>
                <Link
                  href="/auth/login"
                  className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-md"
                >
                  Login
                </Link>
              </div>
            ) : orders.length === 0 ? (
              <EmptyOrdersUI />
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="grid grid-cols-3 gap-4 md:gap-8 text-md">
                      <div className="space-y-4">
                        <div>
                          <span className="text-gray-600">Order: </span>
                          <span className="font-medium text-[#172554]">
                            {order.invoiceDetails?.[0]?.invoiceNo ||
                              `#${order._id?.slice(-6).toUpperCase()}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status: </span>
                          <span
                            className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-full border-2 transition-all ${
                              getNormalizedStatus(order) === "delivered"
                                ? "border-green-600 text-green-600 bg-green-50"
                                : getNormalizedStatus(order) === "cancelled"
                                  ? "border-red-600 text-red-600 bg-red-50"
                                  : getNormalizedStatus(order) === "shipped"
                                    ? "border-blue-600 text-blue-600 bg-blue-50"
                                    : getNormalizedStatus(order) ===
                                        "processing"
                                      ? "border-purple-600 text-purple-600 bg-purple-50"
                                      : "border-[#172554] text-[#172554] bg-[#172554]/5"
                            }`}
                          >
                            {getNormalizedStatus(order) === "delivered"
                              ? "Delivered"
                              : getNormalizedStatus(order) === "cancelled"
                                ? "Cancelled"
                                : getNormalizedStatus(order) === "shipped"
                                  ? "Shipped"
                                  : getNormalizedStatus(order) === "processing"
                                    ? "Processing"
                                    : "Order Placed"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="text-gray-600">Date: </span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </div>
                        <div>
                          <span className="text-gray-600">Total: </span>
                          <span className="font-medium">
                            {currencySymbol}
                            {formatPrice(
                              order.paymentTotal || order.totalAmount || 0,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end items-center">
                        <button
                          onClick={() => openModal(order)}
                          className="h-8 px-4 text-sm border-2 border-[#172554] rounded-lg bg-white hover:bg-[#172554] hover:text-white transition font-medium"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2
                  className="text-2xl font-semibold text-[#172554]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Order Details
                </h2>
                <p className="text-sm text-gray-500">
                  Invoice:{" "}
                  {selectedOrder?.invoiceDetails?.[0]?.invoiceNo ||
                    selectedOrder?.invoiceNo ||
                    `#${selectedOrder?._id?.slice(-6).toUpperCase()}` ||
                    "N/A"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium text-[#172554]">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-[#172554]">{user?.email}</p>
              </div>
            </div>

            <div className="border-t pt-6 mb-6">
              <h4 className="font-semibold text-lg mb-4 text-[#172554]">
                Products
              </h4>

              {(() => {
                const items =
                  selectedOrder?.items ||
                  selectedOrder?.orderItems ||
                  selectedOrder?.products ||
                  selectedOrder?.cartItems ||
                  [];

                if (!items || items.length === 0) {
                  return (
                    <p className="text-gray-500 italic text-sm">
                      No products found in this order.
                    </p>
                  );
                }

                return (
                  <div className="space-y-4">
                    {items.map((item, index) => {
                      const price = isIndia
                        ? Number(item.price || 0)
                        : Number(item.priceUSD || item.price || 0);

                      const qty = Number(item.quantity || 1);
                      const total = (price * qty) / 100;

                      const name =
                        item.name || item.productName || "Product Name";
                      const rawImage =
                        item.productImages?.[0] || "/fallback.jpg";
                      const imageUrl = rawImage.startsWith("http")
                        ? rawImage
                        : `${IMG_URL}/${rawImage.replace(/^uploads\//, "")}`;

                      return (
                        <div
                          key={item._id || index}
                          className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {name}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {qty} × {currencySymbol}
                              {formatPrice(price)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-xl text-[#172554]">
                              {currencySymbol}
                              {formatPrice(total)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {currencySymbol}
                  {formatPrice(
                    selectedOrder?.paymentTotal ||
                      selectedOrder?.totalAmount ||
                      0,
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span className="text-green-600">
                  -{currencySymbol}
                  {formatPrice(selectedOrder?.discount || 0)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-300 text-[#172554]">
                <span>Total Paid</span>
                <span>
                  {currencySymbol}
                  {formatPrice(
                    selectedOrder?.paymentTotal ||
                      selectedOrder?.totalAmount ||
                      0,
                  )}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-medium mb-4 text-[#172554]">
                Order Tracking
              </h4>

              <div className="relative mb-6">
                <div className="flex justify-between">
                  {statusSteps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                          i <= currentIndex
                            ? "bg-[#172554] border-[#172554] text-white"
                            : "bg-white border-gray-300 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <p
                        className={`text-xs mt-2 font-medium ${i <= currentIndex ? "text-[#172554]" : "text-gray-500"}`}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="absolute top-6 left-0 right-0 h-1 -z-10">
                  <div className="h-full bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#172554] transition-all duration-500"
                      style={{
                        width:
                          currentIndex >= 0
                            ? `${(currentIndex / (statusSteps.length - 1)) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>

              {tracking.loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : tracking.error ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">{tracking.error}</p>
                </div>
              ) : tracking.events && tracking.events.length > 0 ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {tracking.events.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-[#172554] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {event.status || event.message || "Status update"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.location || event.city || "Location"}
                          {event.location && event.city && ", "}
                          {event.state || ""}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {event.datetime
                            ? new Date(event.datetime).toLocaleString("en-IN")
                            : event.date || event.time || "Recent"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No tracking details available
                </div>
              )}
            </div>

            {showReturn && (
              <div className="mb-6 p-5 border-2 border-orange-300 rounded-xl bg-orange-50">
                <h4 className="font-semibold text-lg mb-4 text-orange-800">
                  Request Return
                </h4>

                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Please explain the issue (e.g., received damaged item, wrong product, etc.)"
                  className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  rows="4"
                />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (max 3)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setReturnImages(Array.from(e.target.files))
                    }
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {returnImages.length} image(s) selected
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={requestReturn}
                    className="flex-1 bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 font-medium"
                  >
                    Submit Return Request
                  </button>
                  <button
                    onClick={() => {
                      setShowReturn(false);
                      setReturnReason("");
                      setReturnImages([]);
                    }}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => downloadInvoice(selectedOrder)}
                className="flex-1 bg-white border-2 border-[#172554] text-[#172554] py-3 rounded-lg hover:bg-[#172554] hover:text-white font-medium transition"
              >
                Download Invoice
              </button>

              <button
                onClick={copyInvoiceNo}
                className="flex-1 bg-white border-2 border-[#172554] text-[#172554] py-3 rounded-lg hover:bg-[#172554] hover:text-white font-medium transition"
              >
                Copy Invoice No
              </button>

              {getNormalizedStatus(selectedOrder) === "pending" && (
                <button
                  onClick={cancelOrderByCustomer}
                  className="flex-1 bg-white border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 font-medium transition flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 6L6 18M6 6l12 12"
                    />
                  </svg>
                  Cancel Order
                </button>
              )}

              {getNormalizedStatus(selectedOrder) === "delivered" &&
                !selectedOrder.returnRequested &&
                (() => {
                  const deliveredDate = new Date(
                    selectedOrder.deliveredAt ||
                      selectedOrder.updatedAt ||
                      selectedOrder.createdAt,
                  );
                  const daysSinceDelivery = Math.floor(
                    (new Date() - deliveredDate) / (1000 * 60 * 60 * 24),
                  );
                  return daysSinceDelivery <= 7;
                })() && (
                  <button
                    onClick={() => setShowReturn(true)}
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    Return Order
                  </button>
                )}

              {selectedOrder.returnRequested && (
                <div className="flex-1 bg-green-50 border-2 border-green-200 text-green-700 py-3 rounded-lg font-medium text-center shadow-sm">
                  Return Request Submitted
                </div>
              )}

              {getNormalizedStatus(selectedOrder) === "delivered" &&
                !selectedOrder.returnRequested &&
                (() => {
                  const deliveredDate = new Date(
                    selectedOrder.deliveredAt || selectedOrder.updatedAt,
                  );
                  const daysSinceDelivery = Math.floor(
                    (new Date() - deliveredDate) / (1000 * 60 * 60 * 24),
                  );
                  return daysSinceDelivery > 7;
                })() && (
                  <div className="flex-1 bg-gray-100 border-2 border-gray-300 text-gray-600 py-3 rounded-lg font-medium text-center cursor-not-allowed shadow-sm">
                    Return period ended
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={() => setShowSuccessPopup(false)}
          />

          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-12 text-center 
                          animate-in fade-in zoom-in duration-500 
                          border border-white/20"
          >
            <div
              className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-600 
                            rounded-full mx-auto mb-8 flex items-center justify-center 
                            shadow-2xl animate-pulse ring-8 ring-white/30"
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </div>

            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h2>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed">
              Thank you for shopping with Tanariri!
            </p>

            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mx-auto bg-[#172554] hover:bg-[#0f1e3d] text-white font-bold 
                          text-xl py-3 px-8 rounded-2xl transition-all duration-300 
                          transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <StayInspired />
    </>
  );
}
