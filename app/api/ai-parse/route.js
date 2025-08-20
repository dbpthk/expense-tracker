import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text input required" },
        { status: 400 }
      );
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      const fallbackData = parseTextFallback(text);
      return NextResponse.json(fallbackData);
    }

    // Try OpenAI if available
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = `Parse the following text and extract budget/expense information. 
      Be very specific and descriptive with the name - avoid generic terms like "General" or "Food".
      Use context clues to create meaningful, specific names.
      
      Return a JSON object with this exact structure:
      {
        "type": "budget" or "expense",
        "name": "specific, descriptive name (not generic)",
        "amount": number,
        "category": "specific category",
        "date": "YYYY-MM-DD format",
        "description": "brief description",
        "icon": "relevant emoji for the category"
      }
      
      Examples:
      - "Spent $15 on Starbucks coffee" → name: "Starbucks Coffee", category: "Coffee & Drinks"
      - "Grocery shopping $85 at Woolworths" → name: "Woolworths Groceries", category: "Groceries"
      - "$30 Uber ride home" → name: "Uber Ride", category: "Transportation"
      
      Text: "${text}"
      
      Only return valid JSON, no other text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert financial assistant that creates specific, descriptive names for expenses and budgets. Never use generic terms. Always include relevant context and be specific.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error("No response from OpenAI");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(response);

        // Validate and enhance the response
        parsedData = validateAndEnhanceData(parsedData, text);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", response);
        const fallbackData = parseTextFallback(text);
        return NextResponse.json(fallbackData);
      }

      return NextResponse.json(parsedData);
    } catch (openaiError) {
      console.error("OpenAI error:", openaiError);
      const fallbackData = parseTextFallback(text);
      return NextResponse.json(fallbackData);
    }
  } catch (error) {
    console.error("Error in AI parsing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Validate and enhance AI response
function validateAndEnhanceData(data, originalText) {
  // Ensure required fields exist
  if (!data.name || data.name === "General" || data.name.length < 3) {
    data.name = extractSpecificName(originalText);
  }

  if (!data.amount || data.amount === 0) {
    const amountMatch = originalText.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    data.amount = amountMatch
      ? parseFloat(amountMatch[1].replace(/,/g, ""))
      : 0;
  }

  if (!data.date) {
    data.date = new Date().toISOString().split("T")[0];
  }

  if (!data.icon) {
    data.icon = getCategoryIcon(data.category || data.name);
  }

  if (!data.category) {
    data.category = data.name;
  }

  return data;
}

// Enhanced fallback parsing function
function parseTextFallback(text) {
  const lowerText = text.toLowerCase();

  // Extract amount with better regex for various formats
  const amountMatch = text.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : 0;

  // Determine type with better logic
  const isBudget =
    lowerText.includes("budget") ||
    lowerText.includes("monthly") ||
    lowerText.includes("weekly") ||
    lowerText.includes("limit") ||
    lowerText.includes("allowance");
  const type = isBudget ? "budget" : "expense";

  // Extract specific name with context
  const name = extractSpecificName(text);
  const category = getCategoryFromText(lowerText);
  const icon = getCategoryIcon(category);

  // Extract date with better logic
  const date = extractDate(lowerText);

  return {
    type,
    name,
    amount,
    category,
    date,
    description: text.substring(0, 100), // Limit description length
    icon,
  };
}

function extractSpecificName(text) {
  const lowerText = text.toLowerCase();

  // Remove common words and extract meaningful content
  const stopWords = [
    "the",
    "and",
    "for",
    "with",
    "from",
    "to",
    "in",
    "on",
    "at",
    "by",
    "of",
    "a",
    "an",
  ];
  const words = text
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        !/^\d+$/.test(word) &&
        !stopWords.includes(word.toLowerCase()) &&
        !word.toLowerCase().includes("$")
    );

  // Try to find brand names or specific locations
  const brands = [
    "starbucks",
    "mcdonalds",
    "uber",
    "lyft",
    "netflix",
    "spotify",
    "amazon",
    "woolworths",
    "coles",
  ];
  const foundBrand = brands.find((brand) => lowerText.includes(brand));

  if (foundBrand) {
    const category = getCategoryFromText(lowerText);
    return `${
      foundBrand.charAt(0).toUpperCase() + foundBrand.slice(1)
    } ${category}`;
  }

  // Use context clues for specific naming
  if (lowerText.includes("coffee") || lowerText.includes("cafe")) {
    return words.length > 0 ? `${words[0]} Coffee` : "Coffee Purchase";
  }

  if (lowerText.includes("lunch") || lowerText.includes("dinner")) {
    return words.length > 0 ? `${words[0]} Meal` : "Restaurant Meal";
  }

  if (lowerText.includes("grocery") || lowerText.includes("shopping")) {
    return words.length > 0 ? `${words[0]} Shopping` : "Grocery Shopping";
  }

  if (lowerText.includes("transport") || lowerText.includes("ride")) {
    return words.length > 0 ? `${words[0]} Transport` : "Transportation";
  }

  // Use the most descriptive words available
  const meaningfulWords = words.filter((word) => word.length > 4);
  if (meaningfulWords.length > 0) {
    return meaningfulWords
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  if (words.length > 0) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  }

  return "Expense Item";
}

function getCategoryFromText(lowerText) {
  if (
    lowerText.includes("grocery") ||
    lowerText.includes("food") ||
    lowerText.includes("supermarket")
  )
    return "Groceries";
  if (
    lowerText.includes("coffee") ||
    lowerText.includes("cafe") ||
    lowerText.includes("starbucks")
  )
    return "Coffee & Drinks";
  if (
    lowerText.includes("lunch") ||
    lowerText.includes("dinner") ||
    lowerText.includes("restaurant")
  )
    return "Dining Out";
  if (
    lowerText.includes("transport") ||
    lowerText.includes("uber") ||
    lowerText.includes("taxi") ||
    lowerText.includes("gas")
  )
    return "Transportation";
  if (
    lowerText.includes("movie") ||
    lowerText.includes("netflix") ||
    lowerText.includes("entertainment")
  )
    return "Entertainment";
  if (
    lowerText.includes("shopping") ||
    lowerText.includes("clothes") ||
    lowerText.includes("amazon")
  )
    return "Shopping";
  if (
    lowerText.includes("health") ||
    lowerText.includes("medical") ||
    lowerText.includes("doctor")
  )
    return "Healthcare";
  if (
    lowerText.includes("rent") ||
    lowerText.includes("mortgage") ||
    lowerText.includes("utilities")
  )
    return "Housing";
  if (
    lowerText.includes("education") ||
    lowerText.includes("course") ||
    lowerText.includes("book")
  )
    return "Education";
  if (
    lowerText.includes("travel") ||
    lowerText.includes("vacation") ||
    lowerText.includes("hotel")
  )
    return "Travel";
  if (
    lowerText.includes("gym") ||
    lowerText.includes("fitness") ||
    lowerText.includes("workout")
  )
    return "Fitness";
  if (
    lowerText.includes("pet") ||
    lowerText.includes("dog") ||
    lowerText.includes("cat")
  )
    return "Pets";
  if (lowerText.includes("gift") || lowerText.includes("birthday"))
    return "Gifts";
  if (lowerText.includes("insurance")) return "Insurance";
  if (lowerText.includes("investment") || lowerText.includes("stock"))
    return "Investments";

  return "General";
}

function getCategoryIcon(category) {
  const iconMap = {
    Groceries: "🛒",
    "Coffee & Drinks": "☕",
    "Dining Out": "🍽️",
    Transportation: "🚗",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Healthcare: "🏥",
    Housing: "🏠",
    Education: "📚",
    Travel: "✈️",
    Fitness: "💪",
    Pets: "🐕",
    Gifts: "🎁",
    Insurance: "🛡️",
    Investments: "📈",
    General: "💰",
  };

  return iconMap[category] || "💰";
}

function extractDate(lowerText) {
  let date = new Date().toISOString().split("T")[0];

  if (lowerText.includes("yesterday")) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    date = yesterday.toISOString().split("T")[0];
  } else if (lowerText.includes("today")) {
    date = new Date().toISOString().split("T")[0];
  } else if (lowerText.includes("tomorrow")) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    date = tomorrow.toISOString().split("T")[0];
  } else if (lowerText.includes("last week")) {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    date = lastWeek.toISOString().split("T")[0];
  }

  // Try to extract specific dates (MM/DD, DD/MM, etc.)
  const dateMatch = lowerText.match(/(\d{1,2})[\/\-](\d{1,2})/);
  if (dateMatch) {
    const currentYear = new Date().getFullYear();
    const month = parseInt(dateMatch[1]);
    const day = parseInt(dateMatch[2]);

    // Assume MM/DD format for now
    if (month <= 12 && day <= 31) {
      const extractedDate = new Date(currentYear, month - 1, day);
      date = extractedDate.toISOString().split("T")[0];
    }
  }

  return date;
}
