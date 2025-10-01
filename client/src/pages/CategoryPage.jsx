import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/useAxios";
import summeryApis from "../common/summuryApi";
import EditCategory from "../components/EditCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false); // Fixed variable name
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [editModelOpen, setEditModel] = useState(false);
  const [openConfirmBoxDelete, setOpenConfirmboxDelete] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({  
    _id: "",
  });
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });

const allCategory = useSelector((store)=>store.product.allcategory);
console.log(allCategory);

useEffect(()=>{
  setCategoryData(allCategory)
  fetchCategory()
},[])

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summeryApis.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setCategoryData(responseData.data);
      }
      console.log(responseData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchCategory();
  // }, []);

  const HandelDelete = async()=>{
         try {
             const responce = await Axios({
                 ...summeryApis.deleteCcategory,
                 data:deleteCategory
             })
             const {data:responseData} = responce;

             if(responseData.success){
                toast.success(responseData.message)
                await fetchCategory()
                setOpenConfirmboxDelete(false)
             }
         } catch (error) {
             AxiosToastError(error)
         }
     }

  return (
    <section>
      <div className="p-2 bg-white shadow-xl flex items-center justify-between rounded-sm">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm cursor-pointer border-amber-400 hover:border-amber-300 hover:bg-amber-300 px-3 py-2 rounded"
        >
          Add category
        </button>
      </div>      

      {/* Fixed: use lowercase 'loading' variable */}
      {!categoryData[0] && !loading && <NoData />}
      <div className="p-2 grid grid-cols-2  gap-8 lg:p-4 lg:grid-cols-5 lg:gap-26">
        {categoryData.map((category, index) => {
          return (
            <div
              key={index}
              className="w-40 h-48  lg:w-50 rounded-xl group lg:h-58 object-scale-down overflow-hidden shadow-lg"
            >
              <img
                alt={category.name}
                src={category.image}
                className="w-36 h-40 lg:w-48 lg:h-50 object-scale-down rounded-xl"
                key={index}
              />
              <div className="hidden group-hover:flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditModel(true);
                    setEditData(category);
                  }}
                  className="flex-1 cursor-pointer bg-green-400 text-black hover:bg-green-300 font-medium rounded-lg py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenConfirmboxDelete(true);
                    setDeleteCategory(category)
                  }}
                  className="flex-1 cursor-pointer bg-red-600 text-white hover:bg-red-400 font-medium rounded-lg py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <Loading />}

      {/* Fixed: use consistent variable name */}
      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {editModelOpen && (
        <EditCategory
          close={() => {
            setEditModel(false);
          }}
          fetchdata={fetchCategory}
          data={editData}
        />
      )}

      {openConfirmBoxDelete && (
        <ConfirmBox
          close={() => setOpenConfirmboxDelete(false)}
          cancel={() => setOpenConfirmboxDelete(false)}
          confirm={HandelDelete}
          message={"Are You sure to permnently delete this Category?"}
        />
      )}
    </section>
  );
};  

export default CategoryPage;
