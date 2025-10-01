import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/useAxios'
import summeryApis from '../common/summuryApi'
import CartProduct from '../components/CartProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import nothing from "../assets/nothing here yet.webp"

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const loadingCardsArray = new Array(12).fill(null)

  const params = useLocation()
  const searchText = params?.search?.slice(3) || ""   // ✅ fallback

  const fetchData = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...summeryApis.searchProducts,
        data: {
          search: searchText.toLowerCase(),
          page: page,
        },
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data)
        } else {
          setData((prev) => [...prev, ...responseData.data]) // ✅ fixed .toLocaleLowerCase()
        }
        setTotalPage(responseData.totalPage || 1)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1) // reset page when search changes
    fetchData()
  }, [searchText])

  useEffect(() => {
    if (page > 1) {
      fetchData()
    }
  }, [page])

  const handleFetchMoreProducts = () => {
    if (totalPage > page) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto p-3 sm:p-4">
        {/* Title */}
        <p className="font-semibold text-base sm:text-lg mb-3">
          Search Results: {data.length}
        </p>

        {/* Infinite Scroll Grid */}
        <InfiniteScroll
          dataLength={data.length}
          hasMore={page < totalPage}
          next={handleFetchMoreProducts}
          loader={<h4 className="text-center p-4">Loading...</h4>}
          scrollThreshold={0.9}
        >
          <div
            className="
              grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
              overflow-x-hidden
            "
          >
            {/* Products */}
            {data.map((p, index) => (
              <CartProduct
                data={p}
                key={p._id + 'searchProduct' + index}
              />
            ))}

            {/* Loading skeletons */}
            {loading &&
              loadingCardsArray.map((_, index) => (
                <CardLoading key={'loadingCard' + index} />
              ))}
          </div>
        </InfiniteScroll>

        {/* No Data */}
        {!data[0] && !loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <img
              src={nothing}
              alt="No Data"
              className="w-60 sm:w-72 md:w-80 opacity-70"
            />
            <p className="mt-4 text-gray-600 font-semibold text-center">
              No Data Found
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchPage
