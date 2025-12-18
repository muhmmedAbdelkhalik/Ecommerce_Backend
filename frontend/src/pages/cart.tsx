import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import type { Cart } from "../types/cart";
import { useAuth } from "../context/auth/authContext";

const CartPage = () => {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = (await response.json()) as { message: string; data: Cart | null };
      setCart(data.data || null);
    };
    fetchCart();
  }, [token]);
  return (
    <div>
      <h1>Cart</h1>
      {cart && (
        <div>
          <h2>{cart.items.map((item) => item.product).join(", ")}</h2>
          <p>{cart.totalPrice}</p>
          <p>{cart.status}</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
