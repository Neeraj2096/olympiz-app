import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRagDb() {
  console.log("Testing RAG Supabase connection...");
  try {
    // Test 1: Insert a dummy document with a dummy embedding
    const dummyEmbedding = new Array(768).fill(0.01);
    const { error: insertError } = await supabase
      .from('documents')
      .insert([{ content: "Test document", metadata: { source: "test" }, embedding: dummyEmbedding }]);

    if (insertError) {
      console.error("Error inserting into documents:", insertError.message);
      return;
    }
    console.log("✅ Inserted dummy document successfully.");

    // Test 2: Call the match_documents function
    const { data: matchData, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: dummyEmbedding,
      match_threshold: 0.5,
      match_count: 1
    });

    if (matchError) {
      console.error("Error calling match_documents RPC:", matchError.message);
      return;
    }
    console.log("✅ match_documents RPC successful! Retrieved:", matchData.length, "documents.");

    // Cleanup: Delete the dummy document
    await supabase.from('documents').delete().eq('content', "Test document");
    console.log("✅ Cleanup successful.");
  } catch (err) {
    console.error("Exception during RAG DB test:", err);
  }
}

testRagDb();
