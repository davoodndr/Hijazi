import React from 'react'
import ProductImageViewer from '../../components/ui/ProductImageViewer'
import StarRating from '../../components/user/StarRating'
import { Link } from 'react-router'

function ProductPageComponent() {
  return (
    <section className='w-9/10 flex flex-col mt-10'>

      <div className="flex space-x-10">
        {/* image viewer with magnification */}
        <ProductImageViewer
          className='w-[40%]'
        />

        {/* detail info */}
        <div className="flex-grow">
          <h2 className="text-4xl">Colorful Pattern Shirts HD450</h2>
          <div className="flex items-center justify-between py-3">
            <div>
              <span> Brand: <Link className='ms-3'>Bootstrap</Link></span>
            </div>
            <div className="inline-flex text-end">
              <StarRating />
              <span className="ml-5 text-gray-400"> (25 reviews)</span>
            </div>
          </div>
          <div className="border-y border-gray-200 flex items-center py-4">
            <div>
              <ins><span className="price-before price-before:!text-xl price-before:font-normal 
                price-before:!top-8 price-before:leading-8
                text-3xl font-semibold !items-start text-primary-400">120.00</span></ins>
              <ins><span className="text-base ml-4">200.00</span></ins>
              <span className=" ml-4">25% Off</span>
            </div>
          </div>
          {/* <div class="bt-1 border-color-1 mt-15 mb-15"></div>
          <div class="short-desc mb-30">
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam rem officia, corrupti reiciendis minima nisi modi, quasi, odio minus dolore impedit fuga eum eligendi? Officia doloremque facere quia. Voluptatum, accusantium!</p>
          </div>
          <div class="product_sort_info font-xs mb-30">
              <ul>
                  <li class="mb-10"><i class="fi-rs-crown mr-5"></i> 1 Year AL Jazeera Brand Warranty</li>
                  <li class="mb-10"><i class="fi-rs-refresh mr-5"></i> 30 Day Return Policy</li>
                  <li><i class="fi-rs-credit-card mr-5"></i> Cash on Delivery available</li>
              </ul>
          </div>
          <div class="attr-detail attr-color mb-15">
              <strong class="mr-10">Color</strong>
              <ul class="list-filter color-filter">
                  <li><a href="#" data-color="Red"><span class="product-color-red"></span></a></li>
                  <li><a href="#" data-color="Yellow"><span class="product-color-yellow"></span></a></li>
                  <li class="active"><a href="#" data-color="White"><span class="product-color-white"></span></a></li>
                  <li><a href="#" data-color="Orange"><span class="product-color-orange"></span></a></li>
                  <li><a href="#" data-color="Cyan"><span class="product-color-cyan"></span></a></li>
                  <li><a href="#" data-color="Green"><span class="product-color-green"></span></a></li>
                  <li><a href="#" data-color="Purple"><span class="product-color-purple"></span></a></li>
              </ul>
          </div>
          <div class="attr-detail attr-size">
              <strong class="mr-10">Size</strong>
              <ul class="list-filter size-filter font-small">
                  <li><a href="#">S</a></li>
                  <li class="active"><a href="#">M</a></li>
                  <li><a href="#">L</a></li>
                  <li><a href="#">XL</a></li>
                  <li><a href="#">XXL</a></li>
              </ul>
          </div>
          <div class="bt-1 border-color-1 mt-30 mb-30"></div>
          <div class="detail-extralink">
              <div class="detail-qty border radius">
                  <a href="#" class="qty-down"><i class="fi-rs-angle-small-down"></i></a>
                  <span class="qty-val">1</span>
                  <a href="#" class="qty-up"><i class="fi-rs-angle-small-up"></i></a>
              </div>
              <div class="product-extra-link2">
                  <button type="submit" class="button button-add-to-cart">Add to cart</button>
                  <a aria-label="Add To Wishlist" class="action-btn hover-up" href="shop-wishlist.html"><i class="fi-rs-heart"></i></a>
                  <a aria-label="Compare" class="action-btn hover-up" href="shop-compare.html"><i class="fi-rs-shuffle"></i></a>
              </div>
          </div>
          <ul class="product-meta font-xs color-grey mt-50">
              <li class="mb-5">SKU: <a href="#">FWM15VKT</a></li>
              <li class="mb-5">Tags: <a href="#" rel="tag">Cloth</a>, <a href="#" rel="tag">Women</a>, <a href="#" rel="tag">Dress</a> </li>
              <li>Availability:<span class="in-stock text-success ml-5">8 Items In Stock</span></li>
          </ul> */}
        </div>
      </div>
      
      
    </section>
  )
}

const ProductPage = React.memo(ProductPageComponent)

export default ProductPage