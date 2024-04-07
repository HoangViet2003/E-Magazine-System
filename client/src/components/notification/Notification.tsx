import React, { useState, useEffect } from 'react';
import profile from '../../assets/profile1.png'
import { useNotifications } from '../../redux/hooks/useNotification';
import InfiniteScroll from 'react-infinite-scroll-component';

const Notification = () => {
    // const notifications = [
    //     {
    //         sender: 'Jese Leos',
    //         message: "Hey, what's up? All set for the presentation?",
    //         time: 'a few moments ago',
    //         avatar: 'https://example.com/avatar1.jpg',
    //     },
    //     {
    //         sender: 'Joseph Mcfall',
    //         message: '5 others started following you.',
    //         time: '10 minutes ago',
    //         avatar: 'https://example.com/avatar2.jpg',
    //     },
    //     {
    //         sender: 'Bonnie Green',
    //         message: '141 others love your story. See it and view more stories.',
    //         time: '44 minutes ago',
    //         avatar: 'https://example.com/avatar3.jpg',
    //     },
    //     {
    //         sender: 'Leslie Livingston',
    //         message: '@bonnie.green what do you say?',
    //         time: '44 minutes ago',
    //         avatar: 'https://example.com/avatar4.jpg',
    //     },
    //     {
    //         sender: 'Robert Brown',
    //         message: 'Glassmorphism - learn how to implement the new design trend.',
    //         time: '3 hours ago',
    //         avatar: 'https://example.com/avatar5.jpg',
    //     },
    //     {
    //         sender: 'Robert Brown',
    //         message: 'Glassmorphism - learn how to implement the new design trend.',
    //         time: '3 hours ago',
    //         avatar: 'https://example.com/avatar5.jpg',
    //     },
    //     {
    //         sender: 'Robert Brown',
    //         message: 'Glassmorphism - learn how to implement the new design trend.',
    //         time: '3 hours ago',
    //         avatar: 'https://example.com/avatar5.jpg',
    //     },
    //     {
    //         sender: 'Robert Brown',
    //         message: 'Glassmorphism - learn how to implement the new design trend.',
    //         time: '3 hours ago',
    //         avatar: 'https://example.com/avatar5.jpg',
    //     },
    //     {
    //         sender: 'Robert Brown',
    //         message: 'Glassmorphism - learn how to implement the new design trend.',
    //         time: '3 hours ago',
    //         avatar: 'https://example.com/avatar5.jpg',
    //     },
    //     {
    //         sender: 'Robert Brown',
    //         message: 'Glassmorphism - learn how to implement the new design trend.',
    //         time: '3 hours ago',
    //         avatar: 'https://example.com/avatar5.jpg',
    //     },
    // ];

    const { getAllNotifications, notifications, totalPage, totalNotification, currentPage, handleSetCurrentPage } = useNotifications();

    useEffect(() => {
        getAllNotifications(currentPage);
    }, []);

    console.log(notifications)

    return (
        <div className="bg-white rounded-lg shadow-md p-4 z-[9999] w-[420px] ">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <button className="text-blue-500 hover:text-blue-700">View all</button>
            </div>
            <div className="space-y-4  ">
                <InfiniteScroll
                    style={{height: '500px'}}
                    dataLength={notifications?.length}
                    next={() => {
                        getAllNotifications(currentPage + 1);
                        handleSetCurrentPage(currentPage + 1);
                    }}
                    hasMore={currentPage !== totalPage}
                    loader={
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                    }
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>You have seen it all</b>
                        </p>
                    }>
                    {notifications?.map((notification, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <img
                                src={profile}
                                alt='avatar'
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-semibold">{notification?.title}</p>
                                <p className="text-gray-600">{notification?.message}</p>
                                <p className="text-gray-500 text-sm">{notification?.createdAt}</p>
                            </div>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </div >
    );
};

export default Notification;