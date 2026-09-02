async function SendSlackAlert(message: string) {
  const slackActivated = process.env.SLACK_NOTIFICATION_ACTIVATED === 'true'

  if (!slackActivated) {
    console.log('Slack notifications are not activated')
    // console.log(`SendSlackAlert message (${message})`)
    return null
  }
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!slackWebhookUrl) {
    console.error('Slack webhook URL not defined in environment variables')
    return null
  }

  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  })
  
  if (!response.ok) {
    console.error('Failed to send Slack message', await response.text())
  }
}

export default SendSlackAlert;
