'use server'

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

// Try multiple models in order of preference
const MODELS = [
  'zai-org/GLM-5:novita',
  'meta-llama/Meta-Llama-3-8B-Instruct',
  'HuggingFaceH4/zephyr-7b-beta',
  'google/flan-t5-small',
  'HuggingFaceH4/zephyr-7b-beta',
  'tiiuae/falcon-7b-instruct',
  'mistralai/Mistral-7B-Instruct-v0.2',
  'Qwen/Qwen2.5-7B-Instruct',
  'openai/gpt-oss-120b',
  'deepseek-ai/DeepSeek-R1',
  'mistralai/Mistral-7B-Instruct-v0.3',
  'meta-llama/Llama-3.x',
  'Qwen/Qwen2.5-7B-Instruct:together',
]

export async function generateWithHuggingFace(
  prompt: string,
  maxTokens: number = 300
): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not configured');
  }

  console.log('🤗 Calling Hugging Face API...');
  console.log('📝 Prompt:', prompt.substring(0, 100) + '...');

  

  // Try each model until one works
  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    console.log(`🔄 Trying model ${i + 1}/${MODELS.length}: ${model}`);

    try {
      const response = await fetch(
        //`https://api-inference.huggingface.co/models/${model}`,
        //'https://router.huggingface.co/hf-inference/models/${model}',
        "https://router.huggingface.co/v1/chat/completions",
        //'https://router.huggingface.co/v1/chat/completions/${model}',
        //'https://api.together.xyz/v1/chat/completions/${model}',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
                          messages: [
                          {
                              role: "user",
                              content: prompt,
                          },
                      ],
                      model: model,
                  }
        ),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ Model ${model} failed:`, response.status, errorData);
        
        // If 404, try next model
        if (response.status === 404 && i < MODELS.length - 1) {
          continue;
        }
        
        throw new Error(`API error (${response.status}): ${errorData}`);
      }

      const data: HuggingFaceResponse[] | HuggingFaceResponse = await response.json();
      console.log(`✅ Success with model: ${model}`);

      // Handle array response
      if (Array.isArray(data)) {
        if (data[0]?.error) {
          throw new Error(data[0].error);
        }
        if (data[0]?.generated_text) {
          return data[0].generated_text;
        }
      }

      // Handle single object response
      if (data && typeof data === 'object') {
        if ('error' in data && data.error) {
          throw new Error(data.error);
        }
        if ('generated_text' in data && data.generated_text) {
          return data.generated_text;
        }
      }
      
      const message = parseChatResponse(data);
      if (message) {
          console.log('✅ Assistant message:', message);
        }
        return message;
        
      throw new Error('Unexpected response format');
      
    } catch (error: any) {
      console.error(`❌ Error with model ${model}:`, error.message);
      
      // If this is the last model, throw the error
      if (i === MODELS.length - 1) {
        throw error;
      }
      
      // Otherwise, try next model
      console.log('⏭️  Trying next model...');
    }
  }

  throw new Error('All models failed');
  
}

async function parseChatResponse(response) {
  try {
    // If response is a string (raw API response), parse it first
    const data = typeof response === 'string' ? JSON.parse(response) : response;

    // Safely extract content with fallbacks
    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('No message content found in response');
    }

    return content;

  } catch (error) {
    console.error('❌ Failed to parse response:', error.message);
    console.log('Raw response:', response);
    return null;
  }
}

export async function generateWithHF(data): Promise<string> {
  try{
	const response = await fetch(
		"https://router.huggingface.co/v1/chat/completions",
		{
			headers: {
				Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);

	const result = await response.json();
  const message = parseChatResponse(result);
  if (message) {
     console.log('✅ Assistant message:', message);
  }
  return message;
  }
  catch (error) {
    console.error('❌ Failed to parse response:', error.message);
    console.log('Raw response:', response);
    return null;
  }
}

