# Disclaimer
The purpose of this piece of software is only for learning and must not be used to run independently and/or without the consent of Google Inc.

# About  
- Schedule query based on the chosen conversion
- Define additional fee
- Define query interval
- Define conversion target
- Open log alert when it reaches the target
- Send alert via Slack Hook integration

# Configuration
Create an environment file .env-cmdrc containing the following:

```
"dev": {
    "NOTEPAD_ALERT": "true",
    "SLACK_ALERT": "true",
    "SLACK_HOOK": "YOUR_SLACK_HOOK_URL"
}
```