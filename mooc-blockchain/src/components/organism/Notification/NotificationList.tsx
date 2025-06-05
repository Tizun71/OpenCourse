"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  limit,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/utils/Firebase";
import { Bell, Clock, X, CheckCircle2, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  userId: number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  userId: number;
}

const NotificationList: React.FC<NotificationListProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const processedNotifications = useRef<Set<string>>(new Set());

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsList: Notification[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Notification)
      );

      setNotifications(notificationsList);
      setUnreadCount(notificationsList.filter((n) => !n.isRead).length);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const newScheduleNotification = notifications.find(
      (notification) =>
        notification.title === "Thông báo lịch học" &&
        !notification.isRead &&
        !processedNotifications.current.has(notification.id)
    );

    if (newScheduleNotification && !showDialog) {
      processedNotifications.current.add(newScheduleNotification.id);
      setSelectedNotification(newScheduleNotification);
      setShowDialog(true);
      markAsRead(newScheduleNotification.id);
    }
  }, [notifications, showDialog]);

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.title === "Thông báo lịch học") {
      setSelectedNotification(notification);
      setShowDialog(true);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedNotification(null);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const getNotificationIcon = (title: string) => {
    if (title === "Thông báo lịch học")
      return <Clock className="w-4 h-4 text-blue-500" />;
    return <AlertCircle className="w-4 h-4 text-orange-500" />;
  };

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
      >
        <Bell
          className={`w-6 h-6 transition-colors duration-200 ${
            unreadCount > 0 ? "text-blue-600" : "text-gray-600"
          } group-hover:text-blue-600`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />

          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-[380px] max-h-[500px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Thông báo
                </h3>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1 rounded-full hover:bg-white/50 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "all"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Tất cả ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "unread"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Chưa đọc ({unreadCount})
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {activeTab === "unread"
                      ? "Không có thông báo chưa đọc"
                      : "Không có thông báo nào"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group ${
                        !notification.isRead ? "bg-blue-50/50" : "bg-white"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            !notification.isRead ? "bg-blue-100" : "bg-gray-100"
                          } group-hover:scale-110 transition-transform duration-200`}
                        >
                          {getNotificationIcon(notification.title)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={`text-sm font-medium ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              } line-clamp-1`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>

                          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                            {notification.body}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showDialog && selectedNotification && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300"
            onClick={closeDialog}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedNotification.title}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Thông báo quan trọng
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDialog}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Đã đến giờ học!
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedNotification.body}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Thời gian:{" "}
                    {new Date(selectedNotification.createdAt).toLocaleString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeDialog}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
