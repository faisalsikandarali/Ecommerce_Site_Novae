import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HangerCard } from '../components/hanger/HangerCard';

export const WishlistPage = ({ onSelectProduct, onNavigate }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[60vh]">
      <button
        onClick={() => onNavigate('home')}
        className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Saved Pieces ({wishlist.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Your personal wishlist of garments and everyday essentials.
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 my-8">
          <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400 mb-3">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Tap the heart icon on any piece to save it to your curated wardrobe.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((item, idx) => (
            <div key={item.id} className="pt-2">
              <HangerCard
                product={item}
                index={idx}
                onSelect={onSelectProduct}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
