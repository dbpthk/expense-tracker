# 🚀 Stripe Localhost Testing Setup Guide

## 📋 **Prerequisites**

### **1. Stripe Account Setup**

- [ ] Create/Login to [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Switch to **Test Mode** (toggle in top-right corner)
- [ ] Note your **Publishable Key** and **Secret Key**

### **2. Environment Variables**

Create a `.env.local` file in your project root with:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe test secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Your webhook secret
STRIPE_PRO_PRICE_ID=price_... # Your Pro plan price ID

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
```

## 🛠️ **Step-by-Step Setup**

### **Step 1: Create Stripe Product & Price**

1. Go to **Products** → **Add Product**
2. **Product Name**: "ExpensiGo Pro"
3. **Price**: $2.99 AUD, Monthly recurring
4. **Copy Price ID**: `price_...` (you'll need this)

### **Step 2: Configure Webhooks**

1. Go to **Developers** → **Webhooks**
2. **Add endpoint**: `http://localhost:3000/api/stripe/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy Webhook Secret**: `whsec_...`

### **Step 3: Enable Customer Portal**

1. Go to **Settings** → **Billing** → **Customer Portal**
2. **Enable**: Customer portal
3. **Configure**: Billing, payment methods, invoices

### **Step 4: Test Cards**

Use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## 🧪 **Testing the Integration**

### **1. Start Your App**

```bash
npm run dev
```

### **2. Test Upgrade Flow**

1. Go to `/dashboard/upgrade`
2. Click "Upgrade to Pro"
3. Should redirect to Stripe checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete payment

### **3. Check Webhook Events**

- Monitor your server console for webhook logs
- Check Stripe Dashboard → **Webhooks** → **Events**

### **4. Verify Subscription**

- Check if user status changed to "pro"
- Verify Pro features are unlocked
- Test downgrade functionality

## 🔍 **Troubleshooting**

### **Common Issues & Solutions**

#### **"Price ID is required" Error**

- ✅ Check `STRIPE_PRO_PRICE_ID` in `.env.local`
- ✅ Verify price ID exists in Stripe Dashboard
- ✅ Ensure price is active and not archived

#### **"Stripe not configured" Error**

- ✅ Check `STRIPE_SECRET_KEY` in `.env.local`
- ✅ Verify key starts with `sk_test_` (test mode)
- ✅ Restart your dev server after adding env vars

#### **Webhook Not Working**

- ✅ Check `STRIPE_WEBHOOK_SECRET` in `.env.local`
- ✅ Verify webhook endpoint is correct
- ✅ Ensure webhook events are selected

#### **Checkout Session Fails**

- ✅ Verify price ID is correct
- ✅ Check Stripe Dashboard for errors
- ✅ Ensure test mode is enabled

## 📱 **Testing Without Stripe CLI**

Since Stripe CLI installation had issues, we can test using:

### **1. Stripe Dashboard Testing**

- Use **Test Mode** in Stripe Dashboard
- Monitor webhook events manually
- Check subscription status in real-time

### **2. Browser Console Logging**

- Check browser console for errors
- Monitor network requests to Stripe API
- Verify checkout session creation

### **3. Server Logs**

- Check terminal/server logs for API errors
- Monitor webhook event processing
- Verify subscription updates

## 🎯 **Next Steps After Setup**

1. **Test Complete Flow**: Upgrade → Payment → Pro Access
2. **Test Webhooks**: Verify subscription events
3. **Test Downgrade**: Cancel subscription → Free plan
4. **Test Billing Portal**: Manage subscription
5. **Production Ready**: Switch to live keys when deploying

## 📞 **Need Help?**

- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Test Mode Guide**: [stripe.com/docs/testing](https://stripe.com/docs/testing)
