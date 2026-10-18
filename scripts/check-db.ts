
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local manually to avoid dotenv dependency
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        // Skip comments
        if (line.trim().startsWith('#')) return;

        // Split by first =
        const index = line.indexOf('=');
        if (index !== -1) {
            const key = line.substring(0, index).trim();
            let value = line.substring(index + 1).trim();

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking database connection...');
    const { data, error } = await supabase
        .from('project_s1')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error connecting to project_s1 table:', error.message);
        if (error.code === '42P01') { // undefined_table
            console.log('Table project_s1 does not exist. Please run the migration script setup_projects.sql');
        }
    } else {
        console.log('Successfully connected to project_s1 table.');
        console.log('Ready to seed.');
    }
}

check();
