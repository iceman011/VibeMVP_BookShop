'use server'

export async function callHuggingFace(prompt: string, maxTokens: number = 300) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY not set in environment variables');
  }

  console.log('🤗 Calling Hugging Face API...');
  console.log('📝 Prompt length:', prompt.length);

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: maxTokens,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
          },
          options: {
            wait_for_model: true, // Wait if model is loading
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Response received from Hugging Face');

    // Handle different response formats
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    } else if (data.generated_text) {
      return data.generated_text;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Unexpected response format from API');
    }
  } catch (error: any) {
    console.error('❌ Hugging Face error:', error);
    throw new Error(`Failed to call Hugging Face: ${error.message}`);
  }
}