import { LuPackagePlus, LuUserRoundPlus } from "react-icons/lu";
import { RiApps2AddLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";

export const dataBank = {
  users: {
    entity: 'users',
    title: 'Users Management',
    subTitle: 'Add, edit and delete users',
    gridCols:'grid-cols-[30px_1.75fr_0.5fr_1.25fr_0.75fr_0.5fr_0.75fr_0.75fr]',
    headers: [
      {sortOptions : [
        {title: 'user',field: 'name', ascending: true},
        {title: 'roles',field: '', ascending: true},
        {title: 'contact',field: 'mobile', ascending: true},
        {title: 'orders',field: 'orderDetails.orders', ascending: true},
        {title: 'reviews',field: 'reviews', ascending: true},
        {title: 'status',field: 'status', ascending: true},
      ]}
    ],
    centerHeaders: [4,5],
    fields : ['username','email','roles','status','mobile'],
    filterMenus : [
      {label: 'none', value: {}, color: '--color-gray-200'},
      {label: 'roles', color: '--color-violet-400',
        children: [
          {label: 'user', value: {'roles': 'user'}, color: '--color-amber-400'},
          {label: 'admin', value: {'roles': 'admin'}, color: '--color-blue-400'},
        ]
      },
      {label: 'status', color: '--color-green-400',
        children: [
          {label: 'active', value: {'status': 'active'}, color: '--color-green-400'},
          {label: 'inactive', value: {'status': 'inactive'}, color: '--color-gray-400'},
          {label: 'blocked', value: {'status': 'blocked'}, color: '--color-red-400'},
        ]
      },
    ],
    sortMenus : [
      {field: 'none', label: 'none', color: '--color-gray-200'},
      {field: 'username', label: 'user name', color: '--color-amber-400'},
      {field: 'fullname', label: 'full name', color: '--color-pink-400'},
      {field: 'email', label: 'email', color: '--color-blue-400'},
      {field: 'join', label: 'join date', color: '--color-green-400'},
      {field: 'last_login', label: 'login', color: '--color-violet-400'},
    ],
    actions: [
      {
        type: 'route',
        label: 'Add User',
        icon: <LuUserRoundPlus size={20} />,
        route: '/admin/users/add-user'
      }
    ]
  },
  orders: {
    entity: 'orders',
    title: 'Order Management',
    subTitle: 'View and manage orders',
    gridCols:'grid-cols-[30px_1.5fr_1fr_0.5fr_1fr_0.75fr_0.75fr_0.25fr]',
    headers: [
      {sortOptions : [
        {title: 'items',field: 'itemsCount', ascending: true},
        {title: 'customer',field: 'billingAddress.name', ascending: true},
        {title: 'date',field: 'createdAt', ascending: true},
        {title: 'amount',field: 'totalPrice', ascending: true},
        {title: 'payment',field: 'paymentMethod', ascending: true},
        {title: 'status',field: 'status', ascending: true},
      ]}
    ],
    centerHeaders: [3,5],
    fields : [''],
    filterMenus : [
      {label: 'none', value: {}, color: '--color-gray-200'},
      {label: 'status', color: '--color-pink-300',
        children: [
          {label: 'pending', value: {'status': 'pending'}, color: '--color-gray-400'},
          {label: 'processing', value: {'status': 'processing'}, color: '--color-amber-400'},
          {label: 'shipped',  value: {'status': 'shipped'}, color: '--color-blue-400'},
          {label: 'out for delivery',  value: {'status': 'out-for-del'}, color: '--color-violet-400'},
          {label: 'delivered',  value: {'status': 'delivered'}, color: '--color-green-400'},
          {label: 'cancelled',  value: {'status': 'cancelled'}, color: '--color-black'},
          {label: 'failed',  value: {'status': 'failed'}, color: '--color-red-400'},
          {label: 'refunded',  value: {'status': 'refunded'}, color: '--color-teal-500'},
        ]
      },
      {label: 'payment method', color: '--color-amber-400',
        children: [
          {label: 'cash on delivery', value: {'paymentMethod': 'cod'}, color: '--color-gray-400'},
          {label: 'razorpay', value: {'paymentMethod': 'razor-pay'}, color: '--color-blue-400'},
        ]
      },
    ],
    sortMenus : [
      {field: 'none', label: 'none', color: '--color-gray-200'},
      {field: 'createdAt', label: 'order date', color: '--color-green-400'},
      {field: 'order_no', label: 'order no.', color: '--color-amber-400'},
      {field: 'billingAddress.city', label: 'customer\'s city', color: '--color-blue-400'},
      {field: 'isPaid', label: 'payment status', color: '--color-pink-400'},
    ],
    actions: []
  },
  reviews: {
    entity: 'reviews',
    title: 'Review Management',
    subTitle: 'View and analize user reviews',
    gridCols:'grid-cols-[30px_1fr_1.25fr_0.75fr_1fr_1.25fr_0.75fr_0.25fr]',
    headers: [
      {sortOptions : [
        {title: 'users',field: 'user_name', ascending: true},
        {title: 'product',field: 'product_name', ascending: true},
        {title: 'rating',field: 'rating', ascending: true},
        {title: 'title',field: 'title', ascending: true},
        {title: 'review',field: '', ascending: true},
        {title: 'status',field: 'status', ascending: true},
      ]}
    ],
    centerHeaders: [5],
    fields : ['user_name','product_name','category_name'],
    filterMenus : [
      {label: 'none', value: {}, color: '--color-gray-200'},
      {label: 'status', color: '--color-green-400',
        children: [
          {label: 'pending', value: {'status': 'pending'}, color: '--color-gray-400'},
          {label: 'approved', value: {'status': 'approved'}, color: '--color-green-400'},
          {label: 'hidden', value: {'status': 'hidden'}, color: '--color-red-400'},
        ]
      },
    ],
    sortMenus : [
      {field: 'none', label: 'none', color: '--color-gray-200'},
      {field: 'createdAt', label: 'review date', color: '--color-amber-400'},
      {field: 'category_name', label: 'product category', color: '--color-blue-400'}
    ],
    actions: []
  },
  products: {
    entity: 'products',
    title: 'Product Management',
    subTitle: 'Add, edit and delete products',
    gridCols:'grid-cols-[40px_2fr_1.5fr_1fr_0.75fr_1.25fr_88px]',
    headers: [
      {sortOptions : [
        {title: 'product',field: 'name', ascending: true},
        {title: 'category',field: 'category_name', ascending: true},
        {title: 'price',field: 'effective_price', ascending: true},
        {title: 'stock',field: 'effective_stock', ascending: true},
        {title: 'status',field: 'status', ascending: true},
        /* {title: 'visible',field: 'visible', ascending: true}, */
      ]}
    ],
    centerHeaders: [3,4,5],
    fields : ['name','slug'],
    filterMenus : [
      {label: 'none', value: {}, color: '--color-gray-200'},
      {label: 'status', color: '--color-green-400',
        children: [
          {label: 'active', value: {'status': 'active'}, color: '--color-green-400'},
          {label: 'inactive', value: {'status': 'inactive'}, color: '--color-gray-400'},
        ]
      },
      {label: 'featured', value: {'featured': true}, color: '--color-blue-400'},
      {label: 'visible', value: {'visible': true}, color: '--color-pink-400'},
      {label: 'out of stock', value: {'effective_stock': 0}, color: '--color-red-400'},
      {label: 'archived', value: {'archived': true}, color: '--color-black'},
    ],
    sortMenus : [
      {field: 'none', label: 'none', color: '--color-gray-200'},
      {field: 'variant_count', label: 'variant\'s count', color: '--color-amber-400'},
      {field: 'parent_category', label: 'main category', color: '--color-blue-400'},
      {field: 'averageRating', label: 'rating', color: '--color-pink-400'},
    ],
    actions: [
      {
        type: 'route',
        label: 'Add Product',
        icon: <LuPackagePlus size={20} />,
        route: '/admin/products/add-product'
      }
    ]
  },
  offers: {
    entity: 'offers',
    title: 'Offer Management',
    subTitle: 'Add, edit and delete offers',
    gridCols:'grid-cols-[30px_1.5fr_1fr_1fr_1.25fr_1fr_1fr_1fr]',
    headers: [
      {sortOptions : [
        {title: 'offer',field: 'title', ascending: true},
        {title: 'discount',field: 'discountValue', ascending: true},
        {title: 'validity',field: 'startDate', ascending: true},
        {title: 'min. purchase',field: 'minPurchase', ascending: true},
        {title: 'limit',field: 'usageLimit', ascending: true},
        {title: 'status',field: 'status', ascending: true},
      ]}
    ],
    centerHeaders: [5],
    fields : ['title','status'],
    filterMenus : [
      {label: 'none', value: {}, color: '--color-gray-200'},
      {label: 'offer type', color: '--color-pink-400',
        children: [
          {label: 'coupon', value: {'type': 'coupon'}, color: '--color-amber-400'},
          {label: 'product', value: {'type': 'product'}, color: '--color-teal-400'},
          {label: 'category', value: {'type': 'category'}, color: '--color-blue-400'},
          {label: 'cart', value: {'type': 'cart'}, color: '--color-violet-400'},
        ]
      },
      {label: 'discount type', color: '--color-sky-400',
        children: [
          {label: 'fixed', value: {'discountType': 'fixed'}, color: '--color-amber-400'},
          {label: 'percentage', value: {'discountType': 'percentage'}, color: '--color-violet-400'},
          {label: 'by one get one', value: {'discountType': 'bogo'}, color: '--color-pink-400'},
        ]
      },
      {label: 'status', color: '--color-green-400',
        children: [
          {label: 'active', value: {'status': 'active'}, color: '--color-green-400'},
          {label: 'inactive', value: {'status': 'inactive'}, color: '--color-gray-400'},
          {label: 'expired', value: {'status': 'expired'}, color: '--color-red-400'},
        ]
      },
    ],
    sortMenus : [
      {field: 'none', label: 'none', color: '--color-gray-200'},
      {field: 'type', label: 'offer type', color: '--color-pink-400'},
      {field: 'discountType', label: 'discount type', color: '--color-blue-400'},
      {field: 'maxDiscount', label: 'maximum discount', color: '--color-green-400'},
      {field: 'usagePerUser', label: 'user\'s limit', color: '--color-violet-400'},
      {field: 'endDate', label: 'end date', color: '--color-orange-400'},
    ],
    actions: [
      {
        type: 'modal',
        label: 'Add Offer',
        icon: <TbCategoryPlus size={20} />,
        route: null,
        action: 'openAddOfferModal'
      }
    ]
  },
  categories: {
    entity: 'categories',
    title: 'Category Management',
    subTitle: 'Add, edit and delete categories',
    gridCols:'grid-cols-[30px_1.75fr_1.5fr_1.5fr_1fr_1fr]',
    headers: [
      {sortOptions : [
        {title: 'category',field: 'name', ascending: true},
        {title: 'slug',field: 'slug', ascending: true},
        {title: 'parent',field: '', ascending: true},
        {title: 'status',field: 'status', ascending: true},
        /* {title: 'visible',field: 'visible', ascending: true}, */
      ]}
    ],
    centerHeaders: [],
    fields : ['name','slug'],
    filterMenus : [
      {label: 'none', value: {}, color: '--color-gray-200'},
      {label: 'featured', value: {'featured': true}, color: '--color-sky-400'},
      {label: 'status', color: '--color-green-400',
        children: [
          {label: 'active', value: {'status': 'active'}, color: '--color-green-400'},
          {label: 'inactive', value: {'status': 'inactive'}, color: '--color-gray-400'},
        ]
      },
      {label: 'visibility', color: '--color-pink-400',
        children: [
          {label: 'visible', value: {'visible': true}, color: '--color-amber-400'},
          {label: 'invisible', value: {'visible': false}, color: '--color-gray-400'},
        ]
      },
    ],
    sortMenus : [
      {field: 'none', label: 'none', color: '--color-gray-200'},
      {field: 'parent_name', label: 'parent name', color: '--color-amber-400'},
      {field: 'products', label: 'product count', color: '--color-blue-400'},
      {field: 'brands', label: 'brand count', color: '--color-pink-400'},
    ],
    actions: [
      {
        type: 'modal',
        label: 'Add Category',
        icon: <TbCategoryPlus size={20} />,
        route: null,
        action: 'openAddCategoryModal'
      }
    ]
  },
  brands: {
    entity: 'brands',
    title: 'Brand Management',
    subTitle: 'Add, edit and delete brands',
    gridCols:'grid-cols-[30px_1.5fr_1fr_1fr_1fr_0.75fr_1fr]',
    headers: [],
    centerHeaders: [],
    fields : ['name','slug'],
    filterMenus : [
      {label: 'none', value: {}, color: '--color-gray-200'},
      {label: 'featured', value: {'featured': true}, color: '--color-sky-400'},
      {label: 'status', color: '--color-green-400',
        children: [
          {label: 'active', value: {'status': 'active'}, color: '--color-green-400'},
          {label: 'inactive', value: {'status': 'inactive'}, color: '--color-gray-400'},
        ]
      },
      {label: 'visibility', color: '--color-pink-400',
        children: [
          {label: 'visible', value: {'visible': true}, color: '--color-amber-400'},
          {label: 'invisible', value: {'visible': false}, color: '--color-gray-400'},
        ]
      },
    ],
    sortMenus : [
      {field: 'none', label: 'none', color: '--color-gray-200'},
      {field: 'products', label: 'product count', color: '--color-blue-400'},
      {field: 'categories', label: 'catagory count', color: '--color-pink-400'},
    ],
    actions: [
      {
        type: 'modal',
        label: 'Add Brand',
        icon: <RiApps2AddLine size={20} />,
        route: null,
        action: 'openAddBrandModal'
      }
    ]
  },
}