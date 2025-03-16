
// Edge Function Proxy for Supabase setup-verification
export default async function handler(req, res) {
  try {
    // Get the Supabase URL from the environment variable
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jksjyhqelduduxmkcuae.supabase.co';
    
    // Add authorization header with service role key if available
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      headers['Authorization'] = `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`;
    }
    
    console.log('Calling setup-verification edge function at:', `${supabaseUrl}/functions/v1/setup-verification`);
    
    // Call the actual Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/setup-verification`, {
      method: 'POST',
      headers,
    });
    
    console.log('Edge function response status:', response.status);
    
    // For non-JSON responses, handle differently
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      // Get the response data as JSON
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // Handle non-JSON responses (like HTML error pages)
      const textResponse = await response.text();
      console.error('Non-JSON response from edge function:', textResponse.substring(0, 200) + '...');
      res.status(response.status).json({ 
        error: 'Invalid response from setup function',
        status: response.status,
        details: 'The server returned a non-JSON response'
      });
    }
  } catch (error) {
    // Handle errors
    console.error('Error proxying to setup-verification:', error);
    res.status(500).json({ 
      error: 'Failed to call setup-verification function',
      details: error.message 
    });
  }
}
