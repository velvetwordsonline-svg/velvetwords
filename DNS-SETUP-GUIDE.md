# DNS Configuration Guide for e-stories.velvetwords.online

## Current Setup
- **Nameservers**: Hostinger (ns1.dns-parking.com, ns2.dns-parking.com)
- **Current e-stories record**: A record pointing to `82.25.125.47`

## ✅ Recommended Approach: Use CNAME Record (Keep Hostinger Nameservers)

**Keep your current Hostinger nameservers** and update the DNS records as shown below.

## Step-by-Step DNS Configuration

### Step 1: Deploy to Vercel First

1. Deploy your project to Vercel (via dashboard or CLI)
2. After deployment, go to **Settings → Domains** in Vercel
3. Add domain: `e-stories.velvetwords.online`
4. Vercel will show you the DNS configuration needed

### Step 2: Update DNS Records in Hostinger

Go to your Hostinger DNS management panel and make these changes:

#### Option A: Use CNAME (Recommended - Easier to manage)

1. **Delete the existing A record for `e-stories`**:
   - Find: `A | e-stories | 82.25.125.47`
   - Click **Delete**

2. **Delete the existing AAAA record for `e-stories`** (if you want):
   - Find: `AAAA | e-stories | 2a02:4780:11:774:0:2bbf:6b8d:4`
   - Click **Delete**

3. **Add a new CNAME record**:
   - **Type**: `CNAME`
   - **Name**: `e-stories`
   - **Points to**: `cname.vercel-dns.com` (or the value Vercel provides)
   - **TTL**: `300` (or `3600`)

#### Option B: Use A Record (If Vercel provides IP addresses)

If Vercel provides specific IP addresses instead of CNAME:

1. **Update the existing A record**:
   - Find: `A | e-stories | 82.25.125.47`
   - Click **Edit**
   - Change **Points to** to Vercel's IP address (Vercel will provide this)
   - **TTL**: `300` or `3600`

2. **Update the AAAA record** (if Vercel provides IPv6):
   - Find: `AAAA | e-stories | 2a02:4780:11:774:0:2bbf:6b8d:4`
   - Click **Edit**
   - Change **Points to** to Vercel's IPv6 address (if provided)

## 📋 Exact DNS Records to Configure

### After Vercel Deployment, You'll See:

In Vercel Dashboard → Settings → Domains → `e-stories.velvetwords.online`:

**Option 1: CNAME (Most Common)**
```
Type: CNAME
Name: e-stories
Value: cname.vercel-dns.com
TTL: 300
```

**Option 2: A Records (If CNAME not available)**
```
Type: A
Name: e-stories
Value: [IP address from Vercel]
TTL: 300
```

## 🔧 Step-by-Step in Hostinger Panel

1. **Log in to Hostinger**
2. **Go to**: Domain → DNS / Nameservers
3. **Find the `e-stories` records**:
   - Look for `A | e-stories | 82.25.125.47`
   - Look for `AAAA | e-stories | 2a02:4780:11:774:0:2bbf:6b8d:4`

4. **Delete the A record**:
   - Click **Delete** on the `A | e-stories | 82.25.125.47` record

5. **Delete the AAAA record** (optional, but recommended):
   - Click **Delete** on the `AAAA | e-stories | 2a02:4780:11:774:0:2bbf:6b8d:4` record

6. **Add CNAME record**:
   - Click **Add Record**
   - **Type**: Select `CNAME`
   - **Name**: Enter `e-stories`
   - **Points to**: Enter `cname.vercel-dns.com` (or value from Vercel)
   - **TTL**: Enter `300` or `3600`
   - Click **Save** or **Add**

## ⏱️ DNS Propagation

- DNS changes typically take **5-30 minutes** to propagate
- Can take up to **24-48 hours** in rare cases
- You can check propagation status at: https://www.whatsmydns.net/

## ✅ Verification

After DNS changes:

1. **Wait 5-30 minutes**
2. **Check DNS propagation**:
   ```bash
   # In terminal
   nslookup e-stories.velvetwords.online
   # or
   dig e-stories.velvetwords.online
   ```

3. **Verify in Vercel**:
   - Go to Vercel Dashboard → Settings → Domains
   - Check that `e-stories.velvetwords.online` shows as "Valid Configuration"

4. **Test the site**:
   - Visit `https://e-stories.velvetwords.online`
   - Should load your Vercel deployment

## 🚨 Important Notes

- **Don't change nameservers** - Keep using Hostinger nameservers
- **Keep other DNS records** - Don't delete records for `@`, `www`, `ftp`, etc.
- **CNAME vs A Record**: CNAME is preferred as it's easier to manage and Vercel can update it automatically
- **SSL Certificate**: Vercel will automatically provision SSL certificate once DNS is configured

## 🐛 Troubleshooting

### DNS not propagating?
- Wait longer (up to 48 hours)
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac) or `ipconfig /flushdns` (Windows)
- Check with different DNS servers (8.8.8.8, 1.1.1.1)

### Vercel shows "Invalid Configuration"?
- Double-check the DNS record matches exactly what Vercel shows
- Ensure TTL is set (not empty)
- Wait for DNS propagation

### Site not loading?
- Verify DNS is pointing to Vercel: `nslookup e-stories.velvetwords.online`
- Check Vercel deployment is successful
- Check browser console for errors

## 📝 Summary

**What to do:**
1. Deploy to Vercel first
2. Add `e-stories.velvetwords.online` domain in Vercel
3. Delete existing `A` and `AAAA` records for `e-stories` in Hostinger
4. Add new `CNAME` record: `e-stories` → `cname.vercel-dns.com`
5. Wait 5-30 minutes for propagation
6. Verify in Vercel dashboard

**Keep:**
- ✅ Hostinger nameservers (ns1.dns-parking.com, ns2.dns-parking.com)
- ✅ All other DNS records (@, www, ftp, CAA records)

**Change:**
- ❌ Delete: `A | e-stories | 82.25.125.47`
- ❌ Delete: `AAAA | e-stories | 2a02:4780:11:774:0:2bbf:6b8d:4`
- ✅ Add: `CNAME | e-stories | cname.vercel-dns.com`
