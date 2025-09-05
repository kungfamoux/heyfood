import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { formatNaira } from "@/lib/utils";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    // In a real app, this would navigate to checkout
    toast({
      title: "Proceeding to checkout",
      description: `You have ${totalItems} items in your cart`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Your Cart</h2>
                <Button
                  type="button"
                  variant="ghost"
                  className="-mr-2 p-2"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                    <p className="mt-1 text-gray-500">Start adding some delicious items to your cart</p>
                    <Button className="mt-6" onClick={onClose}>
                      Browse Menu
                    </Button>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image_url || '/placeholder-food.jpg'}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-food.jpg';
                              }}
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">{formatNaira(item.price * item.quantity)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.restaurant.name}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => removeFromCart(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{formatNaira(totalPrice)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                  >
                    Checkout
                  </Button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 font-medium text-primary hover:text-primary/90"
                      onClick={onClose}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </Button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
