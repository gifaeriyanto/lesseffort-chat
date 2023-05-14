const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

(async () => {
  // Create a single supabase client for interacting with your database
  const supabase = createClient(
    'https://rdlbbmvmqgumfwvtouns.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbGJibXZtcWd1bWZ3dnRvdW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM4NzYwNjgsImV4cCI6MTk5OTQ1MjA2OH0.aJQrMc40pUcHHotnnA8QRM27DF9C03ZpRRpjnY3HNxo',
  );

  const { data } = await supabase.from('chat_prompt_v3').select();

  if (!data) {
    return;
  }

  fs.writeFile(
    './src/store/db/prompts.json',
    JSON.stringify(data),
    { flag: 'w' },
    function (err) {
      if (err) throw err;
      console.log('File created/overwritten successfully!');
    },
  );
})();
