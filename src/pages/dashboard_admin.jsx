import React from 'react';
import { useSpring, animated } from '@react-spring/web'
import { BookOutlined, MoneyCollectOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import RatingChart from '../component/rating_chart';
import BookBoughtChart from '../component/book_bought_chart';

const DashboardAdmin = () => {
    const user=useSpring({users:200,from:{users:0}})
    const book=useSpring({books:1287,from:{books:0}})
    const order=useSpring({orders:431,from:{orders:0}})
    const bought=useSpring({boughts:312,from:{boughts:0}})
    return (
        <div className='w-full '>
            <div className='w-full flex justify-start p-4 mb-4 border-b-[1px] border-solid border-gray-300'>
                <p className='text-xl font-medium px-4'>Dashboard</p>
            </div>
            <div className='flex justify-around'>
                <div className='bg-white flex justify-start items-center w-[270px] h-[113px]'>
                    <div className=' ml-4 w-[66px] h-[66px] flex justify-center items-center rounded-[50%] bg-teal-700'>
                        <UserOutlined style={{color:'white', fontSize:20}}/>
                    </div>
                    <div className='ml-4 mt-4'>
                        <div className='text-4xl font-bold'>
                            <animated.div>
                                {user.users.to((val)=>Math.floor(val))}
                            </animated.div>
                        </div>
                        <p className='text-xl font-medium'>Users</p>
                    </div>
                </div>
                <div className='bg-white flex justify-start items-center w-[270px] h-[113px]'>
                    <div className=' ml-4 w-[66px] h-[66px] flex justify-center items-center rounded-[50%] bg-red-400'>
                        <BookOutlined style={{color:'white',fontSize:20}} />
                    </div>
                    <div className='ml-4 mt-4'>
                        <div className='text-4xl font-bold'>
                            <animated.div>
                                {book.books.to((val)=>Math.floor(val))}
                            </animated.div>
                        </div>
                        <p className='text-xl font-medium'>Books</p>
                    </div>
                </div>
                <div className='bg-white flex justify-start items-center w-[270px] h-[113px]'>
                    <div className=' ml-4 w-[66px] h-[66px] flex justify-center items-center rounded-[50%] bg-orange-400'>
                        <ShoppingOutlined style={{color:'white',fontSize:20}} />
                    </div>
                    <div className='ml-4 mt-4'>
                        <div className='text-4xl font-bold'>
                            <animated.div>
                                {order.orders.to((val)=>Math.floor(val))}
                            </animated.div>
                        </div>
                        <p className='text-xl font-medium'>Orders</p>
                    </div>
                </div>
                <div className='bg-white flex justify-start items-center w-[270px] h-[113px]'>
                    <div className=' ml-4 w-[66px] h-[66px] flex justify-center items-center rounded-[50%] bg-purple-800'>
                        <MoneyCollectOutlined style={{color:'white',fontSize:20}} />
                    </div>
                    <div className='ml-4 mt-4'>
                        <div className='text-4xl font-bold'>
                            <animated.div>
                                {bought.boughts.to((val)=>Math.floor(val))}
                            </animated.div>
                        </div>
                        <p className='text-xl font-medium'>Bought</p>
                    </div>
                </div>


            </div>
            <div className=' m-8 bg-white w-[95%] h-[500px] p-4 '>
                <div className='flex justify-start w-full mb-4 border-b-[1px] border-gray-300'>
                    <p className='text-3xl font-medium'>Top sách đã bán</p>
                </div>
                <div className='w-full h-[400px]'>
                    <BookBoughtChart/>  
                </div>
            </div>
            <div className=' m-8 bg-white w-[95%] h-[500px] p-4 '>
                <div className='flex justify-start w-full mb-4 border-b-[1px] border-gray-300'>
                    <p className='text-3xl font-medium'>Top sách đánh giá cao</p>
                </div>
                <div className='w-full h-[400px]'>
                    <RatingChart/> 
                </div>
            </div>
            
        </div>
    );
};

export default DashboardAdmin;