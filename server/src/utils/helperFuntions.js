export const countProductsNbrands = (products, category) => {

  const pList = [], bList = [];
  for (const p of products) {
    if (
      (category?._id?.toString() === p?.category?._id?.toString() ||
        category?._id?.toString() === p?.category?.parentId?._id?.toString()) &&
      !pList?.includes(p?._id?.toString())
    ) {
      pList.push(p?._id?.toString());

      if (!bList?.includes(p?.brand?._id?.toString())) bList.push(p?.brand?._id?.toString());
    }
  }
  return {
    ...category,
    products: pList?.length,
    brands: bList?.length,
  };
}