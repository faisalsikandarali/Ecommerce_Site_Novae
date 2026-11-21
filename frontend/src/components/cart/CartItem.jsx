import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-stone-100 last:border-0 group">
      {/* Thumbnail */}
      <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
              {item.name}
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Size: <span className="font-medium text-stone-700">{item.size}</span>
              {item.color && (
                <> • Color: <span className="font-medium text-stone-700">{item.color}</span></>
              )}
            </p>
          </div>
          <button
            onClick={() => removeFromCart(item.cartItemId)}
            className="text-stone-400 hover:text-red-500 p-1 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Price & Quantity Stepper */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-semibold text-stone-900">
            {item.currency || 'Rs.'} {(item.price * item.quantity).toLocaleString()}
          </span>

          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-semibold px-2.5 text-stone-800 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
