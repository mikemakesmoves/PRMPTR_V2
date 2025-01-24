const BACKEND_URL = 'https://prmptr-v2.onrender.com';

const enhancePrompt = async (prompt) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to enhance prompt');
    }
    
    const data = await response.json();
    return {
      enhancedPrompt: data.enhancedPrompt,
      remaining: response.headers.get('RateLimit-Remaining')
    };
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    throw error;
  }
};

export default enhancePrompt;
