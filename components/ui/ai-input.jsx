"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/context/SubscriptionContext";

const AIInput = ({ onDataParsed, type = "expense" }) => {
  const { subscription } = useSubscription();
  const isProUser =
    subscription?.status === "pro" || subscription?.status === "enterprise";
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const parseText = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to parse");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai-parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setParsedData(data);

      if (onDataParsed) {
        onDataParsed(data);
      }

      toast.success("Text parsed successfully!");
    } catch (error) {
      console.error("Error parsing text:", error);
      toast.error(`Failed to parse text: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    parseText();
  };

  const clearData = () => {
    setText("");
    setParsedData(null);
  };

  // AI parsing is Pro-only feature
  if (!isProUser) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-lg">
            AI-Powered Input (Pro Feature)
          </h3>
        </div>

        <p className="text-sm text-gray-600">
          Upgrade to Pro to unlock AI-powered expense and budget parsing. Simply
          describe your expenses in natural language and let AI do the work!
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-600" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">Pro Feature</h4>
              <p className="text-sm text-yellow-700">
                AI parsing is available for Pro users only. Upgrade now to
                unlock this powerful feature!
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/dashboard/upgrade")}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-lg">AI-Powered Input</h3>
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
          Pro
        </span>
      </div>

      <p className="text-sm text-gray-600">
        Describe your {type} in natural language and let AI parse it for you.
        <br />
        <span className="font-medium">Examples:</span>
        {type === "expense"
          ? ' "I spent $50 on groceries yesterday" or "Coffee $4.50 today"'
          : ' "Monthly budget of $500 for groceries" or "Budget $200 for entertainment"'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Describe your ${type}...`}
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !text.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Parse
          </Button>
        </div>
      </form>

      {parsedData && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Parsed Data:</span>
          </div>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Type:</span> {parsedData.type}
            </div>
            <div>
              <span className="font-medium">Name:</span> {parsedData.name}
            </div>
            <div>
              <span className="font-medium">Amount:</span> ${parsedData.amount}
            </div>
            {parsedData.category && (
              <div>
                <span className="font-medium">Category:</span>{" "}
                {parsedData.category}
              </div>
            )}
            {parsedData.date && (
              <div>
                <span className="font-medium">Date:</span> {parsedData.date}
              </div>
            )}
            {parsedData.description && (
              <div>
                <span className="font-medium">Description:</span>{" "}
                {parsedData.description}
              </div>
            )}
          </div>
          <Button
            onClick={clearData}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Clear
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader className="w-4 h-4 animate-spin" />
          <span>AI is parsing your text...</span>
        </div>
      )}
    </div>
  );
};

export default AIInput;
