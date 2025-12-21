# Google Sheets Setup Guide - Contact Form

This is the **easiest and completely free** way to save form submissions to Google Sheets. No Google Cloud Console setup needed!

## How It Works

We'll use **Google Apps Script** (built into Google Sheets) to create a simple webhook that receives form data and saves it to your sheet.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Heal School Contact Form Submissions"
4. In the first row, add these headers:
   - **A1:** Timestamp
   - **B1:** Name
   - **C1:** Email
   - **D1:** Phone
   - **E1:** Subject
   - **F1:** Message

## Step 2: Create the Webhook Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get current timestamp
    const timestamp = new Date();
    
    // Add the data as a new row
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || 'Not provided',
      data.subject || '',
      data.message || ''
    ]);
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Data saved successfully' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Test function (you can run this to test)
function test() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    subject: 'Test Subject',
    message: 'This is a test message'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  doPost(mockEvent);
}
```

4. Click **Save** (💾 icon) or press `Ctrl+S`
5. Name your project: "Heal School Form Handler"

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" → **Web app**
3. Configure:
   - **Description:** Heal School Contact Form
   - **Execute as:** Me (your email)
   - **Who has access:** **Anyone** ⚠️ (IMPORTANT: Must be "Anyone" for it to work!)
4. Click **Deploy**
5. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   ⚠️ **IMPORTANT:** Make sure the URL ends with `/exec` not `/dev`
6. Click **Authorize access** when prompted
   - Choose your Google account
   - Click **Advanced** → **Go to [project name] (unsafe)**
   - Click **Allow**
7. **IMPORTANT:** After first deployment, you may need to run the script once manually:
   - In Apps Script, click the function dropdown → select `doPost` (or `test`)
   - Click **Run** (▶️ button)
   - Authorize if asked
   - This activates the script

## Step 4: Update Your Server

1. Open `server/.env` file
2. Add this line:
   ```env
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. Replace `YOUR_SCRIPT_ID` with the actual ID from your Web App URL
4. **Restart your server**

## Testing

### Test 1: Test the Script Manually
1. In Apps Script editor, click function dropdown → select `test`
2. Click **Run** (▶️)
3. Authorize if needed
4. Check your Google Sheet - you should see a test row appear

### Test 2: Test the Webhook URL
Open a new terminal and run:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"123","subject":"Test","message":"Test message"}'
```

Replace `YOUR_WEBHOOK_URL` with your actual webhook URL from Step 3.

**Expected response:**
```json
{"success":true,"message":"Data saved successfully"}
```

If you see this, check your Google Sheet - the data should be there!

## Troubleshooting

### Sheet not updating?

**Check 1: Server Console Logs**
When you submit the form, check your server console. You should see:
```
📤 Sending data to Google Sheets webhook...
📥 Response status: 200
📥 Response body: {"success":true,"message":"Data saved successfully"}
✅ Data saved to Google Sheets via webhook
```

If you see errors, note them down.

**Check 2: Apps Script Executions**
1. In Apps Script, click **Executions** tab (clock icon)
2. Look for recent executions
3. Click on one to see if there are any errors

**Check 3: Common Issues**

**"401 Unauthorized" Error**
- This means the webhook is not publicly accessible
- Go to **Deploy** → **Manage deployments**
- Click the **pencil icon** (✏️) to edit
- Make sure **"Who has access"** is set to **"Anyone"** (NOT "Only myself")
- Click **Deploy** and get a new URL
- Update `GOOGLE_SHEETS_WEBHOOK_URL` in `server/.env`
- Restart server

**"Script not authorized"**
- Run the script once manually in Apps Script (click Run on `test` function)
- Authorize when prompted

**"Access denied" or 403 error**
- Make sure "Who has access" is set to **"Anyone"** (not "Only myself")
- Create a new deployment if needed

**Response is HTML instead of JSON**
- Your webhook URL might be wrong
- Make sure URL ends with `/exec` not `/dev`
- Redeploy and get a fresh URL

**Script runs but data doesn't appear**
- Check sheet name is "Sheet1" (default)
- Make sure headers are in row 1
- Check if sheet is protected/read-only

**"Cannot find function doPost"**
- Make sure the function is named exactly `doPost` (case-sensitive)
- Make sure you saved the script

### Quick Fix: Redeploy Script

If nothing works, try redeploying:

1. In Apps Script, click **Deploy** → **Manage deployments**
2. Click the 3 dots (⋮) next to your deployment
3. Click **Delete**
4. Create a new deployment:
   - **Deploy** → **New deployment**
   - Select **Web app**
   - Set "Who has access" to **Anyone**
   - Click **Deploy**
5. Copy the new URL
6. Update `GOOGLE_SHEETS_WEBHOOK_URL` in your `.env` file
7. Restart your server

## What Gets Saved?

Every form submission automatically saves:
- **Timestamp** - Date and time of submission
- **Name** - Person's name
- **Email** - Person's email
- **Phone** - Phone number (or "Not provided")
- **Subject** - Message subject
- **Message** - Full message content

## Advantages of This Method

✅ **Completely Free** - No API limits, no costs
✅ **No API Keys** - No Google Cloud Console setup needed
✅ **Simple Setup** - Just copy-paste code and deploy
✅ **Secure** - Only you can access your sheet
✅ **Reliable** - Google's infrastructure handles it

## Still Not Working?

Share:
1. The error message from server console
2. The response status and body from the logs
3. Any errors from Apps Script Executions tab

Then we can fix it together!

