
// Edge Function Proxy for Supabase setup-verification
export default async function handler(req, res) {
  try {
    // Get the Supabase URL from the environment variable
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jksjyhqelduduxmkcuae.supabase.co';
    
    // Call the actual Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/setup-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Get the response data
    const data = await response.json();

    // Set the appropriate status code and send the response
    res.status(response.status).json(data);
  } catch (error) {
    // Handle errors
    console.error('Error proxying to setup-verification:', error);
    res.status(500).json({ 
      error: 'Failed to call setup-verification function',
      details: error.message 
    });
  }
}
