import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Missing message body' },
        { status: 400 }
      )
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not defined in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Call the n8n webhook
    // Using a timeout so it doesn't hang forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId);

    if (!n8nResponse.ok) {
      console.error(`n8n responded with status: ${n8nResponse.status}`)
      return NextResponse.json(
        { error: 'Failed to communicate with n8n workflow' },
        { status: 502 }
      )
    }

    const n8nData = await n8nResponse.json()

    // Depending on what properties you mapped in n8n's Node output:
    return NextResponse.json({ 
      response: n8nData.response || 'No response field configured in n8n.'
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while processing message' },
      { status: 500 }
    )
  }
}
