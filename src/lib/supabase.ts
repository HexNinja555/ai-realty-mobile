import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ljcivmxfythnimswuaml.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjY5N2M3NDg0LWZkYTMtNDFlYi04MGVmLWRhYTQ1ZDgyZjVhNyJ9.eyJwcm9qZWN0SWQiOiJsamNpdm14Znl0aG5pbXN3dWFtbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwNjkxMTAxLCJleHAiOjIwOTYwNTExMDEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.r6xjPqhHYFssfOcLIxFpmSvV0J6Vl2n-eRTytLfLif0';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };