import { UserButton } from "@clerk/nextjs";
import React, { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  const {
    notifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = getUnreadCount();
  const totalCount = notifications.length;

  const handleNotificationClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setIsOpen(false);
  };

  return (
    <div className="md:h-30 md:shadow-md flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Facebook-style notification bell with dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationClick}
            className="relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Notification Dropdown */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-50"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown Content - Stripe Style */}
              <div className="absolute left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    {totalCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-sm text-gray-500 hover:text-red-600 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[500px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium text-gray-900 mb-1">
                        No notifications
                      </p>
                      <p className="text-sm">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Status Indicator */}
                          <div className="flex-shrink-0 mt-1">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>

                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.read
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-400">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {totalCount > 0 && (
                  <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                    <p className="text-xs text-gray-500">
                      {unreadCount > 0
                        ? `${unreadCount} unread notifications`
                        : "All notifications read"}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {totalCount > 0 && (
          <span className="text-sm text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread` : "All read"} •{" "}
            {totalCount} total
          </span>
        )}
      </div>

      <div className="hidden lg:flex">
        <UserButton className="cursor-pointer" />
      </div>
    </div>
  );
};

export default DashboardHeader;
