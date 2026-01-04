'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Package, Truck, CreditCard } from "lucide-react";
import StayInspired from "@/components/home/StayInspired";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    shippingAddress: "",
  });

  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    fetch('https://api.country.is/')
      .then(res => res.json())
      .then(data => {
        const countryCode = data?.country || 'IN';
        setIsIndia(countryCode === 'IN');
      })
      .catch(() => {
        setIsIndia(true);
      });
  }, []);

  const currencySymbol = isIndia ? '₹' : '$';

  const getPrice = (item) => {
    return isIndia
      ? Number(item.discountPrice || item.price || 0)
      : Number(item.discountPriceUSD || item.priceUSD || 0);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + getPrice(item) * (item.quantity || 1),
    0
  );

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error("Please login to checkout");
      router.push("/auth/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    if (!user.addresses || user.addresses.length === 0) {
      toast.error("Please add a shipping address first");
      router.push("/profile?tab=addresses");
      return;
    }
  }, [authLoading, user, cart, router]);

  const handlePlaceOrder = async () => {
    if (!formData.shippingAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setPlacingOrder(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        toast.error("Please login again");
        router.push("/auth/login");
        return;
      }

      const shippingAddr = user.addresses?.find((addr) => {
        const addrStr = `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
        return addrStr === formData.shippingAddress;
      });

      if (!shippingAddr) {
        toast.error("Invalid address selected");
        return;
      }

      let payload = {
        items: cart.map((item) => {
          const priceInPaise = Math.round(getPrice(item) * 100);
          const quantity = Number(item.quantity) || 1;

          return {
            productId: item._id || item.id,
            name: item.productName || item.name || "Product",
            price: priceInPaise,
            quantity: quantity,
            subtotal: priceInPaise * quantity,
          };
        }),
        totalAmount: Math.round(total),
        shippingAddress: {
          address: shippingAddr.address,
          city: shippingAddr.city,
          state: shippingAddr.state,
          pincode: shippingAddr.pincode,
          country: shippingAddr.country || "India",
        },
        // paymentMethod: paymentMethod,
      };

      if (paymentMethod === "cod") {
        const res = await fetch(`${API_BASE}/api/orders/createOrderByCustomer`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "COD order failed");
          return;
        }

        toast.success("Order placed! Pay on delivery");
        clearCart();
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
          sessionStorage.setItem("justPlacedOrder", "true");
          sessionStorage.setItem("showOrderSuccess", "true");
          window.location.href = "/orders";
        }
        return;
      }

      // Online Payment Flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway");
        setPlacingOrder(false);
        return;
      }

      const orderRes = await fetch(`${API_BASE}/api/orders/createOrderByCustomer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        toast.error(err.message || "Failed to create order");
        setPlacingOrder(false);
        return;
      }

      const orderData = (await orderRes.json()).data;

      if (!orderData?.razorpayOrder) {
        toast.error("Payment details missing");
        setPlacingOrder(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: "Tanariri",
        description: "Order Payment",
        order_id: orderData.razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.order._id,
            };

            const verifyRes = await fetch(`${API_BASE}/api/razorpay/verify`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(verifyPayload),
            });

            if (verifyRes.ok) {
              toast.success("Payment successful! Order placed");
              clearCart();
              if (typeof window !== "undefined") {
                localStorage.removeItem("cart");
                sessionStorage.setItem("justPlacedOrder", "true");
                window.location.href = "/orders";
              }
            } else {
              toast.error("Payment failed. Please contact support.");
            }
          } catch (e) {
            console.error(e);
            toast.error("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          contact: user.phone || "",
        },
        theme: { color: "#172554" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#f5f3f0]">
        <div className="mx-auto px-8 py-12">
          <div className="relative inline-block pb-3 mb-6">
            <h1
              className="text-5xl text-[#172554]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
              }}
            >
              Checkout
            </h1>
            <div className="absolute left-0 bottom-0 h-1 bg-[#172554] rounded-full w-full overflow-hidden">
              <div className="absolute inset-0 bg-pink-500 animate-shimmer"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Truck className="w-6 h-6 text-gray-700" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>

                {!user || !user.addresses || user.addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-4">
                      No shipping address found
                    </p>
                    <button
                      onClick={() => router.push("/profile?tab=addresses")}
                      className="text-[#172554] underline font-medium hover:text-[#0f1e3d]"
                    >
                      → Add Address First
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#172554] focus:border-[#172554] outline-none"
                    required
                  >
                    <option value="">Select address</option>
                    {user.addresses.map((addr, i) => {
                      const str = `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
                      return (
                        <option key={i} value={str}>
                          {str}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-5">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-[#172554]"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Online Payment</div>
                      <div className="text-sm text-gray-600">
                        Credit/Debit Card, UPI, Netbanking
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 text-gray-500" />
                  </label>

                  <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-[#172554]"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Cash on Delivery (COD)</div>
                      <div className="text-sm text-gray-600">
                        Pay when you receive
                      </div>
                    </div>
                    <Package className="w-6 h-6 text-gray-500" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-5 pb-4 border-b">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.productName || item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {currencySymbol}
                        {(getPrice(item) * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>{currencySymbol}{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
                    <span>Total</span>
                    <span>{currencySymbol}{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !formData.shippingAddress}
                  className="w-full mt-6 bg-[#172554] hover:bg-[#0f1e3d] text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placingOrder
                    ? "Processing..."
                    : paymentMethod === "cod"
                    ? "Place Order (COD)"
                    : `Pay ${currencySymbol}${total.toLocaleString("en-IN")}`}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Secured by SSL • Trusted by thousands
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <StayInspired />
        </div>
      </div>
    </>
  );
}