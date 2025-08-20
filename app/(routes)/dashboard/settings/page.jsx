"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Bell, Download, Settings, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const ToggleSwitch = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
}) => (
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
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

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
  const updateNotificationSetting = (key, value) => {
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
            toast.error("Push notification permission denied");
            setNotifications((prev) => ({ ...prev, pushNotifications: false }));
          }
        });
      } else if (Notification.permission === "denied") {
        toast.error(
          "Push notifications are blocked. Please enable them in your browser settings."
        );
        setNotifications((prev) => ({ ...prev, pushNotifications: false }));
      }
    }
  };

  // Test notification function
  const testNotification = async (type) => {
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
  };

  const handleExport = async (format) => {
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
        fetch(`/api/budgets?email=${user?.primaryEmailAddress?.emailAddress}`),
        fetch(`/api/expenses?email=${user?.primaryEmailAddress?.emailAddress}`),
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
        const workbook = XLSX.utils.book_new();

        // Create Budgets sheet
        if (budgets.length > 0) {
          const budgetWorksheet = XLSX.utils.json_to_sheet(budgets);
          XLSX.utils.book_append_sheet(workbook, budgetWorksheet, "Budgets");
        }

        // Create Expenses sheet
        if (expenses.length > 0) {
          const expenseWorksheet = XLSX.utils.json_to_sheet(expenses);
          XLSX.utils.book_append_sheet(workbook, expenseWorksheet, "Expenses");
        }

        // Create Summary sheet
        const summaryData = [
          { "Total Budgets": budgets.length },
          { "Total Expenses": expenses.length },
          { "Export Date": new Date().toLocaleDateString() },
          { User: user?.fullName || user?.primaryEmailAddress?.emailAddress },
        ];
        const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

        XLSX.writeFile(
          workbook,
          `expensigo-data-${new Date().toISOString().split("T")[0]}.xlsx`
        );
        toast.success("Data exported as Excel successfully!");
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
  };

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
          <ToggleSwitch
            enabled={notifications.pushNotifications}
            onChange={(value) =>
              updateNotificationSetting("pushNotifications", value)
            }
            label="Push Notifications"
            description="Receive browser notifications for important alerts"
          />

          {notifications.pushNotifications &&
            "Notification" in window &&
            Notification.permission === "denied" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  ⚠️ Notifications are blocked. Please enable them in your
                  browser settings to receive alerts.
                </p>
              </div>
            )}

          <ToggleSwitch
            enabled={notifications.overspendingAlerts}
            onChange={(value) =>
              updateNotificationSetting("overspendingAlerts", value)
            }
            label="Overspending Alerts"
            description="Get notified when you exceed your budget limits"
          />

          <ToggleSwitch
            enabled={notifications.budgetWarnings}
            onChange={(value) =>
              updateNotificationSetting("budgetWarnings", value)
            }
            label="Budget Warning Alerts"
            description="Receive warnings when budgets are nearly depleted"
          />

          <ToggleSwitch
            enabled={notifications.soundEnabled}
            onChange={(value) =>
              updateNotificationSetting("soundEnabled", value)
            }
            label="Notification Sounds"
            description="Play sounds for push notifications"
          />
        </div>

        {/* Test Notifications */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Test Notifications</h3>

          {/* Notification Permission Status */}
          {"Notification" in window && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Browser Support:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Supported
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className="font-medium">Notification Permission:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    Notification.permission === "granted"
                      ? "bg-green-100 text-green-800"
                      : Notification.permission === "denied"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {Notification.permission === "granted"
                    ? "✅ Granted"
                    : Notification.permission === "denied"
                    ? "❌ Denied"
                    : "⏳ Default"}
                </span>
              </div>
              {Notification.permission === "default" && (
                <p className="text-xs text-blue-600 mt-1">
                  Click "Test Push" to request notification permission
                </p>
              )}
              {Notification.permission === "denied" && (
                <p className="text-xs text-red-600 mt-1">
                  Notifications are blocked. Please enable them in your browser
                  settings.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => testNotification("push")}
              disabled={!notifications.pushNotifications}
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Test Push
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testNotification("toast")}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Test Toast
            </Button>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Data Management
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-500">
                  Download all your data as JSON or CSV format
                  {subscription?.status !== "pro" &&
                    !subscription?.canCreateUnlimited && (
                      <span className="text-orange-600 font-medium ml-2">
                        (Pro feature)
                      </span>
                    )}
                </p>
              </div>
              <Button
                onClick={() => setShowExportDialog(true)}
                disabled={
                  !subscription?.status ||
                  (subscription.status !== "pro" &&
                    !subscription?.canCreateUnlimited)
                }
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
            <DialogDescription>
              Choose the format to export your budgets and expenses data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Button
              onClick={() => handleExport("xlsx")}
              disabled={exporting}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
            <Button
              onClick={() => handleExport("json")}
              disabled={exporting}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as JSON
            </Button>
            <Button
              onClick={() => handleExport("csv")}
              disabled={exporting}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
