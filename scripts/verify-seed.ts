
import { createClient } from '@supabase/supabase-js';
import { projects } from '../lib/projects-data';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        if (line.trim().startsWith('#')) return;
        const index = line.indexOf('=');
        if (index !== -1) {
            const key = line.substring(0, index).trim();
            let value = line.substring(index + 1).trim();
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
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    const { count, error } = await supabase
        .from('project_s1')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error counting rows:', error.message);
    } else {
        console.log(`Database Rows: ${count}`);
        console.log(`Source Projects: ${projects.length}`);
        if (count === projects.length) {
            console.log('Verification SUCCESS: counts match.');
        } else {
            console.log('Verification FAILED: counts mismatch.');
        }
    }
}

verify();
