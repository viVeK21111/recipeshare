import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { query, history } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Query cannot be empty' }, { status: 400 })
    }

    const systemPrompt = `You are a helpful and friendly cooking assistant on RecipeShare, a recipe sharing platform.

Your role:
- Help users with recipe ideas, cooking techniques, ingredient substitutions, and cooking tips
- Be conversational, warm, and encouraging
- Keep responses concise but informative (3-5 sentences for general questions, longer for recipes)
- Use emojis occasionally to be friendly
- If user asks for recipes, suggest 3-4 options with brief descriptions
- Include cooking tips when relevant

Important:
- Don't make up specific recipes from a database
- Give general recipe suggestions and cooking advice
- Be encouraging to home cooks
- Keep it simple and practical`

    try {
      // Build conversation messages
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.flatMap((h: any) => [
          { role: 'user', content: h.query },
          { role: 'assistant', content: h.response }
        ]),
        { role: 'user', content: query }
      ]

      // Call Groq API
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!groqResponse.ok) {
        throw new Error('Groq API error')
      }

      const aiData = await groqResponse.json()
      const response = aiData.choices[0].message.content

      return NextResponse.json({
        success: true,
        response
      })

    } catch (aiError) {
      console.error('AI Error:', aiError)
      return NextResponse.json({
        success: false,
        message: 'Failed to get AI response'
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}