import { createClient } from '@supabase/supabase-js';

/**
 * Khởi tạo Supabase client phía Server (dùng service_role key để có quyền ghi Storage).
 * service_role key có toàn quyền - chỉ dùng ở backend, không được expose ra frontend.
 */
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_URL hoặc SUPABASE_SERVICE_KEY chưa được cấu hình trong .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
