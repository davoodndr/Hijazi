import React from 'react'

function BrandList() {
  return (
    <section className='flex flex-col p-6 bg-gray-100'>

      {/* page title & add category button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Category Management</h3>
          <span className='sub-title'>Add, edit and delete categories</span>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className='px-4! inline-flex items-center gap-2 text-white'>
          <TbCategoryPlus size={20} />
          <span>Add Category</span>
        </button>
      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Categories</span>
        </div>
      </div>

      {/* search */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center relative w-3/10">
          <LuSearch size={20} className='absolute left-3'/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder='Search users'
            className='pl-10! rounded-xl! bg-white' />
        </div>

        <div>
          <span>Filter</span>
        </div>
        
      </div>

      <motion.ul 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col">
        {/* Header */}

        <AnimatePresence>

          {loading ?
            <li className='w-full grid grid-cols-5 gap-6'>

              {
                [...Array(8)].map((_,i) => (
                  <div key={i} className='border border-gray-300 bg-white p-3 rounded-4xl shadow-md/4'>
                    <div className="flex rounded-3xl overflow-hidden">
                      <Skeleton className='w-[164]px h-[164px]' />
                    </div>
                    <div className="p-1 flex flex-col gap-1 justify-end relative">
                      <Skeleton height='h-4' width='w-7/10'/>
                      <Skeleton height='h-3' width='w-5/10'/>
                    </div>
                  </div>
                ))
              }
              
            </li>
            :
            <li className="w-full grid grid-cols-5 gap-6">

              {paginatedCategories.map((category, index) => 

                <div 
                  layout
                  key={category._id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className='border border-gray-300 bg-white p-3 rounded-4xl shadow-md/4'>

                  <div className="flex rounded-3xl overflow-hidden">
                    <img src={category.image} alt="image" />
                  </div>
                  <div className="p-1 flex flex-col justify-end relative">

                    <Menu as="div" className="absolute right-1 top-2 overflow-hidden w-2 inline-flex justify-center">
                      {({open}) => (
                        <>
                          <MenuButton className="!bg-transparent !text-gray-500 !p-0 !shadow-none">
                            <IoMdMore size={25} />
                          </MenuButton>

                          <ContextMenu
                            open={open}
                            items={[
                              {label: 'edit', icon: MdOutlineEdit, onClick: ()=> {}},
                              {label: 'delete', icon: HiOutlineTrash, onClick: ()=> {}}
                            ]}
                          />
                        </>
                      )}

                    </Menu>

                    <span className='text-sm font-semibold capitalize'>{category.name}</span>
                    <span className='text-xs'>{category.slug}</span>
                  </div>
                </div>

              )}

            </li>  
          }

        </AnimatePresence>

        {/* Pagination */}
        {paginatedCategories && <motion.li
          key="pagination"
          custom={filteredCategories.length + 1}
          initial="hidden"
          animate="visible"
          variants={rowVariants}
          className="px-4 py-5"
        >
          
          <AdminPagination 
            currentPage={currentPage} 
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            className={`grid grid-cols-1 items-center w-full bg-white border border-gray-300 
              p-4 rounded-xl`}
          />

        </motion.li>}

      </motion.ul>

      <AddCategoryModal
        onCreate={handleCreate}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

    </section>
  )
}

export default BrandList