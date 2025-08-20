"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Bell, Download, Settings, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Memoized ToggleSwitch component for better performance
const ToggleSwitch = React.memo(
  ({ enabled, onChange, label, description, disabled = false }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? "bg-blue-600" : "bg-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 h-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
);

ToggleSwitch.displayName = "ToggleSwitch";

const SettingsPage = () => {
  const { user } = useUser();
  const { subscription } = useSubscription();
  const [notifications, setNotifications] = useState({
    pushNotifications: false,
    overspendingAlerts: true,
    budgetWarnings: true,
    soundEnabled: false,
  });

  const [exporting, setExporting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [xlsxLoaded, setXlsxLoaded] = useState(false);
  const [XLSX, setXLSX] = useState(null);

  // Ensure component only runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load XLSX library when component mounts
  useEffect(() => {
    if (isClient) {
      import("xlsx")
        .then((module) => {
          setXLSX(module);
          setXlsxLoaded(true);
        })
        .catch((error) => {
          console.error("Failed to load XLSX library:", error);
          setXlsxLoaded(false);
        });
    }
  }, [isClient]);

  // Check if browser supports notifications
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Load saved notification settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(
      `notificationSettings_${user?.id}`
    );
    if (savedSettings) {
      setNotifications(JSON.parse(savedSettings));
    }
  }, [user?.id]);

  // Save notification settings to localStorage
  const updateNotificationSetting = useCallback(
    (key, value) => {
      const newSettings = { ...notifications, [key]: value };
      setNotifications(newSettings);
      localStorage.setItem(
        `notificationSettings_${user?.id}`,
        JSON.stringify(newSettings)
      );

      // If enabling push notifications, request permission
      if (key === "pushNotifications" && value && "Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission !== "granted") {
              toast.error("Notification permission denied");
              // Revert the setting
              const revertedSettings = { ...newSettings, [key]: false };
              setNotifications(revertedSettings);
              localStorage.setItem(
                `notificationSettings_${user?.id}`,
                JSON.stringify(revertedSettings)
              );
            }
          });
        }
      }
    },
    [notifications, user?.id]
  );

  // Test notification function
  const testNotification = useCallback(
    async (type) => {
      if (type === "push" && notifications.pushNotifications) {
        try {
          // Check if browser supports notifications
          if (!("Notification" in window)) {
            toast.error("This browser doesn't support notifications");
            return;
          }

          // Request permission if not granted
          if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
              toast.error("Notification permission denied");
              return;
            }
          }

          if (Notification.permission === "granted") {
            const notification = new Notification("ExpensiGo Test", {
              body: "This is a test push notification from ExpensiGo!",
              icon: "/favicon.png",
              badge: "/favicon.png",
              tag: "test-notification",
            });

            // Add sound if enabled
            if (notifications.soundEnabled) {
              try {
                const audio = new Audio(
                  "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
                );
                await audio.play();
              } catch (audioError) {
                console.log("Audio play failed:", audioError);
              }
            }

            // Auto close after 5 seconds
            setTimeout(() => notification.close(), 5000);

            toast.success("Push notification sent successfully!");
          } else {
            toast.error(
              "Notification permission denied. Please enable notifications in your browser settings."
            );
          }
        } catch (error) {
          console.error("Error sending test notification:", error);
          toast.error("Failed to send test notification");
        }
      } else if (type === "toast") {
        toast.success("Test toast notification sent!", {
          description: "This is a test in-app notification",
        });
      }
    },
    [notifications.pushNotifications, notifications.soundEnabled]
  );

  const handleExport = useCallback(
    async (format) => {
      if (
        !subscription?.status ||
        (subscription.status !== "pro" && !subscription.canCreateUnlimited)
      ) {
        toast.error("Export feature is available for Pro users only", {
          description: "Upgrade to Pro to export your data.",
          action: {
            label: "Upgrade",
            onClick: () => (window.location.href = "/dashboard/upgrade"),
          },
        });
        return;
      }

      try {
        setExporting(true);

        // Fetch user data
        const [budgetsResponse, expensesResponse] = await Promise.all([
          fetch(
            `/api/budgets?email=${user?.primaryEmailAddress?.emailAddress}`
          ),
          fetch(
            `/api/expenses?email=${user?.primaryEmailAddress?.emailAddress}`
          ),
        ]);

        if (!budgetsResponse.ok || !expensesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const budgets = await budgetsResponse.json();
        const expenses = await expensesResponse.json();

        const userData = {
          user: {
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName,
            exportDate: new Date().toISOString(),
          },
          budgets,
          expenses,
        };

        if (format === "xlsx") {
          // Ensure XLSX is loaded
          if (!xlsxLoaded || !XLSX || !XLSX.utils) {
            toast.error(
              "Excel export is still loading. Please wait a moment and try again."
            );
            return;
          }

          try {
            const workbook = XLSX.utils.book_new();

            // Create Budgets sheet
            if (budgets.length > 0) {
              const budgetWorksheet = XLSX.utils.json_to_sheet(budgets);
              XLSX.utils.book_append_sheet(
                workbook,
                budgetWorksheet,
                "Budgets"
              );
            }

            // Create Expenses sheet
            if (expenses.length > 0) {
              const expenseWorksheet = XLSX.utils.json_to_sheet(expenses);
              XLSX.utils.book_append_sheet(
                workbook,
                expenseWorksheet,
                "Expenses"
              );
            }

            // Create Summary sheet
            const summaryData = [
              { "Total Budgets": budgets.length },
              { "Total Expenses": expenses.length },
              { "Export Date": new Date().toLocaleDateString() },
              {
                User: user?.fullName || user?.primaryEmailAddress?.emailAddress,
              },
            ];
            const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

            XLSX.writeFile(
              workbook,
              `expensigo-data-${new Date().toISOString().split("T")[0]}.xlsx`
            );
            toast.success("Data exported as Excel successfully!");
          } catch (xlsxError) {
            console.error("XLSX export error:", xlsxError);
            toast.error("Failed to create Excel file. Please try again.");
          }
          return;
        }

        if (format === "json") {
          const dataStr = JSON.stringify(userData, null, 2);
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `expensigo-data-${
            new Date().toISOString().split("T")[0]
          }.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success("Data exported as JSON successfully!");
        } else if (format === "csv") {
          // Convert to CSV format
          const csvData = [
            ["Type", "Name", "Amount", "Category", "Date", "Color"],
            ...budgets.map((b) => [
              "Budget",
              b.name,
              b.amount,
              b.name,
              b.createdAt,
              b.color,
            ]),
            ...expenses.map((e) => [
              "Expense",
              e.name,
              e.amount,
              e.category,
              e.createdAt,
              e.color,
            ]),
          ];

          const csvContent = csvData
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");
          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `expensigo-data-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success("Data exported as CSV successfully!");
        }
      } catch (error) {
        console.error("Export error:", error);
        toast.error("Failed to export data");
      } finally {
        setExporting(false);
        setShowExportDialog(false);
      }
    },
    [
      subscription?.status,
      subscription?.canCreateUnlimited,
      user?.primaryEmailAddress?.emailAddress,
      user?.fullName,
      xlsxLoaded,
      XLSX,
    ]
  );

  // Memoized notification settings for better performance
  const notificationSettings = useMemo(
    () => [
      {
        key: "pushNotifications",
        label: "Push Notifications",
        description: "Receive browser notifications for important updates",
      },
      {
        key: "overspendingAlerts",
        label: "Overspending Alerts",
        description: "Get notified when you exceed your budget limits",
      },
      {
        key: "budgetWarnings",
        label: "Budget Warnings",
        description: "Receive warnings when approaching budget limits",
      },
      {
        key: "soundEnabled",
        label: "Sound Effects",
        description: "Play sounds for notifications and alerts",
      },
    ],
    []
  );

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Customize your ExpensiGo experience</p>
        </div>
      </div>

      {/* Notifications & Reminders Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Notifications & Reminders
          </h2>
        </div>

        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <ToggleSwitch
              key={setting.key}
              enabled={notifications[setting.key]}
              onChange={(value) =>
                updateNotificationSetting(setting.key, value)
              }
              label={setting.label}
              description={setting.description}
            />
          ))}
        </div>

        {/* Test Notifications */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Test Notifications</h3>
          <div className="flex gap-3">
            <Button
              onClick={() => testNotification("push")}
              disabled={!notifications.pushNotifications}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Test Push
            </Button>
            <Button
              onClick={() => testNotification("toast")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Test Toast
            </Button>
          </div>
          {!notifications.pushNotifications && (
            <p className="text-xs text-gray-500 mt-2">
              Enable push notifications to test browser notifications
            </p>
          )}
        </div>
      </div>

      {/* Data Management Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Data Management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => handleExport("xlsx")}
            disabled={exporting || !xlsxLoaded}
            className="flex items-center gap-2 p-4 h-auto flex-col"
          >
            {exporting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>Export as Excel</span>
            {!xlsxLoaded && (
              <span className="text-xs text-gray-400">Loading...</span>
            )}
          </Button>

          <Button
            onClick={() => handleExport("json")}
            disabled={exporting}
            variant="outline"
            className="flex items-center gap-2 p-4 h-auto flex-col"
          >
            <Download className="w-5 h-5" />
            <span>Export as JSON</span>
          </Button>

          <Button
            onClick={() => handleExport("csv")}
            disabled={exporting}
            variant="outline"
            className="flex items-center gap-2 p-4 h-auto flex-col"
          >
            <Download className="w-5 h-5" />
            <span>Export as CSV</span>
          </Button>
        </div>

        {!xlsxLoaded && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Excel export is loading. Please wait a moment before trying to
              export.
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Export Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Excel files include separate sheets for budgets, expenses, and
              summary
            </li>
            <li>
              • JSON format preserves all data structure and relationships
            </li>
            <li>• CSV format is compatible with spreadsheet applications</li>
            <li>• All exports include your email and export timestamp</li>
          </ul>
        </div>
      </div>

      {/* Account Information */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Account Information
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">User Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {user?.fullName || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <p>
                  <span className="font-medium">Member since:</span>{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Subscription</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Plan:</span>{" "}
                  {subscription?.status === "pro"
                    ? "Pro"
                    : subscription?.status === "trial"
                    ? "Free Trial"
                    : "Free"}
                </p>
                {subscription?.status === "trial" &&
                  subscription?.trialEndsAt && (
                    <p>
                      <span className="font-medium">Trial ends:</span>{" "}
                      {new Date(subscription.trialEndsAt).toLocaleDateString()}
                    </p>
                  )}
                <p>
                  <span className="font-medium">Features:</span>{" "}
                  {subscription?.status === "pro"
                    ? "Unlimited budgets & expenses, Export, AI parsing"
                    : "Limited budgets & expenses"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
