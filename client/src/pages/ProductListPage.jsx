import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Axios from "../utils/useAxios";
import summeryApis from "../common/summuryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import CartProduct from "../components/CartProduct";
import { useSelector } from "react-redux";
import { validUrl } from "../utils/validUrlConvert";

const ProductListPage = () => {
  const params = useParams();
  console.log("parameters : ", params);
  const Allsubcategory = useSelector((store) => store.product.allSubcategory);
  console.log(Allsubcategory);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalPageCount] = useState(1);
  const subcategoryLength = params?.subcategory?.split("-");
  const subCategoryName = subcategoryLength
    ?.splice(0, subcategoryLength?.length - 1)
    .join(" ");
  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subcategory.split("-").slice(-1)[0];
  const [displaysubCategory, setDisplaySUbCategory] = useState([]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summeryApis.getProductByCategoryandSubcategory,
        data: {
          categoryId,
          subCategoryId,
          page: page,
          limit: 8,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
      console.log("data with category subcategory", data);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params]);

  useEffect(() => {
    const sub = Allsubcategory.filter((sub) => {
      const filterData = sub.category.some((el) => {
        return el._id == categoryId;
      });
      return filterData ? filterData : null;
    });
    console.log(sub);
    setDisplaySUbCategory(sub);
  }, [params, Allsubcategory]);

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto grid grid-cols-[90px_1fr] lg:grid-cols-[280px_1fr] md:grid-cols-[200px_1fr] h-screen">
        {/* subCategory - Fixed height with scrolling */}
        <div className="bg-white h-full overflow-y-auto border-r border-gray-200 scrollbar-thin mayurScroll scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {displaysubCategory.map((s, index) => {
                const link = `/${validUrl(s.category[0]?.name)}-${s?.category[0]?._id}/${validUrl(s?.name)}-${s?._id}`;
            
            return (
              <Link
                to={link}
                key={index}
                className={`p-3 flex flex-col lg:flex-row lg:items-center lg:justify-start border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  subCategoryId === s._id ? "bg-green-100 border-green-300" : ""
                } duration-200 cursor-pointer`}
              >
                {/* Image Container */}
                <div className="flex-shrink-0 w-16 h-16 lg:w-18 lg:h-18 mx-auto lg:mx-0 lg:mr-3 mb-2 lg:mb-0">
                  <img
                    src={s.image}
                    alt={s.name || "Category Image"}
                    className="w-full h-full object-scale-down rounded bg-white p-1 border border-gray-200"
                  />
                </div>

                {/* Text Container */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 text-center lg:text-left leading-tight break-words px-1">
                    {s.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Product - Also with proper scrolling */}
        <div className="bg-white h-full overflow-y-auto ">
          <div className="bg-white shadow-sm p-4 border-b border-gray-200 sticky top-0 z-10">
            <h3 className="font-semibold text-gray-900">{subCategoryName}</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 ">
              {data.map((product, index) => {
                return (
                  <CartProduct
                    data={product}
                    key={product._id + "ProductSUbcategory" + index}
                  />
                );
              })}
            </div>
            {loading && (
              <div className="flex justify-center py-8">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
