import React, { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { PriceInruppees } from "../utils/DisplayPriceinRuppes";
import { useGlobalContext } from "../provider/global.provider";
import AddressAdd from "../components/AddressAdd";
import Devider from "../components/Devider";
import Axios from "../utils/useAxios";
import summeryApis from "../common/summuryApi";
import toast from "react-hot-toast";
import {loadStripe} from "@stripe/stripe-js"
import { priceWithDisCount } from "../utils/DisCountCunter";
import { clearCart } from "../store/Cartslice";

const CheckOutpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notDiscountprice, totalPrice, isLoading ,clearCartData} = useGlobalContext();
  const cartItems = useSelector((store) => store?.cart?.cart || []);
  const address = useSelector((store) => store?.address?.addressList || []);

  const [OpenAddress, setOpenAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const savings = useMemo(() => {
    if (!notDiscountprice || !totalPrice) return 0;
    return notDiscountprice - totalPrice;
  }, [notDiscountprice, totalPrice]);

  const memoizedCartItems = useMemo(() => {
    return Array.isArray(cartItems) ? cartItems : [];
  }, [cartItems]);

  const finalAmount = useMemo(() => {
    return (totalPrice || 0) + ((totalPrice || 0) >= 500 ? 0 : 40);
  }, [totalPrice]);


const HandleCashOndelivery = async () => {
    let loadingToast;
    try {
        if (isProcessing) return;

        // Validations
        if (!address?.length) {
            toast.error("Please add a delivery address");
            setOpenAddress(true);
            return;
        }

        if (!cartItems?.length) {
            toast.error("Your cart is empty");
            return;
        }

        setIsProcessing(true);
        loadingToast = toast.loading('Placing your order...');

        const response = await Axios({
            ...summeryApis.cashondeliery,
            data: {
                list_items: cartItems.map(item => ({
                    productId: item.productId._id,
                    name: item.productId.name,
                    image: item.productId.image,
                    quantity: item.quantity,
                    price: Math.round(Number(item.productId.price))
                })),
                addressId: address[selectedAddress]._id,
                subTotalAmount: totalPrice,
                totalAmount: finalAmount
            }
        });

        if (loadingToast) {
            toast.dismiss(loadingToast);
        }

        if (response?.data?.success) {
            // Clear cart from both Redux and global context
            dispatch(clearCart())
            await clearCartData(); // This will handle both Redux and backend
            
            // Show single success message and navigate
            toast.success('Order placed successfully', {
                id: 'order-success', // Use unique ID to prevent duplicates
                duration: 3000
            });
            
            navigate('/myorders'); // Navigate to orders page instead of success
        } else {
            throw new Error(response?.data?.message || "Failed to place order");
        }
    } catch (error) {
        console.error("Order error:", error);
        if (loadingToast) {
            toast.dismiss(loadingToast);
        }
        
        // Show single error message
        toast.error(error?.response?.data?.message || "Failed to place order", {
            id: 'order-error' // Use unique ID to prevent duplicates
        });
    } finally {
        setIsProcessing(false);
    }
};

const handleOnlinePayment = async () => {
    let loadingToast;
    try {
        if (isProcessing) return;

        // Validations
        if (!address?.length) {
            toast.error("Please add a delivery address");
            setOpenAddress(true);
            return;
        }

        if (!cartItems?.length) {
            toast.error("Your cart is empty");
            return;
        }

        setIsProcessing(true);
        loadingToast = toast.loading('Processing payment...');

        // Format items with proper price calculation
        const formattedItems = cartItems.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            image: Array.isArray(item.productId.Image) 
                ? item.productId.Image[0] 
                : item.productId.image,
            quantity: item.quantity,
            price: Math.round(
                priceWithDisCount(
                    Number(item.productId.price), 
                    Number(item.productId.discount || 0)
                )
            )
        }));

        const requestData = {
            list_items: formattedItems,
            addressId: address[selectedAddress]._id,
            subTotalAmount: Math.round(totalPrice),
            totalAmount: Math.round(finalAmount)
        };

        console.log('Payment Request:', requestData); // Debug log

        const response = await Axios({
            ...summeryApis.payment_url,
            data: requestData
        });

        if (loadingToast) {
            toast.dismiss(loadingToast);
        }

        if (response?.data?.url) {
            window.location.href = response.data.url;
        } else {
            throw new Error("Invalid payment session");
        }

    } catch (error) {
        console.error("Payment error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        if (loadingToast) {
            toast.dismiss(loadingToast);
        }

        toast.error(error.response?.data?.message || "Payment initialization failed");
        setIsProcessing(false);
    }
};

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <section className="bg-blue-50 min-h-[80vh]">
      <div className="container mx-auto p-4 flex w-full gap-4 justify-between lg:flex-row flex-col">
        <div className="w-full cursor-pointer lg:flex-3 py-4 px-2">
          <h3 className="text-lg font-semibold">Choose Your Address</h3>
          <div className="bg-white p-2 grid gap-3">
            {address?.length > 0 ? (
              address.map((addr, index) => (
                <label
                  key={`address-${index}`}
                  htmlFor={`address-${index}`}
                  className={`${!addr.status && "hidden"}`}
                >
                  <div>
                    <div className="rounded p-3 flex gap-3 items-center border hover:bg-zinc-50 cursor-pointer">
                      <div>
                        <input
                          type="radio"
                          onChange={() => setSelectedAddress(index)}
                          checked={selectedAddress === index}
                          className="cursor-pointer"
                          value={index}
                          id={`address-${index}`}
                          name="address"
                        />
                      </div>
                      <div className="p-2">
                        <p>{addr?.address_line}</p>
                        <p>{addr?.city}</p>
                        <p>{addr?.state}</p>
                        <p>{addr?.country} - {addr?.pincode}</p>
                        <p>{addr?.mobile}</p>
                      </div>
                    </div>
                    <Devider />
                  </div>
                </label>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">No addresses found</p>
            )}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <span className="text-blue-600">+ Add New Address</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md lg:flex-2 py-4 px-2">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="p-2 flex-shrink-0">
            <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                Bill Details
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Items Total ({memoizedCartItems.reduce((sum, item) => sum + (item?.quantity || 1), 0)} items)
                  </span>
                  <span className="font-medium">
                    {PriceInruppees(totalPrice || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className={`font-medium ${(totalPrice || 0) >= 500 ? "text-green-600" : "text-gray-800"}`}>
                    {(totalPrice || 0) >= 500 ? "FREE" : PriceInruppees(40)}
                  </span>
                </div>

                {(totalPrice || 0) < 500 && (
                  <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    Add {PriceInruppees(500 - (totalPrice || 0))} more for FREE delivery
                  </p>
                )}

                {savings > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Total Savings</span>
                    <span className="font-medium">-{PriceInruppees(savings)}</span>
                  </div>
                )}

                <hr className="border-gray-200 my-2" />

                <div className="flex justify-between items-center font-semibold text-base">
                  <span className="text-gray-800">Grand Total</span>
                  <span className="text-green-600">{PriceInruppees(finalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 items-center">
              <button
              onClick={handleOnlinePayment}
                disabled={isProcessing}
                className={`w-full py-2 px-4 font-bold rounded text-green-500 cursor-pointer border-2 bg-white border-green-400 hover:bg-green-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Online Payment
              </button>
              <button
                onClick={HandleCashOndelivery}
                disabled={isProcessing}
                className={`w-full py-2 px-4 font-bold rounded text-green-500 cursor-pointer border-2 bg-white border-green-400 hover:bg-green-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? 'Processing...' : 'Cash on Delivery'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {OpenAddress && <AddressAdd close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckOutpage;